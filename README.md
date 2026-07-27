# zuplo-for-puzzle

Zuplo project configuration for Puzzle: the edge gateway config and the
developer portal.

Owned by the Zuplo account operated under the `integrations@puzzle.io`
login. Successor to the `zuplo-gateway` repo.

## Layout

```
config/routes.oas.json   Gateway routing table (OpenAPI + x-zuplo extensions);
                         edited via the Zuplo Route Designer or by hand
config/policies.json     Reusable gateway policies (auth, rate limiting, ...)
modules/                 Custom TypeScript handlers
docs/                    Developer portal (Zudoku); see docs/zudoku.config.tsx
```

## Developer portal

The portal's API reference fetches the gateway-generated OpenAPI spec live
from `https://api.puzzle.io/rest/v0/openapi.json` (`type: "url"` in
`docs/zudoku.config.tsx`), so the published docs always describe the
deployed API — there is no spec snapshot in this repo to go stale.

## Local development

```bash
npm install
npm run dev        # gateway on :9000
cd docs && npm run dev   # dev portal on :3000
```

## Deployment

Zuplo deploys automatically once this repo is connected to the Zuplo
project (Project Settings → Source Control): the production branch (main)
deploys the production environment; every other branch gets a preview
environment.
