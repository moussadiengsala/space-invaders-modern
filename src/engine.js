import { Menu } from "./ui/menu.js";
import { skyAnimation } from "./ui/skyAnimation.js";
import { ResourceManager } from "./ui/resourceManager.js";
import { hideLoadingMessage, showLoadingMessage } from "./ui/loadingMessage.js";

export const resources = new ResourceManager();

export class Engine {
    constructor() {
        this.menu = new Menu();
        this.FPS = 60; // Desired frames per second
        this.UPDATE_RATE = 1000 / this.FPS; // Time in milliseconds for each frame
        this.lastUpdateTime = performance.now();
        this.gameLoop = this.gameLoop.bind(this);
        this.map = document.getElementById("game-board");
    }

    gameLoop() {
        const now = performance.now();
        const elapsed = now - this.lastUpdateTime;
        if (elapsed > this.UPDATE_RATE) {
            if (!this.menu.isPaused) {
                this.render()
            }
            this.lastUpdateTime = now - (elapsed % this.UPDATE_RATE);
        }
        window.requestAnimationFrame(this.gameLoop);
    }

    async render() {
        Promise.all([
            skyAnimation(this.map),
            this.menu.Start()
        ]);
    }
}

async function initializeResources() {
    showLoadingMessage(); // Show loading message while resources are loading
    try {
        // load all resources needed for the game.
        await resources.resourceLoader()
        hideLoadingMessage(); // Hide loading message once resources are loaded
    
        // Start the game loop once resources are loaded
        let engine = new Engine();
        engine.gameLoop();
    } catch (e) {
        console.log(e);
    }
}

initializeResources()
