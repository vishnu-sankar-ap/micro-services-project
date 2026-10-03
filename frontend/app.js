/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   REACTION RUSH
========================================= */

let reactionStartTime = 0;
let reactionTimer = null;
let reactionWaiting = false;

const reactionTarget =
    document.getElementById("reaction-target");

const reactionMessage =
    document.getElementById("reaction-message");

const reactionStartButton =
    document.getElementById("reaction-start");


function startReaction() {

    clearTimeout(reactionTimer);

    reactionWaiting = true;

    reactionTarget.style.display = "none";

    reactionMessage.textContent =
        "Wait for it...";

    reactionStartButton.disabled = true;

    const delay =
        Math.floor(Math.random() * 3000) + 1500;

    reactionTimer = setTimeout(() => {

        reactionWaiting = false;

        reactionStartTime = performance.now();

        reactionMessage.textContent =
            "CLICK NOW!";

        reactionTarget.style.display =
            "block";

        reactionTarget.style.left =
            Math.random() * 65 + 15 + "%";

        reactionTarget.style.top =
            Math.random() * 55 + 20 + "%";

    }, delay);
}


function reactionClicked() {

    if (reactionWaiting) {

        clearTimeout(reactionTimer);

        reactionMessage.textContent =
            "Too early! Try again.";

        reactionStartButton.disabled = false;

        reactionWaiting = false;

        return;
    }

    const reactionTime =
        Math.round(
            performance.now() -
            reactionStartTime
        );

    reactionTarget.style.display = "none";

    reactionMessage.textContent =
        `Your reaction time: ${reactionTime} ms`;

    document.getElementById(
        "reaction-last"
    ).textContent =
        `${reactionTime}ms`;

    const oldBest =
        localStorage.getItem(
            "reactionBest"
        );

    if (!oldBest ||
        reactionTime < Number(oldBest)) {

        localStorage.setItem(
            "reactionBest",
            reactionTime
        );

        document.getElementById(
            "reaction-best"
        ).textContent =
            `${reactionTime}ms`;

    }

    reactionStartButton.disabled = false;
}


function loadReactionBest() {

    const best =
        localStorage.getItem(
            "reactionBest"
        );

    if (best) {

        document.getElementById(
            "reaction-best"
        ).textContent =
            `${best}ms`;

    }
}


/* =========================================
   MEMORY MATCH
========================================= */

const memorySymbols = [
    "🚀",
    "☁️",
    "🐳",
    "⚡",
    "🔥",
    "🎮",
    "💎",
    "🛸"
];

let memoryCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let memoryMoves = 0;
let memoryMatches = 0;
let memorySeconds = 0;
let memoryTimer = null;


function shuffle(array) {

    return array.sort(
        () => Math.random() - 0.5
    );

}


function startMemory() {

    clearInterval(memoryTimer);

    memoryMoves = 0;
    memoryMatches = 0;
    memorySeconds = 0;

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    document.getElementById(
        "memory-moves"
    ).textContent = "0";

    document.getElementById(
        "memory-time"
    ).textContent = "0s";

    memoryCards =
        shuffle([
            ...memorySymbols,
            ...memorySymbols
        ]);

    const board =
        document.getElementById(
            "memory-board"
        );

    board.innerHTML = "";

    memoryCards.forEach(
        (symbol, index) => {

            const card =
                document.createElement("button");

            card.className =
                "memory-card";

            card.dataset.symbol =
                symbol;

            card.dataset.index =
                index;

            card.textContent =
                symbol;

            card.addEventListener(
                "click",
                () => flipMemoryCard(card)
            );

            board.appendChild(card);

        }
    );

    memoryTimer = setInterval(() => {

        memorySeconds++;

        document.getElementById(
            "memory-time"
        ).textContent =
            `${memorySeconds}s`;

    }, 1000);
}


function flipMemoryCard(card) {

    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("flipped");

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    memoryMoves++;

    document.getElementById(
        "memory-moves"
    ).textContent =
        memoryMoves;

    checkMemoryMatch();
}


function checkMemoryMatch() {

    const match =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;

    if (match) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        memoryMatches++;

        resetMemoryTurn();

        if (memoryMatches === memorySymbols.length) {

            clearInterval(memoryTimer);

            const score =
                Math.max(
                    1000 -
                    memoryMoves * 30 -
                    memorySeconds * 10,
                    0
                );

            const oldBest =
                localStorage.getItem(
                    "memoryBest"
                );

            if (
                !oldBest ||
                score > Number(oldBest)
            ) {

                localStorage.setItem(
                    "memoryBest",
                    score
                );

                document.getElementById(
                    "memory-best"
                ).textContent =
                    score;
            }

            setTimeout(() => {

                alert(
                    `🎉 You completed Memory Match!\n\n` +
                    `Moves: ${memoryMoves}\n` +
                    `Time: ${memorySeconds}s\n` +
                    `Score: ${score}`
                );

            }, 300);

        }

        return;
    }

    lockBoard = true;

    setTimeout(() => {

        firstCard.classList.remove(
            "flipped"
        );

        secondCard.classList.remove(
            "flipped"
        );

        resetMemoryTurn();

    }, 700);
}


function resetMemoryTurn() {

    firstCard = null;
    secondCard = null;
    lockBoard = false;
}


function loadMemoryBest() {

    const best =
        localStorage.getItem(
            "memoryBest"
        );

    if (best) {

        document.getElementById(
            "memory-best"
        ).textContent =
            best;

    }
}


/* =========================================
   SNAKE
========================================= */

const canvas =
    document.getElementById(
        "snake-canvas"
    );

const ctx =
    canvas.getContext("2d");

const gridSize = 20;

const tileCount =
    canvas.width / gridSize;

let snake = [];

let snakeFood = {};

let snakeDirection = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let snakeScore = 0;

let snakeGame = null;

let snakeRunning = false;


function startSnake() {

    clearInterval(snakeGame);

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    snakeDirection = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    snakeScore = 0;

    snakeRunning = true;

    document.getElementById(
        "snake-score"
    ).textContent = "0";

    document.getElementById(
        "snake-message"
    ).textContent =
        "Use the arrow keys!";

    createSnakeFood();

    snakeGame =
        setInterval(
            updateSnake,
            110
        );

    drawSnake();
}


function createSnakeFood() {

    snakeFood = {

        x:
            Math.floor(
                Math.random() *
                tileCount
            ),

        y:
            Math.floor(
                Math.random() *
                tileCount
            )

    };

    const onSnake =
        snake.some(
            segment =>
                segment.x === snakeFood.x &&
                segment.y === snakeFood.y
        );

    if (onSnake) {

        createSnakeFood();

    }
}


function updateSnake() {

    if (!snakeRunning) {
        return;
    }

    snakeDirection =
        nextDirection;

    const head = {
        x:
            snake[0].x +
            snakeDirection.x,

        y:
            snake[0].y +
            snakeDirection.y
    };


    /* WALL COLLISION */

    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {

        endSnake();

        return;
    }


    /* SELF COLLISION */

    if (
        snake.some(
            segment =>
                segment.x === head.x &&
                segment.y === head.y
        )
    ) {

        endSnake();

        return;
    }


    snake.unshift(head);


    /* FOOD */

    if (
        head.x === snakeFood.x &&
        head.y === snakeFood.y
    ) {

        snakeScore++;

        document.getElementById(
            "snake-score"
        ).textContent =
            snakeScore;

        createSnakeFood();

    } else {

        snake.pop();

    }

    drawSnake();
}


function drawSnake() {

    ctx.fillStyle = "#050812";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* FOOD */

    ctx.fillStyle = "#ff3d81";

    ctx.beginPath();

    ctx.arc(
        snakeFood.x * gridSize + gridSize / 2,
        snakeFood.y * gridSize + gridSize / 2,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* SNAKE */

    snake.forEach(
        (segment, index) => {

            ctx.fillStyle =
                index === 0
                    ? "#00d9ff"
                    : "#7c5cff";

            ctx.fillRect(
                segment.x * gridSize + 2,
                segment.y * gridSize + 2,
                gridSize - 4,
                gridSize - 4
            );

        }
    );

}


function endSnake() {

    clearInterval(snakeGame);

    snakeRunning = false;

    document.getElementById(
        "snake-message"
    ).textContent =
        `Game Over — Score: ${snakeScore}`;

    const oldBest =
        Number(
            localStorage.getItem(
                "snakeBest"
            ) || 0
        );

    if (snakeScore > oldBest) {

        localStorage.setItem(
            "snakeBest",
            snakeScore
        );

        document.getElementById(
            "snake-best"
        ).textContent =
            snakeScore;

    }
}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (!snakeRunning) {
            return;
        }

        const key =
            event.key;

        if (
            key === "ArrowUp" &&
            snakeDirection.y !== 1
        ) {

            nextDirection = {
                x: 0,
                y: -1
            };

        }

        if (
            key === "ArrowDown" &&
            snakeDirection.y !== -1
        ) {

            nextDirection = {
                x: 0,
                y: 1
            };

        }

        if (
            key === "ArrowLeft" &&
            snakeDirection.x !== 1
        ) {

            nextDirection = {
                x: -1,
                y: 0
            };

        }

        if (
            key === "ArrowRight" &&
            snakeDirection.x !== -1
        ) {

            nextDirection = {
                x: 1,
                y: 0
            };

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

loadReactionBest();

loadMemoryBest();

startMemory();

drawSnake();