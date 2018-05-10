import Dashboard from './Dashboard'
import Empty from 'layouts/Empty'
import MatchesContainer from './MatchesContainer'

const routes = [
  {
    path: '/',
    layout: Dashboard,
    routes: [
      {
        path: '/',
        exact: true,
        component: Empty
      },
      {
        path: '/:uuid/',
        component: MatchesContainer,
        name: 'matches'
      }
    ]
  }
]

export default routes
