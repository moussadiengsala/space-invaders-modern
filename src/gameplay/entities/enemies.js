import { throttle } from "../../utils/throttle.js";
import { Character } from "../shared/character.js";

export class Enemies extends Character {
  constructor(
    ID,
    size,
    health,
    strength,
    position,
    texture,
    spaceFire,
    directionBullets,
    activeBullets,
    gameBoard,
    direction
  ) {
    super(
      ID,
      size,
      health,
      strength,
      position,
      texture,
      spaceFire,
      directionBullets,
      activeBullets,
      gameBoard
    );
    this.shipWrapper.style.transform = "rotate(180deg)";

    // direction where enemy enter on scene 1 == left || -1 == right
    this.direction = direction;
    this.speed = 0.5;

    // before moving enemy let them make enter bedore.
    this.beginMove = false;

    this.directionX = Math.random() < 0.5 ? 1 : -1;
    this.directionY = Math.random() < 0.5 ? 1 : -1;

    this.updatePosition = this.updatePosition.bind(this);
  }

  // Enter on scene
  appearationMove(enemies) {
    if (!this.beginMove) {
      if (this.direction == 1) {
        this.position.x += this.speed;
        if (this.position.x > this.position.z) {
          this.position.x = this.position.z;
          this.beginMove = true;
        }
      } else if (this.direction == -1) {
        this.position.x -= this.speed;
        if (this.position.x < this.position.z) {
          this.position.x = this.position.z;
          this.beginMove = true;
        }
      }
    } else {
      setTimeout(() => {
        this.move(300, 20, 0.1, enemies);
      }, 2000);
    }

    this.updatePosition();
  }

  // moving in Rollercoaster way
  move(numPoints, amplitude, frequency, enemies) {
    let offsetX = (100 * this.size) / innerWidth;
    let offsetY = (100 * this.size) / innerHeight;

    const x = (50 / numPoints) * this.directionX; // Spread the points evenly on the x-axis
    const y =
      amplitude * Math.sin((frequency * Math.PI) / numPoints) * this.directionY;

    // Calculate the potential new position
    let newX = this.position.x + x;
    let newY = this.position.y + y;

    // this.adjustInCollision(enemies, newX, newY);
    this.position.x = newX;
    this.position.y = newY;

    if (this.position.x <= 0 || this.position.x >= 100 - offsetX) {
      this.directionX *= -1;
    }

    if (this.position.y <= 40 || this.position.y >= 100 - offsetY) {
      this.directionY *= -1;
    }
  }

  // after some time adjust the position if he is overlapping with an other.
  adjustInCollision = throttle((enemies, newX, newY) => {
    for (let enemy of enemies) {
      if (enemy !== this) {
        let distance = Math.sqrt(
          Math.pow(newX - enemy.position.x, 2) +
            Math.pow(newY - enemy.position.y, 2)
        );
        if (distance < 10) {
          // Adjust this value according to your needs
          // Calculate the adjustment vectors based on the collision
          let adjustX = (newX - enemy.position.x) * 0.1;
          let adjustY = (newY - enemy.position.y) * 0.1;
          console.log(adjustX, adjustY);

          newX += adjustX;
          newY += adjustY;
          break;
        }
      }
    }
  }, 0);
}
