import { resources } from "../engine.js";
import { GamePlay } from "../gameplay/gameplay.js";
import { socket } from "../server/socketEntrypoint.js";

const gameBoard = document.getElementById("game-board");

export class Menu {
    constructor() {
        this.isGameStarted = false;
        this.isPaused = false;

        this.game = new GamePlay();

        this.menuElement = document.getElementById("main-menu");
        this.p = document.getElementById("pause-game");
        this.g = document.getElementById("game-over");

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
        if (this.isGameStarted && !this.isPaused) {
            if (!this.game.player.isAlive) {
                this.isPaused = true;
                this.GameOver();
                this.handleMenu();
            }
            this.game.render();
        }
    }

    PauseMenu() {}

    GameOver() {
        let backgroundMusic = resources.audios.gameOver;
        window.removeEventListener("keydown", this.handleKeyDown);

        backgroundMusic.autoplay = true;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();

        this.game.player.removeMoveHandler();
        this.g.style.display = "block";
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
                            this.PauseMenu();
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
}
