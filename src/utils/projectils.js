
export const weapons = {
    default: {
        projectile: "cannon",
        weapon: "bigSpaceGun",
        bullet: 1,
        demage: 5,
        adjustPosition: [0],
        animationStateProjectile: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
        animationStateWeapon: {
            currentFrame: 0,
            frameCount: 1,
            currentRow: 0,
            row: 1,
        },
    },
    bigSpaceGun: {
        projectile: "bigSpaceGun",
        weapon: "bigSpaceGun",
        bullet: 1,
        demage: 20,
        adjustPosition: [0],
        animationStateProjectile: {
            currentFrame: 0,
            frameCount: 10,
            currentRow: 0,
            row: 1,
        },
        animationStateWeapon: {
            currentFrame: 0,
            frameCount: 12 - 1,
            currentRow: 0,
            row: 1,
        },
    },
    autoCannon: {
        projectile: "autoCannon",
        weapon: "autoCannon",
        bullet: 2,
        demage: 5,
        adjustPosition: [-10, 20],
        animationStateProjectile: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
        animationStateWeapon: {
            currentFrame: 0,
            frameCount: 7,
            currentRow: 0,
            row: 1,
        },
    },
    // rocket: {
    //     projectile: "rockets",
    //     weapon: "rockets",
    //     bullet: 6,
    //     adjustPosition: [-1, -.6, -.4, 2, .8, 1],
    //     demage: 5,
    //     animationStateProjectile: {
    //         currentFrame: 0,
    //         frameCount: 3,
    //         currentRow: 0,
    //         row: 1,
    //     },
    //     animationStateWeapon: {
    //         currentFrame: 0,
    //         frameCount: 16,
    //         currentRow: 0,
    //         row: 1,
    //     },
    // },
    zapper: {
        projectile: "zapper",
        weapon: "zapper",
        bullet: 2,
        demage: 15,
        adjustPosition: [-10, 20],
        animationStateProjectile: {
            currentFrame: 0,
            frameCount: 8,
            currentRow: 0,
            row: 1,
        },
        animationStateWeapon: {
            currentFrame: 0,
            frameCount: 14,
            currentRow: 0,
            row: 1,
        },
    },
}


