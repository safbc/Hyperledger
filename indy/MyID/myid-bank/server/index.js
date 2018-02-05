import bodyParser from 'body-parser'
import express from 'express'
import http from 'http'
import path from 'path'
import webpack from 'webpack'
import render from './render'
import endpoints from './endpoints'

const app = express()
const server = http.Server(app)

if (process.env.NODE_ENV === 'development') {
  const config = require('./webpack.config.dev')
  const compiler = webpack(config)

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }))
  app.use(require('webpack-hot-middleware')(compiler))
  app.use(express.static(path.resolve(__dirname, '../client')))

} else if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')))
}

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, 'public')))

app.get('*', render)

endpoints(app, server)

server.listen(8080, '0.0.0.0', err => {
  if (err) return console.error(err)

  console.info('Listening at http://localhost:8080')
})

process.once('SIGUSR2', function () {
  process.exit()
})
process.on('SIGINT', function() {
  process.exit()
})
process.on('SIGTERM', function() {
  process.exit()
})
