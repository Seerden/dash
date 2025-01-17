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

yarn build garbage

- have to run yarn install on top-level
- am running yarn install on root in each of the prod dockerfiles, this seems
  stupid, but if I don't, it doesn't recognize the stuff properly... I think.
- remove the all lockfiles except the top-level one -- if this makes it build,
  nice, but then does it still work for the dev servers? have to do the same
  workspace-related stuff I guess.. (i.e. yarn workspaces focus -A instead of
  yarn install, and run yarn install top-level first...)

https://stackoverflow.com/questions/67358873/docker-nginx-reverse-proxy-503-service-temporarily-unavailable

### Containers
- to run the dev containers, run `./scripts/dev.sh`. This should be
  self-contained, but if you run into trouble, remove (or empty out, Windows may
  have trouble creating volumes if the folder does not exist) each
  `node_modules` folder. Also make sure there is only one yarn.lock file (in the
  root level), because we're using workspaces (I guess). From a fresh install,
  you may need to run `yarn set version berry`. God knows why this yarn version
  transition was such a mess, but I got it working, so I'm sticking with it.
- to run the prod containers, run `./scripts/prod.sh`. Same guidelines apply as
  above. The script will expose the application at `http://localhost:80` (=
  `http://localhost`).

  Currently struggling to get trpc to work on the production site. I think the
  client build is being cached, or I'm outputting it to the wrong place, because
  I think it's still using the old base endpoint (localhost:5000/trpc instead of
  .../api/trpc)