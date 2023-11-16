import { spriteAnimation } from "../../utils/spriteAnimation.js";
import { weapon } from "../../utils/wepean.js";

class Bullets {
  constructor(BulletOwner, x, y, direction, isHitTarget, gameBoard) {
    this.BulletOwner = BulletOwner;
    this.gameBoard = gameBoard;
    this.direction = direction;
    this.isHitTarget = isHitTarget;
    this.position = {
      x,
      y,
    };

    let [bullets, animationState] = weapon("bigGun", this.position)
    this.bullets = bullets
    this.animationState = animationState

    this.gameBoard.appendChild(this.bullets);

  }

  loadGun(newGun) {
    const [newBullets, newAnimationState] = weapon(newGun, this.position);
    
    // Remove the current bullets from the game board
    this.gameBoard.removeChild(this.bullets);

    // Update with the new bullets and animation state
    this.bullets = newBullets;
    this.animationState = newAnimationState;
    this.currentGun = newGun;

    // Add the new bullets to the game board
    this.gameBoard.appendChild(this.bullets);
  }

  fire(array, index) {
    this.position.y += 0.8 * this.direction;
    this.bullets.style.bottom = `${this.position.y}%`;

    spriteAnimation(this.bullets, this.animationState);
    const isOutOfBoard = this.position.y > 100 || (this.position.y < 0 && this.gameBoard.contains(this.bullets));

    if (isOutOfBoard || this.isHitTarget) {
      this.gameBoard.removeChild(this.bullets);
      array.splice(index, 1);
    }
  }
}

export default Bullets;
