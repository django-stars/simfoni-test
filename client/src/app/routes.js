import NotFound from 'pages/fallbacks/NotFound'
import AppLayout from 'layouts/AppLayout'
import { routes as dashboard } from 'pages/dashboard'

const appRoutes = [
  {
    path: '/',
    exact: true,
    name: 'root',
    redirectTo: '/dashboard'
  },
  {
    path: '/',
    layout: AppLayout,
    routes: [
      {
        path: '/dashboard',
        routes: dashboard,
        name: 'dashboard'
      },
      {
        component: NotFound
      }
    ]
  }
]

export default appRoutes
export const namedRoutes = routesMap(appRoutes)

function routesMap (routes, basePath = '/') {
  return routes.reduce(function (acc, { name, path, routes }) {
    if (!path) {
      return acc
    }

    path = makePath(path, basePath)

    if (name) {
      acc = {
        ...acc,
        [name]: path
      }
    }

    if (routes) {
      acc = {
        ...acc,
        ...(routesMap(routes, path))
      }
    }
    return acc
  }, {})
}

function makePath (path, basePath) {
  return (basePath + path).replace(/\/+/g, '/')
}
