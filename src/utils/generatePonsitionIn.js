import { random } from "./radom.js";

export function generatePositionIn(numOfEnemies, i) {
  let y = ((innerHeight -100) * random(0, 40)) / 100;
  let x = ((innerWidth - 100) * random(0, 100)) / 100;

  return { x, y };
}

