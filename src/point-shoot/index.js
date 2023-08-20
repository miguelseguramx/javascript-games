const canvas = document.querySelector('#canvas')
const colitionCanvas = document.querySelector('#collitionCanvas')
const ctx = canvas.getContext('2d')
const ctxCollision = colitionCanvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = window.innerWidth
const CANVAS_HEIGHT = canvas.height = window.innerHeight
const COLLITION_CANVAS_WIDTH = colitionCanvas.width = window.innerWidth
const COLLITION_CANVAS_HEIGHT = colitionCanvas.height = window.innerHeight
ctx.font = '50px Impact'

let score = 0
let ravens = []
let gameOver = false

class Raven {
  constructor() {
    this.spriteWidth = 271
    this.spriteHeigjt = 194
    this.sizeModifier = Math.random() * 0.5 + 0.4
    this.width = this.spriteWidth * this.sizeModifier
    this.height = this.spriteHeigjt * this.sizeModifier
    this.x = canvas.width
    this.y = Math.random() * (canvas.height - this.height)
    this.directionX = Math.random() * 4 + 2;
    this.directionY = Math.random() * 4 - 1.5;
    this.markedForDeletion = false
    this.image = new Image()
    this.image.src = '../../static/images/sprites/raven.png'
    this.frame = 0
    this.maxFrame = 4
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 75 + 100;
    this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    this.color = `rgb(${this.randomColors.join(',')})`
    this.hasTrail = Math.random() < 0.5
  }
  update(deltaTime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1
    }

    this.x -= this.directionX;
    this.y += this.directionY
    if (this.x < 0 - this.width) this.markedForDeletion = true

    this.timeSinceFlap += deltaTime
    if (this.timeSinceFlap > this.flapInterval) {
      this.frame > this.maxFrame ? this.frame = 0 : this.frame++
      this.timeSinceFlap = 0
      if (this.hasTrail) {
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(this.x, this.y, this.width, this.color))
        }
      }
    }
    if (this.x < 0 - this.width) gameOver = true
  }
  draw() {
    ctxCollision.fillStyle = this.color
    ctxCollision.fillRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(
      this.image, this.frame * this.spriteWidth, 0,
      this.spriteWidth, this.spriteHeigjt,
      this.x, this.y, this.width, this.height
    )
  }
}

let explosions = []

class Explosion{
  constructor (x, y, size) {
    this.image = new Image()
    this.image.src = '../../static/images/sprites/boom.png'
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.size = size
    this.x = x
    this.y = y

    this.frame = 0
    this.timeSinceLastFrame = 0
    this.frameInterval = 100
    this.markedForDeletion = false

    this.boomSound = new Audio()
    this.boomSound.src = '../../static/sound-effects/boom.wav'
    this.boomSound.playbackRate = 1.8
  }
  update(deltaTime) {
    if (this.frame === 0) {
      this.boomSound.play()
    }
    this.timeSinceLastFrame += deltaTime
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++
      this.timeSinceLastFrame = 0
      if (this.frame > 4) {
        this.frame = this.markedForDeletion = true
      }
    }
  }
  draw() {
    if (this.markedForDeletion) return
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame, 0,
      this.spriteWidth, this.spriteHeight,
      this.x, (this.y - (this.size * 0.4)) , this.size, this.size
    )
  }
}

let particles = [];
class Particle {
  constructor (x, y, size, color) {
    this.size = size
    this.x = x + this.size * 0.3 + Math.random() * 30 - 25;
    this.y = y + this.size * 0.3 + Math.random() * 30 - 25;
    this.radius = Math.random() * this.size / 10;
    this.maxRadius = Math.random() * 10 + 35;
    this.markedForDeletion = false
    this.speedX = Math.random() * 1 + 0.5
    this.color = color
  }
  update() {
    this.x += this.speedX
    this.radius += 0.5
    if (this.radius > this.maxRadius - 5) this.markedForDeletion = true
  }
  draw() {
    ctx.save()
    ctx.globalAlpha = 1 - (this.radius / this.maxRadius)
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}


function drawGaveOver() {
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black'
  ctx.fillText('GAME OVER, your score is ' + score, canvas.width / 2, canvas.height / 2)
  ctx.fillStyle = 'white'
  ctx.fillText('GAME OVER, your score is ' + score, canvas.width / 2 +  5, canvas.height / 2 +  5)
}

function drawScore() {
  ctx.fillStyle = 'black'
  ctx.fillText(`Score: ${score}`, 50, 75)
  ctx.fillStyle = '#f0f0f0'
  ctx.fillText(`Score: ${score}`, 55, 80)
}

window.addEventListener('click', (e) => {
  const detectPixelColor = ctxCollision.getImageData(e.x, e.y, 1, 1)
  const pxc = detectPixelColor.data
  ravens.forEach((raven) => {
    if (pxc[0] === raven.randomColors[0] && pxc[1] === raven.randomColors[1] && pxc[2] === raven.randomColors[2]) {
      raven.markedForDeletion = true
      score++
      // Collition by color
      explosions.push(new Explosion(raven.x, raven.y, raven.width))
      console.log(explosions)
    }
  })
})


let timeToNextRaven = 0
let lastTime = 0
const ravenInterval = 500

function animate(timestamp) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  ctxCollision.clearRect(0, 0, COLLITION_CANVAS_WIDTH, COLLITION_CANVAS_HEIGHT)

  const deltaTime = timestamp - lastTime
  lastTime = timestamp
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven())
    timeToNextRaven = 0
    ravens.sort((a, b) => a.width - b.width)
  }
  [...particles, ...ravens, ...explosions].forEach((object) => object.update(deltaTime));
  [...particles, ...ravens, ...explosions].forEach((object) => object.draw());
  drawScore();
  ravens = ravens.filter((object) => !object.markedForDeletion)
  explosions = explosions.filter((object) => !object.markedForDeletion)
  particles = particles.filter((object) => !object.markedForDeletion)
  if (gameOver) {
    drawGaveOver()
  } else {
    requestAnimationFrame(animate)
  }
}

animate(0)
