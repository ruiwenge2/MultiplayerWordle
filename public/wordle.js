const keyboard = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"]
];

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");

for(let i = 0; i < 6; i++){
  for(let j = 0; j < 5; j++){
    let element = document.createElement("div");
    element.className = "tile";
    board.appendChild(element);
    element.innerHTML = "<span>A</span>";
    element.id = `row${i}col${j}`;
  }
  board.innerHTML += "<br>";
}

