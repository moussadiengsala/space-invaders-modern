import { resources } from "./engine.js";


// function mainMenu() {
//     return `
        
//     `;
// }

// // document.body.appendChild(mainMenu());

function navigation() {
    const accordionTogglers = document.body.querySelectorAll(".accordion-toggler");
    const accordionContents = document.body.querySelectorAll(".accordion-content");

    console.log(accordionTogglers);
    const toggleContent = (index) => {
        // console.log("planet:")
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
navigation()
