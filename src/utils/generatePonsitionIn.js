export function generatePositionIn(numOfEnemies, i) {
    let condition = i < numOfEnemies / 2;
    let a = i - 6;

    let { direction, x, y, z } = condition
        ? {
              direction: 1,
              x: -30,
              y: 80 - (i % 4) * 10,
              z: 20 + (i % 6) * 10,
          }
        : {
              direction: -1,
              x: 120,
              y: 80 - (a % 4) * 10,
              z: 70 - (i % 6) * 10,
          };

    return { direction, x, y, z };
}
