export function spriteAnimation(elementToAnimate, animationState) {
  const { width: frameWidth } = elementToAnimate.getBoundingClientRect();
  const newXPos = -animationState?.currentFrame * frameWidth;
  elementToAnimate.style.backgroundPosition = `${newXPos}px 0`;
  animationState.currentFrame =
    (animationState?.currentFrame + 1) % animationState?.frameCount;
}
