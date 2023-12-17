
import { resources } from "../../engine.js";
import { isElementCollide } from "../../utils/collision.js";
import { spriteAnimation, spriteAutoAnimation } from "../../utils/spriteAnimation.js";
import { throttle } from "../../utils/throttle.js";
import Bullets from "../entities/bullets.js";
import Weapon from "../entities/weapon.js";

// Define the Character class
export class Character {

  // Constructor for creating instances of Character
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
    poolingBullets,
    enemies,
    poolingEnemies,
    score,
    gameBoard
  ) {
    // Initialize properties of the character
    this.CharacterType = CharacterType;
    this.ID = `${this.CharacterType}_${Date.now()}`;
    this.health = health;
    this.strength = strength;
    this.size = size;
    this.position = position;
    this.texture = texture;
    this.gameBoard = gameBoard;
    this.activeBullets = activeBullets;
    this.poolingBullets = poolingBullets;
    this.isAlive = true
    this.score = score;

    // enemies
    this.enemies = enemies
    this.poolingEnemies = poolingEnemies

    // Set the rhythm at which enemies shoot
    this.spaceFire = spaceFire;

    // Set the direction of bullets (up for player, down for enemy)
    this.directionBullets = directionBullets;

    // Call the 'fire' function after a delay determined by 'spaceFire'
    this.fire = throttle(this.fire.bind(this), this.spaceFire);

    // Set exhaust type and create ship elements
    this.shipWrapper = document.createElement("div");
    this.ship = document.createElement("div");
    this.shipExhausts = document.createElement("div")

    resources.audios.fire.volume = 0.1;
    
    // Exhaust texture
    this.animationState =  {
      currentFrame: 0,
      frameCount: 4,
      currentRow: 0,
      row: 1,
    }
  }

  // Method to load the texture of the character
  loadTexture() {
    // this.shipWrapper.className = `ship-wrapper absolute w-[${this.size}px] h-[${this.size}px]`
    Object.assign(this.shipWrapper.style, {
      position: "absolute",
      width: `${this.size}px`,
      height: `${this.size}px`,
      transform: `translate(${this.position.x}px, ${this.position.y}px)`
    });

    let elem = document.createElement("div")
    elem.className = `ship-wrapper-elem ${this.CharacterType.includes("Enemy") ? "ship-wrapper-enemy":"ship-wrapper-player"}`
    
    // exhauste
    let exhaustEngine = document.createElement("div");
    exhaustEngine.className = `exhaust exhaust-engine`
    exhaustEngine.style.backgroundImage = `url(${resources.images.exhaust.engine.src})`


    this.shipExhausts.className = `exhaust exhaust-ship`;
    this.shipExhausts.style.backgroundImage = `url(${resources.images.exhaust.exhaust.src})`

    // Create a weapon for the character
    this.weapon = new Weapon(0, elem)

    this.ship.style.backgroundImage = `url(${this.texture[this.health].src})`
    this.ship.className = `ship-wrapper-ship`

    this.bar = document.createElement("div")
    this.healthBar = document.createElement("div");
    this.bar.className = 'health-bar';

    this.bar.appendChild(this.healthBar);
    elem.appendChild(this.bar);
    elem.appendChild(this.shipExhausts);
    elem.appendChild(exhaustEngine);

    elem.appendChild(this.ship);

    this.shipWrapper.appendChild(elem)
    this.gameBoard.appendChild(this.shipWrapper);
  }

  // Method to handle damage to the character
  takeDamage() {
    this.health -= this.weapon.demage;
    this.healthBar.style.width = `${this.health}%`
    this.updateTexture();

    if (this.health <= 50) {
      this.healthBar.style.backgroundColor = "#eab308"
    }

    if (this.health <= 0) {
      if (this.CharacterType === "Enemy") {
        let explosionSoundEffect = resources.audios.explosion
        explosionSoundEffect.play();
        explosionSoundEffect.volume = 0.1;
        spriteAutoAnimation(this.ship, 64, 9, 100, () => {
          this.isAlive = false
          let index = this.enemies.indexOf(this)

          this.poolingEnemies[this.enemies[index].ID] = this.enemies[index]
       
          this.enemies.splice(index, 1)
          this.cleanup()
        })
      } else {
        this.isAlive = false
      }
    }
  }

  restortHealth() {
    this.health = 100
    this.healthBar.style.backgroundColor = "#22c55e"
    this.healthBar.style.width = `${this.health}%`
    this.updateTexture();
  }

  // Method to update the character's texture based on health
  updateTexture() {
    let newTexture;
    for (const damageThreshold in this.texture) {
      if (this.health <= damageThreshold) { 
        newTexture = this.texture[damageThreshold].src;
        break; // Stop once the first matching threshold is found
      }
    }

    this.ship.style.backgroundImage = `url(${newTexture})`;
  }

  handleBulletHit = throttle( async () => {
    let bulletsOpponents = this.activeBullets.filter(bullet => !bullet.BulletOwner.includes(this.CharacterType))
   
    Promise.all(bulletsOpponents.map(async (bulletOpponents) => {
      let index = this.activeBullets.indexOf(bulletOpponents)
      this.activeBullets[index].isHitTarget = isElementCollide(this, this.activeBullets[index])

      if (this.activeBullets[index].isHitTarget && this.activeBullets[index].BulletOwner === 'Player') {
        this.score.score += 100
        document.querySelector(".score").textContent = this.score.score;
      }

      if(this.activeBullets[index].isHitTarget && this.health > 0) {
        this.takeDamage()
        this.poolingBullets[this.activeBullets[index].ID] = this.activeBullets[index]
        // Clean up the bullets after hitting the target.
        this.activeBullets[index].cleanup();
        this.activeBullets.splice(index, 1);
      }
    }))
 
  }, 100)


  // Method to render the characterthis.shipWrapper.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  render = async () => {
    // spriteAnimation(this.shipExhausts, this.animationState)
    this.fire();
  };

  // Method to make the character fire bullets
  fire = async () => {
    // initial coordinates of bullet.
    let x = this.position.x + (this.size - 32) / 2;
    let y = this.CharacterType.includes("Enemy") ? this.position.y + this.size : this.position.y

    // the number of bullet per fire depends on the type of weapon
    await Promise.all(this.weapon.adjustPosition.map(async (adjustPosition, i) => {
      x += adjustPosition;

      let [id, bullet] = []
      for (let bulletID in this.poolingBullets) {
        [id, bullet] = [bulletID, this.poolingBullets[bulletID]];
        break
      }

      // let polling = Object.entries(this.poolingBullets)
      if (id) {
        delete this.poolingBullets[id]

        bullet.bullets.style.opacity = 1
        bullet.BulletOwner = this.CharacterType
        bullet.position = {x, y}
        bullet.direction = this.directionBullets;
        bullet.isHitTarget = false;
        bullet.elem.style.backgroundImage = `url(${this.weapon.projectile})`
        
        this.activeBullets.push(bullet)
      } else {
        let bullet = new Bullets(this.CharacterType, x, y, this.directionBullets, this.weapon.projectile, this.weapon.animationStateProjectile, this.gameBoard);
        bullet.ID += i
        this.activeBullets.push(bullet);
      }
    }));

    resources.audios.fire.play();
  }


  // Method to perform cleanup when the character is no longer active
  cleanup() {
    this.shipWrapper.style.opacity = 0;
  }
}
