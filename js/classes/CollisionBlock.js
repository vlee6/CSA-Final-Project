class CollisionBlock {
    constructor({position, color, height = tileHeight}) {
        this.position = position
        this.width = tileWidth
        this.color = color
        this.height = height
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }
}