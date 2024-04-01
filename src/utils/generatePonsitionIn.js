import { random } from "./radom.js";

export function generatePositionIn(gameBoard, numOfEnemies, i) {
    let y = random(0, innerHeight / 2);
    let x = random(100, gameBoard.clientWidth - 100);

    return { x, y };
}
