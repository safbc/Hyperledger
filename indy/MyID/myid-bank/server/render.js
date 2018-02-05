import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { match, RouterContext } from 'react-router'
import reducers from '../client/reducers'
import preload from './preload'
import routes from '../client/routes'

export default (req, res, next) => {
  if (req.url.match(/api/)) return next()
  if (req.url.match(/static/)) return next()

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)

    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)

    } else if (renderProps) {

      preload((err, init) => {
        if (err) return res.status(500).send(err.message)

        const store = createStore(reducers, init)
        const app = (process.env.NODE_ENV === 'production') ?

        renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps}/>
          </Provider>
        ) : ''

        const css =  (process.env.NODE_ENV === 'production') ?
          '<link rel="stylesheet" href="/bundle.css">' : ''

        // TODO: trim ident
        const html = `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>MyID Bank</title>
              <link rel="stylesheet" href="/libs/bootstrap.min.css">${css}
              <!--[if lt IE 9]>
                <script src="/libs/html5shiv.min.js"></script>
                <script src="/libs/respond.min.js"></script>
              <![endif]-->
            </head>
          	<body>
          		<div id="app">${app}</div>
              <script src="/libs/jquery.min.js"></script>
              <script src="/libs/bootstrap.min.js"></script>
              <script src="/socket.io/socket.io.js"></script>
              <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())}
              </script>
              <script src="/bundle.js"></script>
          	</body>
          </html>
  			`
        res.status(200).send(html)
      })
    } else {
      res.status(404).send('Not found')
    }
  })
}
