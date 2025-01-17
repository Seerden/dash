🫠

# Status
DAS-8: scaffolded the application from `/track`. This project will have a
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
- If Docker doesn't want to play nice, empty out node_modules (keep the folder,
though, if on Windows, because otherwise the volumes can't mount) and try again.
- Only ever install packages using yarn, and do it from inside the service's
  container.
- we run storybook in the container using vite. HMR works, but not that well.
  Adding or renaming a story breaks the HMR.