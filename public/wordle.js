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
    let key = document.createElement("button");
    key.className = "key";
    key.id = `key_${j}`;
    key.innerHTML = j;
    keyboard.appendChild(key);
    key.addEventListener("click", function(){
      alert(j)
      inputLetter(j);
    });

  }
  keyboard.innerHTML += "<br>";
}

document.addEventListener("keyup", e => {
  if(e.key.length == 1){
    inputLetter(e.key);
  } else if(e.key == "Enter"){
    socket.emit("regular_guess", guess);
  }
});