// Import necessary modules and classes
import { spriteAnimation } from "../../utils/spriteAnimation.js";
import { resources } from "../../engine.js";

// Class definition for Bullets
class Bullets {
  constructor(BulletOwner, x, y, direction, projectile, projectileSprite,  gameBoard) {
    // Initialize properties for bullets
    this.BulletOwner = BulletOwner;
    this.ID = `bullet_${Date.now()}`;
    this.gameBoard = gameBoard;
    this.direction = direction;
    this.isHitTarget = false;
    this.position = {
      x,
      y,
    };

    this.size = 32

    this.projectile = projectile
    this.animationState = projectileSprite

    // Initialize bullets with the specified projectile
    this.loadProjectile(this.position)

    // song who goes with the fire
    resources.audios.fire.volume = 0.1;
    resources.audios.fire.play();
  }

  // Method to load a new gun for the bullets
  loadGun() {
    // Remove existing bullets and create new bullets with the new gun
    this.gameBoard.removeChild(this.bullets);
    this.loadProjectile(this.position);
  }

  // Method to create bullets with a specific projectile
  loadProjectile = (position) => {
  
    // Create a new div element for the bullets
    // Set bullets as a property of the Bullets class
    this.bullets = document.createElement("div");
    this.bullets.className = `bullet`
    this.updatePosition()

    this.elem = document.createElement("div");
    this.elem.style.backgroundImage = `url(${this.projectile})`
    this.elem.className = `${this.BulletOwner.includes("Enemy") && "bullet-enemy"}`
    
    this.bullets.appendChild(this.elem)
    this.gameBoard.appendChild(this.bullets);
  }

  // Method to animate and update the position of bullets
  fire(activeBullets, poolingBullets, index) {
    // Animate bullets using spriteAnimation
    // spriteAnimation(this.bullets, this.animationState);

    // Check if bullets are out of the game board
    const isOutOfBoard = this.position.y > window.innerHeight || (this.position.y < 0);

    // If bullets are out of the board, clean up and remove them from the array
    if (isOutOfBoard) {
      this.cleanup()
      poolingBullets[activeBullets[index].ID] = activeBullets[index]
      activeBullets.splice(index, 1);
    }

    // Update the vertical position of bullets
    this.position.y += 8 * this.direction;
    this.updatePosition()
  }

  updatePosition() {
    this.bullets.style.transform = `translate(${this.position.x}px,${this.position.y}px)`;
  }

  // Method to clean up bullets
  cleanup() {
    // Remove bullets from the game board if they exist
    // if (this.gameBoard.contains(this.bullets)) this.gameBoard.removeChild(this.bullets)
    this.bullets.style.opacity = 0
  }
}

// Export the Bullets class
export default Bullets;
