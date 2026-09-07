const setupMobileNav = require("./mobileNav");

test("opens mobile nav when hamburger is clicked", () => {

    document.body.innerHTML = `
        <button id="menu">☰</button>

        <div id="drawer">
            <button>Home</button>
            <button>About</button>
        </div>
    `;

    setupMobileNav();

    const menu = document.querySelector("#menu");
    const drawer = document.querySelector("#drawer");

    menu.click();

    expect(drawer.classList.contains("open"))
        .toBe(true);
});