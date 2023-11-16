import { HUD } from "../ui/HUD.js";
import { Enemies } from "./entities/enemies.js";
import { Player } from "./entities/player.js";
import { generatePositionIn } from "../utils/generatePonsitionIn.js";
import { throttle } from "../utils/throttle.js";


// This class has a purpose to start a new game
export class GamePlay {
  constructor() {
    this.activeBullets = []
    this.isGamePaused = false;
    // init a gameBoard
    this.gameBoard = document.querySelector("#game-board");
    // Default position of the player at start of the game
    this.position = {
      x: 50 - (100 * 100) / window.innerWidth,
      y: 0,
    };
    // init a new player
    this.player = new Player(
      "Player",
      100,
      100,
      30,
      this.position,
      1000,
      1,
      this.activeBullets,
      this.gameBoard
    );

    HUD();
    // init a set of enemies
    this.enemies = [];

  }

  load() {
    this.player.loadTexture()
    //  make the player movements controlled by keyboard keys
    this.player.moveHandler();
    this.loadEnemies();
  }

  loadEnemies() {
    // Load the texture of an enemy

    for (let i = 0; i < 1; i++) {
      let r = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
      const texture = {
        100: `assets/characters/enemies/soldier/enemy-${r}/base.png`,
        0: `assets/characters/enemies/soldier/enemy-${r}/destruction.png`
      }
      let { direction, x, y, z } = generatePositionIn(1, i);

      let enemy = new Enemies(
        "Enemy",
        100,
        100,
        10,
        { x, y, z },
        texture,
        Math.floor(Math.random() * (2000 - 4000 + 1)) + 4000,
        -1,
        this.activeBullets,
        this.gameBoard,
        direction
      );
      enemy.loadTexture()
      this.enemies.push(enemy);
    }
  }

  render = throttle(() => {
      this.enemies = this.enemies.filter((enemy) => enemy.isAlive);
      // console.log(this.enemies)
      for (let i = 0; i < this?.activeBullets?.length; i++) {
          let bullet = this.activeBullets[i];
          bullet.fire(this.activeBullets, i);
      }
      
      this.player.render()
      this.enemies.forEach((enemy) => {
          enemy.appearationMove();
          enemy.render();
      });

  }, 0)
}
