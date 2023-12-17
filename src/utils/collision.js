

export function isElementCollide(element1, element2) {
  // Check for overlap
  var isOverlap = !(
    element1.position.x + element1.size < element2.position.x ||
    element1.position.x > element2.position.x + element2.size ||
    element1.position.y + element1.size < element2.position.y ||
    element1.position.y > element2.position.y + element2.size
  );

  // Return the result
  return isOverlap;
}