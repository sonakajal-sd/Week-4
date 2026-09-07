// PART 1 — ANIMATED COUNTER


const counter = document.getElementById("counter");
const startCounter = document.getElementById("startCounter");

const duration = 2000;
const startValue = 0;
const endValue = 100;

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateCounter(startTime) {

    const currentTime = performance.now();

    const elapsed = currentTime - startTime;

    let progress = elapsed / duration;

    if (progress > 1) {
        progress = 1;
    }

    const easedProgress = easeOutCubic(progress);

    const value =
        startValue +
        (endValue - startValue) * easedProgress;

    counter.textContent = Math.round(value);

    if (progress < 1) {
        requestAnimationFrame(() => {
            animateCounter(startTime);
        });
    }
}

startCounter.addEventListener("click", () => {

    counter.textContent = startValue;

    const startTime = performance.now();

    requestAnimationFrame(() => {
        animateCounter(startTime);
    });
});


// ======================================
// PART 2 — PARTICLE SYSTEM
// ======================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const particles = [];

for (let i = 0; i < 200; i++) {

    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,

        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,

        color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
}


// PART 3 — ANIMATION LOOP

let animationId = null;
let isPaused = false;

function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const particle of particles) {

        // UPDATE POSITION

        particle.x += particle.vx;
        particle.y += particle.vy;


        // BOUNCE FROM LEFT / RIGHT

        if (
            particle.x <= 0 ||
            particle.x >= canvas.width
        ) {
            particle.vx *= -1;
        }


        // BOUNCE FROM TOP / BOTTOM

        if (
            particle.y <= 0 ||
            particle.y >= canvas.height
        ) {
            particle.vy *= -1;
        }


        // DRAW PARTICLE

        ctx.fillStyle = particle.color;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    animationId = requestAnimationFrame(animateParticles);
}


// Start particle animation

animationId = requestAnimationFrame(animateParticles);


// PART 4 — PAUSE

const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");

pauseButton.addEventListener("click", () => {

    if (animationId !== null) {

        cancelAnimationFrame(animationId);

        animationId = null;

        isPaused = true;
    }
});


// PART 5 — RESUME

resumeButton.addEventListener("click", () => {

    if (isPaused) {

        isPaused = false;

        animationId = requestAnimationFrame(animateParticles);
    }
});




// number 2 animation

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// const particles = [];

// const centerX = canvas.width / 2;
// const centerY = canvas.height / 2;

// for (let i = 0; i < 200; i++) {
//     const angle = Math.random() * Math.PI * 2;
//     const speed = Math.random() * 2 + 0.5;

//     particles.push({
//         x: centerX,
//         y: centerY,

//         vx: Math.cos(angle) * speed,
//         vy: Math.sin(angle) * speed,

//         size: Math.random() * 3 + 1,

//         color: `hsl(${Math.random() * 360}, 100%, 50%)`
//     });
// }

// let animationId = null;
// let isPaused = false;

// function animateParticles() {

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     for (const particle of particles) {

//         // Move particle
//         particle.x += particle.vx;
//         particle.y += particle.vy;

//         // Slowly reduce velocity
//         particle.vx *= 0.995;
//         particle.vy *= 0.995;

//         // Draw particle
//         ctx.fillStyle = particle.color;

//         ctx.beginPath();

//         ctx.arc(
//             particle.x,
//             particle.y,
//             particle.size,
//             0,
//             Math.PI * 2
//         );

//         ctx.fill();
//     }

//     animationId = requestAnimationFrame(animateParticles);
// }

// animationId = requestAnimationFrame(animateParticles);


// // PAUSE

// pauseButton.addEventListener("click", () => {

//     cancelAnimationFrame(animationId);

//     animationId = null;
//     isPaused = true;
// });


// // RESUME

// resumeButton.addEventListener("click", () => {

//     if (isPaused) {

//         isPaused = false;

//         animationId = requestAnimationFrame(animateParticles);
//     }
// });