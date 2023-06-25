# Authorization Code Grant Type

- More secure than the implicit grant type.
- Typically used for **server-side web apps**, since it requires a client secret (effectively the client's password for the authorization server).
- Not useful for browser-based apps (SPAs) since the client secret cannot be stored securely.
- Not useful for native apps (mobile apps, desktop apps, etc.) since the client secret cannot be stored securely.

```mermaid
%% Oauth2 goal: get client an access_token (+ maybe refresh_token + maybe id_token)

sequenceDiagram
  participant client as Client (Private)
  participant browser as Browser (User) ## User-Agent + Resource Owner + Web-Hosted Client Resource
  participant authserver as Authorization Server

  rect rgb(140, 255, 160, 0.2)
    browser ->> client: Read/write something on my behalf
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,browser: Initiate flow
    %% client constructs the authorization server URI
    %% and redirects the user-agent to that URI
    %% /authorize
    %%   ?response_type=code
    %%   &client_id=...         identifies the client app to the auth server
    %%   &redirect_uri=...      the registered location to redirect the client app to after the grant decision
    %%   &scope=...             the scopes/permissions the client app is requesting
    %%   &state=...             arbitrary state that the auth server will propagate back to the redirect_uri
    client -->> browser: 302 FOUND (Redirect to /authorize?response_type=code&...)
  end

  rect rgba(150, 150, 150, 0.2)
    note over browser,authserver: Authenticate & grant permission

    browser ->> authserver: GET /authorize?response_type=code&...

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
    note over client,authserver: Exchange code for access_token

    client ->> authserver: POST /token (with code, client_id, client_secret, redirect_uri)
    authserver -->> client: 200 OK (access_token, refresh_token, expires_in)
  end
```
