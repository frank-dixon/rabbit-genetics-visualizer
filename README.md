# rabbit-genetics-visualizer

Interactive tool to plan and visualize results of crossing meat rabbits based on coat and eye color.

## Deploy

Production build is published to [frank-dixon.github.io/rabbit/](https://frank-dixon.github.io/rabbit/) (Vite `base: '/rabbit/'`).

Auto-deploy workflow: copy `docs/deploy-hub.yml` → `.github/workflows/deploy-hub.yml` (requires a PAT with `workflow` scope to push that path). Then add repository secret `HUB_DEPLOY_TOKEN` (classic `repo` PAT, or fine-grained Contents write on `frank-dixon/frank-dixon.github.io`) at [Settings → Secrets → Actions](https://github.com/frank-dixon/rabbit-genetics-visualizer/settings/secrets/actions). Pushes to `main` (and workflow_dispatch) build and deploy `dist/` into the hub repo under `rabbit/`.
