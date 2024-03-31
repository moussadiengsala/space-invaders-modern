import { Menu } from "./ui/menu.js";
import { skyAnimation } from "./ui/skyAnimation.js";
import { ResourceManager } from "./ui/resourceManager.js";
import { navigation } from "./index.js";

export const resources = new ResourceManager();

export class Engine {
    constructor() {
        this.menu = new Menu();
        this.FPS = 60; // Desired frames per second
        this.UPDATE_RATE = 1000 / this.FPS; // Time in milliseconds for each frame
        this.lastUpdateTime = Date.now();
        this.gameLoop = this.gameLoop.bind(this);
        this.map = document.getElementById("game-board");
    }

    gameLoop() {
        const now = Date.now();
        const elapsed = now - this.lastUpdateTime;
        if (!this.menu.isPaused && elapsed > this.UPDATE_RATE) {
            this.render();

            this.lastUpdateTime = now - (elapsed % this.UPDATE_RATE);
        }
        window.requestAnimationFrame(this.gameLoop);
    }

    render() {
        // skyAnimation(this.map);
        this.menu.Start();
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
        let engine = new Engine();
        engine.gameLoop();
    } catch (e) {
        console.log(e);
    }
}

initializeResources();
