const board = document.getElementById("board");

const rows = 2;   // move back up when done testing 
const cols = 2;   // same as above ho you know how to read

const boardWidth = 1000;
const boardHeight = 800;

const pieceWidth = boardWidth / cols;
const pieceHeight = boardHeight / rows;

const imageSrc = "puzzle.png";

let placedCount = 0;
const totalPieces = rows * cols;

// -----------------------------
// Random position OUTSIDE board IMPORTANT IMPORTANT IMPORTANTTTT
// -----------------------------
function getRandomOutsideBoard() {
    const padding = 20;
    const boardRect = board.getBoundingClientRect();

    let x, y;

    while (true) {
        x = Math.random() * (window.innerWidth - pieceWidth);
        y = Math.random() * (window.innerHeight - pieceHeight);

        const insideBoard =
            x > boardRect.left - padding &&
            x < boardRect.right + padding &&
            y > boardRect.top - padding &&
            y < boardRect.bottom + padding;

        if (!insideBoard) {
            return { x, y };
        }
    }
}

// -----------------------------
// Simple jigsaw-like shape
// -----------------------------
function getJigsawClip(row, col, rows, cols) {

    const top = row === 0 ? 0 : (Math.random() > 0.5 ? 20 : -20);
    const right = col === cols - 1 ? 100 : (Math.random() > 0.5 ? 120 : 80);
    const bottom = row === rows - 1 ? 100 : (Math.random() > 0.5 ? 120 : 80);
    const left = col === 0 ? 0 : (Math.random() > 0.5 ? 20 : -20);

    return `
        polygon(
            0% ${top}%,
            ${right}% 0%,
            100% ${bottom}%,
            ${left}% 100%
        )
    `;
}

// -----------------------------
// Create pieces
// -----------------------------
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

        const piece = document.createElement("div");
        piece.classList.add("piece");

        piece.style.width = pieceWidth + "px";
        piece.style.height = pieceHeight + "px";

        // image mapping
        piece.style.backgroundImage = `url(${imageSrc})`;
        piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;

        piece.style.backgroundPosition =
            `-${col * pieceWidth}px -${row * pieceHeight}px`;

        // correct position
        const correctX = col * pieceWidth;
        const correctY = row * pieceHeight;

        piece.dataset.correctX = correctX;
        piece.dataset.correctY = correctY;

        // scatter outside board
        const pos = getRandomOutsideBoard();
        piece.style.left = pos.x + "px";
        piece.style.top = pos.y + "px";

        // jigsaw look
        const clip = getJigsawClip(row, col, rows, cols);
        piece.style.clipPath = clip;
        piece.style.webkitClipPath = clip;

        board.appendChild(piece);

        enableDrag(piece);
    }
}

// -----------------------------
// Drag logic
// -----------------------------
function enableDrag(piece) {

    let offsetX;
    let offsetY;
    let dragging = false;

    piece.addEventListener("mousedown", startDrag);

    function startDrag(e) {

        if (piece.dataset.locked) return;

        dragging = true;

        offsetX = e.clientX - piece.offsetLeft;
        offsetY = e.clientY - piece.offsetTop;

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
    }

    function drag(e) {
        if (!dragging) return;

        piece.style.left = (e.clientX - offsetX) + "px";
        piece.style.top = (e.clientY - offsetY) + "px";
    }

    function stopDrag() {

        dragging = false;

        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);

        const correctX = Number(piece.dataset.correctX);
        const correctY = Number(piece.dataset.correctY);

        const currentX = piece.offsetLeft;
        const currentY = piece.offsetTop;

        const distance = Math.hypot(
            currentX - correctX,
            currentY - correctY
        );

        if (distance < 20) {

            piece.style.left = correctX + "px";
            piece.style.top = correctY + "px";

            piece.dataset.locked = true;

            placedCount++;

            if (placedCount === totalPieces) {
                completePuzzle();
            }
        }
    }
}

// -----------------------------
// Completion
// -----------------------------
function completePuzzle() {

    const modal = document.getElementById("modal");
    modal.classList.add("show");

    document
        .getElementById("continueBtn")
        .onclick = () => {
            window.location.href =
                "https://x.com/RLTelepath/status/2062267162488627206?s=20";
        };
}
