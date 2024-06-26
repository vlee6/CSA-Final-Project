class Projectile { // I could make this a subclass but I'm too lazy
    constructor({
        player,
        width,
        height,
        frames,
        multiplier,
        speed,
        collisionBlocks,
    }) {
        this.position = {
            x: player.hitbox.position.x + player.hitbox.width / 2 - width / 2, // The spawnpoint of the projectile is in the center of the player
            y: player.hitbox.position.y + player.hitbox.height / 2 - height / 2
        }
        this.player = player
        this.playerY = player.hitbox.position.y + player.hitbox.height / 2 - height / 2
        this.lastDirection = player.getDirection()
        this.width = width
        this.height = height
        this.frames = frames
        this.elapsedFrames = 0
        this.multiplier = multiplier
        this.speed = speed
        this.collisionBlocks = collisionBlocks
        this.attackRegistered = false
        this.hasCollided = false
    }

    update() {
        this.checkCollisions()
        this.player.canAttack = false
        if (this.elapsedFrames > this.frames.cooldown) { this.player.canAttack = true }
        if (this.elapsedFrames >= this.frames.delay && this.elapsedFrames < this.frames.duration + this.frames.delay && !this.attackRegistered && !this.hasCollided) { 
            // Projectile is fired, position is continously updated
            this.position.x += this.speed * this.lastDirection
            this.position.y = this.playerY - 15 // Offset to get to finger
            this.draw()
        } else {
            this.position.y = -99999
        }
        this.elapsedFrames++
    }

    checkCollisions() { // Check whether the projectile has hit a wall, if so, 
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            let collisionBlock = this.collisionBlocks[i] 
            if (collision({object1: this, object2: collisionBlock})) { this.hasCollided = true }
        }
    }

    draw() {
        c.fillStyle = 'rgba(255, 255, 153, 1)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}
