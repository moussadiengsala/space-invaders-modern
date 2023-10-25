import { spriteAnimation } from "../../utils/spriteAnimation.js";

let Bullets = function (x, y, direction, gameBoard) {
  this.gameBoard = gameBoard;
  this.position = {
    x,
    y,
  };
  this.direction = direction;
  this.width = 32;
  this.height = 32;
  

  this.bullets = document.createElement("div");
  this.bullets.style.backgroundImage =
    "url(../../../assets/Foozle_2DS0011_Void_MainShip/projectile/PNGs/big-gun.png)";

  this.bullets.style.position = "absolute";
  this.animationState = {
    currentFrame: 0,
    frameCount: 10,
  };

  this.bullets.style.width = this.width + "px";
  this.bullets.style.height = this.height + "px";
  this.bullets.style.borderRadius = "50%";

  this.bullets.style.left = `${this.position.x}%`;
  this.bullets.style.bottom = `${this.position.y}%`;

  this.gameBoard.appendChild(this.bullets);
};

Bullets.prototype.fire = function (array, index) {
  this.position.y += 0.8 * this.direction;
  this.bullets.style.bottom = `${this.position.y}%`;
  
  spriteAnimation(this.bullets, this.animationState);
  if ((this.position.y > 100 || this.position.y < 0) && this.gameBoard.contains(this.bullets)) {
    this.gameBoard.removeChild(this.bullets);
    array.splice(index, 1);
  }
};

export default Bullets;
