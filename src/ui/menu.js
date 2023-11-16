import { GamePlay } from "../gameplay/gameplay.js";
import { skyAnimation } from "./skyAnimation.js";

const gameBoard = document.getElementById("game-board");

export class Menu {
    constructor() {
        this.isGameStarted = false;
        this.isPaused = false;

        this.game = new GamePlay();
        this.menuElement = document.createElement("div");
        this.PauseMenuElement = document.createElement("div");
        this.PauseMenuElement.className =
            "absolute menu-pause bg-black/70 flex gap-6 flex-col justify-center items-center text-white h-screen w-full";
        this.menuElement.className = "btn testing";
        this.menuElement.innerHTML = this.MainMenu();
        document.body.appendChild(this.menuElement);
        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() == "p" && this.isGameStarted) {
                this.isPaused = !this.isPaused;
                this.isPaused;
                if (this.isPaused) {
                    this.PauseMenuElement.innerHTML = this.PauseMenu();
                    document.body.appendChild(this.PauseMenuElement);
                } else {
                    document.querySelector(".menu-pause").remove();
                }
            }
        });

        this.planets = this.menuElement.querySelectorAll(".new-game");
        this.planets.forEach((planet) => {
            planet.addEventListener("click", () => {
                this.game.gameBoard.style.backgroundImage = `url(../../assets/maps/${planet.getAttribute(
                    "data-map"
                )}-background.png)`;
                document.querySelector(".testing")
                    ? document.body.removeChild(
                          document.querySelector(".testing")
                      )
                    : null;
                this.isGameStarted = true;
                console.log("hello world! test");
                this.game.load();
            });
        });
        this.Navigation();
        this.backgroundMusic();
    }
    MainMenu() {
        return `<h1 class="md:text-[80px] text-center text-[#86AE94]">Space Invaders 2.0</h1>
      <p class="arcade-text text-[#E3C7E0]  text-center">Defend the planets, Save the Galaxy!</p>
      <div class="flex flex-col w-fit mx-auto p-8 text-center gap-8  justify-center items-center">
      <div class="text-enter arcade-text">
      <button class="accordion-toggler">Start a new game</button>
      <div class="accordion-content text-[12px] space-y-6">
            Choose a planet
            <div class="flex gap-8">
              <div data-map="lava" class="w-[48px] new-game h-[48px] hover:scale-125 cursor-pointer  mt-6 bg-[url(../../assets/maps/Lava.png)]"></div>
              <div data-map="ice" class="w-[48px] h-[48px] new-game hover:scale-125  cursor-pointer mt-6 bg-[url(../../assets/maps/Ice.png)]"></div>
              <div data-map="terran" class="w-[48px] h-[48px] new-game hover:scale-125  cursor-pointer mt-6 bg-[url(../../assets/maps/Terran.png)]"></div>
              <div data-map="baren"  class="w-[48px] h-[48px] new-game hover:scale-125  cursor-pointer mt-6 bg-[url(../../assets/maps/Baren.png)]"></div>
            </div>
      </div>
     </div>
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
         </div>`;
    }
    Navigation() {
        const accordionTogglers =
            this.menuElement.querySelectorAll(".accordion-toggler");
        const accordionContents =
            this.menuElement.querySelectorAll(".accordion-content");

        accordionTogglers.forEach((toggler, index) => {
            toggler.addEventListener("click", () => {
                let clickSound = new Audio(
                    "../../assets/audio/click-sound.wav"
                );
                clickSound.play();
                accordionContents[index].classList.toggle("active");

                accordionContents.forEach((content, i) => {
                    if (i !== index) {
                        content.classList.remove("active");
                    }
                });
            });
        });
    }
    Start() {
        if (this.isGameStarted && !this.isPaused) this.game.render();
    }
    PauseMenu() {
        return `
          <div class="mb-4 text-xl">Paused</div>
          <div>Continue</div>
          <div>Restart</div>
          <div>Quit</div>
        `;
    }
    backgroundMusic() {
        let backgroundMusic = new Audio(
            "../../assets/audio/background-music.mp3"
        );
        backgroundMusic.loop = true;
        backgroundMusic.autoplay = true;
        backgroundMusic.volume = 0.1;
        backgroundMusic.play();
    }
}
