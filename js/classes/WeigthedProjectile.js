class WeightedProjecile {
    constructor({
        player,
        width,
        height,
        frames,
        multiplier,
        accel,
        maxSpeed,
        collisionBlocks,
    }) {
        this.position = {
            x: player.hitbox.position.x + player.hitbox.width / 2 - width / 2, // The spawnpoint of the projectile is in the center of the player
            y: player.hitbox.position.y + player.hitbox.height / 2 - height / 2
        }
        this.lastY = this.position.y
        this.player = player
        this.lastDirection = player.getDirection()
        this.width = width
        this.height = height
        this.frames = frames
        this.elapsedFrames = 0
        this.multiplier = multiplier
        this.accel = accel
        this.maxSpeed = maxSpeed
        this.collisionBlocks = collisionBlocks
        this.attackRegistered = false
        this.hasCollided = false
        this.velocity = {
            x: 0,
            y: -5,
        }
    }

    update() {
        this.player.canAttack = false
        if (this.elapsedFrames > this.frames.cooldown) { this.player.canAttack = true }
        if (this.elapsedFrames >= this.frames.delay && this.elapsedFrames < this.frames.duration + this.frames.delay && !this.attackRegistered) { 
            // Projectile is fired, position is continously updated
            if (Math.abs(this.velocity.x) < this.maxSpeed) { this.velocity.x += this.accel * this.lastDirection}
            this.position.x += this.velocity.x
            this.checkForHorizontalCollisions()
            this.position.y = this.lastY
            this.applyGravity()
            this.checkForVerticalCollisions()
            this.draw()
            this.lastY = this.position.y 
        } else {
            this.position.y = -99999
        }
        this.elapsedFrames++
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]
            
            if (
                collision({
                    object1: this,
                    object2: collisionBlock
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.position.y - this.position.y + this.height
                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.position.y - this.position.y
                    this.position.y = collisionBlock.position.y + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }

    checkForHorizontalCollisions() { // Check whether the projectile has hit a wall, if so, 
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            let collisionBlock = this.collisionBlocks[i] 
            if (collision({object1: this, object2: collisionBlock})) {

                if (this.velocity.x > 0) {
                    this.velocity.x *= -1
                    this.lastDirection *= -1

                    const offset = this.position.x - this.position.x + this.width
                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }

                if (this.velocity.x < 0) {
                    this.velocity.x *= -1
                    this.lastDirection *= -1

                    const offset = this.position.x - this.position.x
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }

    draw() {
        c.fillStyle = 'rgba(255, 165, 50, 0.5)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}