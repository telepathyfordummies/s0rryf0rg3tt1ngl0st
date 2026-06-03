const board = document.getElementById("board");

const rows = 8;
const cols = 10;

const boardWidth = 1000;
const boardHeight = 800;

const pieceWidth = boardWidth / cols;
const pieceHeight = boardHeight / rows;

const imageSrc = "puzzle.png";

let placedCount = 0;
const totalPieces = rows * cols;

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

        const piece = document.createElement("div");

        piece.classList.add("piece");

        piece.style.width = pieceWidth + "px";
        piece.style.height = pieceHeight + "px";

        piece.style.backgroundImage = `url(${imageSrc})`;
        piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;

        piece.style.backgroundPosition =
            `-${col * pieceWidth}px -${row * pieceHeight}px`;

        const correctX = col * pieceWidth;
        const correctY = row * pieceHeight;

        piece.dataset.correctX = correctX;
        piece.dataset.correctY = correctY;

        piece.style.left =
            Math.random() * (boardWidth - pieceWidth) + "px";

        piece.style.top =
            Math.random() * (boardHeight - pieceHeight) + "px";

        board.appendChild(piece);

        enableDrag(piece);
    }
}

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

function completePuzzle() {

    const modal = document.getElementById("modal");

    modal.classList.remove("hidden");

    document
        .getElementById("continueBtn")
        .addEventListener("click", () => {

            window.location.href =
                "https://YOUR-WEBSITE-HERE.com";

        });
}
