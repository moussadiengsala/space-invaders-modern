

const gameBoard = document.getElementById("game-board");
const menuElement = document.getElementById("main-menu");
const p = document.getElementById("pause-game");
const g = document.getElementById("game-over");
const planets = menuElement.querySelectorAll(".main-menu-planet");

export function navigation(resources) {
    const accordionTogglers =
        menuElement.querySelectorAll(".accordion-toggler");
    const accordionContents =
        menuElement.querySelectorAll(".accordion-content");

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
        toggler.addEventListener("click", () => {
            toggleContent(index);
        });
    });
}

