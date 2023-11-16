import { isElementCollide } from "../../utils/collision.js";
import {  exhausts } from "../../utils/exhausts.js";
import { spriteAnimation, spriteAutoAnimation } from "../../utils/spriteAnimation.js";
import { throttle } from "../../utils/throttle.js";
import Bullets from "../entities/bullets.js";

export class Character {
  constructor(
    CharacterType,
    size,
    health,
    strength,
    position,
    texture,
    spaceFire,
    directionBullets,
    activeBullets,
    gameBoard
  ) {
    this.CharacterType = CharacterType;
    this.health = health;
    this.strength = strength;
    this.size = size;
    this.position = position;
    this.texture = texture;
    this.gameBoard = gameBoard;
    this.activeBullets = activeBullets;
    this.isAlive = true

    // the rythme that enemy shoot.
    this.spaceFire = spaceFire;

    // for the player the direction his bullet is up (1) , for enemy it is down (-1)
    this.directionBullets = directionBullets;

    // call the function fire after the delay of this.spaceFire
    this.fire = throttle(this.fire.bind(this), this.spaceFire);

    this.exhaustPosition = 10
    this.shipWrapper = document.createElement("div");
    this.ship = document.createElement("div");
    // this.image = new Image(this.size, this.size);
    
    this.shipExhausts = exhausts(this.exhaustPosition).elem
    // this.loadTexture();

    const {currentFrame, frameCount, currentRow, row} = exhausts(this.exhaustPosition).animationState
    this.animationState = {currentFrame, frameCount, currentRow, row}
  }

  loadTexture() {

    this.ship.style.backgroundImage = `url(${this.texture[this.health]})`
    this.ship.className = `absolute w-[64px] h-[64px] bg-no-repeat bg-[lenght:64px_64px] ${this.CharacterType == "Player" && "bg-center"} left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[2] origin-center`

    this.shipWrapper.className = `absolute w-[${this.size}px] h-[${this.size}px] left-[${this.position.x || 0}%] bottom-[${this.position.y || 0}%]`

    this.shipWrapper.appendChild(this.shipExhausts);
    this.shipWrapper.appendChild(exhausts(this.exhaustPosition).engine);

    this.shipWrapper.appendChild(this.ship);
    this.gameBoard.appendChild(this.shipWrapper);
  }

  takeDamage(damage) {
    this.health -= damage;

    this.updateTexture();
    if (this.health <= 0) {
      if (this.CharacterType === "Enemy") {
        spriteAutoAnimation(this.ship, 64, 9, 100, () => {
          this.isAlive = false
          this.cleanup()
        })
      } else {
        this.isAlive = false

      }
    }
  }

  updateTexture() {
    let newTexture; 
    for (const damageThreshold in this.texture) {
      if (this.health <= damageThreshold) {
        newTexture = this.texture[damageThreshold];
        break; // Stop once the first matching threshold is found
      }
    }

    this.ship.style.backgroundImage = `url(${newTexture})`;
  }
  
  render = throttle(() => {

    let bulletsOpponents = this.activeBullets.filter(bullet => !bullet.BulletOwner.includes(this.CharacterType))
    for (let bullet of bulletsOpponents) {
      bullet.isHitTarget = isElementCollide(this.shipWrapper, bullet.bullets)
      if(bullet.isHitTarget && this.health > 0) this.takeDamage(5)
    }

    spriteAnimation(this.shipExhausts, this.animationState)
    this.updatePosition();
    this.fire();
  }, 0);

  fire() {
    let imageWidthPrtg = (100 * this.size) / window.innerWidth;
    let imageHeightPrtg = (100 * this.size) / window.innerHeight;
    let bulletWidthPrtg = (100 * 10) / window.innerWidth;
    let bulletHeightPrtg = (100 * 10) / window.innerHeight;

    let x = this.position.x + (imageWidthPrtg - 3 * bulletWidthPrtg) / 2;
    let y =
      this.CharacterType == "Enemy"
        ? this.position.y
        : this.position.y + (imageHeightPrtg - 2 * bulletHeightPrtg);

    let bullet = new Bullets(`Bullets_${this.CharacterType}`, x, y, this.directionBullets, false, this.gameBoard);
    bullet.loadGun("bigGun")
    this.activeBullets.push(bullet);
    let shootNoise = new Audio(
      "../../../assets/audio/LASRGun_Blaster star wars 2 (ID 1758)_LS.wav"
    );
    shootNoise.play();
    shootNoise.volume = 0.1;
  }

  updatePosition() {
    Object.assign(this.shipWrapper.style, {
      left: `${this.position.x}%`,
      bottom: `${this.position.y}%`,
    });
  }

  cleanup() {
    // Cleanup logic here, remove elements associated with the character
    this.gameBoard.removeChild(this.shipWrapper);

    this.activeBullets.forEach((bullet) => {
      bullet.isHitTarget = true;
    });

    // Additional cleanup as needed
    this.activeBullets = [];
  }
  
}
