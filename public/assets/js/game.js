export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 15,
      height: 15
    }
  }

  const observers = []

  function start() {
    const frequency = 5000

    setInterval(addFruit, frequency)
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    console.log(`Notifying ${observers.length} observers`)

    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function addPlayer(command) {
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)
    const score = 0

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      score: 0
    }

    notifyAll({
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
      score
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId: playerId
    })
  }

  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }

    notifyAll({
      type: 'add-fruit',
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY
    })
  }

  function removeFruit(command) {
    const fruitId = command.fruitId

    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId: fruitId
    })
  }

  function movePlayer(command) {
    notifyAll(command)

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) {
          player.y = player.y - 1
          return
        }

        if (player.y === 0) {
          player.y = state.screen.height - 1
          return
        }
      },
      ArrowDown(player) {
        if (player.y < state.screen.height - 1) {
          player.y = player.y + 1
          return
        }

        if (player.y > state.screen.height - 2) {
          player.y = 0
          return
        }
      },
      ArrowRight(player) {
        if (player.x < state.screen.width - 1) {
          player.x = player.x + 1
          return
        }

        if (player.x > state.screen.width - 2) {
          player.x = 0
          return
        }
      },
      ArrowLeft(player) {
        if (player.x > 0) {
          player.x = player.x - 1
          return
        }

        if (player.x === 0) {
          player.x = state.screen.width - 1
          return
        }
      }
    }

    const keyPressed = command.keyPressed
    const playerId = command.playerId
    const player = state.players[playerId]
    const moveFunction = acceptedMoves[keyPressed]

    if (player && moveFunction) {
      moveFunction(player)
      checkForFruitCollision(playerId)
    }
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId]

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]
      // console.log(`Checking ${playerId} and ${fruitId}`)

      if (player.x === fruit.x && player.y === fruit.y) {
        // console.log(`COLLISION between ${playerId} and ${fruitId}`)
        removeFruit({ fruitId })
        player.score = player.score + 1
      }
    }
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    setState,
    subscribe,
    start,
    state
  }
}
