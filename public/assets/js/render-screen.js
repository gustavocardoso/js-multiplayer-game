export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
  const ctx = screen.getContext('2d')

  screen.setAttribute('width', game.state.screen.width)
  screen.setAttribute('height', game.state.screen.height)

  ctx.clearRect(0, 0, board.width, board.height)

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId]
    ctx.fillStyle = '#c03'
    ctx.fillRect(fruit.x, fruit.y, 1, 1)
  }

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId]
    ctx.fillStyle = '#111'
    ctx.fillRect(player.x, player.y, 1, 1)
  }

  const currentPlayer = game.state.players[currentPlayerId]

  if (currentPlayer) {
    ctx.fillStyle = '#f0db4f'
    ctx.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
  })
}
