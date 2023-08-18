
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.width = 500

const rect1 = { x: 5, y: 5, width: 50, height: 50 }
const rect2 = { x: 20, y: 10, width: 10, height: 10 }

function isRectColliding(rect1, rect2) {
  if (
    // Rect is to the right of rect2
    rect1.x > rect2.x + rect2.width ||

    // Rect is to the left of rect2
    rect1.x + rect1.width < rect2.x ||

    // Rect is above rect2
    rect1.y > rect2.y + rect2.height ||

    // Rect is below rect2
    rect1.y + rect1.height < rect2.y
  ) {
    // No collisioin
    return true
  } else {
    return false
  }
}

isRectColliding(rect1, rect2)

const circle1 = { x: 200, y: 200, radius: 50 }
const circle2 = { x: 250, y: 250, radius: 50 }

function isCircleColliding(circle1, circle2) {
  let ca = circle2.x - circle1.x
  let co = circle2.y - circle1.y

  // Pythagoras theorem: a^2 + b^2 = c^2
  // c = sqrt(a^2 + b^2)
  const distance = Math.sqrt(Math.pow(ca, 2) + Math.pow(co, 2))
  const sumOfRadius = circle1.radius + circle2.radius
  if (distance < sumOfRadius) {
    return true
  } else {
    return false
  }
}

isCircleColliding(circle1, circle2)
