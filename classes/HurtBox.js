class HurtBox {
    constructor({
        player,
        width,
        height,
        frames,
        multiplier,
    }) {
        this.position = {
            x: 0,
            y: 0,
        }
        this.width = width
        this.height = height
        this.player = player
        this.frames = frames
        this.elapsedFrames = 0
        this.multiplier = multiplier
    }

    update()
    {
        this.player.isAttacking = true
        if (this.elapsedFrames < this.frames.duration) {         
            switch (this.player.lastDirection) { // Making the hurtbox face the right direction
                case "right":
                    this.position.x = this.player.position.x + (this.player.hitbox.width / 2)
                    this.position.y = this.player.position.y
                    break
                case "left":
                    this.position.x = this.player.position.x - (this.player.hitbox.width / 2)
                    this.position.y = this.player.position.y
                    break
            }
            c.fillStyle = 'rgba(255, 0, 0, 0.5)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        } else {
            this.position.y = -99999 // Obscuring the hurtbox once the attack is over (probably gonna be an issue later)
            this.width = 0
            this.height = 0
            if (this.elapsedFrames > this.frames.cooldown + this.frames.duration) {
                this.player.isAttacking = false
            }
        }
        this.elapsedFrames++
    }


}