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
const playerSpeed = 6
const bounds = 500

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
                color: 'rgba(30, 30, 30, 1)',
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
                color: 'rgba(30, 30, 30, 0.5)',
                height: tileHeight, // Platform collision blocks are slimmer than normal blocks (just to visually show their difference)
            }))
        }
    })
})

// Create player object(s)
const p1TransInterp = new Ewma(friction.ground)
const p2TransInterp = new Ewma(friction.ground)

const p1 = new Player({
    position: {
        x: canvas.width * 1 / 4,
        y: -50,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    color: "rgba(0, 0, 255, 0.2)",
    interp: p1TransInterp,
    name: "Blue",
    imageSrc: "./img/Blue/Idle.png",
    frameRate: 1,
    animations: { // It's a dictionary...
        Idle: {
            imageSrc: "./img/Blue/Idle.png",
            frameRate: 1, // The number of frames in the spritesheet
            frameBuffer: 1, // The speed of the animation
        },
        IdleLeft: {
            imageSrc: "./img/Blue/IdleLeft.png",
            frameRate: 1,
            frameBuffer: 1,
        },
        Run: {
            imageSrc: "./img/Blue/Run.png",
            frameRate: 8,
            frameBuffer: 4,
        },
        RunLeft: {
            imageSrc: "./img/Blue/RunLeft.png",
            frameRate: 8,
            frameBuffer: 4,
        },
        NeutralBasic: {
            imageSrc: "./img/Blue/NeutralBasic.png",
            frameRate: 4,
            frameBuffer: 10,
        },
        NeutralBasicLeft: {
            imageSrc: "./img/Blue/NeutralBasicLeft.png",
            frameRate: 4,
            frameBuffer: 10,
        },
        TranslationalBasic: {
            imageSrc: "./img/Blue/TranslationalBasic.png",
            frameRate: 3,
            frameBuffer: 10,
        },
        TranslationalBasicLeft: {
            imageSrc: "./img/Blue/TranslationalBasicLeft.png",
            frameRate: 3,
            frameBuffer: 10,
        },
        DownBasic: {
            imageSrc: "./img/Blue/DownBasic.png",
            frameRate: 1,
            frameBuffer: 1,
        },
        UpBasic: {
            imageSrc: "./img/Blue/UpBasic.png",
            frameRate: 4,
            frameBuffer: 4,
        },
        UpBasicLeft: {
            imageSrc: "./img/Blue/UpBasicLeft.png",
            frameRate: 4,
            frameBuffer: 4,
        },
        NeutralSpecial: {
            imageSrc: "./img/Blue/NeutralSpecial.png",
            frameRate: 5,
            frameBuffer: 4,
        },
        NeutralSpecialLeft: {
            imageSrc: "./img/Blue/NeutralSpecialLeft.png",
            frameRate: 5,
            frameBuffer: 4,
        },
        DownSpecial: {
            imageSrc: "./img/Blue/DownSpecial.png",
            frameRate: 1,
            frameBuffer: 1,
        },
        DownSpecialLeft: {
            imageSrc: "./img/Blue/DownSpecialLeft.png",
            frameRate: 1,
            frameBuffer: 1,
        },
        UpSpecial: {
            imageSrc: "./img/Blue/UpSpecial.png",
            frameRate: 13,
            frameBuffer: 4,
        },
        UpSpecialLeft: {
            imageSrc: "./img/Blue/UpSpecialLeft.png",
            frameRate: 13,
            frameBuffer: 4,
        },
        TranslationalSpecial: {
            imageSrc: "./img/Blue/TranslationalSpecial.png",
            frameRate: 10,
            frameBuffer: 5,
        },
        TranslationalSpecialLeft: {
            imageSrc: "./img/Blue/TranslationalSpecialLeft.png",
            frameRate: 10,
            frameBuffer: 5,
        },
        Fall: {
            imageSrc: "./img/Blue/Fall.png",
            frameRate: 1,
            frameBuffer: 1,
        },
        FallLeft: {
            imageSrc: "./img/Blue/FallLeft.png",
            frameRate: 1,
            frameBuffer: 1,
        },
        Jump: {
            imageSrc: "./img/Blue/Jump.png",
            frameRate: 1,
            frameBuffer: 1,
        },
        JumpLeft: {
            imageSrc: "./img/Blue/JumpLeft.png",
            frameRate: 1,
            frameBuffer: 1,
        },
    }
})


const p2 = new Player({
    position: {
        x: canvas.width * 2 / 4,
        y: -50,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    color: "rgba(255, 0, 0, 0.2)",
    interp: p2TransInterp,
    name: "Red",
    imageSrc: "./img/Sandbag.png",
    frameRate: 1,
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
    for (let i = 0; i < activeAttacks.length; i++) {
        activeAttacks[i].update()
        if (activeAttacks[i].elapsedFrames > 9999) { // Removing old attacks
            activeAttacks.splice(i, 1)
            i--
        }
    }

    // Check for attacks
    p1.checkHurtCollision({activeAttacks: activeAttacks})
    p2.checkHurtCollision({activeAttacks: activeAttacks})

    // Display text
    p1.displayDebugStats({id: "debugstats1"})
    p2.displayDebugStats({id: "debugstats2"})

    p1.displayPercent({id: "p1-percent"})
    p2.displayPercent({id: "p2-percent"})
    
    p1.displayLives({id: "p1-lives"})
    p2.displayLives({id: "p2-lives"})

    // Handling user input for movement
    if (p1.canAttack) {
        if (keys.a.pressed) {
            p1.velocity.x = p1.interp.update(-playerSpeed);
            p1.lastDirection = 'left'
            p1.switchSprite("RunLeft")
        } else if (keys.d.pressed) {
            p1.velocity.x = p1.interp.update(playerSpeed);
            p1.lastDirection = 'right'
            p1.switchSprite("Run")
        } else {
            p1.velocity.x = p1.interp.update(0);
            switch (p1.lastDirection) {
                case "left":
                    p1.switchSprite("IdleLeft")
                    break
                case "right":
                    p1.switchSprite("Idle")
                    break
            }
        }
    } else {
        p1.velocity.x = p1.interp.update(0);
    }
    
    if (p2.canAttack) {
        if (keys.leftArrow.pressed) {
            p2.velocity.x = p2.interp.update(-playerSpeed);
            p2.lastDirection = 'left'
        } else if (keys.rightArrow.pressed) {
            p2.velocity.x = p2.interp.update(playerSpeed);
            p2.lastDirection = 'right'
        } else {
            p2.velocity.x = p2.interp.update(0);
        }
    } else {
        p2.velocity.x = p2.interp.update(0);
    }


    // Switch the friction of the ground depending on the material a player is standing on
    switch(p1.material) {
        case 'air':
            p1TransInterp.setAlpha(friction.air)
            
            if (p1.velocity.y > 0 && p1.canAttack) {
                switch (p1.lastDirection) {
                    case "left":
                        p1.switchSprite("FallLeft")
                        break
                    case "right":
                        p1.switchSprite("Fall")
                        break
                }
            } else if (p1.velocity.y <= 0 && p1.canAttack) {
                switch (p1.lastDirection) {
                    case "left":
                        p1.switchSprite("JumpLeft")
                        break
                    case "right":
                        p1.switchSprite("Jump")
                        break
                }
            }

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

    // User input for attacks
    // TO DO: Figure out how to remove past attacks
    if (keys.r.pressed && keys.a.pressed && p1.canAttack) {
        character1.horiBasic({p: p1})
        p1.switchSprite("TranslationalBasicLeft")
    } else if (keys.r.pressed && keys.d.pressed && p1.canAttack) {
        character1.horiBasic({p: p1})
        p1.switchSprite("TranslationalBasic")
    } else if (keys.r.pressed && keys.w.pressed && p1.canAttack) {
        character1.upBasic({p: p1})
        switch (p1.lastDirection) {
            case "left":
                p1.switchSprite("UpBasicLeft")
                break
            case "right":
                p1.switchSprite("UpBasic")
                break
        }
    } else if (keys.r.pressed && keys.s.pressed && p1.canAttack) {
        character1.downBasic({p: p1})
        p1.switchSprite("DownBasic")
    } else if (keys.r.pressed && p1.canAttack) { // Order matters, neutral attacks should be last
        character1.neutralBasic({p: p1})
        switch (p1.lastDirection) {
            case "left":
                p1.switchSprite("NeutralBasicLeft")
                break
            case "right":
                p1.switchSprite("NeutralBasic")
                break
        }
    } else if (keys.t.pressed && keys.w.pressed && p1.canAttack) {
        character1.upSpecial({p: p1})
        switch (p1.lastDirection) {
            case "left":
                p1.switchSprite("UpSpecialLeft")
                break
            case "right":
                p1.switchSprite("UpSpecial")
                break
        }
    } else if (keys.t.pressed && keys.a.pressed && p1.canAttack) {
        character1.horiSpecial({p: p1})
        p1.switchSprite("TranslationalSpecialLeft")
    } else if (keys.t.pressed && keys.d.pressed && p1.canAttack) {
        character1.horiSpecial({p: p1})
        p1.switchSprite("TranslationalSpecial")
    } else if (keys.t.pressed && keys.s.pressed && p1.canAttack) {
        character1.downSpecial({p: p1})
        switch (p1.lastDirection) {
            case "left":
                p1.switchSprite("DownSpecialLeft")
                break
            case "right":
                p1.switchSprite("DownSpecial")
                break
        }
    } else if (keys.t.pressed && p1.canAttack) { // Order matters, neutral attacks should be last
        character1.neutralSpecial({p: p1})
        switch (p1.lastDirection) {
            case "left":
                p1.switchSprite("NeutralSpecialLeft")
                break
            case "right":
                p1.switchSprite("NeutralSpecial")
                break
        }
    }

    if (keys.p.pressed && keys.leftArrow.pressed && p2.canAttack) {
        character1.horiBasic({p: p2})
    } else if (keys.p.pressed && keys.rightArrow.pressed && p2.canAttack) {
        character1.horiBasic({p: p2})
    } else if (keys.p.pressed && keys.upArrow.pressed && p2.canAttack) {
        character1.upBasic({p: p2})
    } else if (keys.p.pressed && keys.downArrow.pressed && p2.canAttack) {
        character1.downBasic({p: p2})
    } else if (keys.p.pressed && p2.canAttack) { // Order matters, neutral attacks should be last
        character1.neutralBasic({p: p2})
    } else if (keys.o.pressed && keys.upArrow.pressed && p2.canAttack) {
        character1.upSpecial({p: p2})
    } else if (keys.o.pressed && keys.leftArrow.pressed && p2.canAttack) {
        character1.horiSpecial({p: p2})
    } else if (keys.o.pressed && keys.rightArrow.pressed && p2.canAttack) {
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

function gameOver({loser}) {
    let screen = document.getElementById("game-over-container")
    screen.style.opacity = "100%"
    screen.style.display = "block"
    
    let header = document.getElementById("game-over-header")
    header.innerHTML = getOtherPlayer(loser).name + " wins!"

    p1.displayStats({id: "p1-stats"})
    p2.displayStats({id: "p2-stats"})
}

// Make sure pixel art isn't blurry
c.imageSmoothingEnabled = false
