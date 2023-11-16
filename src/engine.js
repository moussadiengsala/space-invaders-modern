import { Menu } from "./ui/menu.js";
import { skyAnimation } from "./ui/skyAnimation.js";
import { FPSMeasurement } from "./utils/fpsMeasurement.js";

export class Engine {
    constructor() {
        this.menu = new Menu();
        const FPS = 60; // Desired frames per second
        this.UPDATE_RATE = 1000 / FPS; // Time in milliseconds for each frame
        this.lastUpdateTime = Date.now();
        this.gameLoop = this.gameLoop.bind(this);
    }

    gameLoop() {
        const now = Date.now();
        const elapsed = now - this.lastUpdateTime;
        if (elapsed > this.UPDATE_RATE) {
          FPSMeasurement()
            if (!this.menu.isPaused) {
                this.render();
            }
            this.lastUpdateTime = now - (elapsed % this.UPDATE_RATE);
        }
        window.requestAnimationFrame(this.gameLoop);
    }
    render() {
        skyAnimation();
        this.menu.Start();
    }
}
let engine = new Engine();
engine.gameLoop();
