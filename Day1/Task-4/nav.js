export function init() {

    const menuButton = document.querySelector("#menu-button");

    const nav = document.querySelector("#nav");

    if (!menuButton || !nav) {
        return;
    }

    menuButton.addEventListener("click", function () {

        nav.classList.toggle("active");

    });

}