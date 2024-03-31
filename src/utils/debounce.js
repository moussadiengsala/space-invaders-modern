// export function debounce(func, obj = { leading: false }) {
//     let animationFrameID;
  
//     return (...args) => {
//         // If obj.leading is true, call the callback immediately without waiting for the delay
//         if (obj.leading && !animationFrameID) {
//             func(...args);
//         }

//         cancelAnimationFrame(animationFrameID);

//         // Call the function using requestAnimationFrame
//         animationFrameID = requestAnimationFrame(() => {
//             func(...args);
//         });
//     };
// }
