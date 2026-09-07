// ==========================================
// 1. CANVAS
// ==========================================

const canvas =
    document.querySelector("#salesChart");

const ctx =
    canvas.getContext("2d");


// ==========================================
// 2. DATA
// ==========================================

const months = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"

];


const sales = [

    40,
    70,
    55,
    90,
    60,
    80,
    45,
    95,
    75,
    65,
    85,
    100

];


// ==========================================
// 3. CHART SETTINGS
// ==========================================

const chartLeft = 60;

const chartTop = 50;

const chartBottom = 430;

const chartWidth = 780;

const chartHeight =
    chartBottom - chartTop;

const maxValue = 100;

const barWidth =
    chartWidth / sales.length;


// ==========================================
// 4. TOOLTIP
// ==========================================

const tooltip =
    document.querySelector("#tooltip");


// ==========================================
// 5. DRAW CHART
// ==========================================

function drawChart(animationProgress = 1) {

    // Clear canvas

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ======================================
    // BACKGROUND
    // ======================================

    ctx.fillStyle = "white";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ======================================
    // GRIDLINES
    // ======================================

    ctx.strokeStyle = "#ddd";

    ctx.lineWidth = 1;

    ctx.font = "14px Arial";

    ctx.fillStyle = "#555";


    for (
        let value = 0;
        value <= maxValue;
        value += 20
    ) {

        const y =
            chartBottom -
            (value / maxValue) *
            chartHeight;


        // Gridline

        ctx.beginPath();

        ctx.moveTo(
            chartLeft,
            y
        );

        ctx.lineTo(
            chartLeft + chartWidth,
            y
        );

        ctx.stroke();


        // Y-axis label

        ctx.fillText(
            value,
            25,
            y + 5
        );

    }


    // ======================================
    // AXES
    // ======================================

    ctx.strokeStyle = "#222";

    ctx.lineWidth = 2;


    // Y axis

    ctx.beginPath();

    ctx.moveTo(
        chartLeft,
        chartTop
    );

    ctx.lineTo(
        chartLeft,
        chartBottom
    );

    ctx.stroke();


    // X axis

    ctx.beginPath();

    ctx.moveTo(
        chartLeft,
        chartBottom
    );

    ctx.lineTo(
        chartLeft + chartWidth,
        chartBottom
    );

    ctx.stroke();


    // ======================================
    // GRADIENT
    // ======================================

    const gradient =
        ctx.createLinearGradient(
            0,
            chartTop,
            0,
            chartBottom
        );


    gradient.addColorStop(
        0,
        "#4facfe"
    );


    gradient.addColorStop(
        1,
        "#00f2fe"
    );


    // ======================================
    // BARS
    // ======================================

    sales.forEach(
        (value, index) => {

            // Target height

            const targetHeight =
                (value / maxValue) *
                chartHeight;


            // Animated height

            const currentHeight =
                targetHeight *
                animationProgress;


            // X position

            const x =
                chartLeft +
                index * barWidth +
                5;


            // Y position

            const y =
                chartBottom -
                currentHeight;


            // Gradient

            ctx.fillStyle =
                gradient;


            // Draw bar

            ctx.fillRect(
                x,
                y,
                barWidth - 10,
                currentHeight
            );


            // ==================================
            // MONTH LABEL
            // ==================================

            ctx.fillStyle = "#222";

            ctx.font = "13px Arial";

            ctx.textAlign = "center";


            ctx.fillText(
                months[index],
                x + (barWidth - 10) / 2,
                chartBottom + 25
            );

        }
    );

}


// ==========================================
// 6. EASE-OUT ANIMATION
// ==========================================

const duration = 2000;

const startTime =
    performance.now();


function animate(currentTime) {

    const elapsed =
        currentTime - startTime;


    // 0 → 1

    const progress =
        Math.min(
            elapsed / duration,
            1
        );


    // Ease-out

    const easedProgress =
        1 -
        Math.pow(
            1 - progress,
            3
        );


    // Draw

    drawChart(
        easedProgress
    );


    // Continue animation

    if (progress < 1) {

        requestAnimationFrame(
            animate
        );

    }

}


// Start animation

requestAnimationFrame(
    animate
);


// ==========================================
// 7. MOUSE HOVER
// ==========================================

canvas.addEventListener(
    "mousemove",
    (event) => {

        // Canvas position

        const rect =
            canvas.getBoundingClientRect();


        // Mouse position inside canvas

        const mouseX =
            event.clientX -
            rect.left;


        const mouseY =
            event.clientY -
            rect.top;


        // Check if mouse is inside chart

        if (
            mouseX < chartLeft ||
            mouseX > chartLeft + chartWidth ||
            mouseY < chartTop ||
            mouseY > chartBottom
        ) {

            tooltip.style.display =
                "none";

            return;

        }


        // Find bar index

        const index =
            Math.floor(
                (mouseX - chartLeft) /
                barWidth
            );


        // Check valid index

        if (
            index < 0 ||
            index >= sales.length
        ) {

            tooltip.style.display =
                "none";

            return;

        }


        // Get value

        const value =
            sales[index];


        // Show tooltip

        tooltip.style.display =
            "block";


        tooltip.textContent =
            `${months[index]}: ${value}`;


        // Tooltip position

        tooltip.style.left =
            `${event.clientX + 12}px`;


        tooltip.style.top =
            `${event.clientY + 12}px`;

    }
);


// ==========================================
// 8. HIDE TOOLTIP
// ==========================================

canvas.addEventListener(
    "mouseleave",
    () => {

        tooltip.style.display =
            "none";

    }
);


// ==========================================
// 9. DOWNLOAD PNG
// ==========================================

const downloadBtn =
    document.querySelector("#downloadBtn");


downloadBtn.addEventListener(
    "click",
    () => {

        // Convert canvas to PNG

        const image =
            canvas.toDataURL(
                "image/png"
            );


        // Create download link

        const link =
            document.createElement("a");


        link.href = image;


        link.download =
            "sales-chart.png";


        // Trigger download

        link.click();

    }
);