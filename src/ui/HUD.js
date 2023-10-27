export const HUD = () => {
  let HUDHeader = document.createElement("div");
  //   let HUDWeapon = document.createElement("div");
  HUDHeader.className =
    "absolute top-0 text-orange-400 w-full p-1  p-8 text-xl";
  HUDHeader.innerHTML = `
    <div class="flex justify-between">
        <p>Score : <span class="score">0</span></p>
        <p>Level : <span class="level">00</span></p>
    </div>
  `;
  //   HUDWeapon.className =
  //     "absolute bottom-0 text-orange-400 w-full p-1  p-8 text-xl";
  //   HUDWeapon.textContent = "shield and automatic gun";
  document.body.appendChild(HUDHeader);
  //   document.body.appendChild(HUDWeapon);
};
