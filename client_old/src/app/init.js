import 'polyfills' // should be first
import '../styles/index.scss'

import { createStore, applyMiddleware, combineReducers, compose as reduxCompose } from 'redux'
import { reducer as form } from 'redux-form'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { middleware as cacheMiddleware, state as initialState } from './cache'
import { reducers, epics } from 'store'
import { reducer as resource, epic as resourceEpic } from 'common/utils/resource'
import API from 'api'

// support for redux dev tools
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose

const store = createStore(
  combineReducers({
    form,
    resource,
    ...reducers
  }),
  initialState,
  compose(
    applyMiddleware(
      createEpicMiddleware(combineEpics(...epics, resourceEpic), { dependencies: { API } }),
      cacheMiddleware
    )
  )
)

export { store }
