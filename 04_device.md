# Device Authorization Grant Type

- Typically used for devices that do not have an easy way to enter user credentials (e.g. smart TVs, game consoles, etc.)
- Also can be used for native apps (mobile apps, desktop apps, etc.) where the client secret cannot be stored securely.

```mermaid
sequenceDiagram
  participant userdevice as Device (User)
  participant client as Client (Device - Public)
  participant browser as Browser (User) ## User-Agent + Resource Owner
  participant authserver as Authorization Server

  rect rgb(140, 255, 160, 0.2)
    userdevice ->> client: Read/write something on my behalf
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,authserver: Initiate flow
    client ->> authserver: POST /device_authorize (with client_id, scope)
    authserver -->> client: 200 OK (device_code, user_code, verification_uri, expires_in, interval)
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,userdevice: Provide user_code and verification_uri to user

    client ->> userdevice: Display user_code and verification_uri
  end

  rect rgba(150, 150, 150, 0.2)
    note over client,authserver: Poll for authorization

    loop Every 'interval' seconds
        client ->> authserver: POST /token (with device_code, client_id)
        authserver --x client: 400 Bad Request (authorization_pending)
    end
    client ->> authserver: POST /token (with device_code, client_id)
    authserver -->> client: 200 OK (access_token, refresh_token, expires_in)
  end

  rect rgba(150, 150, 150, 0.2)
    note over userdevice,browser: User visits verification_uri and enters user_code

    userdevice ->> browser: Navigate to verification_uri
    browser ->> authserver: GET /login (with user_code)
    authserver -->> browser: 200 OK (Auth Prompt)

    browser ->> authserver: POST /authorize (with user credentials and user_code)
    authserver -->> browser: 200 OK (Success page)
  end
```
