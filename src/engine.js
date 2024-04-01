import { skyAnimation } from "./ui/skyAnimation.js";
import { ResourceManager } from "./ui/resourceManager.js";
import { navigation } from "./index.js";
import { GamePlay } from "./gameplay/gameplay.js";
import { history } from "./utils/history.js";

export const resources = new ResourceManager();

export class Menu {
    constructor() {
        this.isGameStarted = false;
        this.isPaused = false;

        this.game = new GamePlay();

        this.FPS = 60; // Desired frames per second
        this.UPDATE_RATE = 1000 / this.FPS; // Time in milliseconds for each frame
        this.lastUpdateTime = Date.now();
        this.gameLoop = this.gameLoop.bind(this);
        this.map = document.getElementById("game-board");

        this.menuElement = document.getElementById("main-menu");
        this.p = document.getElementById("pause-game");
        this.g = document.getElementById("game-over");
        this.history = document.getElementById("history");
        this.stageHistory = null;

        window.addEventListener("keydown", this.handleKeyDown);
        this.handlePlanet();
        this.backgroundMusic();
    }

    handlePlanet() {
        this.planets = this.menuElement.querySelectorAll(".main-menu-planet");
        const handleClick = (event) => {
            const planet = event.target;
            const map = planet.getAttribute("data-map");

            this.game.gameBoard.style.backgroundImage = `url(${resources.images.map[map].src})`;
            this.menuElement.classList.add("main-menu-hidden");

            document.getElementById("header").style.display = "block";

            this.isGameStarted = true;
            this.game.load();
            this.gameLoop();
            this.handleHistory("intorduction");
        };

        this.planets.forEach((planet) => {
            planet.addEventListener("click", handleClick);
        });
    }

    handleKeyDown = (e) => {
        if (e.key.toLowerCase() == "p" && this.isGameStarted) {
            this.isPaused = !this.isPaused;
            this.game.isRunning = !this.game.isRunning;
            if (this.isPaused) {
                this.p.style.display = "block";
                this.handleMenu();
                this.game.player.removeMoveHandler();
            } else {
                this.game.player.moveHandler();
                this.p.style.display = "none";
            }
        }
    };

    async Start() {
        if (
            this.game.level === this.game.maxLevel / 2 &&
            this.stageHistory != "development"
        ) {
            this.game.player.isAlive = false;
            this.stageHistory = "development";
            this.handleHistory(this.stageHistory);
        }

        if (
            this.game.level === this.game.maxLevel &&
            this.stageHistory != "conclusion"
        ) {
            this.stageHistory = "conclusion";
            this.handleHistory(this.stageHistory);
        }

        if (this.isGameStarted && !this.isPaused) {
            if (!this.game.player.isAlive) {
                this.isPaused = true;
                this.GameOver();
                this.handleMenu();
            }
            this.game.render();
        }
    }

    handleHistory(step) {
        this.isPaused = true;
        const content = history[step];
        this.history.querySelector(".history-content").textContent = content;
        this.history.style.display = "flex";
        if (this.game.player) this.game.player.removeMoveHandler();

        this.history.querySelector("button").addEventListener("click", () => {
            this.history.style.display = "none";
            if (this.stageHistory == "conclusion") {
                this.GameOver();
                this.handleMenu();
            } else {
                this.isPaused = false;
                this.game.player.moveHandler();
            }
        });
    }

    GameOver() {
        let backgroundMusic = resources.audios.gameOver;
        window.removeEventListener("keydown", this.handleKeyDown);

        backgroundMusic.autoplay = true;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();

        this.game.player.removeMoveHandler();
        this.g.style.display = "block";

        const s = document.getElementById("submit-score");
        s.addEventListener("submit", async (e) => {
            e.preventDefault();
            let formData = new FormData(e.target);
            formData.append("score", this.game.score);

            let response = await fetch("http://localhost:8080/post-score", {
                method: "POST",
                body: formData, 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            let data = await response.json();
        });
    }

    backgroundMusic() {
        let backgroundMusic = resources.audios.backgroundSound;
        backgroundMusic.loop = true;
        backgroundMusic.autoplay = true;
        backgroundMusic.volume = 0.1;
        // backgroundMusic.play();
    }

    handleMenu() {
        let buttons = Array.from(
            document.querySelectorAll(".game-menu-button")
        );
        buttons.forEach((button) => {
            let action = button.dataset?.action;
            button.addEventListener("click", () => {
                switch (action) {
                    case "restart":
                        this.isPaused = false;
                        this.p.style.display = "none";
                        this.g.style.display = "none";
                        window.addEventListener("keydown", this.handleKeyDown);
                        this.game.player.moveHandler();
                        this.game.load();
                        break;
                    case "continue":
                        this.isPaused = !this.isPaused;
                        this.game.isRunning = !this.game.isRunning;
                        if (this.isPaused) {
                            this.game.player.removeMoveHandler();
                        } else {
                            this.game.player.moveHandler();
                            this.p.style.display = "none";
                            this.g.style.display = "none";
                        }
                        break;
                    case "quit":
                        location.reload();
                        break;
                }
            });
        });
    }

    gameLoop() {
        const now = Date.now();
        const elapsed = now - this.lastUpdateTime;
        if (!this.isPaused && elapsed > this.UPDATE_RATE) {
            this.render();
            this.lastUpdateTime = now - (elapsed % this.UPDATE_RATE);
        }
        window.requestAnimationFrame(this.gameLoop);
    }

    render() {
        // skyAnimation(this.map);
        if (this.game.player) this.Start();
    }
}

async function initializeResources() {
    try {
        // load all resources needed for the game.
        await resources.resourceLoader();
        navigation(resources);
        document.getElementById("main-menu").style.display = "block";
        document.querySelector(".loading-message").style.display = "none";

        // Start the game loop once resources are loaded
        new Menu();
    } catch (e) {
        console.log(e);
    }
}

initializeResources();
