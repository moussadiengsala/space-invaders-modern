const exhaust = [
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust0.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust1.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 3,
            currentRow: 0,
            row: 1,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust2.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 2,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust3.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust4.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts1.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust5.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts1.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 2,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust6.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts1.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 7,
            currentRow: 0,
            row: 1,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust7.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts1.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 6,
            currentRow: 0,
            row: 1,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust8.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts1.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 7,
            currentRow: 0,
            row: 2,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust9.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
    },
    {
        url: "url(/assets/characters/exhausts/PNGs/exhaust10.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 1,
        },
        url: "url(/assets/characters/exhausts/PNGs/exhaust11.png)",
        engine: "url(/assets/characters/engin-exhausts/PNGs/engin-exhausts4.png)",
        animationState: {
            currentFrame: 0,
            frameCount: 4,
            currentRow: 0,
            row: 2,
        },
    },
];

export function exhausts(exhaustPosition) {
    let shipExhausts = document.createElement("div");
    let shipEngine = document.createElement("div");

    let clx = "absolute left-[50.4%] transform -translate-x-1/2 bg-no-repeat -z-10";
    shipEngine.className = `inset-0 top-1/2 ${clx}`;
    shipExhausts.className = `w-[48px] h-[48px] bottom-0 ${clx}`;

    shipExhausts.style.backgroundImage = exhaust[exhaustPosition].url;
    shipEngine.style.backgroundImage = exhaust[exhaustPosition].engine;

    return {
        engine: shipEngine,
        elem: shipExhausts,
        animationState: exhaust[exhaustPosition].animationState,
    };
}
