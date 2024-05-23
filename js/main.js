const canvas = document.getElementsByTagName('canvas')[0]
const c = canvas.getContext('2d')

// Setting the canvas height and width
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
console.log("Canvas width: " + canvas.width + " Canvas height: " + canvas.height)

// Game constants
const gravity = 1
const jumpHeight = 20 / gravity;
const globalMultiplier = 0.005 // How much the percent goes up by
const friction = { // Lowering these values makes it more "slippery"
    ground: 0.2,
    air: 0.1, // Might raise this?
}
const playerSpeed = 8

const tileWidth = canvas.width / rowLength
const tileHeight = tileWidth

// User input
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
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
    upArrow: {
        pressed: false
    },
    leftArrow: {
        pressed: false
    },
    downArrow: {
        pressed: false
    },
    rightArrow: {
        pressed: false
    },
    o: {
        pressed: false
    },
    p: {
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
                height: tileHeight * 1, // Platform collision blocks are slimmer than normal blocks (just to visually show their difference)
            }))
        }
    })
})

// Create player object(s)
const p1TransInterp = new Ewma(friction.ground)
const p2TransInterp = new Ewma(friction.ground)

const p1 = new Player({
    position: {
        x: canvas.width * 1 / 3,
        y: 0,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    color: "rgba(255, 0, 0, 0.8)",
    interp: p1TransInterp,
})


const p2 = new Player({
    position: {
        x: canvas.width * 2 / 3 - p1.hitbox.width,
        y: 0,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    color: "rgba(0, 0, 255, 0.8)",
    interp: p2TransInterp,
})

const players = [p2]

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

    // Display text
    p1.displayStats({id: "stats1"})
    p2.displayStats({id: "stats2"})

    p1.displayPercent({id: "p1-percent"})
    p2.displayPercent({id: "p2-percent"})


    // Handling user input for movement
    if (keys.a.pressed) {
        p1.velocity.x = p1.interp.update(-playerSpeed);
        p1.lastDirection = 'left'
    } else if (keys.d.pressed) {
        p1.velocity.x = p1.interp.update(playerSpeed);
        p1.lastDirection = 'right'
    } else {
        p1.velocity.x = p1.interp.update(0);
    }

    if (keys.leftArrow.pressed) {
        p2.velocity.x = p2.interp.update(-playerSpeed);
        p2.lastDirection = 'left'
    } else if (keys.rightArrow.pressed) {
        p2.velocity.x = p2.interp.update(playerSpeed);
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
    if (keys.r.pressed && (keys.a.pressed || keys.d.pressed) && p1.canAttack) {
        character1.horiBasic({p: p1})
    } else if (keys.r.pressed && keys.w.pressed && p1.canAttack) {
        character1.upBasic({p: p1})
    } else if (keys.r.pressed && keys.s.pressed && p1.canAttack) {
        character1.downBasic({p: p1})
    } else if (keys.r.pressed && p1.canAttack) { // Order matters, neutral attacks should be last
        character1.neutralBasic({p: p1})
    }

    if (keys.t.pressed && keys.w.pressed && p1.canAttack) {
        character1.upSpecial({p: p1})
    } else if (keys.t.pressed && (keys.a.pressed || keys.d.pressed) && p1.canAttack) {
        character1.horiSpecial({p: p1})
    } else if (keys.t.pressed && keys.s.pressed && p1.canAttack) {
        character1.downSpecial({p: p1})
    } else if (keys.t.pressed && p1.canAttack) { // Order matters, neutral attacks should be last
        character1.neutralSpecial({p: p1})
    }

    if (keys.p.pressed && (keys.leftArrow.pressed || keys.rightArrow.pressed) && p2.canAttack) {
        character1.horiBasic({p: p2})
    } else if (keys.p.pressed && keys.upArrow.pressed && p2.canAttack) {
        character1.upBasic({p: p2})
    } else if (keys.p.pressed && keys.downArrow.pressed && p2.canAttack) {
        character1.downBasic({p: p2})
    } else if (keys.p.pressed && p2.canAttack) { // Order matters, neutral attacks should be last
        character1.neutralBasic({p: p2})
    }

    if (keys.o.pressed && keys.upArrow.pressed && p2.canAttack) {
        character1.upSpecial({p: p2})
    } else if (keys.o.pressed && (keys.leftArrow.pressed || keys.rightArrow.pressed) && p2.canAttack) {
        character1.horiSpecial({p: p2})
    } else if (keys.o.pressed && keys.downArrow.pressed && p2.canAttack) {
        character1.downSpecial({p: p2})
    } else if (keys.o.pressed && p2.canAttack) { // Order matters, neutral attacks should be last
        character1.neutralSpecial({p: p2})
    }
    
    c.restore()
}

animate() // !!!

// Listen for whether a specific key is being pressed, then set that key's pressed attribute to true
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            p1.jump({jumpHeight: jumpHeight})
            keys.w.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case 'r':
            keys.r.pressed = true
            break
        case 't':
            keys.t.pressed = true
            break
        case 'ArrowUp':
            p2.jump({jumpHeight: jumpHeight})
            keys.upArrow.pressed = true
            break
        case 'ArrowLeft':
            keys.leftArrow.pressed = true
            break
        case 'ArrowDown':
            keys.downArrow.pressed = true
            break
        case 'ArrowRight':
            keys.rightArrow.pressed = true
            break
        case 'p':
            keys.p.pressed = true
            break
        case 'o':
            keys.o.pressed = true
            break
    }
})

// Listen for whether a specific key is not being pressed, then set that key's pressed attribute to false
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            p1.jump({jumpHeight: jumpHeight})
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'r':
            keys.r.pressed = false
            break
        case 't':
            keys.t.pressed = false
            break
        case 'ArrowUp':
            keys.upArrow.pressed = false
            break
        case 'ArrowLeft':
            keys.leftArrow.pressed = false
            break
        case 'ArrowDown':
            keys.downArrow.pressed = false
            break
        case 'ArrowRight':
            keys.rightArrow.pressed = false
            break
        case 'p':
            keys.p.pressed = false
            break
        case 'o':
            keys.o.pressed = false
            break
    }
})