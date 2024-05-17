class character1 {
    static neutralNormal({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 2.5,
            height: 0.2,
            frames: {delay: 0, duration: 10, cooldown: 5},
            multiplier: {x: 10, y: 5},
            offset: {x: -0.75, y: -0.8}
        }))
    }

    static horiNormal({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1.5,
            height: 0.5,
            frames: {delay: 0, duration: 10, cooldown: 10},
            multiplier: {x: 30, y: 5},
            offset: {x: 1, y: -0.25}
        }))
    }

    static upNormal({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1,
            height: 1,
            frames: {delay: 0, duration: 10, cooldown: 15},
            multiplier: {x: 5, y: 10},
            offset: {x: 0, y: 0.8}
        }))
    }

    static downNormal({p}) {
        activeAttacks.push(new HurtBox({
            player: p,
            width: 1,
            height: 0.5,
            frames: {delay: 0, duration: 60, cooldown: 10},
            multiplier: {x: 2, y: 7},
            offset: {x: 0, y: -1.01}
        }))
        p.velocity.y += 5
    }
    
}