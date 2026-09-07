
const canvas = document.getElementById("chessCanvas");
const ctx = canvas.getContext("2d");

const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const moveListEl = document.getElementById("moveList");

let gameOver = false;
let gameResult = null;


// ============================================================
// CONSTANTS
// ============================================================

const SIZE = 8;

const LIGHT = "#f0d9b5";
const DARK = "#b58863";

const HIGHLIGHT = "rgba(255, 215, 0, 0.45)";
const MOVE_DOT = "rgba(0, 0, 0, 0.28)";
const CHECK_COLOR = "rgba(220, 50, 50, 0.65)";

const PIECE_SYMBOLS = {

    white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙"
    },

    black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟"
    }
};


// ============================================================
// GAME STATE
// ============================================================

let board;

let turn;

let selected;

let legalMoves = [];

let lastMove = null;

let enPassantTarget = null;

let castleRights;

let moveHistory = [];

let gameOver = false;

let promotionState = null;


// ============================================================
// ANIMATION STATE
// ============================================================

let animation = null;

let animationFrame = null;


// ============================================================
// INITIAL BOARD
// ============================================================

function createPiece(color, type) {

    return {
        color,
        type
    };
}


function createInitialBoard() {

    const b = Array.from(
        { length: 8 },
        () => Array(8).fill(null)
    );

    const backRank = [
        "rook",
        "knight",
        "bishop",
        "queen",
        "king",
        "bishop",
        "knight",
        "rook"
    ];

    for (let col = 0; col < 8; col++) {

        b[0][col] =
            createPiece("black", backRank[col]);

        b[1][col] =
            createPiece("black", "pawn");

        b[6][col] =
            createPiece("white", "pawn");

        b[7][col] =
            createPiece("white", backRank[col]);
    }

    return b;
}


// ============================================================
// GAME RESET
// ============================================================

function resetGame() {

    board = createInitialBoard();

    turn = "white";

    selected = null;

    legalMoves = [];

    lastMove = null;

    enPassantTarget = null;

    castleRights = {
        whiteKing: true,
        blackKing: true,
        whiteKingSide: true,
        whiteQueenSide: true,
        blackKingSide: true,
        blackQueenSide: true
    };

    moveHistory = [];

    gameOver = false;

    promotionState = null;

    animation = null;

    render();

    updateStatus();

    renderMoveList();
}


// ============================================================
// BOARD DRAWING
// ============================================================

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    render();
}


function getBoardSize() {

    return canvas.clientWidth;
}


function getSquareSize() {

    return getBoardSize() / 8;
}


function drawBoard() {

    const size = getBoardSize();
    const square = size / 8;

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            ctx.fillStyle =
                (row + col) % 2 === 0
                    ? LIGHT
                    : DARK;

            ctx.fillRect(
                col * square,
                row * square,
                square,
                square
            );
        }
    }
}


// ============================================================
// HIGHLIGHTS
// ============================================================

function drawHighlights() {

    const square = getSquareSize();

    // Last move
    if (lastMove) {

        ctx.fillStyle =
            "rgba(255, 235, 59, 0.25)";

        ctx.fillRect(
            lastMove.from.col * square,
            lastMove.from.row * square,
            square,
            square
        );

        ctx.fillRect(
            lastMove.to.col * square,
            lastMove.to.row * square,
            square,
            square
        );
    }


    // Selected square
    if (selected) {

        ctx.fillStyle = HIGHLIGHT;

        ctx.fillRect(
            selected.col * square,
            selected.row * square,
            square,
            square
        );
    }


    // Legal moves
    for (const move of legalMoves) {

        const x =
            move.col * square +
            square / 2;

        const y =
            move.row * square +
            square / 2;

        const target =
            board[move.row][move.col];

        if (target) {

            ctx.strokeStyle =
                "rgba(220, 50, 50, 0.7)";

            ctx.lineWidth = 5;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                square * 0.38,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        } else {

            ctx.fillStyle = MOVE_DOT;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                square * 0.11,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }


    // Check highlight
    const king = findKing(turn);

    if (
        king &&
        isSquareAttacked(
            king.row,
            king.col,
            opposite(turn)
        )
    ) {

        ctx.fillStyle = CHECK_COLOR;

        ctx.fillRect(
            king.col * square,
            king.row * square,
            square,
            square
        );
    }
}


// ============================================================
// PIECES
// ============================================================

function drawPiece(piece, row, col, offsetX = 0, offsetY = 0) {

    const square = getSquareSize();

    const x =
        col * square +
        square / 2 +
        offsetX;

    const y =
        row * square +
        square / 2 +
        offsetY;

    const fontSize = square * 0.78;

    ctx.font =
        `${fontSize}px "Segoe UI Symbol", "Noto Sans Symbols 2", serif`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Soft shadow
    ctx.shadowColor =
        "rgba(0,0,0,0.35)";

    ctx.shadowBlur = 5;

    ctx.shadowOffsetY = 3;

    ctx.fillStyle =
        piece.color === "white"
            ? "#ffffff"
            : "#111111";

    ctx.fillText(
        PIECE_SYMBOLS[piece.color][piece.type],
        x,
        y
    );

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
}


// ============================================================
// RENDER
// ============================================================

function render() {

    const size = getBoardSize();

    if (!size) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        size,
        size
    );

    drawBoard();

    drawHighlights();


    // Draw pieces
    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = board[row][col];

            if (!piece) {
                continue;
            }

            // During movement animation,
            // don't draw the original piece.
            if (
                animation &&
                animation.from.row === row &&
                animation.from.col === col
            ) {
                continue;
            }

            drawPiece(
                piece,
                row,
                col
            );
        }
    }


    // Animated piece
    if (animation) {

        const piece = animation.piece;

        const progress =
            animation.progress;

        const eased =
            easeInOutCubic(progress);

        const row =
            animation.from.row +
            (
                animation.to.row -
                animation.from.row
            ) * eased;

        const col =
            animation.from.col +
            (
                animation.to.col -
                animation.from.col
            ) * eased;

        drawPiece(
            piece,
            row,
            col,
            0,
            0
        );
    }
}


// ============================================================
// REQUEST ANIMATION FRAME
// ============================================================

function animateMove(
    piece,
    from,
    to,
    callback
) {

    const duration = 220;

    animation = {
        piece,
        from,
        to,
        start: performance.now(),
        duration,
        progress: 0
    };

    function frame(now) {

        if (!animation) {
            return;
        }

        const elapsed =
            now - animation.start;

        animation.progress =
            Math.min(
                elapsed / animation.duration,
                1
            );

        render();

        if (animation.progress < 1) {

            animationFrame =
                requestAnimationFrame(frame);

        } else {

            animation = null;

            render();

            callback();
        }
    }

    animationFrame =
        requestAnimationFrame(frame);
}


function easeInOutCubic(t) {

    return t < 0.5
        ? 4 * t * t * t
        : 1 -
          Math.pow(-2 * t + 2, 3) / 2;
}


// ============================================================
// MOUSE / TOUCH
// ============================================================

function getSquareFromPointer(event) {

    const rect =
        canvas.getBoundingClientRect();

    const x =
        event.clientX - rect.left;

    const y =
        event.clientY - rect.top;

    const square =
        rect.width / 8;

    const col =
        Math.floor(x / square);

    const row =
        Math.floor(y / square);

    if (
        row < 0 ||
        row >= 8 ||
        col < 0 ||
        col >= 8
    ) {
        return null;
    }

    return {
        row,
        col
    };
}


canvas.addEventListener(
    "pointerdown",
    handlePointer
);


function handlePointer(event) {

    if (
        gameOver ||
        promotionState ||
        animation
    ) {
        return;
    }

    const square =
        getSquareFromPointer(event);

    if (!square) {
        return;
    }

    handleSquare(square.row, square.col);
}


// ============================================================
// SQUARE CLICK
// ============================================================

function handleSquare(row, col) {

    const piece =
        board[row][col];


    // Select own piece
    if (!selected) {

        if (
            piece &&
            piece.color === turn
        ) {

            selected = {
                row,
                col
            };

            legalMoves =
                getLegalMoves(
                    row,
                    col
                );

            render();
        }

        return;
    }


    // Clicking another own piece
    if (
        piece &&
        piece.color === turn
    ) {

        selected = {
            row,
            col
        };

        legalMoves =
            getLegalMoves(
                row,
                col
            );

        render();

        return;
    }


    // Try move
    const move =
        legalMoves.find(
            m =>
                m.row === row &&
                m.col === col
        );

    if (!move) {

        selected = null;
        legalMoves = [];

        render();

        return;
    }

    executeMove(
        selected,
        move
    );
}


// ============================================================
// MOVE EXECUTION
// ============================================================

function executeMove(from, to) {

    const piece =
        board[from.row][from.col];

    const moveData =
        createMoveData(
            from,
            to,
            piece
        );


    // Make move temporarily
    applyMove(moveData);


    // Animate the normal move
    const movingPiece =
        board[to.row][to.col];

    // Restore animation source representation
    board[to.row][to.col] = null;

    selected = null;
    legalMoves = [];

    animateMove(
        movingPiece,
        from,
        to,
        () => {

            board[to.row][to.col] =
                movingPiece;

            finishMove(moveData);
        }
    );
}


// ============================================================
// MOVE DATA
// ============================================================

function createMoveData(
    from,
    to,
    piece
) {

    return {

        from: { ...from },

        to: { ...to },

        piece,

        captured:
            board[to.row][to.col],

        promotion: null,

        castle: false,

        enPassant: false
    };
}


// ============================================================
// APPLY MOVE
// ============================================================

function applyMove(move) {

    const {
        from,
        to,
        piece
    } = move;


    // En passant
    if (
        piece.type === "pawn" &&
        enPassantTarget &&
        to.row === enPassantTarget.row &&
        to.col === enPassantTarget.col &&
        !board[to.row][to.col]
    ) {

        move.enPassant = true;

        const capturedRow =
            piece.color === "white"
                ? to.row + 1
                : to.row - 1;

        move.captured =
            board[capturedRow][to.col];

        board[capturedRow][to.col] =
            null;
    }


    // Castling
    if (
        piece.type === "king" &&
        Math.abs(to.col - from.col) === 2
    ) {

        move.castle = true;

        const rookFromCol =
            to.col > from.col
                ? 7
                : 0;

        const rookToCol =
            to.col > from.col
                ? 5
                : 3;

        board[to.row][rookToCol] =
            board[to.row][rookFromCol];

        board[to.row][rookFromCol] =
            null;
    }


    board[to.row][to.col] =
        board[from.row][from.col];

    board[from.row][from.col] =
        null;


    // Promotion
    if (
        piece.type === "pawn" &&
        (to.row === 0 || to.row === 7)
    ) {

        move.promotion = "queen";
    }
}


// ============================================================
// FINISH MOVE
// ============================================================

function finishMove(move) {

    const piece =
        board[move.to.row][move.to.col];


    // Promotion
    if (move.promotion) {

        promotionState = {
            row: move.to.row,
            col: move.to.col,
            piece
        };

        drawPromotionUI();

        return;
    }


    completeMove(move);
}


// ============================================================
// COMPLETE MOVE
// ============================================================

function completeMove(move) {

    const piece =
        board[move.to.row][move.to.col];


    // Update castling rights
    updateCastleRights(
        move,
        piece
    );


    // En passant target
    enPassantTarget = null;

    if (
        piece.type === "pawn" &&
        Math.abs(
            move.to.row -
            move.from.row
        ) === 2
    ) {

        enPassantTarget = {

            row:
                (
                    move.from.row +
                    move.to.row
                ) / 2,

            col:
                move.from.col
        };
    }


    lastMove = move;


    moveHistory.push({
        color: piece.color,
        notation: createNotation(move)
    });


    turn = opposite(turn);


    renderMoveList();

    updateStatus();

    render();


    // Checkmate / stalemate
    const moves =
        getAllLegalMoves(turn);

    if (moves.length === 0) {

        const king =
            findKing(turn);

        const inCheck =
            isSquareAttacked(
                king.row,
                king.col,
                opposite(turn)
            );

        gameOver = true;

        if (inCheck) {

            statusEl.textContent =
                `${capitalize(opposite(turn))} wins by checkmate!`;

        } else {

            statusEl.textContent =
                "Draw by stalemate.";
        }
    }
}


// ============================================================
// PROMOTION UI
// ============================================================

function drawPromotionUI() {

    render();

    const size = getBoardSize();
    const square = size / 8;

    const row =
        promotionState.row;

    const col =
        promotionState.col;

    const pieces = [
        "queen",
        "rook",
        "bishop",
        "knight"
    ];


    ctx.fillStyle =
        "rgba(0,0,0,0.72)";

    ctx.fillRect(
        0,
        0,
        size,
        size
    );


    ctx.fillStyle = "#fff";

    ctx.font =
        `${square * 0.3}px sans-serif`;

    ctx.textAlign = "center";

    ctx.fillText(
        "Choose promotion",
        size / 2,
        size * 0.15
    );


    pieces.forEach(
        (type, index) => {

            const x =
                size / 2 +
                (
                    index - 1.5
                ) * square;

            const y =
                size / 2;

            ctx.fillStyle =
                "#fff";

            ctx.beginPath();

            ctx.roundRect(
                x - square * 0.35,
                y - square * 0.35,
                square * 0.7,
                square * 0.7,
                12
            );

            ctx.fill();

            ctx.fillStyle =
                "#111";

            ctx.font =
                `${square * 0.55}px serif`;

            ctx.fillText(
                PIECE_SYMBOLS[
                    promotionState.piece.color
                ][type],
                x,
                y + square * 0.18
            );
        }
    );
}


canvas.addEventListener(
    "pointerdown",
    handlePromotionClick
);


function handlePromotionClick(event) {

    if (!promotionState) {
        return;
    }

    const rect =
        canvas.getBoundingClientRect();

    const x =
        event.clientX - rect.left;

    const size =
        rect.width;

    const square =
        size / 8;

    const center =
        size / 2;

    const index =
        Math.floor(
            (
                x -
                (
                    center -
                    1.5 * square
                )
            ) / square
        );

    const choices = [
        "queen",
        "rook",
        "bishop",
        "knight"
    ];

    if (
        index < 0 ||
        index >= choices.length
    ) {
        return;
    }

    const chosen =
        choices[index];

    promotionState.piece.type =
        chosen;

    const fakeMove = {
        ...lastMove
    };

    promotionState = null;

    completeMove(fakeMove);
}


// ============================================================
// LEGAL MOVE GENERATION
// ============================================================

function getLegalMoves(row, col) {

    const piece =
        board[row][col];

    if (!piece) {
        return [];
    }

    const pseudoMoves =
        getPseudoMoves(
            row,
            col,
            piece
        );

    const legal = [];

    for (const move of pseudoMoves) {

        const snapshot =
            cloneBoard(board);

        const oldEnPassant =
            enPassantTarget;

        const oldCastle =
            JSON.parse(
                JSON.stringify(castleRights)
            );

        const moveData =
            createMoveData(
                { row, col },
                move,
                piece
            );

        applyMove(moveData);

        const king =
            findKing(piece.color);

        const inCheck =
            !king ||
            isSquareAttacked(
                king.row,
                king.col,
                opposite(piece.color)
            );

        board = snapshot;

        enPassantTarget =
            oldEnPassant;

        castleRights =
            oldCastle;

        if (!inCheck) {

            legal.push(move);
        }
    }

    return legal;
}


// ============================================================
// PSEUDO MOVES
// ============================================================

function getPseudoMoves(
    row,
    col,
    piece
) {

    switch (piece.type) {

        case "pawn":
            return pawnMoves(
                row,
                col,
                piece
            );

        case "knight":
            return knightMoves(
                row,
                col,
                piece
            );

        case "bishop":
            return slidingMoves(
                row,
                col,
                piece,
                [
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1]
                ]
            );

        case "rook":
            return slidingMoves(
                row,
                col,
                piece,
                [
                    [-1, 0],
                    [1, 0],
                    [0, -1],
                    [0, 1]
                ]
            );

        case "queen":
            return slidingMoves(
                row,
                col,
                piece,
                [
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1],
                    [-1, 0],
                    [1, 0],
                    [0, -1],
                    [0, 1]
                ]
            );

        case "king":
            return kingMoves(
                row,
                col,
                piece
            );

        default:
            return [];
    }
}


// ============================================================
// PAWN
// ============================================================

function pawnMoves(row, col, piece) {

    const moves = [];

    const direction =
        piece.color === "white"
            ? -1
            : 1;

    const startRow =
        piece.color === "white"
            ? 6
            : 1;


    // Forward one
    const one =
        row + direction;

    if (
        inside(one, col) &&
        !board[one][col]
    ) {

        moves.push({
            row: one,
            col
        });


        // Forward two
        const two =
            row +
            direction * 2;

        if (
            row === startRow &&
            !board[two][col]
        ) {

            moves.push({
                row: two,
                col
            });
        }
    }


    // Captures
    for (
        const dc of [-1, 1]
    ) {

        const nr =
            row + direction;

        const nc =
            col + dc;

        if (!inside(nr, nc)) {
            continue;
        }

        const target =
            board[nr][nc];

        if (
            target &&
            target.color !== piece.color
        ) {

            moves.push({
                row: nr,
                col: nc
            });
        }


        // En passant
        if (
            enPassantTarget &&
            enPassantTarget.row === nr &&
            enPassantTarget.col === nc
        ) {

            moves.push({
                row: nr,
                col: nc
            });
        }
    }

    return moves;
}


// ============================================================
// KNIGHT
// ============================================================

function knightMoves(
    row,
    col,
    piece
) {

    const moves = [];

    const jumps = [

        [-2, -1],
        [-2, 1],

        [-1, -2],
        [-1, 2],

        [1, -2],
        [1, 2],

        [2, -1],
        [2, 1]
    ];

    for (const [dr, dc] of jumps) {

        const nr = row + dr;
        const nc = col + dc;

        if (!inside(nr, nc)) {
            continue;
        }

        const target =
            board[nr][nc];

        if (
            !target ||
            target.color !== piece.color
        ) {

            moves.push({
                row: nr,
                col: nc
            });
        }
    }

    return moves;
}


// ============================================================
// SLIDING PIECES
// ============================================================

function slidingMoves(
    row,
    col,
    piece,
    directions
) {

    const moves = [];

    for (
        const [dr, dc]
        of directions
    ) {

        let nr = row + dr;
        let nc = col + dc;

        while (
            inside(nr, nc)
        ) {

            const target =
                board[nr][nc];

            if (!target) {

                moves.push({
                    row: nr,
                    col: nc
                });

            } else {

                if (
                    target.color !==
                    piece.color
                ) {

                    moves.push({
                        row: nr,
                        col: nc
                    });
                }

                break;
            }

            nr += dr;
            nc += dc;
        }
    }

    return moves;
}


// ============================================================
// KING
// ============================================================

function kingMoves(
    row,
    col,
    piece
) {

    const moves = [];

    for (
        let dr = -1;
        dr <= 1;
        dr++
    ) {

        for (
            let dc = -1;
            dc <= 1;
            dc++
        ) {

            if (
                dr === 0 &&
                dc === 0
            ) {
                continue;
            }

            const nr = row + dr;
            const nc = col + dc;

            if (!inside(nr, nc)) {
                continue;
            }

            const target =
                board[nr][nc];

            if (
                !target ||
                target.color !==
                piece.color
            ) {

                moves.push({
                    row: nr,
                    col: nc
                });
            }
        }
    }


    // Castling
    const enemy =
        opposite(piece.color);


    // King side
    if (
        canCastleKingSide(
            piece.color
        )
    ) {

        moves.push({
            row,
            col: col + 2
        });
    }


    // Queen side
    if (
        canCastleQueenSide(
            piece.color
        )
    ) {

        moves.push({
            row,
            col: col - 2
        });
    }

    return moves;
}


// ============================================================
// CASTLING
// ============================================================

function canCastleKingSide(color) {

    const row =
        color === "white"
            ? 7
            : 0;

    const rights =
        color === "white"
            ? castleRights.whiteKingSide
            : castleRights.blackKingSide;

    if (!rights) {
        return false;
    }

    const king =
        board[row][4];

    const rook =
        board[row][7];

    if (
        !king ||
        king.type !== "king" ||
        king.color !== color
    ) {
        return false;
    }

    if (
        !rook ||
        rook.type !== "rook" ||
        rook.color !== color
    ) {
        return false;
    }

    if (
        board[row][5] ||
        board[row][6]
    ) {
        return false;
    }

    if (
        isSquareAttacked(
            row,
            4,
            opposite(color)
        ) ||
        isSquareAttacked(
            row,
            5,
            opposite(color)
        ) ||
        isSquareAttacked(
            row,
            6,
            opposite(color)
        )
    ) {
        return false;
    }

    return true;
}


function canCastleQueenSide(color) {

    const row =
        color === "white"
            ? 7
            : 0;

    const rights =
        color === "white"
            ? castleRights.whiteQueenSide
            : castleRights.blackQueenSide;

    if (!rights) {
        return false;
    }

    const king =
        board[row][4];

    const rook =
        board[row][0];

    if (
        !king ||
        king.type !== "king" ||
        king.color !== color
    ) {
        return false;
    }

    if (
        !rook ||
        rook.type !== "rook" ||
        rook.color !== color
    ) {
        return false;
    }

    if (
        board[row][1] ||
        board[row][2] ||
        board[row][3]
    ) {
        return false;
    }

    if (
        isSquareAttacked(
            row,
            4,
            opposite(color)
        ) ||
        isSquareAttacked(
            row,
            3,
            opposite(color)
        ) ||
        isSquareAttacked(
            row,
            2,
            opposite(color)
        )
    ) {
        return false;
    }

    return true;
}


// ============================================================
// ATTACK DETECTION
// ============================================================

function isSquareAttacked(
    row,
    col,
    byColor
) {

    // Pawns
    const pawnDirection =
        byColor === "white"
            ? 1
            : -1;

    for (
        const dc of [-1, 1]
    ) {

        const r =
            row + pawnDirection;

        const c =
            col + dc;

        if (!inside(r, c)) {
            continue;
        }

        const piece =
            board[r][c];

        if (
            piece &&
            piece.color === byColor &&
            piece.type === "pawn"
        ) {
            return true;
        }
    }


    // Knights
    const knightOffsets = [

        [-2, -1],
        [-2, 1],

        [-1, -2],
        [-1, 2],

        [1, -2],
        [1, 2],

        [2, -1],
        [2, 1]
    ];

    for (
        const [dr, dc]
        of knightOffsets
    ) {

        const r = row + dr;
        const c = col + dc;

        if (!inside(r, c)) {
            continue;
        }

        const piece =
            board[r][c];

        if (
            piece &&
            piece.color === byColor &&
            piece.type === "knight"
        ) {
            return true;
        }
    }


    // Rooks / Queens
    const straight = [

        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    if (
        rayAttacked(
            row,
            col,
            byColor,
            straight,
            ["rook", "queen"]
        )
    ) {
        return true;
    }


    // Bishops / Queens
    const diagonal = [

        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];

    if (
        rayAttacked(
            row,
            col,
            byColor,
            diagonal,
            ["bishop", "queen"]
        )
    ) {
        return true;
    }


    // Enemy king
    for (
        let dr = -1;
        dr <= 1;
        dr++
    ) {

        for (
            let dc = -1;
            dc <= 1;
            dc++
        ) {

            if (
                dr === 0 &&
                dc === 0
            ) {
                continue;
            }

            const r = row + dr;
            const c = col + dc;

            if (!inside(r, c)) {
                continue;
            }

            const piece =
                board[r][c];

            if (
                piece &&
                piece.color === byColor &&
                piece.type === "king"
            ) {
                return true;
            }
        }
    }

    return false;
}


function rayAttacked(
    row,
    col,
    color,
    directions,
    types
) {

    for (
        const [dr, dc]
        of directions
    ) {

        let r = row + dr;
        let c = col + dc;

        while (
            inside(r, c)
        ) {

            const piece =
                board[r][c];

            if (piece) {

                if (
                    piece.color === color &&
                    types.includes(piece.type)
                ) {
                    return true;
                }

                break;
            }

            r += dr;
            c += dc;
        }
    }

    return false;
}


// ============================================================
// KING FINDER
// ============================================================

function findKing(color) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                board[row][col];

            if (
                piece &&
                piece.color === color &&
                piece.type === "king"
            ) {

                return {
                    row,
                    col
                };
            }
        }
    }

    return null;
}


// ============================================================
// ALL LEGAL MOVES
// ============================================================

function getAllLegalMoves(color) {

    const moves = [];

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                board[row][col];

            if (
                !piece ||
                piece.color !== color
            ) {
                continue;
            }

            const pieceMoves =
                getLegalMoves(
                    row,
                    col
                );

            for (
                const move
                of pieceMoves
            ) {

                moves.push({
                    from: {
                        row,
                        col
                    },
                    to: move
                });
            }
        }
    }

    return moves;
}


// ============================================================
// CASTLING RIGHTS
// ============================================================

function updateCastleRights(
    move,
    piece
) {

    if (piece.type === "king") {

        if (piece.color === "white") {

            castleRights.whiteKing = false;

            castleRights.whiteKingSide = false;
            castleRights.whiteQueenSide = false;

        } else {

            castleRights.blackKing = false;

            castleRights.blackKingSide = false;
            castleRights.blackQueenSide = false;
        }
    }


    if (piece.type === "rook") {

        if (
            piece.color === "white"
        ) {

            if (
                move.from.row === 7 &&
                move.from.col === 0
            ) {
                castleRights.whiteQueenSide =
                    false;
            }

            if (
                move.from.row === 7 &&
                move.from.col === 7
            ) {
                castleRights.whiteKingSide =
                    false;
            }

        } else {

            if (
                move.from.row === 0 &&
                move.from.col === 0
            ) {
                castleRights.blackQueenSide =
                    false;
            }

            if (
                move.from.row === 0 &&
                move.from.col === 7
            ) {
                castleRights.blackKingSide =
                    false;
            }
        }
    }


    // Capturing a rook also removes its
    // castling right.
    const captured =
        move.captured;

    if (
        captured &&
        captured.type === "rook"
    ) {

        if (
            move.to.row === 7 &&
            move.to.col === 0
        ) {
            castleRights.whiteQueenSide =
                false;
        }

        if (
            move.to.row === 7 &&
            move.to.col === 7
        ) {
            castleRights.whiteKingSide =
                false;
        }

        if (
            move.to.row === 0 &&
            move.to.col === 0
        ) {
            castleRights.blackQueenSide =
                false;
        }

        if (
            move.to.row === 0 &&
            move.to.col === 7
        ) {
            castleRights.blackKingSide =
                false;
        }
    }
}


// ============================================================
// NOTATION
// ============================================================

function createNotation(move) {

    const piece =
        move.piece;

    const letters = {
        pawn: "",
        knight: "N",
        bishop: "B",
        rook: "R",
        queen: "Q",
        king: "K"
    };

    if (
        piece.type === "king" &&
        Math.abs(
            move.to.col -
            move.from.col
        ) === 2
    ) {

        return move.to.col > move.from.col
            ? "O-O"
            : "O-O-O";
    }

    const destination =
        squareName(
            move.to.row,
            move.to.col
        );

    const capture =
        move.captured ||
        move.enPassant
            ? "x"
            : "";

    return (
        letters[piece.type] +
        capture +
        destination
    );
}


function squareName(row, col) {

    const files =
        "abcdefgh";

    return (
        files[col] +
        (8 - row)
    );
}


// ============================================================
// MOVE LIST
// ============================================================

function renderMoveList() {

    moveListEl.innerHTML = "";

    for (
        let i = 0;
        i < moveHistory.length;
        i += 2
    ) {

        const row =
            document.createElement("div");

        row.className =
            "move-row";

        const number =
            document.createElement("span");

        number.textContent =
            `${i / 2 + 1}.`;

        const white =
            document.createElement("span");

        white.textContent =
            moveHistory[i]
                ?.notation || "";

        const black =
            document.createElement("span");

        black.textContent =
            moveHistory[i + 1]
                ?.notation || "";

        row.append(
            number,
            white,
            black
        );

        moveListEl.appendChild(row);
    }
}


// ============================================================
// STATUS
// ============================================================

function updateStatus() {

    if (gameOver) {
        return;
    }

    const king =
        findKing(turn);

    const check =
        king &&
        isSquareAttacked(
            king.row,
            king.col,
            opposite(turn)
        );

    statusEl.textContent =
        `${capitalize(turn)} to move` +
        (check ? " — Check!" : "");
}


// ============================================================
// HELPERS
// ============================================================

function opposite(color) {

    return color === "white"
        ? "black"
        : "white";
}


function capitalize(value) {

    return value[0].toUpperCase() +
        value.slice(1);
}


function inside(row, col) {

    return (
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8
    );
}


function cloneBoard(source) {

    return source.map(
        row =>
            row.map(
                piece =>
                    piece
                        ? { ...piece }
                        : null
            )
    );
}

function completeMove(move) {

    const piece =
        board[move.to.row][move.to.col];

    // --------------------------------------------------------
    // PROMOTION
    // --------------------------------------------------------

    if (move.promotion) {

        promotionState = {
            row: move.to.row,
            col: move.to.col,
            piece
        };

        render();
        drawPromotionUI();

        return;
    }


    // --------------------------------------------------------
    // CASTLING RIGHTS
    // --------------------------------------------------------

    updateCastleRights(
        move,
        piece
    );


    // --------------------------------------------------------
    // EN PASSANT TARGET
    // --------------------------------------------------------

    enPassantTarget = null;

    if (
        piece.type === "pawn" &&
        Math.abs(
            move.to.row -
            move.from.row
        ) === 2
    ) {

        enPassantTarget = {

            row:
                (
                    move.from.row +
                    move.to.row
                ) / 2,

            col:
                move.from.col
        };
    }


    // --------------------------------------------------------
    // SAVE LAST MOVE
    // --------------------------------------------------------

    lastMove = {
        from: { ...move.from },
        to: { ...move.to }
    };


    // --------------------------------------------------------
    // SAVE MOVE HISTORY
    // --------------------------------------------------------

    moveHistory.push({
        color: piece.color,
        notation: createNotation(move)
    });


    // --------------------------------------------------------
    // SWITCH TURN
    // --------------------------------------------------------

    turn = opposite(turn);


    // --------------------------------------------------------
    // UPDATE UI
    // --------------------------------------------------------

    selected = null;
    legalMoves = [];

    renderMoveList();

    checkGameState();
}

function checkGameState() {

    const king =
        findKing(turn);

    /*
     * A valid chess position must always contain
     * the side-to-move king.
     */
    if (!king) {
        return;
    }


    // --------------------------------------------------------
    // IS THE KING IN CHECK?
    // --------------------------------------------------------

    const inCheck =
        isSquareAttacked(
            king.row,
            king.col,
            opposite(turn)
        );


    // --------------------------------------------------------
    // FIND EVERY LEGAL MOVE
    // --------------------------------------------------------

    const availableMoves =
        getAllLegalMoves(turn);


    // --------------------------------------------------------
    // CHECKMATE
    // --------------------------------------------------------

    if (
        inCheck &&
        availableMoves.length === 0
    ) {

        gameOver = true;

        gameResult = {
            type: "checkmate",
            winner: opposite(turn),
            loser: turn
        };

        selected = null;
        legalMoves = [];

        statusEl.textContent =
            `${capitalize(opposite(turn))} wins by checkmate!`;

        render();

        drawGameOverOverlay();

        return;
    }


    // --------------------------------------------------------
    // STALEMATE
    // --------------------------------------------------------

    if (
        !inCheck &&
        availableMoves.length === 0
    ) {

        gameOver = true;

        gameResult = {
            type: "stalemate"
        };

        selected = null;
        legalMoves = [];

        statusEl.textContent =
            "Draw — Stalemate";

        render();

        drawGameOverOverlay();

        return;
    }


    // --------------------------------------------------------
    // NORMAL GAME
    // --------------------------------------------------------

    gameOver = false;
    gameResult = null;

    if (inCheck) {

        statusEl.textContent =
            `${capitalize(turn)} to move — CHECK!`;

    } else {

        statusEl.textContent =
            `${capitalize(turn)} to move`;
    }

    render();
}


function drawGameOverOverlay() {

    if (!gameOver || !gameResult) {
        return;
    }

    const size =
        getBoardSize();

    // Dark translucent overlay
    ctx.fillStyle =
        "rgba(0, 0, 0, 0.68)";

    ctx.fillRect(
        0,
        0,
        size,
        size
    );


    // Panel
    const panelWidth =
        size * 0.72;

    const panelHeight =
        size * 0.32;

    const panelX =
        (size - panelWidth) / 2;

    const panelY =
        (size - panelHeight) / 2;


    ctx.fillStyle =
        "rgba(20, 20, 20, 0.96)";

    ctx.beginPath();

    ctx.roundRect(
        panelX,
        panelY,
        panelWidth,
        panelHeight,
        18
    );

    ctx.fill();


    // Border
    ctx.strokeStyle =
        "rgba(255, 255, 255, 0.14)";

    ctx.lineWidth = 2;

    ctx.stroke();


    // Main title
    ctx.fillStyle =
        "#ffffff";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.font =
        `bold ${size * 0.075}px system-ui`;


    if (
        gameResult.type === "checkmate"
    ) {

        ctx.fillText(
            "CHECKMATE",
            size / 2,
            panelY + panelHeight * 0.34
        );


        ctx.font =
            `${size * 0.038}px system-ui`;

        ctx.fillStyle =
            "rgba(255,255,255,0.72)";

        ctx.fillText(
            `${capitalize(gameResult.winner)} wins`,
            size / 2,
            panelY + panelHeight * 0.58
        );


        ctx.font =
            `${size * 0.026}px system-ui`;

        ctx.fillStyle =
            "rgba(255,255,255,0.45)";

        ctx.fillText(
            "Press New Game to play again",
            size / 2,
            panelY + panelHeight * 0.78
        );

    } else {

        ctx.fillText(
            "STALEMATE",
            size / 2,
            panelY + panelHeight * 0.34
        );


        ctx.font =
            `${size * 0.038}px system-ui`;

        ctx.fillStyle =
            "rgba(255,255,255,0.72)";

        ctx.fillText(
            "Draw",
            size / 2,
            panelY + panelHeight * 0.58
        );


        ctx.font =
            `${size * 0.026}px system-ui`;

        ctx.fillStyle =
            "rgba(255,255,255,0.45)";

        ctx.fillText(
            "Press New Game to play again",
            size / 2,
            panelY + panelHeight * 0.78
        );
    }
}
function resetGame() {

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    board = createInitialBoard();

    turn = "white";

    selected = null;

    legalMoves = [];

    lastMove = null;

    enPassantTarget = null;

    castleRights = {
        whiteKing: true,
        blackKing: true,

        whiteKingSide: true,
        whiteQueenSide: true,

        blackKingSide: true,
        blackQueenSide: true
    };

    moveHistory = [];

    gameOver = false;

    gameResult = null;

    promotionState = null;

    animation = null;

    statusEl.textContent =
        "White to move";

    renderMoveList();

    render();
}





// ============================================================
// EVENTS
// ============================================================

restartBtn.addEventListener(
    "click",
    resetGame
);

window.addEventListener(
    "resize",
    resizeCanvas
);


// ============================================================
// START
// ============================================================

resetGame();

resizeCanvas();

