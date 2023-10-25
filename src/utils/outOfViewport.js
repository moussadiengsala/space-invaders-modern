export function isElementOutOfViewport(element) {
  const elementRect = element.getBoundingClientRect();
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // Check if any of the element's edges are outside the viewport
  return (
    elementRect.right < 0 ||
    elementRect.bottom < 0 ||
    elementRect.left > viewportWidth ||
    elementRect.top > viewportHeight
  );
}
