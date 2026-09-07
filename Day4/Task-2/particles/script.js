const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");

const pauseBottom = document.getElementById("pauseBottom");
const resumeBottom = document.getElementById("resumeBottom");

const fpsDisplay = document.getElementById("fps");


// ======================================
// CENTER OF SOLAR SYSTEM
// ======================================

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;


// ======================================
// ORBIT RADII
// ======================================

const orbitRadii = [
    70,
    120,
    170,
    220,
    270,
    320
];


// ======================================
// 200 PARTICLES
// ======================================

const particles = [];

for (let i = 0; i < 200; i++) {

    const orbitIndex =
        Math.floor(Math.random() * orbitRadii.length);

    particles.push({

        orbit:
            orbitRadii[orbitIndex],

        angle:
            Math.random() * Math.PI * 2,

        speed:
            (Math.random() * 0.003) + 0.001,

        size:
            Math.random() * 1.8 + 1,

        color:
            `hsl(${Math.random() * 360}, 100%, 65%)`
    });
}


// ======================================
// BIG PLANETS
// ======================================

const planets = [

    {
        orbit: 110,
        angle: 0,
        speed: 0.006,
        size: 7,
        color: "#66aaff"
    },

    {
        orbit: 170,
        angle: 2,
        speed: 0.004,
        size: 9,
        color: "#55ff77"
    },

    {
        orbit: 220,
        angle: 4,
        speed: 0.003,
        size: 8,
        color: "#ff6688"
    },

    {
        orbit: 270,
        angle: 1,
        speed: 0.0025,
        size: 11,
        color: "#55ddff"
    },

    {
        orbit: 320,
        angle: 3,
        speed: 0.002,
        size: 10,
        color: "#aa66ff"
    }
];


// ======================================
// BACKGROUND STARS
// ======================================

const stars = [];

for (let i = 0; i < 180; i++) {

    stars.push({

        x: Math.random() * canvas.width,

        y: Math.random() * canvas.height,

        size: Math.random() * 1.5,

        opacity: Math.random()
    });
}


// ======================================
// DRAW BACKGROUND STARS
// ======================================

function drawStars() {

    for (const star of stars) {

        ctx.fillStyle =
            `rgba(255,255,255,${star.opacity})`;

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ======================================
// DRAW ORBIT RINGS
// ======================================

function drawOrbits() {

    for (const radius of orbitRadii) {

        ctx.strokeStyle =
            "rgba(255,255,255,0.15)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }
}


// ======================================
// DRAW SUN
// ======================================

function drawSun() {

    // Outer glow

    const glow =
        ctx.createRadialGradient(
            centerX,
            centerY,
            5,
            centerX,
            centerY,
            70
        );

    glow.addColorStop(0, "rgba(255,255,180,1)");
    glow.addColorStop(0.25, "rgba(255,220,50,0.8)");
    glow.addColorStop(0.6, "rgba(255,150,0,0.25)");
    glow.addColorStop(1, "rgba(255,100,0,0)");

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        70,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Sun itself

    const sun =
        ctx.createRadialGradient(
            centerX - 5,
            centerY - 5,
            2,
            centerX,
            centerY,
            28
        );

    sun.addColorStop(0, "#ffffff");
    sun.addColorStop(0.4, "#ffff55");
    sun.addColorStop(1, "#ff9900");

    ctx.fillStyle = sun;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        27,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ======================================
// DRAW PARTICLES
// ======================================

function drawParticles() {

    for (const particle of particles) {

        particle.angle += particle.speed;

        const x =
            centerX +
            Math.cos(particle.angle) *
            particle.orbit;

        const y =
            centerY +
            Math.sin(particle.angle) *
            particle.orbit;


        // Glow

        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.color;

        ctx.fillStyle = particle.color;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}


// ======================================
// DRAW PLANETS
// ======================================

function drawPlanets() {

    for (const planet of planets) {

        planet.angle += planet.speed;

        const x =
            centerX +
            Math.cos(planet.angle) *
            planet.orbit;

        const y =
            centerY +
            Math.sin(planet.angle) *
            planet.orbit;


        // Planet glow

        ctx.shadowBlur = 18;
        ctx.shadowColor = planet.color;

        ctx.fillStyle = planet.color;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            planet.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}


// ======================================
// FPS CALCULATION
// ======================================

let lastTime = performance.now();
let frameCount = 0;
let fpsTime = lastTime;


// ======================================
// ANIMATION LOOP
// ======================================

let animationId = null;

function animate(currentTime) {

    // Clear

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Background

    drawStars();


    // Solar system

    drawOrbits();

    drawSun();

    drawParticles();

    drawPlanets();


    // FPS

    frameCount++;

    if (currentTime - fpsTime >= 500) {

        const fps =
            Math.round(
                frameCount /
                ((currentTime - fpsTime) / 1000)
            );

        fpsDisplay.textContent = fps;

        frameCount = 0;

        fpsTime = currentTime;
    }


    // Next frame

    animationId =
        requestAnimationFrame(animate);
}


// ======================================
// START
// ======================================

animationId =
    requestAnimationFrame(animate);


// ======================================
// PAUSE
// ======================================

function pauseAnimation() {

    if (animationId !== null) {

        cancelAnimationFrame(animationId);

        animationId = null;
    }
}


// ======================================
// RESUME
// ======================================

function resumeAnimation() {

    if (animationId === null) {

        animationId =
            requestAnimationFrame(animate);
    }
}


// Buttons

pauseButton.addEventListener(
    "click",
    pauseAnimation
);

pauseBottom.addEventListener(
    "click",
    pauseAnimation
);

resumeButton.addEventListener(
    "click",
    resumeAnimation
);

resumeBottom.addEventListener(
    "click",
    resumeAnimation
);