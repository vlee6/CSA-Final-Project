class Sprite {
    constructor({
        position,
        imageSrc,
        frameRate = 1,
        frameBuffer = 3,
        scale = 1,
    }) {
        this.position = position
        this.frameRate = frameRate
        this.frameBuffer = frameBuffer // Increasing this will slow down frame rate of animation
        this.scale = scale
        this.loaded = false

        this.image = new Image()
        this.image.src = imageSrc
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale // Our sprite sheet is all the frames together
            this.height = this.image.height * this.scale
            this.loaded = true
        }

        this.currentFrame = 0
        this.elapsedFrames = 0
    }

    draw() {
        if (!this.image || !this.loaded) { return } // If theres no image, don't draw
        
        const cropbox = { // We show each frame of our spritesheet and hide the others
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }

        c.drawImage( // Drawing each individual frame
            this.image, 
            cropbox.position.x, 
            cropbox.position.y, 
            cropbox.width, 
            cropbox.height, 
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        )

        // c.fillStyle = "rgba(125, 55, 0, 0.05)"
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    updateFrames() {
        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer == 0) {
            // If the current frame is less than our total frames, go to the next frame
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }

    update() {
        this.draw()
        this.updateFrames()
    }
}