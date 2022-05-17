const socket = io();

socket.emit("regular player");


function enterKey(){
  socket.emit("regular_guess", guess);
}

socket.on("regular_guess_success", colors => {
  for(let i = 0; i < 5; i++){
    document.getElementById(`row${chance}col${i}`).className += " " + colors[i];
      document.getElementById(`key_${guess[i].toUpperCase()}`).className += " " + colors[i];
  }
  if(chance >= 5){
    socket.emit("regular_lost"); // :(
  }
  guess = "";
  chance ++;
  letter = 0;
});


socket.on("regular_guess_error", error => {
  alert(error);
});

socket.on("regular_lost", word => {
  setTimeout(() => {
    alertmodal("", "The word was: " + word).then(() => {location.reload()});
  }, 1000)
})

document.addEventListener("keydown", e => {
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