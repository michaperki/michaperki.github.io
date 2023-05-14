// knight travails

// create a board

class Board {
  constructor() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];
      for (let j = 0; j < 8; j++) {
        this.board[i][j] = new Square(i, j);
      }
    }
  }
}

// create a square

class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.parent = null;
  }
}

// create a knight

class Knight {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// create a tree of possible moves

class Tree {
  constructor() {
    this.root = null;
  }

  add(value) {
    if (this.root === null) {
      this.root = new Node(value);
    } else {
      let currentNode = this.root;
      while (currentNode) {
        if (value < currentNode.value) {
          if (!currentNode.left) {
            currentNode.left = new Node(value);
            break;
          }
          currentNode = currentNode.left;
        } else {
          if (!currentNode.right) {
            currentNode.right = new Node(value);
            break;
          }
          currentNode = currentNode.right;
        }
      }
    }
  }

  find(value) {
    if (this.root === null) return null;
    let currentNode = this.root;
    while (currentNode) {
      if (value === currentNode.value) return currentNode;
      if (value < currentNode.value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    return null;
  }

  remove(value) {
    if (this.root === null) return null;
    let currentNode = this.root;
    let parentNode = null;
    while (currentNode) {
      if (value === currentNode.value) {
        if (currentNode.right === null) {
          if (parentNode === null) {
            this.root = currentNode.left;
          } else {
            if (currentNode.value < parentNode.value) {
              parentNode.left = currentNode.left;
            } else if (currentNode.value > parentNode.value) {
              parentNode.right = currentNode.left;
            }
          }
        } else if (currentNode.right.left === null) {
          currentNode.right.left = currentNode.left;
          if (parentNode === null) {
            this.root = currentNode.right;
          } else {
            if (currentNode.value < parentNode.value) {
              parentNode.left = currentNode.right;
            } else if (currentNode.value > parentNode.value) {
              parentNode.right = currentNode.right;
            }
          }
        } else {
          let leftmost = currentNode.right.left;
          let leftmostParent = currentNode.right;
          while (leftmost.left !== null) {
            leftmostParent = leftmost;
            leftmost = leftmost.left;
          }
          leftmostParent.left = leftmost.right;
          leftmost.left = currentNode.left;
          leftmost.right = currentNode.right;
          if (parentNode === null) {
            this.root = leftmost;
          } else {
            if (currentNode.value < parentNode.value) {
              parentNode.left = leftmost;
            } else if (currentNode.value > parentNode.value) {
              parentNode.right = leftmost;
            }
          }
        }
        return true;
      }
      if (value < currentNode.value) {
        parentNode = currentNode;
        currentNode = currentNode.left;
      } else {
        parentNode = currentNode;
        currentNode = currentNode.right;
      }
    }
    return false;
  }

  // reset the tree
  reset() {
    this.root = null;
  }
}

// find the shortest path to a given square

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function findShortestPath(start, end) {
  const tree = new Tree();
  const queue = [];
  queue.push(start);
  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode.x === end.x && currentNode.y === end.y) {
      let path = [];
      let current = currentNode;
      while (current.parent) {
        path.push(current);
        current = current.parent;
      }
      path.push(current);
      return path.reverse();
    }
    currentNode.visited = true;
    const moves = getMoves(currentNode);
    for (let i = 0; i < moves.length; i++) {
      if (!moves[i].visited) {
        queue.push(moves[i]);
        moves[i].parent = currentNode;
        tree.add(moves[i]);
      }
    }
  }
}

function getMoves(square) {
  const moves = [];
  const possibleMoves = [
    [square.x + 2, square.y + 1],
    [square.x + 2, square.y - 1],
    [square.x - 2, square.y + 1],
    [square.x - 2, square.y - 1],
    [square.x + 1, square.y + 2],
    [square.x + 1, square.y - 2],
    [square.x - 1, square.y + 2],
    [square.x - 1, square.y - 2],
  ];
  for (let i = 0; i < possibleMoves.length; i++) {
    if (
      possibleMoves[i][0] >= 0 &&
      possibleMoves[i][0] < 8 &&
      possibleMoves[i][1] >= 0 &&
      possibleMoves[i][1] < 8
    ) {
      moves.push(board.board[possibleMoves[i][0]][possibleMoves[i][1]]);
    }
  }
  return moves;
}

const board = new Board();

// get the body element

const body = document.querySelector("body");

// add a prompt

const prompt = document.createElement("h1");
prompt.textContent = "Select a square to start the knight's tour";
prompt.style.textAlign = "center";
prompt.style.margin = "0px";
prompt.style.padding = "10px";
body.appendChild(prompt);

const chessboard = document.createElement("table");
chessboard.style.border = "1px solid black";
chessboard.style.borderCollapse = "collapse";

// create rows and cells of alternating colors

for (let i = 0; i < 8; i++) {
  const tr = document.createElement("tr");
  tr.classList.add("row");

  for (let j = 0; j < 8; j++) {
    const td = document.createElement("td");
    // add a class to the td element
    td.classList.add("square");
    td.style.width = "50px";
    td.style.height = "50px";
    td.style.border = "0px solid black";
    td.style.padding = "0px";
    td.style.margin = "0px";
    if ((i + j) % 2 === 0) {
      td.style.backgroundColor = "white";
    } else {
      td.style.backgroundColor = "black";
    }

    // add a click event listener to the td element
    td.addEventListener("click", function () {
        // if two squares are already selected
        if (document.querySelectorAll(".selected").length === 2) {
            // prevent the user from selecting more squares
            return;
        }


      // if the td element has a class of "selected"
      if (this.classList.contains("selected")) {
        // remove the class of "selected"
        this.classList.remove("selected");
      } else {
        // otherwise, add the class of "selected"
        this.classList.add("selected");
      }

      // if there are two squares with the class of "selected"
      if (document.querySelectorAll(".selected").length === 2) {
        // get the coordinates of the two squares
        const x1 =
          document.querySelectorAll(".selected")[0].parentNode.rowIndex;
        const y1 = document.querySelectorAll(".selected")[0].cellIndex;
        const x2 =
          document.querySelectorAll(".selected")[1].parentNode.rowIndex;
        const y2 = document.querySelectorAll(".selected")[1].cellIndex;

        // get the start and end squares
        const start = board.board[x1][y1];
        const end = board.board[x2][y2];

        // find the shortest path
        const path = findShortestPath(start, end);

        // add the path to the board
        for (let i = 0; i < path.length; i++) {
          const x = path[i].x;
          const y = path[i].y;
          chessboard.rows[x].cells[y].style.backgroundColor = "yellow";
          // if the square is not the start or end square
          if (i !== 0 && i !== path.length - 1) {
            chessboard.rows[x].cells[y].textContent = i;
          }
          // update the prompt to "The number of moves is: "
          prompt.textContent = "The number of moves is: ";

          // add a span element to the prompt
          const span = document.createElement("span");
          span.textContent = path.length - 1;
          span.style.color = "red";
          prompt.appendChild(span);
        }

        // once the tour is complete, add text below the board
        const p = document.createElement("p");
        p.textContent =
          "This concludes the knight's tour. Refresh the page to start over.";
        p.style.textAlign = "center";
        p.style.margin = "0px";
        p.style.padding = "10px";
        body.appendChild(p);
      }

      // if there is only one square with the class of "selected"
      if (document.querySelectorAll(".selected").length === 1) {
        // change the text content of the prompt to "Select a square to end the knight's tour"
        prompt.textContent = "Select a square to end the knight's tour";
      }
    });

    tr.appendChild(td);
  }
  chessboard.appendChild(tr);
}

// append a table to the body

body.appendChild(chessboard);
