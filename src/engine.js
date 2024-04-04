import { skyAnimation } from "./ui/skyAnimation.js";
import { ResourceManager } from "./resourceManager.js";
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

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.initialize();
    }

    initialize() {
        window.addEventListener("keydown", this.handleKeyDown);
        this.handlePlanet();
        this.backgroundMusic();
        this.handleSubmit();
        this.handleMenu();
    }

    handlePlanet() {
        this.planets = this.menuElement.querySelectorAll(".main-menu-planet");
        this.planets.forEach((planet) => {
            planet.addEventListener("click", this.handlePlanetClick.bind(this));
        });
    }

    handlePlanetClick(event) {
        const planet = event.target;
        const map = planet.getAttribute("data-map");
        resources.gameBoard.style.backgroundImage = `url(${resources.images.map[map].src})`;
        this.menuElement.classList.add("main-menu-hidden");
        document.getElementById("header").style.display = "block";
        // this.handleHistory("intorduction");
        this.isGameStarted = true;
        this.game.load();
        this.gameLoop();
    }

    handleKeyDown(e) {
        if (e.key.toLowerCase() == "p" && this.isGameStarted) {
            this.togglePause();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.game.isRunning = !this.game.isRunning;
        this.p.style.display = this.isPaused ? "block" : "none";
        if (this.isPaused) {
            resources.player.removeMoveHandler();
        } else {
            resources.player.moveHandler();
        }
    }

    async Start() {
        // if (
        //     this.game.level === this.game.maxLevel / 2 + 1 &&
        //     this.stageHistory != "development"
        // ) {
        //     this.stageHistory = "development";
        //     this.handleHistory(this.stageHistory);
        // }

        if (this.isGameStarted && !this.isPaused) {
            if (!resources.player.isAlive) {
                this.isPaused = true;
                this.GameOver();
            }
            this.game.render();
        }
    }

    handleHistory(step) {
        this.isPaused = true;
        const content = history[step];
        this.history.querySelector(".history-content").textContent = content;
        this.history.style.display = "flex";
        resources.player.removeMoveHandler();

        this.history.querySelector("button").addEventListener("click", () => {
            this.history.style.display = "none";
            if (this.step != "conclusion") {
                this.isPaused = false;
                resources.player.moveHandler();
            }
        });
    }

    GameOver() {
        // this.handleHistory("conclusion");
        let backgroundMusic = resources.audios.gameOver;
        window.removeEventListener("keydown", this.handleKeyDown);

        backgroundMusic.autoplay = true;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();

        resources.player.removeMoveHandler();
        this.g.style.display = "block";
    }

    handleSubmit() {
        const s = document.getElementById("submit-score");
        s.addEventListener("submit", async (e) => {
            e.preventDefault();

            let formData = new FormData(e.target);

            fetch("http://localhost:8080/post-score", {
                method: "POST",
                // headers: {
                //     "Content-Type": "application/json",
                // },
                body: JSON.stringify({
                    score: this.game.score,
                    name: formData.get("name"),
                }),
            })
                .then((response) => response.json())
                .catch((error) => console.error("Error:", error));
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
                        this.restartGame();
                        break;
                    case "continue":
                        this.togglePause();
                        break;
                    case "quit":
                        location.reload();
                        break;
                }
            });
        });
    }

    restartGame() {
        this.isPaused = false;
        this.p.style.display = "none";
        this.g.style.display = "none";
        window.addEventListener("keydown", this.handleKeyDown);
        resources.player.moveHandler();
        this.game.load();
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
        this.Start();
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
