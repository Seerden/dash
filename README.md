Dash will provide a market overview, edge-seeking, backtesting, and acts as your expansive
personal trading log. Think TradingView and Tradervue, but in one place, without the bloat but also without
realtime charting.

💹🫠📈

# Documentation
- Issue tracking happens on [my
linear.app](http://linear.app/seerden/team/DAS/active) (not public -- it mirrors
the issues to [/dash/issues](https://github.com/Seerden/dash/issues) though)
- I'm keeping development documentation on a local Obsidian vault for now.

# Development status / changelog

- **DAS-29**
  - made some final tweaks to our build process and deployed the skeleton of the
application to a digitalocean droplet that points to [our domain dash.seerden.dev](https://dash.seerden.dev) (might
not be LIVE currently, because there's no point to keep a pre-alpha build
running 24/7)

- **DAS-27**
  - implemented the groundwork to get emails working, which will be
necessary for account verification, and billing etc. (if this thing ever makes
it out of pre-alpha).

- ...

- **DAS-8**
  - scaffolded the application from `/track`. This project will have a
slightly different stack, so I've taken out some things that will be
(re-)implemented later:

    - `styled-components` will be replaced with `emotion`
    - I took out the decorators etc. from storybook
    - I took out the initialization of Sentry for now, it'll be back soon, just have
      to set up an organization for it.
    - all express packages used in `track` are still dependencies, but I'm not sure
      if they're all needed. `trpc` will be used in this project.
    - for routing, we're going to use `tanstack/router`, and once it's a bit more
      mature, we're going to use `tanstack/start`. When setting up the client,
      remove all remaining references to `react-router`.
    - `jest` is installed on the server, but I think we'll use `vitest`, since we're
      using it on the client already as well.

# Notes

## Docker

- If Docker doesn't want to play nice, empty out each `node_modules` (keep the folder,
  though, if on Windows, because otherwise the volumes might not be able to mount) and try again.
- Only ever install packages using `yarn`, and do it from inside the service's
  container (can use `yarn workspaces focus <package-name>`, too).
- We run storybook in the container using vite. HMR works, but not that well.
  Adding or renaming a story breaks the HMR.

## Development
- To run the dev containers, run `./scripts/dev.sh`. This should be
  self-contained, but if you run into trouble, remove (or empty out, Windows may
  have trouble creating volumes if the folder does not exist) each
  `node_modules` folder. Also make sure there is only one `yarn.lock` file (in the
  root level), because we're using workspaces (I guess). From a fresh install,
  you may need to run `yarn set version berry` in the client and server. God knows why this yarn version
  transition was such a mess, but hey, it works on my machine™️.
