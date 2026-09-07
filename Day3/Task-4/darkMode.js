function initDarkMode() {
    const preference = localStorage.getItem("darkMode");

    if (preference === "true") {
        document.body.classList.add("dark");
    }
}

module.exports = {
    initDarkMode
};