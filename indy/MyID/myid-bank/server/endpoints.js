import socket from 'socket.io'
import request from 'request'

export default (app, server) => {
  const io = socket(server)

  io.on('connection', socket => {
    const { host } = socket.request.headers
    socket.join([host])

    socket.on('something', data => {
      request.put({
        url: `http://api/request`,
        body: data,
        json: true
      }, (err, res) =>
        console.log('response', err || res.statusCode)
      )
    })
  })

  app.put('/api/method', (req, res) => {
      const { data } = req.body
      Object.keys(data).map(id => {
        const socket = io.sockets.connected[id]
        socket.emit('action', req.body)
      })

      res.send('OK')
  })
}
