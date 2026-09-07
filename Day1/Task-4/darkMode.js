export function init() {

    const button = document.querySelector("#dark-mode-toggle");

    if (!button) {
        return;
    }

    button.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

}