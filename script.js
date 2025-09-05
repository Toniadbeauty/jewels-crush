const board = document.getElementById("gameBoard");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const width = 8;
const candies = [];
const colors = ["red", "yellow", "green", "blue", "purple", "orange"];
let score = 0;

// Special candy types
const NORMAL = "normal";
const STRIPED = "striped";
const BOMB = "bomb";

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < width * width; i++) {
    let candy = document.createElement("div");
    candy.setAttribute("draggable", true);
    candy.setAttribute("id", i);
    let color = colors[Math.floor(Math.random() * colors.length)];
    candy.style.backgroundColor = color;
    candy.classList.add("candy");
    candy.dataset.type = NORMAL;
    board.appendChild(candy);
    candies.push(candy);
  }
}
createBoard();

// Dragging
let colorBeingDragged, colorBeingReplaced, candyIdBeingDragged, candyIdBeingReplaced;

candies.forEach(candy =>
  candy.addEventListener("dragstart", dragStart)
);
candies.forEach(candy =>
  candy.addEventListener("dragend", dragEnd)
);
candies.forEach(candy =>
  candy.addEventListener("dragover", e => e.preventDefault())
);
candies.forEach(candy =>
  candy.addEventListener("dragenter", e => e.preventDefault())
);
candies.forEach(candy =>
  candy.addEventListener("drop", dragDrop)
);

function dragStart() {
  colorBeingDragged = this.style.backgroundColor;
  candyIdBeingDragged = parseInt(this.id);
  candyTypeDragged = this.dataset.type;
}

function dragDrop() {
  colorBeingReplaced = this.style.backgroundColor;
  candyIdBeingReplaced = parseInt(this.id);
  candyTypeReplaced = this.dataset.type;
}

function dragEnd() {
  const validMoves = [
    candyIdBeingDragged - 1,
    candyIdBeingDragged - width,
    candyIdBeingDragged + 1,
    candyIdBeingDragged + width
  ];
  const validMove = validMoves.includes(candyIdBeingReplaced);

  if (validMove && candyIdBeingReplaced) {
    candies[candyIdBeingReplaced].style.backgroundColor = colorBeingDragged;
    candies[candyIdBeingDragged].style.backgroundColor = colorBeingReplaced;

    candies[candyIdBeingReplaced].dataset.type = candyTypeDragged;
    candies[candyIdBeingDragged].dataset.type = candyTypeReplaced;

    checkMatches();
  } else {
    candies[candyIdBeingDragged].style.backgroundColor = colorBeingDragged;
    candies[candyIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
  }
}

// Check for matches
function checkMatches() {
  // Row of 3
  for (let i = 0; i < 61; i++) {
    let rowOfThree = [i, i+1, i+2];
    let decidedColor = candies[i].style.backgroundColor;
    let isBlank = decidedColor === "";

    if (rowOfThree.every(index => candies[index].style.backgroundColor === decidedColor && !isBlank)) {
      score += 30;
      scoreEl.innerText = score;
      // Turn middle candy into special
      candies[i+1].dataset.type = STRIPED;
      candies[i+1].style.backgroundImage = "linear-gradient(45deg, white 25%, transparent 25%, transparent 50%, white 50%, white 75%, transparent 75%, transparent)";
      rowOfThree.forEach(index => {
        if (candies[index].dataset.type !== STRIPED) candies[index].style.backgroundColor = "";
      });
    }
  }

  // Column of 3
  for (let i = 0; i < 47; i++) {
    let columnOfThree = [i, i+width, i+width*2];
    let decidedColor = candies[i].style.backgroundColor;
    let isBlank = decidedColor === "";

    if (columnOfThree.every(index => candies[index].style.backgroundColor === decidedColor && !isBlank)) {
      score += 30;
      scoreEl.innerText = score;
      // Turn middle candy into bomb
      candies[i+width].dataset.type = BOMB;
      candies[i+width].style.backgroundColor = "black";
      columnOfThree.forEach(index => {
        if (candies[index].dataset.type !== BOMB) candies[index].style.backgroundColor = "";
      });
    }
  }

  moveDown();
}

// Smooth drop logic
function moveDown() {
  for (let i = 0; i < 56; i++) {
    if (candies[i + width].style.backgroundColor === "") {
      candies[i + width].style.backgroundColor = candies[i].style.backgroundColor;
      candies[i + width].dataset.type = candies[i].dataset.type;
      candies[i].style.backgroundColor = "";
      candies[i].dataset.type = NORMAL;
    }
  }

  // Refill top row
  for (let i = 0; i < width; i++) {
    if (candies[i].style.backgroundColor === "") {
      candies[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }
  }
}

// Game loop
window.setInterval(function() {
  checkMatches();
}, 100);
