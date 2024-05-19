class character1 {
    static neutralBasic({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1,
            height: 0.3,
            frames: {delay: 0, duration: 10, cooldown: 0},
            multiplier: {x: 5, y: 5, percent: 0.3},
            offset: {x: 1, y: -0.25}
        }))
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1,
            height: 0.3,
            frames: {delay: 15, duration: 10, cooldown: 10},
            multiplier: {x: 30, y: 5, percent: 0.3},
            offset: {x: 1, y: -0.5}
        }))
        p.interp.update(p.velocity.x + 50 * p.getDirection())
    }

    static horiBasic({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1.5,
            height: 0.5,
            frames: {delay: 0, duration: 10, cooldown: 5},
            multiplier: {x: 50, y: 5, percent: 0.5},
            offset: {x: 1, y: -0.25}
        }))
    }

    static upBasic({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1,
            height: 1,
            frames: {delay: 0, duration: 10, cooldown: 15},
            multiplier: {x: 5, y: 10, percent: 0.5},
            offset: {x: 0, y: 0.8}
        }))
    }

    static downBasic({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1,
            height: 0.5,
            frames: {delay: 0, duration: 60, cooldown: 10},
            multiplier: {x: 2, y: 7, percent: 1},
            offset: {x: 0, y: -1.01}
        }))
        p.velocity.y += 5
    }

    static neutralSpecial({p}) {
        activeAttacks.push(new Projectile({
            player: p,
            target: p2,
            width: 50,
            height: 20,
            frames: {delay: 0, duration: 500, cooldown: 40},
            multiplier: {x: 10, y: 5, percent: 2},
            speed: 25,
            collisionBlocks: collisionBlocks.concat(platformCollisionBlocks), // Projectiles will dissapear if they collide with platforms or regular collision blocks
        }))
    }

    static horiSpecial({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1,
            height: 0.5,
            frames: {delay: 5, duration: 5, cooldown: 20},
            multiplier: {x: 200, y: 7, percent: 0.1},
            offset: {x: 1, y: -0.25}
        }))
    }

    static upSpecial({p}) {
        p.position.y -= 200
        p.velocity.y = -10
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1.5,
            height: 0.7,
            frames: {delay: 0, duration: 20, cooldown: 20},
            multiplier: {x: 5, y: 5, percent: 0.2},
            offset: {x: -0.25, y: 0.25}
        }))
    }

    static downSpecial({p}) {

    }
    
}