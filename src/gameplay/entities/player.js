import { Character } from "../shared/character.js";

export class Player extends Character {
  constructor(ID, size, health, strength, position, spaceFire, directionBullets, activeBullets, gameBoard) {

    // the texture is now an object where keys represent diffrent state of health and values represent texture on that state of health
    const texture = {
      100: "/assets/characters/main-ship-base/PNGs/full-health.png",
      75: '/assets/characters/main-ship-base/PNGs/slight-damage.png',
      50: '/assets/characters/main-ship-base/PNGs/damaged.png',
      25: "/assets/characters/main-ship-base/PNGs/very-damage.png",
      0: "/assets/characters/main-ship-base/PNGs/very-damage.png"
    }

    super(ID, size, health, strength, position, texture, spaceFire, directionBullets, activeBullets, gameBoard);
    this.movebymouse = this.movebymouse.bind(this);
    this.movebyKeyBoard = this.movebyKeyBoard.bind(this);
    this.gameBoardRect = this.gameBoard.getBoundingClientRect();
  }

  movebymouse(e) {
    let xPercentage =
      ((e.clientX - this.gameBoardRect.left - this.size) /
        this.gameBoardRect.width) *
      100;
    let yPercentage =
      ((e.clientY - this.gameBoardRect.top - this.size) /
        this.gameBoardRect.height) *
      100;

    xPercentage = Math.max(
      0,
      Math.min(xPercentage, 100 - (this.size * 100) / this.gameBoardRect.width)
    );
    yPercentage = Math.max(
      0,
      Math.min(yPercentage, 100 - (this.size * 100) / this.gameBoardRect.height)
    );

    let bottomPercentage =
      100 - (yPercentage + (this.size * 100) / this.gameBoardRect.height);

    this.position.x = xPercentage;
    this.position.y = bottomPercentage;
  }
  movebyKeyBoard(distance, direction) {
    let updatePosition = (coord) => {
      let value = coord;
      if (0 <= value <= 100) {
        value = ["right", "up"].includes(direction)
          ? value + distance
          : value - distance;
      }
      return value;
    };

    if (["right", "left"].includes(direction)) {
      this.position.x = updatePosition(this.position.x);
    } else if (["up", "down"].includes(direction)) {
      this.position.y = updatePosition(this.position.y);
    }
  }
  moveHandler() {
    window.addEventListener("mousemove", this.movebymouse);
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") this.movebyKeyBoard(1, "left");
      if (event.key === "ArrowRight") this.movebyKeyBoard(1, "right");
      if (event.key === "ArrowUp") this.movebyKeyBoard(1, "up");
      if (event.key === "ArrowDown") this.movebyKeyBoard(1, "down");
    });
  }
}
