
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 700

class Exponsion{
  constructor (x, y) {
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.width = this.spriteWidth * 0.5
    this.height = this.spriteHeight * 0.5
    this.x = x
    this.y = y
    this.image = new Image()
    this.image.src = '../../static/images/sprites/boom.png'
    this.frame = 0
    this.timer = 0
    this.angle = Math.random() * 6.2
    this.boomSound = new Audio()
    this.boomSound.src = '../../static/sound-effects/boom.wav'
    this.boomSound.playbackRate = 1.8
  }
  update() {
    if (this.frame === 0) {
      this.boomSound.play()
    }
    this.timer ++
    if (this.timer % 10 === 0) {
      this.frame++
    }
  }
  draw() {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame, 0,
      this.spriteWidth, this.spriteHeight,
      0 - this.width * 0.5, 0 - this.height * 0.5, this.width, this.height
    )
    ctx.restore()
  }
}

const canvasPosition = canvas.getBoundingClientRect();
// This properties will be added to all the elements on the canvas:
ctx.fillStyle = 'red'
// ctx.fillRect(50, 50, 100, 150)
const explosions = []

window.addEventListener('click', createAnimation)

function createAnimation(e) {
  const xPosition = e.x - canvasPosition.left
  const yPositon = e.y - canvasPosition.top
  explosions.push(new Exponsion(xPosition, yPositon))
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update()
    explosions[i].draw()
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1)
      i--
    }
  }
  requestAnimationFrame(animate)
}

animate()
