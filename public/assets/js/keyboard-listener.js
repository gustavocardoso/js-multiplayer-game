export default function createKeyboardListener(document) {
  const state = {
    observers: []
  }

  function registerPlayerId(playerId) {
    state.playerId = playerId
  }

  function subscribe(observerFunction) {
    state.observers.push(observerFunction)
  }

  function unsubscribe(observerFunction) {
    state.observers = []
  }

  function notifyAll(command) {
    console.log(`Notifying ${state.observers.length} observers`)

    for (const observerFunction of state.observers) {
      observerFunction(command)
    }
  }

  document.addEventListener('keydown', handleKeydown, false)

  function handleKeydown(event) {
    const keyPressed = event.key
    const command = {
      type: 'move-player',
      playerId: state.playerId,
      keyPressed
    }

    notifyAll(command)
  }

  return {
    subscribe,
    unsubscribe,
    registerPlayerId
  }
}
