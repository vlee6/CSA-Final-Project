const canvas = document.getElementsByTagName('canvas')[0]
const c = canvas.getContext('2d')

// Setting the canvas height and width
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
console.log("Canvas width: " + canvas.width + " Canvas height: " + canvas.height)

// Game constants
const gravity = 0.5
const jumpHeight = 7 / gravity;
const friction = { // Lowering these values makes it more "slippery"
    ground: 0.15,
    air: 0.05, // Might raise this?
}

const tileWidth = canvas.width / rowLength
const tileHeight = tileWidth

// User input
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    r: {
        pressed: false
    },
    t: {
        pressed: false
    },
    leftArrow: {
        pressed: false
    },
    rightArrow: {
        pressed: false
    },
    m: {
        pressed: false
    },
    n: {
        pressed: false
    },
    // 'w' and 'upArrow' are not included since a jump doesn't need to be stopped on key release
}

// Generating collision blocks off of the tileset
const collisionBlocks = []
blockCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 1) {
            collisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * tileWidth,
                    y: y * tileHeight,
                },
                color: 'rgba(0, 255, 0, 0.5)',
            }))
        }
    })
})

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 2) {
            platformCollisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * tileWidth,
                    y: y * tileHeight,
                },
                color: 'rgba(0, 255, 0, 0.3)',
                height: tileHeight * 3/4, // Platform collision blocks are slimmer than normal blocks (just to visually show their difference)
            }))
        }
    })
})

// Create player object(s)
const p1TransInterp = new Ewma(friction.ground)
const p2TransInterp = new Ewma(friction.ground)

const p1 = new Player({
    position: {
        x: 700,
        y: 0,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    color: "rgba(255, 0, 0, 1)",
    interp: p1TransInterp,
})


const p2 = new Player({
    position: {
        x: 1200,
        y: 0,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    color: "rgba(0, 0, 255, 1)",
    interp: p2TransInterp,
})

const players = [p1, p2]

// Store active attacks that each player will iterate through every frame
let activeAttacks = []

// Game loop
function animate() {
    // This function is recursive and will run continously
    window.requestAnimationFrame(animate)

    // Clear the canvas at the beginning of each frame
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()

    // Draw blocks
    collisionBlocks.forEach(block => {
        block.update();
    })
    platformCollisionBlocks.forEach(block => {
        block.update();
    })

    // Draw characters, apply kinematics, check for collisions
    p1.update()
    p2.update()

    // Draw attacks
    activeAttacks.forEach(attack => {
        console.log(attack.position.x + ", " + attack.position.y)
        attack.update()
    })

    // Check for attacks
    p1.checkHurtCollision({activeAttacks: activeAttacks})
    p2.checkHurtCollision({activeAttacks: activeAttacks})

    p1.displayStats({id: "stats1"})

    // Handling user input for movement
    if (keys.a.pressed) {
        p1.velocity.x = p1.interp.update(-5);
        p1.lastDirection = 'left'
    } else if (keys.d.pressed) {
        p1.velocity.x = p1.interp.update(5);
        p1.lastDirection = 'right'
    } else {
        p1.velocity.x = p1.interp.update(0);
    }

    if (keys.leftArrow.pressed) {
        p2.velocity.x = p2.interp.update(-5);
        p2.lastDirection = 'left'
    } else if (keys.rightArrow.pressed) {
        p2.velocity.x = p2.interp.update(5);
        p2.lastDirection = 'right'
    } else {
        p2.velocity.x = p2.interp.update(0);
    }

    // Switch the friction of the ground depending on the material a player is standing on
    switch(p1.material) {
        case 'air':
            p1TransInterp.setAlpha(friction.air)
            break
        case 'ground':
            p1TransInterp.setAlpha(friction.ground)
            break
    }

    switch(p2.material) {
        case 'air':
            p2TransInterp.setAlpha(friction.air)
            break
        case 'ground':
            p2TransInterp.setAlpha(friction.ground)
            break
    }

    console.log(activeAttacks)
    // User input for attacks
    // TO DO: Figure out how to remove past attacks
    if (keys.r.pressed && !p1.isAttacking) {
        activeAttacks.push(new HurtBox({
            player: p1,
            width: 50,
            height: 50,
            frames: {duration: 10, cooldown: 30},
            multiplier: 2,
        }))
    }

    if (keys.m.pressed && !p2.isAttacking) {
        activeAttacks.push(new HurtBox({
            player: p2,
            width: 50,
            height: 50,
            frames: {duration: 10, cooldown: 30},
            multiplier: 2,
        }))
    }

    c.restore()
}

animate() // !!!

// Listen for whether a specific key is being pressed, then set that key's pressed attribute to true
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case 'w':
            p1.jump({jumpHeight: jumpHeight})
            break
        case 'r':
            keys.r.pressed = true
            break
        case 't':
            keys.r.pressed = true
            break
        case 'ArrowLeft':
            keys.leftArrow.pressed = true
            break
        case 'ArrowRight':
            keys.rightArrow.pressed = true
            break
        case 'ArrowUp':
            p2.jump({jumpHeight: jumpHeight})
        case 'm':
            keys.m.pressed = true
            break
        case 'n':
            keys.n.pressed = true
            break
    }
})

// Listen for whether a specific key is not being pressed, then set that key's pressed attribute to false
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'r':
            keys.r.pressed = false
            break
        case 't':
            keys.r.pressed = false
            break
        case 'ArrowLeft':
            keys.leftArrow.pressed = false
            break
        case 'ArrowRight':
            keys.rightArrow.pressed = false
            break
        case 'm':
            keys.m.pressed = false
            break
        case 'n':
            keys.n.pressed = false
            break
    }
})
