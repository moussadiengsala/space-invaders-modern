let times = [];

export const FPSMeasurement = () => {
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  times.push(now);
  let fps = times.length;
  document.querySelector(
    ".fps-display"
  ).textContent = `You running at ${fps} FPS`;
};
