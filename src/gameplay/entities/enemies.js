// Import necessary modules and classes
import { resources } from "../../engine.js";
import { random } from "../../utils/radom.js";
import { Character } from "../shared/character.js";

// Class definition for Enemies, extending Character class
export class Enemies extends Character {
    constructor(
        ID,
        size,
        health,
        strength,
        position,
        spaceFire,
        directionBullets,
        gameBoard,
        r
    ) {
        // text of enemies
        const texture = resources.images.enemie[`${random(1, 2)}`];

        // Call the constructor of the parent class (Character)
        super(
            ID,
            size,
            health,
            strength,
            position,
            texture,
            spaceFire,
            directionBullets,
            gameBoard,
            r
        );

        // Set direction and speed for enemy movement
        this.speed = 4;

        // Set a flag to track whether the enemy has started moving
        this.beginMove = false;

        // Set initial random movement directions
        this.directionX = Math.random() < 0.5 ? 1 : -1;
        this.directionY = Math.random() < 0.5 ? 1 : -1;

        this.numPoints = 20;
        this.amplitude = 20;
        this.frequency = 0.1;

        this.offsetX = this.gameBoard.clientWidth - this.size;
        this.offsetY = innerHeight - 4 * this.size;

        this.spaceMove = 1000;
        this.stageToMove = 0;
    }

    move = () => {
        this.stageToMove += 500;
        if (this.stageToMove < this.spaceMove) return;
        this.stageToMove = 0;
        const x = (50 / this.numPoints) * this.directionX;
        const y =
            this.amplitude *
            Math.sin((this.frequency * Math.PI) / this.numPoints) *
            this.directionY;

        let newX = this.position.x + x;
        let newY = this.position.y + y;

        if (newX <= 0 || newX >= this.offsetX) {
            this.directionX *= -1;
        }

        if (newY <= 0 || newY >= this.offsetY) {
            this.directionY *= -1;
        }

        this.position.x = newX;
        this.position.y = newY;
        this.shipWrapper.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    };
}
