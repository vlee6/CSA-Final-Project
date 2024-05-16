class Player {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        color,
        interp,
    }) {
        this.position = position
        this.respawnPosition = {
            x: position.x,
            y: position.y,
        }
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.collisionBlocks = collisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks
        this.hitbox = { // The hitbox is what actually interacts with the environment
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 50,
            height: 70,
        }
        this.color = color
        this.jumps = { // Change for double jump or triple jump
            num: 1,
            max: 2,
        }
        this.material = 'air',
        this.lastDirection = 'right'
        this.bounceThreshold = {
            y: 20
        }
        this.isAttacking = false
        this.interp = interp
    }

    update() {
        this.updateHitbox()

        // Drawing a rectangle to show where our hitbox is
        c.fillStyle = this.color
        c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

        this.position.x += this.velocity.x

        this.updateHitbox() // Our hitbox values should be up to date before we check for vertical or horizontal collisions
        this.checkForHorizontalCollisions() // MAKE SURE THIS IS BEFORE GRAVITY SINCE GRAVITY WILL CAUSE THE OBJECT TO TOUCH THE COLLISION BLOCK
        this.applyGravity()
        this.updateHitbox() // Our hitbox values should be up to date before we check for vertical or horizontal collisions
        this.checkMaterial()
        this.checkForVerticalCollisions()
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: this.hitbox.width,
            height: this.hitbox.height,
        }
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]
            
            // If the player is touching the iterated collision block stop the player and move to a specific position
            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock
                })
            ) {
                if (this.velocity.x > 0) { // If the player is moving to the right and collides with a collision block...
                    this.velocity.x = 0

                    // Find the distance between the right of the hitbox and the right of the sprite image
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    // Setting the position of the hitbox to the left of the block (plus a small buffer)
                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break // If theres a collision, there is no need to iterate through the rest of the blocks
                }

                if (this.velocity.x < 0) { // If the player is moving to the right and collides with a collision block...
                    this.velocity.x = 0

                    // Find the distance between the left of the hitbox and the left of the sprite image
                    const offset = this.hitbox.position.x - this.position.x

                    // Setting the position of the hitbox to the right of the block (plus a small buffer)
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }

    checkForVerticalCollisions() {
        // For normal collision blocks
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]
            
            // If the player is touching the iterated collision block stop the player and move to a specific position
            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock
                })
            ) {
                if (this.velocity.y > 0) { // If the player is are moving down and collides with a collision block...
                    // Find the distance between the bottom of the hitbox and the bottom of the sprite image
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    // Setting the position of the hitbox to the top of the block (plus a small buffer)
                    this.position.y = collisionBlock.position.y - offset - 0.01

                    if (this.velocity.y > this.bounceThreshold.y) {
                        this.velocity.y *= -0.5
                    } else {
                        this.velocity.y = 0
                    }

                    break
                }

                if (this.velocity.y < 0) { // If the player is moving up and collides with a collision block...

                    // Find the distance between the top of the hitbox and the top of the sprite image
                    const offset = this.hitbox.position.y - this.position.y

                    // Setting the position of the hitbox to to the bottom of the block (plus a small buffer)
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01

                    if (this.velocity.y > this.bounceThreshold.y) {
                        this.velocity.y *= -0.5
                    } else {
                        this.velocity.y = 0
                    }

                    break
                }
            }
        }

        // For platform collision blocks
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i]
            
            // If the player is touching a platform collision block, only stop the player if where are moving downward
            if (
                platformCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlock
                })
            ) {
                if (this.velocity.y > 0) {
                    // Find the distance between the bottom of the hitbox and the bottom of the sprite image
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    // Setting the position of the hitbox to the bottom of the platform (plus a small buffer)
                    this.position.y = platformCollisionBlock.position.y - offset - 0.01

                    if (this.velocity.y > this.bounceThreshold.y) {
                        this.velocity.y *= -0.5
                    } else {
                        this.velocity.y = 0
                    }

                    break
                }
            }
        }
    }

    checkHurtCollision({activeAttacks}) {
        activeAttacks.forEach(attack => {
            if (
                collision({
                    object1: this.hitbox,
                    object2: attack
                })
            ) {
                if (attack.player != this) {
                    this.velocity.x = this.interp.update(((this.position.x + this.hitbox.width / 2) - (attack.player.position.x + attack.player.hitbox.width / 2)) * attack.multiplier)
                    this.velocity.y = -5 * attack.multiplier
                }
            }
        })
    }

    checkMaterial() {
        // If it's not any material, it's probably air
        this.material = 'air'

        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]
            if (onMaterialCheck({
                object1: this.hitbox,
                object2: collisionBlock
            })) {
                this.material = 'ground'
                this.jumps.num = this.jumps.max
                break
            }
        }

        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i]
            if (onMaterialCheck({
                object1: this.hitbox,
                object2: platformCollisionBlock
            })) {
                this.material = 'ground'
                this.jumps.num = this.jumps.max
                break
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }

    jump({jumpHeight}) {
        if (this.jumps.num > 0)
        {
            this.velocity.y = -jumpHeight
            this.jumps.num--
        }
    }

    displayStats({id}) {
        document.getElementById(id).innerHTML =
        "xVel: " + this.velocity.x.toFixed(2)
        + "\n yVel: " + this.velocity.y.toFixed(2)
        // + "\n onMaterial: " + this.collisions.vertical
        // + "\n friction: " + horizontalInterp.mAlpha
        // + "\n respawnX: " + this.respawnPosition.x.toFixed(2)
        // + "\n respawnY: " + this.respawnPosition.y.toFixed(2)
        + "\n playerY: " + this.position.y.toFixed(2)
        + "\n playerX: " + this.position.x.toFixed(2)
    }

}