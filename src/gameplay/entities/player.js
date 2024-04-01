import { resources } from "../../engine.js";
import { Character } from "../shared/character.js";

export class Player extends Character {
    constructor(
        ID,
        size,
        health,
        strength,
        position,
        spaceFire,
        directionBullets,
        activeBullets,
        poolingBullets,
        enemies,
        poolingEnemies,
        gameBoard
    ) {
        // the texture is now an object where keys represent diffrent state of health and values represent texture on that state of health
        const texture = resources.images.player;

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
            poolingBullets,
            enemies,
            poolingEnemies,
            gameBoard
        );

        this.movebyKeyBoard = this.movebyKeyBoard.bind(this);
        this.speed = 10;

        this.actualGunTypes = 0;
        this.scoreHandled = false;
        this.actualHealth = this.health;
    }

    handleKeyDown(distance, direction) {
        let offsetX = this.gameBoard.clientWidth - this.size;
        let offsetY = innerHeight - this.size;

        let updatePosition = (coord) => {
            let value = coord;
            if (direction === "right" && value + distance < offsetX) {
                value += distance;
            } else if (direction === "left" && value - distance > 0) {
                value -= distance;
            } else if (direction === "up" && value - distance > 0) {
                value -= distance;
            } else if (direction === "down" && value + distance < offsetY) {
                value += distance;
            }
            return value;
        };

        if (["right", "left"].includes(direction)) {
            this.position.x = updatePosition(this.position.x);
        } else if (["up", "down"].includes(direction)) {
            this.position.y = updatePosition(this.position.y);
        }

        // update position
        this.shipWrapper.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }

    movebyKeyBoard(event) {
        if (event.key === "ArrowLeft") this.handleKeyDown(this.speed, "left");
        else if (event.key === "ArrowRight")
            this.handleKeyDown(this.speed, "right");
        else if (event.key === "ArrowUp") this.handleKeyDown(this.speed, "up");
        else if (event.key === "ArrowDown")
            this.handleKeyDown(this.speed, "down");
    }

    moveHandler() {
        window.addEventListener("keydown", this.movebyKeyBoard);
    }

    removeMoveHandler() {
        window.removeEventListener("keydown", this.movebyKeyBoard);
    }

    // changing the gun of player depend on his score.
    handleScore = (score) => {
        if (score !== 0 && score % 2000 === 0) {
            if (!this.scoreHandled) {
                this.scoreHandled = true;

                if (this.actualGunTypes == this.weapon.gunTypes.length - 1)
                    return;
                this.actualGunTypes =
                    (this.actualGunTypes + 1) % this.weapon.gunTypes.length;
                this.weapon.changedGun(this.actualGunTypes);
            }
        } else {
            this.scoreHandled = false;
        }

        if (this.actualHealth > this.health) {
            this.actualHealth = this.health;

            this.actualGunTypes =
                this.actualGunTypes == 0 ? 0 : this.actualGunTypes - 1;
            this.actualGunTypes =
                this.actualGunTypes % this.weapon.gunTypes.length;
            this.weapon.changedGun(this.actualGunTypes);
        }
    };
}
