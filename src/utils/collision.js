export function isElementCollide(element1, element2) {
  // Get the bounding boxes of the two divs
  var rect1 = element1.getBoundingClientRect();
  var rect2 = element2.getBoundingClientRect();

  // Check for overlap
  var isOverlap = !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );

  // Return the result
  return isOverlap;
}
