class Player extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        color,
        interp,
        name,
        imageSrc,
        frameRate,
        scale = 3,
        animations,
    }) {
        super({imageSrc: imageSrc, frameRate: frameRate, scale: scale})
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
            width: 45,
            height: 100,
        }
        this.color = color
        this.jumps = { // Change for double jump or triple jump
            num: 1,
            max: 2,
        }
        this.material = 'air',
        this.lastDirection = 'right'
        this.bounceThreshold = {
            y: 30
        }
        this.canAttack = true
        this.interp = interp
        this.multiplier = 1
        this.lives = 3
        this.name = name
        this.gameOver = false
        this.totalDamageTaken = 0

        this.animations = animations
        for (let key in this.animations) { // Getting images from our animation, replacing the data in this.animations
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }
    }

    switchSprite(key) {
        if (this.image == this.animations[key].image || !this.loaded) { return } // If we are at the desired image, we don't need to do anything

        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    update() {
        if (this.outOfBounds()) { 
            this.lives--
            this.position.x = this.respawnPosition.x
            this.position.y = this.respawnPosition.y
            this.interp.setAlpha(1)
            this.interp.update(0)
            this.velocity.x = 0
            this.velocity.y = 0
            this.multiplier = 1
            if (this.lives <= 0) {
                gameOver({loser: this})
                // this.color = "rgba(255, 255, 255, 0)"
                this.gameOver = true
            }
        }
        // For some reason, if gameOver isn't a instance variable and the return statement isn't outside of the if statement above, it doesn't work
        if (this.gameOver) {return false}

        super.update() // Inheirited from the Sprite class
        
        // Drawing a rectangle to show where our hitbox is
        // c.fillStyle = this.color
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

        this.position.x += this.velocity.x

        this.updateHitbox() // Our hitbox values should be up to date before we check for vertical or horizontal collisions
        this.checkForHorizontalCollisions() // MAKE SURE THIS IS BEFORE GRAVITY SINCE GRAVITY WILL CAUSE THE OBJECT TO TOUCH THE COLLISION BLOCK
        this.applyGravity()
        this.updateHitbox() // Our hitbox values should be up to date before we check for vertical or horizontal collisions
        this.checkMaterial()
        this.checkForVerticalCollisions()

        this.updateHitbox()
    }

    updateHitbox() {
        this.hitbox = {
            width: this.hitbox.width,
            height: this.hitbox.height,
            position: {
                x: this.position.x + this.width / 2 - this.hitbox.width / 2,
                y: this.position.y + 139, // Arbitrary offest to get sprite's feet on the ground
            },
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

                    if (this.velocity.y > -this.bounceThreshold.y) {
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
                    attack.attackRegistered = true
                    let xDirection = Math.sign((this.position.x + this.hitbox.width / 2) - (attack.player.position.x + attack.player.hitbox.width / 2)) // Getting the direction of the attack
                    let yDirection = Math.sign((this.position.y + this.hitbox.height / 2.1) - (attack.player.position.y + attack.player.hitbox.height / 2))
                    this.velocity.x = this.interp.update(xDirection * attack.multiplier.x * this.multiplier)
                    this.velocity.y = yDirection * attack.multiplier.y * (this.multiplier * 0.8) 
                    let damage = (attack.multiplier.x + attack.multiplier.y) / 2 * attack.multiplier.percent * this.multiplier * globalMultiplier
                    this.multiplier += damage
                    this.totalDamageTaken += damage
                    if (this.multiplier > 4) { this.multiplier = 4 } // Making sure the multiplier does not exceed 300%
                    if (this.multiplier < 1) { this.multiplier = 1 } // Making sure the multiplier is not below 0%
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
        if (this.jumps.num > 0 && this.velocity.y >= 0)
        {
            this.velocity.y = -jumpHeight
            this.jumps.num--
        }
    }

    displayDebugStats({id}) {
        document.getElementById(id).innerHTML =
        "xVel: " + this.velocity.x.toFixed(2)
        + "\n yVel: " + this.velocity.y.toFixed(2)
        + "\n onMaterial: " + this.material
        // + "\n friction: " + horizontalInterp.mAlpha
        // + "\n respawnX: " + this.respawnPosition.x.toFixed(2)
        // + "\n respawnY: " + this.respawnPosition.y.toFixed(2)
        + "\n playerY: " + this.position.y.toFixed(2)
        + "\n playerX: " + this.position.x.toFixed(2)
        + "\n direction: " + this.lastDirection
        + "\n lives: " + this.lives
    }

    displayPercent({id}) {
        document.getElementById(id).innerHTML = ((this.multiplier - 1) * 100).toFixed(1) + "%"
    }

    displayLives({id}) {
        document.getElementById(id).innerHTML = "Lives: " + this.lives
    }

    getDirection() {
        switch (this.lastDirection) {
            case "left":
                return -1
            case "right":
                return 1
        }
    }

    outOfBounds() {
        let playerX = this.position.x + this.hitbox.width / 2
        let playerY = this.position.y + this.hitbox.height / 2

        return (
            playerX < 0 - bounds ||
            playerX > canvas.width + bounds ||
            playerY < 0 - bounds ||
            playerY > canvas.height + bounds
        )
    }

    displayStats({id}) {
        document.getElementById(id).innerHTML =

        "<b>" + this.name + "</b>"
        + "\n Kills: " + (3 - getOtherPlayer({player: this}).lives)
        + "\n Deaths: " + (3 - this.lives)
        + "\n Damage: " + (getOtherPlayer({player: this}).totalDamageTaken * 100).toFixed(2) + "%"
    }

}