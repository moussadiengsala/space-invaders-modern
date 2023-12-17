import { resources } from "../engine.js";
import { GamePlay } from "../gameplay/gameplay.js";
import { debounce } from "../utils/debounce.js";

const gameBoard = document.getElementById("game-board");

export class Menu {
    constructor() {
        this.isGameStarted = false;
        this.isPaused = false;

        this.game = new GamePlay();

        this.menuElement = document.createElement("div");
        this.PauseMenuElement = document.createElement("div");
        this.PauseMenuElement.className = "menu-pause";
        this.menuElement.className = "main-menu";
        this.menuElement.innerHTML = this.MainMenu();
        document.body.appendChild(this.menuElement);
        window.addEventListener("keydown", this.handleKeyDown);
        
        this.handlePlanet()
        this.Navigation();
        this.backgroundMusic();
    }

    handlePlanet() {
        this.planets = this.menuElement.querySelectorAll(".main-menu-planet");
        const handleClick = (event) => {
            const planet = event.target;
            const map = planet.getAttribute("data-map");

            this.game.gameBoard.style.backgroundImage = `url(${resources.images.map[map].src})`;
            this.menuElement.classList.add("main-menu-hidden");
            
            this.isGameStarted = true;
            this.game.load();
        };
    
        this.planets.forEach((planet) => {
            planet.addEventListener("click", handleClick);
        });
    }
    

    handleKeyDown = (e) => {
        if (e.key.toLowerCase() == "p" && this.isGameStarted) {
            this.isPaused = !this.isPaused;
            this.game.isRunning = !this.game.isRunning;
            if (this.isPaused) {
                this.PauseMenuElement.innerHTML = this.PauseMenu();
                document.body.appendChild(this.PauseMenuElement);
                this.handleMenu();
                this.game.player.removeMoveHandler()
            } else {
                this.game.player.moveHandler()
                document.querySelector(".menu-pause").remove();
            }
        }
    };

    MainMenu() {
        return ` 
        <h1 class="main-menu-title">Space Invaders 2.0</h1>
        <p class="main-menu-arcade-text arcade-text">Defend the planets, Save the Galaxy!</p>
        <div class="main-menu-container">

            <div class="arcade-text">
                <button class="accordion-toggler arcade-text">Start a new game</button>
                <div class="main-menu-planets accordion-content">
                    Choose a planet
                    <div class="main-menu-planets-container">
                        <div data-map="lava" class="main-menu-planet new-game" style="background-image:url(${resources.images.map.icons.lava.src})"></div>
                        <div data-map="ice" class="main-menu-planet new-game" style="background-image:url(${resources.images.map.icons.ice.src})"></div>
                        <div data-map="terran" class="main-menu-planet new-game" style="background-image:url(${resources.images.map.icons.terran.src})"></div>
                        <div data-map="baren"  class="main-menu-planet new-game" style="background-image:url(${resources.images.map.icons.baren.src})"></div>
                    </div>
                </div>
            </div>

            <div class="arcade-text">
                <button class="accordion-toggler arcade-text">Synopsis</button>
                <div class="accordion-content">In the not-so-distant future, Earth's colonies across the galaxy face an unprecedented threat: the Xylogar Dominion, an advanced alien force. As a starfighter commander, you're humanity's last hope. Fight waves of invaders, upgrade your ship, and uncover ancient alien tech to turn the tide. The fate of Earth and the galaxy is in your hands. Will you rise to the challenge and repel the invaders in 'Galactic Reckoning: The Invasion Chronicles'?
                </div>
            </div>

            <div class="arcade-text">
                <button class="accordion-toggler arcade-text">Leaderboard</button>
                <div class="accordion-content leaderboard"></div>
            </div>

            <div class="arcade-text">
                <button class="accordion-toggler arcade-text">How to play ?</button>
                <div class="accordion-content">
                    <div class="main-menu-instruction">
                      <div style="background-image:url(${resources.images.button.spaceKey.src})"></div>
                      &rarr;<small>Shoot</small>
                    </div>
                    <div class="main-menu-instruction">
                      <div style="background-image:url(${resources.images.button.cKey.src})"></div>
                      &rarr;<small>Change weapon</small>
                    </div>
                </div>
            </div>

            <div class="arcade-text">
                <button class="accordion-toggler arcade-text">Credits</button>
                <div class="accordion-content">
                    <p>${new Date().getFullYear()} make with ❤️</p>
                    <p>Abdou Aziz Ndiaye</p>
                    <p>Moussa Dieng</p>
                    <div><span>Assets : </span><a href="https://www.foozle.io/">www.foozle.io</a></div>
                </div>
            </div>
        </div>`;
    }

    Navigation() {
        const accordionTogglers = this.menuElement.querySelectorAll(".accordion-toggler");
        const accordionContents = this.menuElement.querySelectorAll(".accordion-content");
    
        const toggleContent = (index) => {
            resources.audios.click.play();
            accordionContents[index].classList.toggle("active");
    
            accordionContents.forEach((content, i) => {
                if (i !== index) {
                    content.classList.remove("active");
                }
            });
        };
    
        accordionTogglers.forEach((toggler, index) => {
            toggler.addEventListener("click", debounce(() => {
                toggleContent(index);
            }, 100));
        });
    }
    
    async Start() {
        if (this.isGameStarted && !this.isPaused) {
            if(!this.game.player.isAlive) {
                this.isPaused=true
                this.PauseMenuElement.innerHTML = this.GameOver()
                document.body.appendChild(this.PauseMenuElement);
                this.handleMenu()
            }
            this.game.render()
        };
    }

    PauseMenu() {
        return `
            <div class="paused">Paused</div>
            <button data-action="continue" class="game-menu-button arcade-text">Continue</button>
            <button data-action="restart" class="game-menu-button arcade-text">Restart</button>
            <button data-action="quit" class="game-menu-button arcade-text">Quit</button>
        `;
    }

    GameOver() {
        let backgroundMusic = resources.audios.gameOver
        window.removeEventListener("keydown", this.handleKeyDown);

        backgroundMusic.autoplay = true;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
        // socket.send(JSON.stringify(user))

        this.game.player.removeMoveHandler()
        return `
            <div class='game-over'>
                <h1 class="game-over-title homme-text">Game Over</h1>
                <div class='game-over-score'>Your score : ${document.querySelector('.score').textContent}</div>
                <div class='game-over-action'>
                    <button data-action="restart" class='game-menu-button arcade-text'>Restart</button>
                    <button data-action="quit" class='game-menu-button arcade-text'>Quit</button>
                </div>
            </div>
        `
    }

    backgroundMusic() {
        let backgroundMusic = resources.audios.backgroundSound
        backgroundMusic.loop = true;
        backgroundMusic.autoplay = true;
        backgroundMusic.volume = 0.1;
        // backgroundMusic.play();
    }

    handleMenu() {
        let buttons = Array.from(document.querySelectorAll(".game-menu-button"))
        buttons.forEach(button => {
            let action = button.dataset?.action
            button.addEventListener("click", () => {
                switch (action) {
                    case "restart":
                        this.isPaused = false
                        document.body.removeChild(this.PauseMenuElement);
                        window.addEventListener("keydown", this.handleKeyDown);
                        this.game.player.moveHandler()
                        this.game.load()
                        break
                    case "continue":
                        this.isPaused = !this.isPaused;
                        this.game.isRunning = !this.game.isRunning
                        if (this.isPaused) {
                            this.PauseMenuElement.innerHTML = this.PauseMenu();
                            document.body.appendChild(this.PauseMenuElement);
                            this.game.player.removeMoveHandler()
                        } else {
                            this.game.player.moveHandler()
                            document.querySelector(".menu-pause").remove();
                        }
                        break;
                    case "quit":
                        location.reload()
                        break;
                }
            })

        })
    }
}
