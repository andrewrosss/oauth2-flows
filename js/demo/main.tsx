/** @jsx h */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import html, { h, type Options } from "https://deno.land/x/htm@0.2.1/mod.ts";
import {
  deleteCookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.120.0/http/cookie.ts";

const AUTH_COOKIE = "__Host-user-token";

const handler = async (req: Request) => {
  const method = req.method.toUpperCase();
  const cookies = getCookies(req.headers);
  const { pathname, searchParams } = new URL(req.url);

  const access_token = cookies[AUTH_COOKIE];

  switch (`${method} ${pathname}`) {
    case "GET /": {
      if (access_token == null) {
        return page(
          <body>
            <div class="card">
              <a id="signin" href="/oauth/signin">
                Sign in with GitHub <i class="fa fa-github" />
              </a>
            </div>
          </body>,
        );
      } else {
        const api = apiGet(access_token);
        const user = await api("https://api.github.com/user");
        const username = user.login;
        const repos = await api(
          `https://api.github.com/users/${username}/repos`,
        );
        return page(
          <body>
            <div class="card">
              <p>
                Signed in as{" "}
                <a class="link" href={`https://github.com/${username}`}>
                  {username}
                </a>. (<a class="link" href="/signout">Sign out</a>)
              </p>
              <ul>
                {repos.map((repo: { full_name: string }) => (
                  <li>
                    <a
                      class="link"
                      href={`https://github.com/${repo.full_name}`}
                    >
                      {repo.full_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </body>,
        );
      }
    }

    case "GET /oauth/signin": {
      const url = new URL("https://github.com/login/oauth/authorize");
      url.search = new URLSearchParams({
        client_id: Deno.env.get("CLIENT_ID") ?? "",
        redirect_uri: Deno.env.get("REDIRECT_URI") ?? "",
        scope: "read:user public_repo",
      }).toString();
      const headers = new Headers({ "Location": url.toString() });
      return new Response(null, { status: 302, headers });
    }

    case "GET /oauth/redirect": {
      const code = searchParams.get("code");
      if (code != null) {
        // code-for-token exchange
        const tokenUrl = new URL("https://github.com/login/oauth/access_token");
        const res = await getToken(tokenUrl, code);
        const { access_token } = await res.json(); // { access_token, token_type, scope }
        const headers = new Headers({ "Location": "/" });
        setCookie(headers, {
          name: AUTH_COOKIE,
          value: access_token,
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
        });
        return new Response(null, { status: 302, headers });
      } else {
        console.error(`ERROR: ${searchParams.get("error")}`);
        const headers = new Headers({ "Location": "/" });
        return new Response(null, { status: 302, headers });
      }
    }

    case "GET /signout": {
      const headers = new Headers({ "Location": "/" });
      if (access_token != null) {
        deleteCookie(headers, AUTH_COOKIE);
        const api = apiDelete(access_token);
        const client_id = Deno.env.get("CLIENT_ID");
        await api(`https://api.github.com/applications/${client_id}/token`, {
          access_token,
        });
      }
      return new Response(null, { status: 302, headers });
    }

    default: {
      console.error(req);
      return page(
        <body>
          <div class="card">
            <a class="link" href="/">← Return Home</a>
          </div>
        </body>,
      );
    }
  }
};

const page = (body: Options["body"]) =>
  html({
    title: "Oh Auth",
    links: [
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
      },
    ],
    styles: [
      "html, body { margin: 0; box-sizing: border-box; font-family: system-ui; height: 100%; }",
      "body { background: #fff; display: grid; place-content: center; }",
      "a { color: inherit; text-decoration: none; background-color: transparent; cursor: pointer; }",
      "ul { list-style: none; }",
      "ul > li { padding-block: 0.125rem; }",
      ".card { display: grid; place-content: center; background-color: #f8f9fa; border-radius: 2rem; padding: 4rem 2rem; min-inline-size: 300px; }",
      ".error { background-color: rgba(254,202,202,0.5); color: rgba(233,8,7); }",
      ".link { color: #0284c7; font-weight: 500 }",
      ".link:hover, .link:focus-visible { text-decoration: underline; }",
      ".fa { font-size: 1.5em; }",
      "#signin { padding: 1rem 3rem; font-weight: 700; background-color: #111; color: #eee; border-radius: 1rem; display: flex; align-items: center; gap: 0.5em }",
    ],
    body,
  });

const apiGet = (access_token: string) => (url: string) =>
  fetch(
    url,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  ).then((r) => r.json());

const apiDelete =
  // deno-lint-ignore no-explicit-any
  (access_token: string) => (url: string, body?: any) =>
    fetch(
      url,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        ...(body != null ? { body: JSON.stringify(body) } : {}),
      },
    ).then((r) => r.json());

const getToken = (url: string | URL, code: string) =>
  fetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: Deno.env.get("CLIENT_ID"),
        client_secret: Deno.env.get("CLIENT_SECRET"),
        code,
      }),
    },
  );

serve(handler);
