export function init() {

    const buttons = document.querySelectorAll(".accordion-button");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const content = button.nextElementSibling;

            content.classList.toggle("active");

        });

    });

}