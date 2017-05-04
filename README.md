# pelican

Helps developing and debugging Zengine backend services locally.

Behind the scenes it will create a tunnel to the local backend service using ngrok.

### Install

```bash
npm install -g git+https://git@github.com:evert0n/pelican.git
```

### Using

```bash

$ pelican -h
Usage: pelican [options]

Options:
  -b, --backend-url      Backend service URL ie: http://0.0.0.0:3000   [default: "http://0.0.0.0:3000"]
  -u, --firebase-url     Firebase URL (x-firebase-url)
  -s, --firebase-secret  Firebase secret (x-firebase-secret)
  -p, --plugin           Plugin namespace (x-plugin)
  -a, --access-token     Zengine access token
  -h, --help             Show help                                     [boolean]

```

The options firebase-url, firebase-secret, plugin and access-token 
will be inject in the requests headers if provided, this helps in
cases when using the backend service with an external service and
is not possible to configure custom header, it's common when working
with webhooks.

