
const weapons = {
    bigGun: {
        url: "url(/assets/Foozle_2DS0011_Void_MainShip/projectile/PNGs/big-gun.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 10,
            currentRow: 0,
            row: 1,
        },
    },
    canonBullet: {
        url: "url(/assets/Foozle_2DS0011_Void_MainShip/projectile/PNGs/canon-bullet.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
    },
    rocket: {
        url: "url(/assets/Foozle_2DS0011_Void_MainShip/projectile/PNGs/rocket.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 3,
            currentRow: 0,
            row: 1,
        },
    },
    zapper: {
        url: "url(/assets/Foozle_2DS0011_Void_MainShip/projectile/PNGs/zapper.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 8,
            currentRow: 0,
            row: 1,
        },
    },
}


export function weapon(chosenWeapon, position) {
    const { url, animationState } = weapons[chosenWeapon];

    const bulletStyle = {
        backgroundImage: url,
        position: "absolute",
        width: "32px",
        height: "32px",
        left: `${position.x}%`,
        bottom: `${position.y}%`,
    };

    const bulletElement = document.createElement("div");
    Object.assign(bulletElement.style, bulletStyle);

    return [bulletElement, animationState];
}