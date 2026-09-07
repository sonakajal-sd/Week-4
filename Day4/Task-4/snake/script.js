/* ==========================================
   GET HTML ELEMENTS
========================================== */

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");

const highScoreElement = document.getElementById("highScore");

const startButton = document.getElementById("startButton");

const pauseButton = document.getElementById("pauseButton");

const stopButton = document.getElementById("stopButton");

const gameOverlay = document.getElementById("gameOverlay");

const overlayTitle = document.getElementById("overlayTitle");

const overlayMessage = document.getElementById("overlayMessage");

const overlayButton = document.getElementById("overlayButton");

const gameStatus = document.getElementById("gameStatus");


//    GAME SETTINGS

/*
    The canvas is 400 x 400.

    We divide it into small squares.

    20 x 20 grid = 20 pixels per square.
*/

const GRID_SIZE = 20;

const TILE_COUNT = canvas.width / GRID_SIZE;


/* ==========================================
   GAME VARIABLES
========================================== */

let snake;

let food;

let direction;

let nextDirection;

let score;

let highScore = 0;

let gameLoop;

let gameState = "ready";


/*
    Possible game states:

    ready
    playing
    paused
    gameover
*/


/* ==========================================
   INITIALIZE GAME
========================================== */

function initializeGame() {

    /*
        Create the snake.

        Each object represents one square
        of the snake.
    */

    snake = [
        {
            x: 10,
            y: 10
        },

        {
            x: 9,
            y: 10
        },

        {
            x: 8,
            y: 10
        }
    ];


    /*
        Start moving to the right.
    */

    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    score = 0;

    updateScore();

    createFood();

    drawGame();
}


/* ==========================================
   START GAME
========================================== */

function startGame() {

    /*
        Don't start another game loop
        if the game is already running.
    */

    if (gameState === "playing") {
        return;
    }


    /*
        If the game was finished,
        create a fresh snake.
    */

    if (gameState === "ready" || gameState === "gameover") {
        initializeGame();
    }


    /*
        Start playing.
    */

    gameState = "playing";


    /*
        Hide the overlay.
    */

    hideOverlay();


    /*
        Update buttons.
    */

    updateButtons();


    /*
        Run the game every 120 milliseconds.
    */

    gameLoop = setInterval(updateGame, 120);


    updateGameStatus("Game started.");
}


/* ==========================================
   PAUSE GAME
========================================== */

function pauseGame() {

    if (gameState !== "playing") {
        return;
    }


    gameState = "paused";


    clearInterval(gameLoop);


    showOverlay(
        "Game Paused",
        "Press Resume to continue.",
        "Resume"
    );


    updateButtons();

    updateGameStatus("Game paused.");
}


/* ==========================================
   RESUME GAME
========================================== */

function resumeGame() {

    if (gameState !== "paused") {
        return;
    }


    gameState = "playing";


    hideOverlay();


    gameLoop = setInterval(updateGame, 120);


    updateButtons();

    updateGameStatus("Game resumed.");
}


/* ==========================================
   STOP GAME
========================================== */

function stopGame() {

    clearInterval(gameLoop);


    gameState = "ready";


    initializeGame();


    showOverlay(
        "Snake Game",
        "Press Start Game to begin.",
        "Start Game"
    );


    updateButtons();

    updateGameStatus("Game stopped.");
}


/* ==========================================
   MAIN GAME LOOP
========================================== */

function updateGame() {

    /*
        Apply the next direction.

        This prevents sudden direction
        changes from causing problems.
    */

    direction = nextDirection;


    /*
        Calculate the new head position.
    */

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };


    /* --------------------------------------
       CHECK WALL COLLISION
    -------------------------------------- */

    if (
        head.x < 0 ||
        head.x >= TILE_COUNT ||
        head.y < 0 ||
        head.y >= TILE_COUNT
    ) {

        endGame();

        return;
    }


    /* --------------------------------------
       CHECK SELF COLLISION
    -------------------------------------- */

    if (hitsSnake(head)) {

        endGame();

        return;
    }


    /* --------------------------------------
       ADD NEW HEAD
    -------------------------------------- */

    snake.unshift(head);


    /* --------------------------------------
       CHECK FOOD
    -------------------------------------- */

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        /*
            Snake grows because we DON'T
            remove the tail.
        */

        score++;

        updateScore();

        createFood();

    } else {

        /*
            Normal movement:
            remove the last part of the snake.
        */

        snake.pop();
    }


    /*
        Draw the updated game.
    */

    drawGame();
}


/* ==========================================
   CHECK IF HEAD HITS SNAKE
========================================== */

function hitsSnake(head) {

    /*
        Start from index 0.

        We check whether the new head
        occupies the same position as
        another snake segment.
    */

    for (let i = 0; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            return true;
        }
    }


    return false;
}


/* ==========================================
   CREATE FOOD
========================================== */

function createFood() {

    let newFood;


    /*
        Keep generating positions until
        we find one that isn't occupied
        by the snake.
    */

    do {

        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),

            y: Math.floor(Math.random() * TILE_COUNT)
        };

    } while (isFoodOnSnake(newFood));


    food = newFood;
}


/* ==========================================
   CHECK FOOD POSITION
========================================== */

function isFoodOnSnake(position) {

    for (let i = 0; i < snake.length; i++) {

        if (
            snake[i].x === position.x &&
            snake[i].y === position.y
        ) {

            return true;
        }
    }


    return false;
}


/* ==========================================
   DRAW EVERYTHING
========================================== */

function drawGame() {

    /*
        Clear the entire canvas.
    */

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawBackground();

    drawFood();

    drawSnake();
}


/* ==========================================
   DRAW BACKGROUND
========================================== */

function drawBackground() {

    /*
        Draw a dark background.
    */

    ctx.fillStyle = "#0f172a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        Draw grid lines.
    */

    ctx.strokeStyle = "#1e293b";

    ctx.lineWidth = 1;


    for (let x = 0; x <= canvas.width; x += GRID_SIZE) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, canvas.height);

        ctx.stroke();
    }


    for (let y = 0; y <= canvas.height; y += GRID_SIZE) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(canvas.width, y);

        ctx.stroke();
    }
}


/* ==========================================
   DRAW SNAKE
========================================== */

function drawSnake() {

    for (let i = 0; i < snake.length; i++) {

        const segment = snake[i];


        /*
            The head is slightly different
            from the body.
        */

        if (i === 0) {

            ctx.fillStyle = "#22c55e";

        } else {

            ctx.fillStyle = "#16a34a";
        }


        /*
            Add a small gap between squares
            to make the snake look cleaner.
        */

        const padding = 2;


        ctx.beginPath();

        ctx.roundRect(
            segment.x * GRID_SIZE + padding,
            segment.y * GRID_SIZE + padding,

            GRID_SIZE - padding * 2,
            GRID_SIZE - padding * 2,

            5
        );

        ctx.fill();
    }


    /*
        Draw eyes on the snake head.
    */

    drawSnakeEyes();
}


/* ==========================================
   DRAW SNAKE EYES
========================================== */

function drawSnakeEyes() {

    const head = snake[0];


    /*
        Head center.
    */

    const centerX =
        head.x * GRID_SIZE + GRID_SIZE / 2;

    const centerY =
        head.y * GRID_SIZE + GRID_SIZE / 2;


    ctx.fillStyle = "#ffffff";


    /*
        Position eyes depending on direction.
    */

    let eye1;
    let eye2;


    if (direction.x === 1) {

        eye1 = {
            x: centerX + 5,
            y: centerY - 5
        };

        eye2 = {
            x: centerX + 5,
            y: centerY + 5
        };

    } else if (direction.x === -1) {

        eye1 = {
            x: centerX - 5,
            y: centerY - 5
        };

        eye2 = {
            x: centerX - 5,
            y: centerY + 5
        };

    } else if (direction.y === -1) {

        eye1 = {
            x: centerX - 5,
            y: centerY - 5
        };

        eye2 = {
            x: centerX + 5,
            y: centerY - 5
        };

    } else {

        eye1 = {
            x: centerX - 5,
            y: centerY + 5
        };

        eye2 = {
            x: centerX + 5,
            y: centerY + 5
        };
    }


    /*
        Draw eyes.
    */

    drawEye(eye1);

    drawEye(eye2);
}


/* ==========================================
   DRAW ONE EYE
========================================== */

function drawEye(eye) {

    ctx.beginPath();

    ctx.arc(
        eye.x,
        eye.y,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* ==========================================
   DRAW FOOD
========================================== */

function drawFood() {

    const centerX =
        food.x * GRID_SIZE + GRID_SIZE / 2;

    const centerY =
        food.y * GRID_SIZE + GRID_SIZE / 2;


    /*
        Draw food as a circle.
    */

    ctx.fillStyle = "#ef4444";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
        Small highlight on food.
    */

    ctx.fillStyle = "#fecaca";

    ctx.beginPath();

    ctx.arc(
        centerX - 2,
        centerY - 2,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* ==========================================
   GAME OVER
========================================== */

function endGame() {

    clearInterval(gameLoop);


    gameState = "gameover";


    /*
        Check high score.
    */

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "snakeHighScore",
            highScore
        );

        highScoreElement.textContent = highScore;
    }


    showOverlay(
        "Game Over!",
        `Your score: ${score}`,
        "Play Again"
    );


    updateButtons();


    updateGameStatus(
        `Game over. Your score was ${score}.`
    );
}


/* ==========================================
   UPDATE SCORE
========================================== */

function updateScore() {

    scoreElement.textContent = score;

    highScoreElement.textContent = highScore;
}


/* ==========================================
   LOAD HIGH SCORE
========================================== */

function loadHighScore() {

    const savedHighScore =
        localStorage.getItem("snakeHighScore");


    if (savedHighScore !== null) {

        highScore = Number(savedHighScore);
    }


    highScoreElement.textContent = highScore;
}


/* ==========================================
   SHOW OVERLAY
========================================== */

function showOverlay(
    title,
    message,
    buttonText
) {

    overlayTitle.textContent = title;

    overlayMessage.textContent = message;

    overlayButton.textContent = buttonText;

    gameOverlay.style.display = "flex";
}


/* ==========================================
   HIDE OVERLAY
========================================== */

function hideOverlay() {

    gameOverlay.style.display = "none";
}


/* ==========================================
   UPDATE BUTTONS
========================================== */

function updateButtons() {

    /*
        Start button
    */

    startButton.disabled =
        gameState === "playing" ||
        gameState === "paused";


    /*
        Pause button
    */

    pauseButton.disabled =
        gameState !== "playing";


    /*
        Stop button
    */

    stopButton.disabled =
        gameState === "ready" ||
        gameState === "gameover";


    /*
        Change pause button text.
    */

    if (gameState === "paused") {

        pauseButton.textContent = "▶ Resume";

    } else {

        pauseButton.textContent = "⏸ Pause";
    }
}


/* ==========================================
   ACCESSIBLE GAME STATUS
========================================== */

function updateGameStatus(message) {

    gameStatus.textContent = message;
}


/* ==========================================
   CHANGE DIRECTION
========================================== */

function changeDirection(newDirection) {

    /*
        Don't allow the snake to immediately
        turn backwards.

        Example:

        Moving right →

        Cannot suddenly move left ←
    */

    if (
        newDirection.x === -direction.x &&
        newDirection.y === -direction.y
    ) {

        return;
    }


    nextDirection = newDirection;
}


/* ==========================================
   KEYBOARD CONTROLS
========================================== */

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key.toLowerCase();


        /*
            Prevent the arrow keys from
            scrolling the page while playing.
        */

        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright"
            ].includes(key)
        ) {

            event.preventDefault();
        }


        /* UP */

        if (
            key === "arrowup" ||
            key === "w"
        ) {

            changeDirection({
                x: 0,
                y: -1
            });
        }


        /* DOWN */

        else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            changeDirection({
                x: 0,
                y: 1
            });
        }


        /* LEFT */

        else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            changeDirection({
                x: -1,
                y: 0
            });
        }


        /* RIGHT */

        else if (
            key === "arrowright" ||
            key === "d"
        ) {

            changeDirection({
                x: 1,
                y: 0
            });
        }


        /* PAUSE */

        else if (key === "p") {

            if (gameState === "playing") {

                pauseGame();

            } else if (gameState === "paused") {

                resumeGame();
            }
        }


        /* ENTER */

        else if (key === "enter") {

            if (
                gameState === "ready" ||
                gameState === "gameover"
            ) {

                startGame();

            } else if (gameState === "paused") {

                resumeGame();
            }
        }

    }
);


/* ==========================================
   BUTTON EVENTS
========================================== */

startButton.addEventListener(
    "click",
    startGame
);


pauseButton.addEventListener(
    "click",
    function () {

        if (gameState === "playing") {

            pauseGame();

        } else if (gameState === "paused") {

            resumeGame();
        }
    }
);


stopButton.addEventListener(
    "click",
    stopGame
);


/*
    Overlay button.

    It can mean:

    Start Game
    Resume
    Play Again
*/

overlayButton.addEventListener(
    "click",
    function () {

        if (gameState === "paused") {

            resumeGame();

        } else {

            startGame();
        }
    }
);


/* ==========================================
   INITIAL GAME SETUP
========================================== */

loadHighScore();

initializeGame();

updateButtons();

