const container = document.getElementById("scrollContainer");
const content = document.getElementById("content");

const totalItemsDisplay = document.getElementById("totalItems");
const renderedItemsDisplay = document.getElementById("renderedItems");
const fpsDisplay = document.getElementById("fps");


// -----------------------------------
// 1. CREATE 10,000 ITEMS
// -----------------------------------

const items = [];

for (let i = 1; i <= 10000; i++) {
    items.push(`Item ${i}`);
}

totalItemsDisplay.textContent = items.length;


// -----------------------------------
// 2. VIRTUAL SCROLL SETTINGS
// -----------------------------------

const itemHeight = 40;
const buffer = 5;


// Total virtual height
const totalHeight = items.length * itemHeight;

document.getElementById("spacer").style.height =
    `${totalHeight}px`;


// -----------------------------------
// 3. RENDER FUNCTION
// -----------------------------------

function render() {

    const scrollTop = container.scrollTop;

    // Find first visible item
    const start = Math.floor(
        scrollTop / itemHeight
    );

    // Number of items visible in viewport
    const visibleCount = Math.ceil(
        container.clientHeight / itemHeight
    );

    // Add buffer above and below
    const renderStart = Math.max(
        0,
        start - buffer
    );

    const renderEnd = Math.min(
        items.length,
        start + visibleCount + buffer
    );


    // Clear old rendered items
    content.innerHTML = "";


    // Render only required items
    for (
        let i = renderStart;
        i < renderEnd;
        i++
    ) {

        const item = document.createElement("div");

        item.className = "item";

        item.textContent = items[i];

        content.appendChild(item);
    }


    // Move rendered items to correct position
    content.style.transform =
        `translateY(${renderStart * itemHeight}px)`;


    // Show how many DOM items are actually rendered
    renderedItemsDisplay.textContent =
        renderEnd - renderStart;
}


// -----------------------------------
// 4. INITIAL RENDER
// -----------------------------------

render();


// -----------------------------------
// 5. rAF THROTTLING
// -----------------------------------

let ticking = false;

let debounceTimer = null;


container.addEventListener("scroll", () => {

    // -------------------------------
    // THROTTLE USING rAF
    // -------------------------------

    if (!ticking) {

        requestAnimationFrame(() => {

            render();

            ticking = false;
        });

        ticking = true;
    }


    // -------------------------------
    // DEBOUNCE
    // -------------------------------

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {

        console.log("Scrolling stopped");

    }, 100);

});


// -----------------------------------
// 6. FPS COUNTER
// -----------------------------------

let frameCount = 0;
let lastTime = performance.now();

function measureFPS(currentTime) {

    frameCount++;

    const elapsed =
        currentTime - lastTime;


    if (elapsed >= 500) {

        const fps =
            Math.round(
                frameCount /
                (elapsed / 1000)
            );

        fpsDisplay.textContent = fps;

        frameCount = 0;

        lastTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
}

requestAnimationFrame(measureFPS);