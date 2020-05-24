import express from 'express'
import http from 'http'
import socketio from 'socket.io'

import createGame from './public/assets/js/game.js'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => {
  console.log(`Emitting ${command.type}`)
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
  const playerId = socket.id
  console.log(`Player connected on server with ID: ${playerId}`)

  game.addPlayer({ playerId })
  console.log(game.state)

  socket.emit('setup', game.state)

  socket.on('disconnect', () => {
    game.removePlayer({ playerId })
    console.log(`Player disconnected on server with ID: ${playerId}`)
  })

  socket.on('move-player', (command) => {
    command.playerId = playerId
    command.type = 'move-player'

    game.movePlayer(command)
  })
})

server.listen(3000, () => {
  console.log('> Server listening on port: 3000')
})
