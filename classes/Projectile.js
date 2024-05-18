class Projectile { // I could make this a subclass but I'm too lazy
    constructor({
        player,
        target,
        width,
        height,
        frames,
        multiplier,
        speed,

    }) {
        this.position = {
            x: player.hitbox.position.x + player.hitbox.width / 2,
            y: player.hitbox.position.y + player.hitbox.height / 2
        }
        this.player = player
        this.target = target
        this.width = width
        this.height = height
        this.frames = frames
        this.elapsedFrames = 0
        this.multiplier = multiplier
        this.attackRegistered = false
        this.angle = angleBetween(player, target)
        this.speed = speed
    }

    update() {
        // this.player.canAttack = false
        if (this.elapsedFrames > this.frames.delay && this.elapsedFrames < this.frames.duration + this.frames.delay && !this.attackRegistered) {
            // Projectile is fired, position is continously updated
            this.position.x += Math.cos(this.angle) * this.speed
            this.position.y += Math.sin(this.angle) * this.speed
            this.draw()
        } else {
            this.position.y = -99999
            if (this.elapsedFrames > this.frames.cooldown + this.frames.duration + this.frames.delay) {
                this.player.canAttack = true
            }
            this.elapsedFrames++
        }
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}