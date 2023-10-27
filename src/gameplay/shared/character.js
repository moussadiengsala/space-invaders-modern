import { throttle } from "../../utils/throttle.js";
import Bullets from "../entities/bullets.js";

export class Character {
  constructor(ID, size, health, strength, position, texture, spaceFire, directionBullets, gameBoard) {
    this.ID = ID;
    this.health = health;
    this.strength = strength;
    this.size = size;
    this.position = position;
    this.texture = texture;
    this.gameBoard = gameBoard;
    this.activeBullets = [];

    // the rythm that enemy shoot.
    this.spaceFire = spaceFire

    // for the player the direction his bullet is up (1) , for enemy it is down (-1)
    this.directionBullets = directionBullets

    // call the function fire after the delay of this.spaceFire
    this.fire = throttle(this.fire.bind(this), this.spaceFire)

    this.image = new Image(this.size, this.size);
    this.loadTexture();
  }
  loadTexture() {
    this.image.src = this.texture;
    this.image.onload = () => {
      Object.assign(this.image.style, {
        position: "absolute",
        left: `${this.position.x || 0}%`,
        bottom: `${this.position.y || 0}%`,
      });
      this.gameBoard.appendChild(this.image);
    };
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(
      `${this.name} takes ${damage} damage. Current health: ${this.health}`
    );
    if (this.health <= 0) {
      console.log(`${this.name} has been defeated.`);
    }
  }

  render = throttle(() => {
    for (let i = 0; i < this?.activeBullets?.length; i++) {
      let bullet = this.activeBullets[i];
      bullet.fire(this.activeBullets, i);
    }
    this.updatePosition();
    this.fire();
  }, 0);

  fire(){
    let imageWidthPrtg = (100 * this.size) / window.innerWidth;
    let imageHeightPrtg = (100 * this.size) / window.innerHeight;
    let bulletWidthPrtg = (100 * 10) / window.innerWidth;
    let bulletHeightPrtg = (100 * 10) / window.innerHeight;

    let x = this.position.x + (imageWidthPrtg - 3 * bulletWidthPrtg) / 2;
    let y = (this.ID == "Enemy") ? this.position.y : this.position.y + (imageHeightPrtg - 2 * bulletHeightPrtg);

    let bullet = new Bullets(x, y, this.directionBullets, this.gameBoard);
    this.activeBullets.push(bullet);
    let shootNoise = new Audio(
      "../../../assets/audio/LASRGun_Blaster star wars 2 (ID 1758)_LS.wav"
    );
    shootNoise.play();
    shootNoise.volume = 0.1
  }

  updatePosition() {
    // console.log(isElementCollide(this.image, document.querySelector(".btn")));

    this.image.style.left = `${this.position.x}%`;
    this.image.style.bottom = `${this.position.y}%`;
  }
}
