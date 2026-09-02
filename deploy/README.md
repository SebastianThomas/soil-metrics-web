# deploy/

K3s manifests for the `soil-metrics-web` SPA. Deploys into namespace
`start-hack` (shared with the `start-hack` backend repo, which owns the
`Namespace`, the DB and the API `Deployment`).

## Routing

`httproute.yaml` serves this SPA on **`soil-metrics.sthomas.ch`** and
**`soil-metrics-web.sthomas.ch`** (both, one HTTPRoute).

The API base URL is baked at build time from `.env.production`
(`VITE_API_URL=https://soil-metrics-ws.sthomas.ch`) — the API + datasets host,
owned by the `start-hack` backend repo. `/v1/**` and `/public/**` send CORS `*`
there. `.env.development` points at `http://localhost:8080` for `npm run dev`.

`soil-metrics-public.sthomas.ch` (standalone public dataset endpoint) is also
in the backend repo.

## Workflows

- `Docker Image CI` (`docker_image.yaml`) — builds `sthomasch/soil-metrics-web`
  on a `v*` tag push, then calls `deploy.yaml`.
- `deploy` (`deploy.yaml`) — reusable (`workflow_call`) + `workflow_dispatch`.
  Run standalone with `gh workflow run deploy.yaml -f tag=v1.2.3` to redeploy any
  already-built tag.

Both need the repo secrets `KUBE_API`, `KUBE_CA`, `KUBE_TOKEN`, `HEADSCALE_URL`,
`TS_AUTHKEY`, `DOCKER_HUB_USERNAME`, `DOCKER_HUB_ACCESS_TOKEN` and a `prod`
Environment (already set up).
