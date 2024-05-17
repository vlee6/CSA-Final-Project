class HurtBox {
    constructor({
        player,
        width,
        height,
        frames,
        multiplier,
        offset,
    }) {
        this.position = {
            x: 0,
            y: 0,
        }
        this.player = player
        this.width = player.hitbox.width * width // Offsets, width, and height is all relative to the hitbox size
        this.height = player.hitbox.height * height
        this.frames = frames
        this.elapsedFrames = 0
        this.multiplier = multiplier
        this.offset = offset
        this.attackRegistered = false // If an attack is already registered, it shouldn't do damage again
    }

    update()
    {
        this.player.canAttack = false
        if (this.elapsedFrames > this.frames.delay && this.elapsedFrames < this.frames.duration + this.frames.delay && !this.attackRegistered) { 
            this.position.y = this.player.position.y - (this.player.hitbox.height * this.offset.y)        
            switch (this.player.lastDirection) { // Making the hurtbox face the right direction
                case "right":
                    this.position.x = this.player.position.x + (this.player.hitbox.width * this.offset.x)
                    break
                case "left":
                    this.position.x = this.player.position.x - (this.width - this.player.hitbox.width) - (this.player.hitbox.width * this.offset.x) // Some very confusing math to mirror the attack
                    break
            }
            this.draw()
        } else {
            this.position.y = -99999 // Obscuring the hurtbox once the attack is over (probably gonna be an issue later)
            if (this.elapsedFrames > this.frames.cooldown + this.frames.duration + this.frames.delay) {
                this.player.canAttack = true
            }
        }
        this.elapsedFrames++
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }


}