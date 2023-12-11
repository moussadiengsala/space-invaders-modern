import { resources } from "../../engine.js";
import { weapons } from "../../utils/projectils.js";
import { spriteAnimation} from "../../utils/spriteAnimation.js"
import { throttle } from "../../utils/throttle.js";

export default class Weapon {
    constructor(gunType, ship) {
        this.ship = ship;

        this.gunTypes = ["default", "autoCannon", "bigSpaceGun", "zapper"]
        this.gunType = gunType;
        this.chargedGun(this.gunType)
    }

    changedGun(gunType) {
        this.gunType = gunType;
        this.ship.removeChild(this.weapon);
        this.chargedGun(this.gunType);
    }

    chargedGun(gunType) {
        this.gunType = gunType
        let gunChoosed = this.gunTypes.at(this.gunType);
        const { projectile, weapon, bullet, demage,  adjustPosition, animationStateProjectile, animationStateWeapon } = weapons[gunChoosed];

        this.weapon = document.createElement("div")
        this.weapon.style.backgroundImage = `url(${resources.images.weapon[weapon].src})`
        this.weapon.className = `weapon`
        
        this.animationStateWeapon = animationStateWeapon
        this.projectile = resources.images.projectile[projectile].src
        this.animationStateProjectile = animationStateProjectile
        this.bullet = bullet
        this.adjustPosition = adjustPosition
        this.demage = demage

        this.ship.appendChild(this.weapon)
    }

    render = throttle(() => {
        // spriteAnimation(this.weapon, this.animationStateWeapon)
    }, 0)
}