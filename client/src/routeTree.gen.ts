/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as VerifyMeImport } from './routes/verify-me'
import { Route as RegisterImport } from './routes/register'

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()
const PriceActionDailyRecapLazyImport = createFileRoute(
  '/price-action/daily-recap',
)()

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const VerifyMeRoute = VerifyMeImport.update({
  id: '/verify-me',
  path: '/verify-me',
  getParentRoute: () => rootRoute,
} as any)

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const PriceActionDailyRecapLazyRoute = PriceActionDailyRecapLazyImport.update({
  id: '/price-action/daily-recap',
  path: '/price-action/daily-recap',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/price-action/daily-recap.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/verify-me': {
      id: '/verify-me'
      path: '/verify-me'
      fullPath: '/verify-me'
      preLoaderRoute: typeof VerifyMeImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/price-action/daily-recap': {
      id: '/price-action/daily-recap'
      path: '/price-action/daily-recap'
      fullPath: '/price-action/daily-recap'
      preLoaderRoute: typeof PriceActionDailyRecapLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/register': typeof RegisterRoute
  '/verify-me': typeof VerifyMeRoute
  '/about': typeof AboutLazyRoute
  '/price-action/daily-recap': typeof PriceActionDailyRecapLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/register': typeof RegisterRoute
  '/verify-me': typeof VerifyMeRoute
  '/about': typeof AboutLazyRoute
  '/price-action/daily-recap': typeof PriceActionDailyRecapLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/register': typeof RegisterRoute
  '/verify-me': typeof VerifyMeRoute
  '/about': typeof AboutLazyRoute
  '/price-action/daily-recap': typeof PriceActionDailyRecapLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/register'
    | '/verify-me'
    | '/about'
    | '/price-action/daily-recap'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/register' | '/verify-me' | '/about' | '/price-action/daily-recap'
  id:
    | '__root__'
    | '/'
    | '/register'
    | '/verify-me'
    | '/about'
    | '/price-action/daily-recap'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  RegisterRoute: typeof RegisterRoute
  VerifyMeRoute: typeof VerifyMeRoute
  AboutLazyRoute: typeof AboutLazyRoute
  PriceActionDailyRecapLazyRoute: typeof PriceActionDailyRecapLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  RegisterRoute: RegisterRoute,
  VerifyMeRoute: VerifyMeRoute,
  AboutLazyRoute: AboutLazyRoute,
  PriceActionDailyRecapLazyRoute: PriceActionDailyRecapLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/register",
        "/verify-me",
        "/about",
        "/price-action/daily-recap"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/verify-me": {
      "filePath": "verify-me.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/price-action/daily-recap": {
      "filePath": "price-action/daily-recap.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
