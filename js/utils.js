function collision({object1, object2}) {
    return (
        object1.position.y + object1.height >= object2.position.y  // Check if the bottom of object1 touches top of object2
        && object1.position.y <= object2.position.y + object2.height // Check if anywhere between the top and bottom of object1 touches bottom of object2
        && object1.position.x <= object2.position.x + object2.width // Check if left of object1 touches right of object2
        && object1.position.x + object1.width >= object2.position.x // Check if right of object1 touches left of object2
    )
}

// Platform collisions differ that the collision is only valid when the bottom object1 touches of object2
function platformCollision({object1, object2}) {
    return (
        object1.position.y + object1.height >= object2.position.y  // Check if the bottom of object1 touches top of object2
        && object1.position.y + object1.height <= object2.position.y + object2.height // Check if bottom of object1 touches the bottom of object2
        && object1.position.x <= object2.position.x + object2.width // Check if left of object1 touches right of object2
        && object1.position.x + object1.width >= object2.position.x // Check if right of object1 touches left of object2
    )
}

// The onMaterialCheck checks for whether object1 is slightly above object2 (this counts as touching the ground)
function onMaterialCheck({object1, object2}) {
    return (
        object1.position.y + object1.height + 0.1 >= object2.position.y // 0.1 is the jump buffer, allowing the player to jump even if they aren't perfectly on the ground
        && object1.position.y + object1.height <= object2.position.y + object2.height
        && object1.position.x <= object2.position.x + object2.width
        && object1.position.x + object1.width >= object2.position.x
    )
}

// Create seperate 2D tilesets for each type of tile in the master tilseet
function createBlockSet({tileset, tileNum, rowLength}) {
    let exclusiveTileSet = new Array(tileset.length)
    for (let i = 0; i < tileset.length; i += 1) {
        if (tileset[i] === tileNum) {
            exclusiveTileSet[i] = tileNum
        } else {  // (tileSet[i] != tileNum)
            exclusiveTileSet[i] = 0
        }
    }
    let exclusiveTileSet2D = []
    for (let i = 0; i < exclusiveTileSet.length; i += rowLength)
    {
        exclusiveTileSet2D.push(exclusiveTileSet.slice(i, i + rowLength))
    }
    return exclusiveTileSet2D
}

// Exponentially weighted average—just a fancy way to interpolate translation to get more organic movement
class Ewma {
    constructor(alpha) {
        this.mAlpha = alpha
        this.mLastValue = 0
    }

    setAlpha(x) {
        this.mAlpha = x
    }

    update(x) {
        this.mLastValue = this.mAlpha * x + (1 - this.mAlpha) * this.mLastValue;
        return this.mLastValue;
    }

}

// Get the other of two players
function getOtherPlayer({player}) {
    for (let i = 0; i < players.length; i++) {
        if (players[i] != player) { return players[i] }
    }
}

