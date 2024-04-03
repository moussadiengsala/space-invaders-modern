import { Enemies } from "./entities/enemies.js";
import { Player } from "./entities/player.js";
import { generatePositionIn } from "../utils/generatePonsitionIn.js";
import { random } from "../utils/radom.js";
import { resources } from "../engine.js";
import { throttle } from "../utils/throttle.js";

const DIRECTIONS = {
    UP: -1,
    DOWN: 1,
};

export class GamePlay {
    constructor() {
        this.maxLevel = 4;
        this.level = 1;
        this.score = 0;
        this.gameBoard = document.querySelector("#game-board");
        this.position = {
            x: this.gameBoard.clientWidth / 2 - 50,
            y: this.gameBoard.clientHeight - 200,
        };

        this.activeBullets = [];
        this.poolingBullets = {};

        this.numberOfEnemies = 1;
        this.enemies = [];
        this.poolingEnemies = {};

        this.isRunning = true;
        this.countdownTime = 1;
    }

    async load() {
        await this.cleanup();

        this.player = new Player(
            "Player",
            100,
            100,
            30,
            this.position,
            500,
            DIRECTIONS.UP,
            this.activeBullets,
            this.poolingBullets,
            this.enemies,
            this.poolingEnemies,
            this.gameBoard
        );
        this.player.loadTexture();
        this.player.moveHandler();

        this.loadEnemies();
    }

    cleanup = async () => {
        this.player?.cleanup();

        Promise.all(
            this.enemies.map(async (enemy) => {
                this.poolingEnemies[enemy.ID] = enemy;
                enemy.cleanup();
            })
        );
        this.enemies = [];

        Promise.all(
            this.activeBullets.map(async (bullet) => {
                this.poolingBullets[bullet.ID] = bullet;
                bullet.cleanup();
            })
        );
        this.activeBullets = [];

        this.score = 0;
        this.level = 1;

        this.countdownTime = 1;
        this.isRunning = true;
        this.numberOfEnemies = 1;

        document.querySelector(".level").textContent = this.level;
        document.querySelector(".score").textContent = this.score;
        document.querySelector(".timer").textContent = "00:00";
    };

    async loadEnemies() {
        const enemies = Array.from(
            { length: this.numberOfEnemies },
            (_, index) => index
        );
        Promise.all(
            enemies.map((i) => {
                const { ...position } = generatePositionIn(
                    this.gameBoard,
                    this.numberOfEnemies,
                    i
                );

                let poolingEnemies = Object.entries(this.poolingEnemies);
                if (poolingEnemies.length > 0) {
                    this.reusePooledEnemy(poolingEnemies, position);
                } else {
                    this.createNewEnemy(position, i);
                }
            })
        );
    }

    // Method to render the game
    render = async () => {
        // this.update();

        // Handle bullet hits for the player
        this.player.handleBulletHit();
        this.player.handleScore(this.score);
        this.player.render();

        // Render each enemy asynchronously
        Promise.all(
            this.enemies.map(async (enemy) => {
                // enemy.appearationMove();
                enemy.move(20, 20, 0.1);

                // Handle bullet hits for enemies and update the score

                if (enemy.handleBulletHit()) {
                    this.score += 100;
                    document.querySelector(".score").textContent = this.score;
                }

                await enemy.render();
            })
        );

        // Iterate through active bullets asynchronously and update their positions
        Promise.all(
            this.activeBullets.map((bullet, i) => {
                bullet.fire(this.activeBullets, this.poolingBullets, i);
            })
        );

        this.setUpNewLevel();
    };

    // If all enemies are defeated, load a new set of enemies
    async setUpNewLevel() {
        if (this.enemies.length === 0) {
            if (this.level == this.maxLevel) {
                this.player.isAlive = false;
                return;
            }
            this.level += 1;
            document.querySelector(".level").textContent = this.level;

            this.player.restortHealth();
            this.player.actualHealth = 100;

            this.numberOfEnemies += 1;
            await this.loadEnemies();
        }
    }

    // Helper function to reuse a pooled enemy
    reusePooledEnemy = (poolingEnemies, position) => {
        const [id, enemy] = poolingEnemies[0];
        delete this.poolingEnemies[id];

        // Reset properties of the reused enemy
        enemy.shipWrapper.style.opacity = 1;
        enemy.restortHealth();
        enemy.isAlive = true;
        enemy.beginMove = false;
        enemy.activeBullets = this.activeBullets;
        enemy.poolingBullets = this.poolingBullets;
        enemy.enemies = this.enemies;
        enemy.poolingEnemies = this.poolingEnemies;
        enemy.ship.style.backgroundPosition = "0px 0px";
        enemy.position = position;

        this.enemies.push(enemy);
    };

    // Helper function to create a new enemy
    createNewEnemy = (position, i) => {
        // Create a new enemy instance
        const enemy = new Enemies(
            "Enemy",
            100,
            100,
            10,
            position,
            random(1000, 2000),
            DIRECTIONS.DOWN,
            this.activeBullets,
            this.poolingBullets,
            this.enemies,
            this.poolingEnemies,
            this.gameBoard
        );
        enemy.ID += i;

        // Load enemy texture and add it to the enemies array
        enemy.loadTexture();
        this.enemies.push(enemy);
    };

    // time
    update = throttle(() => {
        if (!this.isRunning) return;

        this.countdownTime += 1000;
        const formattedTime = this.formatTime(this.countdownTime);

        document.querySelector(".timer").textContent = formattedTime;
    }, 1000);

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }

    pad(value) {
        return value < 10 ? `0${value}` : value;
    }
}

// in web game to enhance the dom manupulation should i load all the necessery element before the game started i mean if my game 10 level each level have their number of enemies correspond to that number of level plus the player character should i load all the 1 + 2 + 3 + ... + 10 enemies + player before the game start
