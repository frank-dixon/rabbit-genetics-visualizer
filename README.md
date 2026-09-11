# rabbit-genetics-visualizer

Interactive tool to plan and visualize results of crossing meat rabbits based on coat and eye color.

## Deploy

Production build is published to [frank-dixon.github.io/rabbit/](https://frank-dixon.github.io/rabbit/) (Vite `base: '/rabbit/'`).

Pushes to `main` run `.github/workflows/deploy-hub.yml`, which builds and deploys `dist/` into the hub repo under `rabbit/`. One-time setup: add repository secret `HUB_DEPLOY_TOKEN` (classic PAT with `repo`, or fine-grained token with Contents write on `frank-dixon/frank-dixon.github.io`) at [Settings → Secrets → Actions](https://github.com/frank-dixon/rabbit-genetics-visualizer/settings/secrets/actions).
