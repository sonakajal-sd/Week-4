// ==========================================
// 1. SELECT ELEMENTS
// ==========================================

const container =
    document.querySelector("#list-container");

const spacer =
    document.querySelector("#spacer");

const visibleItems =
    document.querySelector("#visible-items");


// ==========================================
// 2. CREATE 10,000 ITEMS
// ==========================================

const items = [];

for (let i = 1; i <= 10000; i++) {

    items.push(`Item ${i}`);

}


// ==========================================
// 3. SETTINGS
// ==========================================

// Height of each item
const itemHeight = 40;


// Extra items before and after
const buffer = 10;


// ==========================================
// 4. CREATE TOTAL SCROLL HEIGHT
// ==========================================

const totalHeight =
    items.length * itemHeight;


// Tell browser that the list
// is actually 400,000px tall

spacer.style.height =
    `${totalHeight}px`;


// ==========================================
// 5. RENDER FUNCTION
// ==========================================

function render() {


    // --------------------------------------
    // STEP 1
    // Get current scroll position
    // --------------------------------------

    const scrollTop =
        container.scrollTop;


    // --------------------------------------
    // STEP 2
    // Get container height
    // --------------------------------------

    const containerHeight =
        container.clientHeight;


    // --------------------------------------
    // STEP 3
    // Calculate visible items
    // --------------------------------------

    const visibleCount =
        Math.ceil(
            containerHeight /
            itemHeight
        );


    // --------------------------------------
    // STEP 4
    // Calculate start index
    // --------------------------------------

    const startIndex =
        Math.floor(
            scrollTop /
            itemHeight
        );


    // --------------------------------------
    // STEP 5
    // Add buffer before
    // --------------------------------------

    const renderStart =
        Math.max(
            0,
            startIndex - buffer
        );


    // --------------------------------------
    // STEP 6
    // Calculate end index
    // --------------------------------------

    const renderEnd =
        Math.min(
            items.length,

            renderStart +
            visibleCount +
            buffer * 2
        );


    // --------------------------------------
    // STEP 7
    // Calculate position
    // --------------------------------------

    const translateY =
        renderStart *
        itemHeight;


    // --------------------------------------
    // STEP 8
    // Move visible items
    // --------------------------------------

    visibleItems.style.transform =
        `translateY(${translateY}px)`;


    // --------------------------------------
    // STEP 9
    // Remove previous items
    // --------------------------------------

    visibleItems.innerHTML = "";


    // --------------------------------------
    // STEP 10
    // Render only required items
    // --------------------------------------

    for (
        let i = renderStart;
        i < renderEnd;
        i++
    ) {


        const div =
            document.createElement("div");


        div.classList.add("item");


        div.textContent =
            items[i];


        visibleItems.appendChild(div);

    }


    // --------------------------------------
    // DEBUG
    // --------------------------------------

    console.log(
        "Scroll Top:",
        scrollTop,

        "Start:",
        renderStart,

        "End:",
        renderEnd,

        "Rendered:",
        renderEnd - renderStart
    );

}


// ==========================================
// 6. LISTEN FOR SCROLL
// ==========================================

container.addEventListener(
    "scroll",
    render
);


// ==========================================
// 7. INITIAL RENDER
// ==========================================

render();