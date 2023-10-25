import { Enemies } from "./entities/enemies.js";
import { Player } from "./entities/player.js";
import { generatePositionIn } from "../utils/generatePonsitionIn.js";

// This class has a purpose to start a new game
export class GamePlay {
  constructor(gameBoard) {
    // init a gameBoard
    this.gameBoard = gameBoard;
    // Default position of the player at start of the game
    this.position = {
      x: 50 - (100 * 100) / window.innerWidth,
      y: 0,
    };
    // init a new player
    this.player = new Player("Player", 100, 3, 10, this.position, 900, 1, this.gameBoard);
    //  make the player movements controlled by keyboard keys
    this.player.moveHandler();
    // init a set of enemies
    this.enemies = [];
    this.appendEnemies();
  }

  appendEnemies() {

    
    // Load the texture of an enemy
    const texture =
      "assets/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Full health.png";

    for (let i = 0; i < 1; i++) {
      let {direction, x, y, z} = generatePositionIn(1, i)
     
      let enemy = new Enemies(
        "Enemy",
        100,
        3,
        10,
        { x, y, z },
        texture,
        1500,
        -1,
        this.gameBoard,
        direction
      );
      this.enemies.push(enemy);
    }
  }
}
