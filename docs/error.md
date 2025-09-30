# API Proxy Checklist

## Symptoms
- Frontend requests like `fetch("http://coretechnet.tplinkdns.com:8000/...")` trigger CORS or 404 errors in production.
- Calls such as `fetch("/v1/...")` bypass the Next.js rewrite, so they may work locally but fail once deployed.

## Root Cause
- `frontend/next.config.js` rewrites `/api/:path*` to `backend:8000/api/:path*`, yet some code omits the `/api` prefix or concatenates raw domains.
- In Docker/Vercel setups the browser runs at `coretechnet.tplinkdns.com:3000` while the API stays on a private network, so direct calls to `backend:8000` cannot resolve from the client.

## Fix Checklist
1. **Keep the Next.js rewrite active**
   ```js
   async rewrites() {
     const target = (process.env.INTERNAL_API_BASE_URL || process.env.API_BASE_URL || "http://backend:8000").replace(/\/+$/, "");
     return [{ source: "/api/:path*", destination: `${target}/api/:path*` }];
   }
   ```
2. **Always call the API through `/api`**
   - good: `fetch("/api/v1/daily/tests?category=linux")`
   - good: `axios.get("/api/v1/daily/tests")`
   - good: `useQuery(["daily-tests"], () => fetch("/api/v1/daily/tests").then(r => r.json()))`
   - bad: `fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/v1/daily/tests")` (string-building domains)
3. **Align environment variables**
   - `.env`: `API_BASE_URL=http://coretechnet.tplinkdns.com:8000`
   - `docker-compose.yml`
     ```yaml
     environment:
       NEXT_PUBLIC_API_BASE_URL: /api
       INTERNAL_API_BASE_URL: http://backend:8000
     ```
   - Use `/api` for `NEXT_PUBLIC_API_BASE_URL` in local dev to share the same code path.
4. **Clean caches before rebuilding**
   ```bash
   rm -rf frontend/.next
   docker compose down
   docker compose up -d --build
   ```

## Pre-release Checklist
- [ ] `/api` rewrite is present in `frontend/next.config.js`.
- [ ] Every fetch/axios call targets `/api/...`.
- [ ] `.env` and `docker-compose.yml` match the values above.
- [ ] `CORS_ORIGINS` includes `http://coretechnet.tplinkdns.com:3000` and other exposed domains.
- [ ] `https://coretechnet.tplinkdns.com:3000/api/v1/daily/tests` responds successfully in the target environment.

```bash
# quick audits
rg "http://backend" frontend/
rg "NEXT_PUBLIC_API_BASE_URL" frontend/
```

Keep `/api` as the public entrypoint so the browser always talks to its own origin while Next.js proxies requests safely to the backend domain.
