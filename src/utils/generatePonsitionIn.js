import { random } from "./radom.js";

export function generatePositionIn(gameBoard, numOfEnemies, i) {
    let y = random(0, innerHeight / 2);
    let x = random(50, gameBoard.clientWidth - 50);

    return { x, y };
}
