/** @type {HTMLCanvasElement} */
import { generateRandonOnRange } from "./utils.js"

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 1000

// We use classes to make the code betters
// const enemy1 = {
//   x: 0,
//   y: 0,
//   width: 100,
//   height: 100,
// }
// INSIDE ANIMATE FUNCTION
// enemy1.x++;
// enemy1.y++;
// ctx.fillRect(enemy1.x, enemy1.y, enemy1.width, enemy1.height)

const numberOfEnemies = 15
const enemiesArray = []
let gameFrame = 0

class Enemy {
  constructor(spriteWidth, spriteHeight, src, frames, animation) {
    // We use math.random to generate a random position and size of the enemy
    this.image = new Image();
    this.image.src = src
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 2.5
    this.height = this.spriteHeight / 2.5
    this.x = Math.random() * (CANVAS_WIDTH - this.width)
    this.y = Math.random() * (CANVAS_HEIGHT - this.height)
    this.frame = frames
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
    this.speed = Math.random() * 4 + 1
    this.animation = animation(gameFrame)
  }
  update() {
    // Add movemen
    const { x, y } = this.animation({
      x: this.x,
      y: this.y,
      speed: this.speed,
      width: this.width,
      height: this.height,
      gameFrame: gameFrame,
    })
    if (x) this.x = x
    if (y) this.y = y
    // Add animation to frames
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? this.frame = 0 : this.frame++
    }
  }
  draw() {
    // ctx.fillRect(this.x, this.y, this.width, this.height)
    // ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
      this.x, this.y, this.width, this.height
    )
  }
}

const enemies = [
  {
    spriteWidth: 293,
    spriteHeight: 155,
    src: '../../static/images/sprites/enemies/enemy1.png',
    frames: 5,
    animation: () => {
      return (x, y) => ({
        x: x += Math.random() * 5 - 2.5,
        y: y += Math.random() * 5 - 2.5,
      })
    }
  },
  {
    spriteWidth: 266,
    spriteHeight: 188,
    src: '../../static/images/sprites/enemies/enemy2.png',
    frames: 5,
    animation: () => {
      let angle = 0
      const angleSpeed = Math.random() * 0.2
      const curve = Math.random() * 7

      return ({ x, y, speed, width }) => {
        let newX = x - speed
        if (newX + width < 0) newX = CANVAS_WIDTH

        angle += angleSpeed;

        return ({
          x: newX,
          y: y + Math.sin(angle) * curve
        })
      }
    }
  },
  {
    spriteWidth: 218,
    spriteHeight: 177,
    src: '../../static/images/sprites/enemies/enemy3.png',
    frames: 5,
    animation: () => {
      let angle = 0
      const angleSpeed = Math.random() * 2 + 0.6

      return ({x, y, width, height}) => {
        angle += angleSpeed;

        // MAKE THE ENEMIES MOVE BETWEEN -200 AND 200 FROM THE CENTER
        const higgerThanCanvas = (CANVAS_HEIGHT / 2) + 40
        return ({
          x: CANVAS_WIDTH /2 * Math.sin(angle * Math.PI / 90) + (CANVAS_WIDTH / 2 - width/2),
          y: higgerThanCanvas * Math.sin(angle * Math.PI / 180) + (CANVAS_HEIGHT / 2 - height/2),
        })
      }
    }
  },
  {
    spriteWidth: 213,
    spriteHeight: 213,
    src: '../../static/images/sprites/enemies/enemy4.png',
    frames: 5,
    animation: () => {
      let newX = 0
      let newY = 0
      let interval = Math.floor(Math.random() * 200 + 50)
      return ({x, y, width, height, gameFrame}) => {
        if (gameFrame % interval === 0 || gameFrame === 0) {
          newX = Math.random() * (CANVAS_WIDTH - width)
          newY = Math.random() * (CANVAS_HEIGHT - height)
        }
        const dx = x - newX
        const dy = y - newY
        return ({
          x: x - dx / 30,
          y: y - dy / 30,
        })
      }
    }
  }
]
const [enemy1, enemy2, enemy3, enemy4] = enemies

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(
    new Enemy(enemy4.spriteWidth, enemy4.spriteHeight, enemy4.src, enemy4.frames, enemy4.animation)
  )
}

function animate(params) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  enemiesArray.forEach((enemy) => {
    enemy.update()
    enemy.draw()
  })
  gameFrame++
  requestAnimationFrame(animate)
}
animate();
