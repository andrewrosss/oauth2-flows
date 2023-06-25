# Authorization Code Grant Type with PKCE

- More secure than the implicit grant type
- More secure than the authorization code grant type
- Recommended flow for browser-based apps (SPAs) where the client secret cannot be stored securely. (Instead of using the implicit grant type.)
- Can be used for native apps (mobile apps, desktop apps, etc.) where the client secret cannot be stored securely.
- Useful as a method to augment the Authorization Code Flow in general, becuase it can prevent authorization code interception attacks which is done by intercepting the authorization code and exchanging it for an access token.

```mermaid
sequenceDiagram
  participant client as Client (Public)
  participant browser as Browser (User) ## User-Agent + Resource Owner + Web-Hosted Client Resource
  participant authserver as Authorization Server

  rect rgb(140, 255, 160, 0.2)
    browser ->> client: Read/write something on my behalf
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,browser: Initiate flow
    %% client generates the code_verifier and its SHA256 hash, the code_challenge
    %% client constructs the authorization server URI
    %% and redirects the user-agent to that URI
    %% /authorize
    %%   ?response_type=code
    %%   &client_id=...         identifies the client app to the auth server
    %%   &redirect_uri=...      the registered location to redirect the client app to after the grant decision
    %%   &scope=...             the scopes/permissions the client app is requesting
    %%   &state=...             arbitrary state that the auth server will propagate back to the redirect_uri
    %%   &code_challenge=...    the SHA256 hash of the code_verifier
    %%   &code_challenge_method=S256
    client -->> browser: 302 FOUND (Redirect to /authorize?response_type=code&...&code_challenge=...&code_challenge_method=S256)
  end

  rect rgba(150, 150, 150, 0.2)
    note over browser,authserver: Authenticate & grant permission

    browser ->> authserver: GET /authorize?response_type=code&...&code_challenge=...&code_challenge_method=S256

    %% user decides whether to grant requested permissions
    authserver -->> browser: [User grants permission]
    browser ->> authserver: ;

    authserver -->> browser: 302 FOUND (Redirect to /oauth/redirect?code=...)
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,browser: Pass authorization_code to client

    browser ->> client: GET /oauth/redirect?code=...

    client -->> browser: 200 OK
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,authserver: Exchange code and code_verifier for access_token

    client ->> authserver: POST /token (with code, client_id, redirect_uri, code_verifier)
    authserver -->> client: 200 OK (access_token, refresh_token, expires_in)
  end
```
