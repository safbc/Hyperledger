import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import reducers from './reducers'
import routes from './routes'
import socket, { middleware } from './socket'

const preloadedState = window.__PRELOADED_STATE__

const store = createStore(reducers, preloadedState,  composeWithDevTools(applyMiddleware(...middleware)))
const history = syncHistoryWithStore(browserHistory, store)

socket(store)

if (process.env.WEBPACK) {
  require('./index.scss')
}

render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>, document.getElementById('app')
)

if (process.env.NODE_ENV == 'development' && module.hot) {
  module.hot.accept('./reducers', () => {
    store.replaceReducer(require('./reducers').default)
  })
}
