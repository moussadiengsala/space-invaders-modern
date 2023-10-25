

function isInsideGameBoard(x, y, spaceShip) {
    const {x, y , width, height} = spaceShip.getBoundingClientRect()

    let spaceShipWidth = (100 * width) / innerWidth
    let spaceShipHeight = (100 * height) / innerHeight
    let isInAxieX = spaceShip
}