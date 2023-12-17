import { throttle } from "../utils/throttle.js";

export const skyAnimation = throttle(async (map) => {
    
    let currentBackgroundPos = map.style.backgroundPosition || "0 0";
    const currentBackgroundPosArray = currentBackgroundPos.split(" ");
    const currentXPos = parseInt(currentBackgroundPosArray[0]);
    const currentYPos = parseInt(currentBackgroundPosArray[1]);

    map.style.backgroundPosition = `${currentXPos}px ${currentYPos + 30}px`
}, 30)
