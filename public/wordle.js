const keyslist = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"]
];

const all_letters = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i",
  "j", "k", "l", "m", "n", "o", "p", "q", "r",
  "s", "t", "u", "v", "w", "x", "y", "z"
]

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
var letter = 0;
var chance = 0;
var guess = "";

function inputLetter(l){
  if(all_letters.includes(l.toLowerCase()) && letter < 5){
    guess += l.toLowerCase();
      document.getElementById(`row${chance}col${letter}`).innerHTML = l.toUpperCase();
    letter++;
  }
}



function backspace(){
  if(!letter) return;
  guess = guess.substring(0, letter - 1);
  document.getElementById(`row${chance}col${letter - 1}`).innerHTML = "";
  letter--;
}

for(let i = 0; i < 6; i++){
  for(let j = 0; j < 5; j++){
    let element = document.createElement("div");
    element.className = "tile";
    element.id = `row${i}col${j}`;
    board.appendChild(element);
  }
  board.innerHTML += "<br>";
}


for(let i of keyslist){
  for(let j of i){
    keyboard.innerHTML += `<button class="key" id="key_${j}" onclick="inputLetter('${j}')">${j}</button>`;
  }
  keyboard.innerHTML += "<br>";
}

