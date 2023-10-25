import { Engine } from "../engine.js";

const gameBoard = document.getElementById("game-board");

export const menu = () => {
    let test = document.createElement("div");
    test.className = "btn";
    test.innerHTML = `
    <h1 class="md:text-[80px] text-center text-[#86AE94]">Space Invaders 2.0</h1>
    <p class="arcade-text text-[#E3C7E0]  text-center">Defend the planets, Save the Galaxy!</p>
    <div class="flex flex-col w-fit mx-auto p-8 text-center gap-8  justify-center items-center">
      <button class="arcade-text newGame">Start a new game</button>
      <div class="arcade-text">
        <button class="accordion-toggler">Synopsis</button>
        <div class="accordion-content text-[10px]">In the not-so-distant future, Earth's colonies across the galaxy face an unprecedented threat: the Xylogar Dominion, an advanced alien force. As a starfighter commander, you're humanity's last hope. Fight waves of invaders, upgrade your ship, and uncover ancient alien tech to turn the tide. The fate of Earth and the galaxy is in your hands. Will you rise to the challenge and repel the invaders in 'Galactic Reckoning: The Invasion Chronicles'?
        </div>
      </div>
      <div class="text-enter arcade-text">
        <button class="accordion-toggler">How to play ?</button>
        <div class="accordion-content transition-all">
        <div class="flex items-center gap-2">
          <div class="w-[64px] h-[32px] bg-[url(../../assets/buttons/Space-Key.png)]"></div>
          &rarr;<small>Shoot</small>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-[32px] h-[32px] bg-[url(../../assets/buttons/C-Key.png)]"></div>
          &rarr;<small>Change weapon</small>
        </div>
        </div>
      </div>
      <div class="text-enter arcade-text">
        <button class="accordion-toggler">Credits</button>
        <div class="accordion-content text-[12px] space-y-6">
        <p>${new Date().getFullYear()} make with ❤️</p>
        <p>Abdou Aziz Ndiaye</p>
        <p>Moussa Dieng</p>
        <div><span>Assets : </span><a class="underline" href="https://www.foozle.io/">www.foozle.io</a></div>
        </div>
      </div>
      </div>
     `;

    document.body.appendChild(test);

    const accordionTogglers = document.querySelectorAll(".accordion-toggler");
    const accordionContents = document.querySelectorAll(".accordion-content");

    accordionTogglers.forEach((toggler, index) => {
        toggler.addEventListener("click", () => {
            let clickSound = new Audio("../../assets/audio/click-sound.wav");
            clickSound.play();
            accordionContents[index].classList.toggle("active");

            accordionContents.forEach((content, i) => {
                if (i !== index) {
                    content.classList.remove("active");
                }
            });
        });
    });

    let btn = document.querySelector(".newGame");
    btn.addEventListener("click", (e) => {
        let engine = new Engine(gameBoard);
        engine.gameLoop();
    });
    let backgroundMusic = new Audio("../../assets/audio/background-music.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.autoplay = true;
    backgroundMusic.play();
};

menu();
