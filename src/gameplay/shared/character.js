import { resources } from "../../engine.js";
import { isElementCollide } from "../../utils/collision.js";
import {
    spriteAnimation,
    spriteAutoAnimation,
} from "../../utils/spriteAnimation.js";
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
        gameBoard,
        r
    ) {
        this.r = r;
        this.CharacterType = CharacterType;
        this.ID = `${this.CharacterType}_${Date.now()}`;
        this.health = health;
        this.strength = strength;
        this.size = size;
        this.position = position;
        this.texture = texture;
        this.gameBoard = gameBoard;
        this.isAlive = true;

        this.spaceFire = spaceFire;

        this.directionBullets = directionBullets;

        this.shipWrapper = document.createElement("div");
        this.shipWrapper.className = "ship-wrapper";
        this.ship = document.createElement("div");
        this.shipExhausts = document.createElement("div");

        this.stageToFire = 0;
    }

    loadTexture() {
        let elem = document.createElement("div");
        elem.className = `ship-wrapper-elem ${
            this.CharacterType.includes("Enemy")
                ? "ship-wrapper-enemy"
                : "ship-wrapper-player"
        }`;

        let exhaustEngine = document.createElement("div");
        exhaustEngine.className = `exhaust exhaust-engine`;
        exhaustEngine.style.backgroundImage = `url(${this.r.images.exhaust.engine.src})`;

        this.shipExhausts.className = `exhaust exhaust-ship`;
        this.shipExhausts.style.backgroundImage = `url(${this.r.images.exhaust.exhaust.src})`;

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

    updatePosition() {
        Object.assign(this.shipWrapper.style, {
            transform: `translate(${this.position.x}px, ${this.position.y}px)`,
        });
    }

    takeDamage() {
        this.health -= this.weapon.demage;
        this.healthBar.style.width = `${this.health}%`;
        this.updateTexture();

        if (this.health <= 50) {
            this.healthBar.style.backgroundColor = "#eab308";
        }

        if (this.health <= 0) {
            if (this.CharacterType === "Enemy") {
                let explosionSoundEffect = this.r.audios.explosion;
                explosionSoundEffect.play();
                explosionSoundEffect.volume = 0.1;
                spriteAutoAnimation(this.ship, 64, 9, 100, () => {
                    this.isAlive = false;
                    let index = resources.enemies.indexOf(this);

                    resources.poolingEnemies[resources.enemies[index].ID] =
                        resources.enemies[index];

                    resources.enemies.splice(index, 1);
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

    updateTexture() {
        let newTexture;
        for (const damageThreshold in this.texture) {
            if (this.health <= damageThreshold) {
                newTexture = this.texture[damageThreshold].src;
                break;
            }
        }

        this.ship.style.backgroundImage = `url(${newTexture})`;
    }

    handleBulletHit = () => {
        let isPlayerHitEnemy = false;
        let bulletsOpponents = resources.activeBullets.filter(
            (bullet) => !bullet.BulletOwner.includes(this.CharacterType)
        );
        for (let bulletOpponents of bulletsOpponents) {
            let index = resources.activeBullets.indexOf(bulletOpponents);
            resources.activeBullets[index].isHitTarget = isElementCollide(
                this,
                resources.activeBullets[index]
            );
            if (
                resources.activeBullets[index].isHitTarget &&
                resources.activeBullets[index].BulletOwner === "Player"
            ) {
                isPlayerHitEnemy = true;
            }
            if (resources.activeBullets[index].isHitTarget && this.health > 0) {
                this.takeDamage();
                resources.poolingBullets[resources.activeBullets[index].ID] =
                    resources.activeBullets[index];

                resources.activeBullets[index].cleanup();
                resources.activeBullets.splice(index, 1);
            }
        }
        return isPlayerHitEnemy;
    };

    render = async () => {
        this.stageToFire += 10;
        if (this.stageToFire >= this.spaceFire) {
            this.stageToFire = 0;
            await this.fire();
        }
    };

    fire = async () => {
        let x = this.position.x + (this.size - 32) / 2;
        let y = this.CharacterType.includes("Enemy")
            ? this.position.y + this.size
            : this.position.y;

        await Promise.all(
            this.weapon.adjustPosition.map(async (adjustPosition, i) => {
                x += adjustPosition;

                let polling = Object.entries(resources.poolingBullets);
                console.log(polling);

                let [id, bullet] = polling.at(0);
                delete resources.poolingBullets[id];

                bullet.bullets.style.opacity = 1;
                bullet.BulletOwner = this.CharacterType;
                bullet.position = { x, y };
                bullet.direction = this.directionBullets;
                bullet.isHitTarget = false;
                bullet.elem.style.backgroundImage = `url(${this.weapon.projectile})`;

                resources.activeBullets.push(bullet);
            })
        );
    };

    cleanup() {
        this.shipWrapper.style.opacity = 0;
    }
}
