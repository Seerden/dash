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

# Scripts
```
  "dev:shared": "npx tsc --build --watch shared",
  "dev": "cd ./docker && docker-compose --file ./compose.yml up --build --force-recreate --remove-orphans",
  "prod": "cd ./docker && docker-compose --file ./docker-compose.prod.yml up --force-recreate --remove-orphans --build server database store test-database",
  "dev-build": "cd ./docker && docker-compose --file ./compose.yml up --force-recreate --remove-orphans --build server database store test-database",
  "dev-down": "cd ./docker && docker-compose --file ./compose.yml down --volumes -v",
  "prod-down": "cd ./docker && docker-compose --file ./docker-compose.prod.yml down --volumes",
  "db": "docker exec -it docker-database-1 psql dash -U postgres",
  "test-db": "docker exec -it docker-test-database-1 psql dash-test -U postgres -p 5434",
  "test-back": "docker exec -it docker-server-1 yarn test --watchAll",
  "test-front": "docker exec -it docker-client-1 yarn test --watchAll",
  "store": "docker exec -it docker-store-1 redis-cli",
  "build:types": "npx tsc --build"
```