const socket = io();
var won = false;
var gameend = false;

socket.emit("regular player");


function enterKey(){
  if(gameend) return;
  socket.emit("regular_guess", guess);
}

socket.on("regular_guess_success", colors => {
  if(gameend) return;
  for(let i = 0; i < 5; i++){
    document.getElementById(`row${chance}col${i}`).className += ` ${colors[i]}-tile`;
      document.getElementById(`key_${guess[i].toUpperCase()}`).className += ` ${colors[i]}-key`;
  }
  
  if(JSON.stringify(colors) == `["green","green","green","green","green"]`){
    won = true;
    gameend = true;
    setTimeout(() => {
      confirmmodal("Correct", "You win!", ok="Play Again").then(() => {location.reload()});

      let cancelbtn = document.getElementsByClassName("cancelbtn")[0];
      cancelbtn.innerHTML = "Home";
      cancelbtn.onclick = function(){
        location.href = "/";
      };
    }, 1000);
  }
  if(chance >= 5 && !won){
    socket.emit("regular_lost"); // :(
  }
  guess = "";
  chance ++;
  letter = 0;
});


socket.on("regular_guess_error", error => {
  if(gameend) return;
  alert(error);
});

socket.on("regular_lost", word => {
  if(gameend) return;
  setTimeout(() => {
    confirmmodal("You Lose", `The word was ${word}.`, ok="Play Again").then(() => {location.reload()});

    let cancelbtn = document.getElementsByClassName("cancelbtn")[0];
    cancelbtn.innerHTML = "Home";
    cancelbtn.onclick = function(){
      location.href = "/";
    };
  }, 1000);
});

document.addEventListener("keydown", e => {
  if(gameend) return;
  if(e.key.length == 1){
    inputLetter(e.key);
  } else if(e.key == "Enter"){
    enterKey();
  } else if(e.key == "Backspace"){
    backspace();
  }
});

document.getElementById("key_Enter").addEventListener("click", enterKey);
document.getElementById("key_Backspace").addEventListener("click", backspace);