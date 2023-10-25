// import { Player } from "./gameplay/shared/entities/player.js";
import { skyAnimation } from "./ui/skyAnimation.js";
import { FPSMeasurement } from "./utils/fpsMeasurement.js";
import { GamePlay } from "./gameplay/gameplay.js";

export class Engine {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.game = new GamePlay(gameBoard);
    const FPS = 60; // Desired frames per second
    this.UPDATE_RATE = 1000 / FPS; // Time in milliseconds for each frame
    this.lastUpdateTime = Date.now();
    this.gameLoop = this.gameLoop.bind(this);
  }

  gameLoop() {
    const now = Date.now();
    const elapsed = now - this.lastUpdateTime;
    if (elapsed > this.UPDATE_RATE) {
      this.render();
      this.lastUpdateTime = now - (elapsed % this.UPDATE_RATE);
    }
    window.requestAnimationFrame(this.gameLoop);
  }
  render() {
    FPSMeasurement();
    // Sky animation
    skyAnimation(this.gameBoard);
    // Render the entities of the game
    this.game.player.render();
    this.game.enemies.forEach((enemy) => {
      enemy.appearationMove(this.game.enemies)
      enemy.render()
    });
  }
}
