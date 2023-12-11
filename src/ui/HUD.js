export const HUD = () => {
  let HUDHeader = document.createElement("div");

  //   let HUDWeapon = document.createElement("div");
  HUDHeader.className = "header";
  HUDHeader.innerHTML = `
    <div class="header-container">
        <p>Score : <span class="score">0</span></p>
        <p>Level : <span class="level">0</span></p>
        <p>Time : <span class="timer">00:00:00</span></p>
    </div>
  `;
  document.body.appendChild(HUDHeader);

};

