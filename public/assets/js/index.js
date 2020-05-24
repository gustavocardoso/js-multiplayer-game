import createGame from './game.js'
import createKeyboardListener from './keyboard-listener.js'
import renderScreen from './render-screen.js'

const socket = io()
const screen = document.querySelector('#board')

const game = createGame()

const keyboardListener = createKeyboardListener(document)

socket.on('connect', () => {
  const playerId = socket.id
  console.log(`Player connected on client with ID: ${playerId}`)

  renderScreen(screen, game, requestAnimationFrame, playerId)
})

socket.on('disconnect', () => {
  keyboardListener.unsubscribe()
})

socket.on('setup', (state) => {
  const playerId = socket.id
  console.log(`Receiving 'setup' event from server!`)

  game.setState(state)

  keyboardListener.registerPlayerId(playerId)
  keyboardListener.subscribe(game.movePlayer)
  keyboardListener.subscribe((command) => {
    socket.emit(command.type, command)
  })
})

socket.on('add-player', (command) => {
  console.log(`Receiving ${command.type} from ${command.playerId}`)
  game.addPlayer(command)
})

socket.on('remove-player', (command) => {
  console.log(`Receiving ${command.type} from ${command.playerId}`)
  game.removePlayer(command)
})

socket.on('move-player', (command) => {
  console.log(`Receiving ${command.type} from ${command.playerId}`)
  const playerId = socket.id

  if (playerId !== command.playerId) {
    game.movePlayer(command)
  }
})

socket.on('add-fruit', (command) => {
  console.log('fruit added')
  console.log(`Receiving ${command.type} from ${command.fruitId}`)
  game.addFruit(command)
})

socket.on('remove-fruit', (command) => {
  console.log('fruit removed')
  game.removeFruit(command)
})
