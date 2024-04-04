import { spriteAnimation } from "../../utils/spriteAnimation.js";

class Bullets {
    constructor(
        BulletOwner,
        x,
        y,
        direction,
        projectile,
        projectileSprite,
        gameBoard
    ) {
        this.BulletOwner = BulletOwner;
        this.ID = `bullet_${Date.now()}`;
        this.gameBoard = gameBoard;
        this.direction = direction;
        this.isHitTarget = false;
        this.position = {
            x,
            y,
        };

        this.size = 32;

        this.projectile = projectile;
        // this.animationState = projectileSprite;

        this.loadProjectile(this.position);
    }

    loadGun() {
        this.gameBoard.removeChild(this.bullets);
        this.loadProjectile(this.position);
    }

    loadProjectile = (position) => {
        this.bullets = document.createElement("div");
        this.bullets.className = `bullet`;
        this.bullets.style.opacity = 0;
        this.updatePosition();

        this.elem = document.createElement("div");
        if (this.projectile)
            this.elem.style.backgroundImage = `url(${this.projectile})`;
        this.elem.className = `${
            this.BulletOwner?.includes("Enemy") && "bullet-enemy"
        }`;

        this.bullets.appendChild(this.elem);
        this.gameBoard.appendChild(this.bullets);
    };

    fire(activeBullets, poolingBullets, index) {
        const isOutOfBoard =
            this.position.y > window.innerHeight || this.position.y < 0;
        if (isOutOfBoard) {
            this.cleanup();
            poolingBullets[activeBullets[index].ID] = activeBullets[index];
            activeBullets.splice(index, 1);
        }
        this.position.y += 8 * this.direction;
        this.updatePosition();
    }

    updatePosition() {
        this.bullets.style.transform = `translate(${this.position.x}px,${this.position.y}px)`;
    }

    cleanup() {
        this.bullets.style.opacity = 0;
    }
}

export default Bullets;
