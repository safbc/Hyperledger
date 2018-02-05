import io from 'socket.io-client'

let socket = null

export const middleware = (/* store */) => {
  return next => action => {
    if (socket) {
      switch (action.type) {
        case actions.ORDERS_INSERT: {
          socket.emit('socket_event', action.data)
          break
        }
      }
    }
    return next(action)
  }
}

export default store => {
  socket = io()

  socket.on('orders', data =>
    store.dispatch(actions.add (data)))
}
