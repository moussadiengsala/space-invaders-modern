import { spriteAnimation } from "../../utils/spriteAnimation.js";

class Bullets {
  constructor(x, y, direction, gameBoard) {
    this.gameBoard = gameBoard;
    this.direction = direction;
    this.position = {
      x,
      y,
    };

    this.bullets = document.createElement("div");

    this.animationState = {
      currentFrame: 0,
      frameCount: 10,
    };
    Object.assign(this.bullets.style, {
      backgroundImage:
        "url(../../../assets/Foozle_2DS0011_Void_MainShip/projectile/PNGs/big-gun.png)",
      position: "absolute",
      width: 32 + "px",
      height: 32 + "px",
      left: `${this.position.x}%`,
      bottom: `${this.position.y}%`,
    });

    this.gameBoard.appendChild(this.bullets);
  }
  fire(array, index) {
    this.position.y += 0.8 * this.direction;
    this.bullets.style.bottom = `${this.position.y}%`;

    spriteAnimation(this.bullets, this.animationState);
    if (
      this.position.y > 100 ||
      (this.direction < 0 && this.gameBoard.contains(this.bullets))
    ) {
      this.gameBoard.removeChild(this.bullets);
      array.splice(index, 1);
    }
  }
}

export default Bullets;
