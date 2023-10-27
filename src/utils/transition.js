export function transition(start, end, axis, value, direction, numPoints) {
  // console.log(start, end, axis, value, direction, numPoints);
  const path = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    let a =
      direction == "left"
        ? start + t * (end - start)
        : start + t * (end - start);
    a = a || start;
    if (axis === "x") {
      let x = a;
      let y = value;
      path.push({ x, y });
      continue;
    }
    let x = value;
    let y = a;
    path.push({ x, y });
  }
  return path;
}
