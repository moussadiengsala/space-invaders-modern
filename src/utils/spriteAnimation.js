import { throttle } from "./throttle.js";

export function spriteAnimation(elementToAnimate, animationState) {

    const { width: frameWidth } = elementToAnimate.getBoundingClientRect();
    const newXPos = -animationState?.currentFrame * frameWidth;
    const newYPos = -animationState?.currentRow * frameWidth;

    elementToAnimate.style.backgroundPosition = `${newXPos}px ${newYPos}px`;

    animationState.currentFrame =
        (animationState?.currentFrame + 1) % animationState?.frameCount;

    animationState.currentRow =
        (animationState?.currentRow + 1) % animationState?.row;
}


// export function spriteAutoAnimation(elementToAnimate, frameSize, frameCount, delay) {
//     let animation = throttle(() => {
//         elementToAnimate.style.backgroundPosition = `${newXPos}px 0`;
//     }, delay)

//     for (let currentFrame = 0; currentFrame < frameCount; currentFrame++) {
//         let newXPos = -currentFrame * frameSize;
        
//         animation()
//         console.log(newXPos, frameSize)
//     }
// }


export function spriteAutoAnimation(elementToAnimate, frameSize, frameCount, delay, onAnimationComplete) {
    function animateFrame(currentFrame) {
      let newXPos = -currentFrame * frameSize;
      elementToAnimate.style.backgroundPosition = `${newXPos}px 0`;
  
      // Schedule the next frame
      if (currentFrame < frameCount - 1) {
        setTimeout(() => animateFrame(currentFrame + 1), delay); // Adjust the duration (100ms) as needed
      } else {
        if (onAnimationComplete && typeof onAnimationComplete === 'function') {
            onAnimationComplete();
        }
      }
    }
  
    // Start the animation
    animateFrame(0);
  }
  

