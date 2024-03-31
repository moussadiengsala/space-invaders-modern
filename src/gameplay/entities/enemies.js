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
        activeBullets,
        poolingBullets,
        enemies,
        poolingEnemies,
        gameBoard
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
            activeBullets,
            poolingBullets,
            enemies,
            poolingEnemies,
            gameBoard
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

        // Pre-calculate offset values
        this.offsetX = this.gameBoard.clientWidth - this.size;
        this.offsetY = innerHeight - 4 * this.size;
    }

    // Method for rollercoaster-like movement of enemies
    move = () => {
        // Calculate movement in x and y directions based on sine function
        const x = (50 / this.numPoints) * this.directionX; // Spread the points evenly on the x-axis
        const y =
            this.amplitude *
            Math.sin((this.frequency * Math.PI) / this.numPoints) *
            this.directionY;

        // Calculate the potential new position
        let newX = this.position.x + x;
        let newY = this.position.y + y;

        // Check and adjust if the new position goes beyond the board boundaries
        if (newX <= 0 || newX >= this.offsetX) {
            this.directionX *= -1;
        }

        if (newY <= 0 || newY >= this.offsetY) {
            this.directionY *= -1;
        }

        // Update the position of the enemy
        this.position.x = newX;
        this.position.y = newY;
        this.shipWrapper.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

        // Request next animation frame
        // requestAnimationFrame(this.move);
    };
}
