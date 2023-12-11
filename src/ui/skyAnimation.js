export const skyAnimation = async (map) => {
    

    let currentBackgroundPos = map.style.backgroundPosition || "0 0";
    const currentBackgroundPosArray = currentBackgroundPos.split(" ");
    const currentXPos = parseInt(currentBackgroundPosArray[0]);
    const currentYPos = parseInt(currentBackgroundPosArray[1]);

    map.style.backgroundPosition = `${currentXPos}px ${currentYPos + 20}px`
};
