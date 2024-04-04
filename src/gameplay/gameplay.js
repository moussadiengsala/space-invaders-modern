import { Enemies } from "./entities/enemies.js";
import { Player } from "./entities/player.js";
import { generatePositionIn } from "../utils/generatePonsitionIn.js";
import { random } from "../utils/radom.js";
import { resources } from "../engine.js";
import { throttle } from "../utils/throttle.js";
import Bullets from "./entities/bullets.js";

const DIRECTIONS = {
    UP: -1,
    DOWN: 1,
};

export class GamePlay {
    constructor() {
        this.maxLevel = 4;
        this.level = 1;
        this.score = 0;
        this.position = {
            x: resources.gameBoard.clientWidth / 2 - 50,
            y: resources.gameBoard.clientHeight - 200,
        };

        this.numberOfEnemies = 1;

        this.isRunning = true;
        this.countdownTime = 1;
    }

    async load() {
        await this.cleanup();

        resources.player.position = this.position;
        resources.player.updatePosition();
        resources.player.shipWrapper.style.opacity = 1;
        resources.player.moveHandler();

        this.loadEnemies();
    }

    cleanup = async () => {
        resources.player?.cleanup();

        Promise.all(
            resources.enemies.map(async (enemy) => {
                resources.poolingEnemies[enemy.ID] = enemy;
                enemy.cleanup();
            })
        );
        resources.enemies = [];

        Promise.all(
            resources.activeBullets.map(async (bullet) => {
                resources.poolingBullets[bullet.ID] = bullet;
                bullet.cleanup();
            })
        );
        resources.activeBullets = [];

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
                    resources.gameBoard,
                    this.numberOfEnemies,
                    i
                );

                let poolingEnemies = Object.entries(resources.poolingEnemies);
                this.reusePooledEnemy(poolingEnemies, position);
            })
        );
    }

    render = async () => {
        // this.update();
        resources.player.handleBulletHit();
        resources.player.handleScore(this.score);
        resources.player.render();

        Promise.all(
            resources.enemies.map(async (enemy) => {
                enemy.move(20, 20, 0.1);

                if (enemy.handleBulletHit()) {
                    this.setUpNewLevel();
                    this.score += 100;
                    document.querySelector(".score").textContent = this.score;
                }

                await enemy.render();
            })
        );

        Promise.all(
            resources.activeBullets.map((bullet, i) => {
                bullet.fire(
                    resources.activeBullets,
                    resources.poolingBullets,
                    i
                );
            })
        );
    };

    async setUpNewLevel() {
        if (resources.enemies.length === 0) {
            if (this.level == this.maxLevel) {
                resources.player.isAlive = false;
                return;
            }
            this.level += 1;
            document.querySelector(".level").textContent = this.level;

            resources.player.restortHealth();
            resources.player.actualHealth = 100;

            this.numberOfEnemies += 1;
            await this.loadEnemies();
        }
    }

    reusePooledEnemy = (poolingEnemies, position) => {
        const [id, enemy] = poolingEnemies[0];
        delete resources.poolingEnemies[id];

        enemy.shipWrapper.style.opacity = 1;
        enemy.restortHealth();
        enemy.isAlive = true;
        enemy.beginMove = false;
        enemy.activeBullets = resources.activeBullets;
        enemy.poolingBullets = resources.poolingBullets;
        enemy.enemies = resources.enemies;
        enemy.poolingEnemies = resources.poolingEnemies;
        enemy.ship.style.backgroundPosition = "0px 0px";
        enemy.position = position;

        resources.enemies.push(enemy);
    };

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
