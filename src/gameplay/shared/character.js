import { resources } from "../../engine.js";
import { isElementCollide } from "../../utils/collision.js";
import {
    spriteAnimation,
    spriteAutoAnimation,
} from "../../utils/spriteAnimation.js";
import Bullets from "../entities/bullets.js";
import Weapon from "../entities/weapon.js";

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
        poolingBullets,
        enemies,
        poolingEnemies,
        gameBoard
    ) {
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
        this.isAlive = true;

        this.enemies = enemies;
        this.poolingEnemies = poolingEnemies;

        this.spaceFire = spaceFire;

        this.directionBullets = directionBullets;

        this.shipWrapper = document.createElement("div");
        this.ship = document.createElement("div");
        this.shipExhausts = document.createElement("div");

        this.stageToFire = 0;

        // Exhaust texture
        this.animationState = {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        };
    }

    // Method to load the texture of the character
    loadTexture() {
        Object.assign(this.shipWrapper.style, {
            position: "absolute",
            top: 0,
            left: 0,
            width: `${this.size}px`,
            height: `${this.size}px`,
            transform: `translate(${this.position.x}px, ${this.position.y}px)`,
        });

        let elem = document.createElement("div");
        elem.className = `ship-wrapper-elem ${
            this.CharacterType.includes("Enemy")
                ? "ship-wrapper-enemy"
                : "ship-wrapper-player"
        }`;

        // exhauste
        let exhaustEngine = document.createElement("div");
        exhaustEngine.className = `exhaust exhaust-engine`;
        exhaustEngine.style.backgroundImage = `url(${resources.images.exhaust.engine.src})`;

        this.shipExhausts.className = `exhaust exhaust-ship`;
        this.shipExhausts.style.backgroundImage = `url(${resources.images.exhaust.exhaust.src})`;

        // Create a weapon for the character
        this.weapon = new Weapon(0, elem);

        this.ship.style.backgroundImage = `url(${
            this.texture[this.health].src
        })`;
        this.ship.className = `ship-wrapper-ship`;

        this.bar = document.createElement("div");
        this.healthBar = document.createElement("div");
        this.bar.className = "health-bar";

        this.bar.appendChild(this.healthBar);
        elem.appendChild(this.bar);
        elem.appendChild(this.shipExhausts);
        elem.appendChild(exhaustEngine);

        elem.appendChild(this.ship);

        this.shipWrapper.appendChild(elem);
        this.gameBoard.appendChild(this.shipWrapper);
    }

    // Method to handle damage to the character
    takeDamage() {
        this.health -= this.weapon.demage;
        this.healthBar.style.width = `${this.health}%`;
        this.updateTexture();

        if (this.health <= 50) {
            this.healthBar.style.backgroundColor = "#eab308";
        }

        if (this.health <= 0) {
            if (this.CharacterType === "Enemy") {
                let explosionSoundEffect = resources.audios.explosion;
                explosionSoundEffect.play();
                explosionSoundEffect.volume = 0.1;
                spriteAutoAnimation(this.ship, 64, 9, 100, () => {
                    this.isAlive = false;
                    let index = this.enemies.indexOf(this);

                    this.poolingEnemies[this.enemies[index].ID] =
                        this.enemies[index];

                    this.enemies.splice(index, 1);
                    this.cleanup();
                });
            } else {
                this.isAlive = false;
            }
        }
    }

    restortHealth() {
        this.health = 100;
        this.healthBar.style.backgroundColor = "#22c55e";
        this.healthBar.style.width = `${this.health}%`;
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

    handleBulletHit = () => {
        let isPlayerHitEnemy = false;
        let bulletsOpponents = this.activeBullets.filter(
            (bullet) => !bullet.BulletOwner.includes(this.CharacterType)
        );
        for (let bulletOpponents of bulletsOpponents) {
            let index = this.activeBullets.indexOf(bulletOpponents);
            this.activeBullets[index].isHitTarget = isElementCollide(
                this,
                this.activeBullets[index]
            );
            if (
                this.activeBullets[index].isHitTarget &&
                this.activeBullets[index].BulletOwner === "Player"
            ) {
                isPlayerHitEnemy = true;
            }
            if (this.activeBullets[index].isHitTarget && this.health > 0) {
                this.takeDamage();
                this.poolingBullets[this.activeBullets[index].ID] =
                    this.activeBullets[index];
                // Clean up the bullets after hitting the target.
                this.activeBullets[index].cleanup();
                this.activeBullets.splice(index, 1);
            }
        }
        return isPlayerHitEnemy;
    };

    render = async () => {
        // spriteAnimation(this.shipExhausts, this.animationState)
        this.stageToFire += 10;
        if (this.stageToFire >= this.spaceFire) {
            this.stageToFire = 0;
            await this.fire();
        }
    };

    // Method to make the character fire bullets
    fire = async () => {
        // initial coordinates of bullet.
        let x = this.position.x + (this.size - 32) / 2;
        let y = this.CharacterType.includes("Enemy")
            ? this.position.y + this.size
            : this.position.y;

        // the number of bullet per fire depends on the type of weapon
        await Promise.all(
            this.weapon.adjustPosition.map(async (adjustPosition, i) => {
                x += adjustPosition;

                let polling = Object.entries(this.poolingBullets);
                if (polling.length > 0) {
                    let [id, bullet] = polling.at(0);
                    delete this.poolingBullets[id];

                    bullet.bullets.style.opacity = 1;
                    bullet.BulletOwner = this.CharacterType;
                    bullet.position = { x, y };
                    bullet.direction = this.directionBullets;
                    bullet.isHitTarget = false;
                    bullet.elem.style.backgroundImage = `url(${this.weapon.projectile})`;

                    this.activeBullets.push(bullet);
                } else {
                    let bullet = new Bullets(
                        this.CharacterType,
                        x,
                        y,
                        this.directionBullets,
                        this.weapon.projectile,
                        this.weapon.animationStateProjectile,
                        this.gameBoard
                    );
                    bullet.ID += i;
                    this.activeBullets.push(bullet);
                }
            })
        );

        // if (this.CharacterType == "Enemy") console.log(this.activeBullets.filter(b => b.BulletOwner == "Enemy"));
    };

    // Method to perform cleanup when the character is no longer active
    cleanup() {
        // if (this.gameBoard.contains(this.shipWrapper)) this.gameBoard.removeChild(this.shipWrapper);
        this.shipWrapper.style.opacity = 0;
    }
}
