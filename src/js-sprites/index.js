import { animationStates } from "./animationStates.js"

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.width = 600

const playerAnimate = new Image()
playerAnimate.src = '../../static/images/sprites/shadow_dog.png'

const spriteWidth = 575
const spriteHeight = 523

let gameFrame = 0
const staggerFrames = 5

let playerState = 'idle'

const spriteAnimations = []
animationStates.forEach(({ name, frames: count }, idx) => {
  const frames = {
    loc: [],
  }
  for (let f = 0; f < count; f++) {
    const positionX = f * spriteWidth
    const positionY = idx * spriteHeight
    frames.loc.push({ x: positionX, y: positionY })
  }
  spriteAnimations[name] = frames
})

const dropdown = document.querySelector('#animations')
dropdown.addEventListener('change', event => {
  playerState = event.target.value
})

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length
  const frameX = spriteWidth * position
  const frameY = spriteAnimations[playerState].loc[position].y
  ctx.drawImage(
    playerAnimate,
    frameX, frameY, spriteWidth, spriteHeight,
    0, 0, spriteWidth, spriteHeight
  )

  gameFrame++
  requestAnimationFrame(animate)
}

animate()
