# Implicit Grant Type

- Typically used for browser-based apps (SPAs) or mobile apps
- Access token is **NOT** sent to the client app's server (part of the url fragment)
- Browser must be able to execute JavaScript
- Less secure: access token can potentially be exposed in browser history or logs since it is passed via the URL fragment.
- Does not support refresh tokens

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
    %% client constructs the authorization server URI
    %% and redirects the user-agent to that URI
    %% /authorize
    %%   ?response_type=token
    %%   &client_id=...         identifies the client app to the auth server
    %%   &redirect_uri=...      the registered location to redirect the client app to after the grant decision
    %%   &scope=...             the scopes/permissions the client app is requesting
    %%   &state=...             arbitrary state that the auth server will propagate back to the redirect_uri
    client -->> browser: 302 FOUND (Redirect to /authorize?response_type=token&...)
  end

  rect rgba(150, 150, 150, 0.2)
    note over browser,authserver: Authenticate & grant permission

    browser ->> authserver: GET /authorize?response_type=token&...

    %% user decides whether to grant requested permissions
    authserver -->> browser: [User grants permission]
    browser ->> authserver: ;

    authserver -->> browser: 302 FOUND (Redirect to /oauth/redirect#35;access_token=...)
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,browser: Pass access_token to client

    browser ->> client: GET /oauth/redirect#35;access_token=...

    client -->> browser: 200 OK
  end
```
