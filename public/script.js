const socket = io();

let name = localStorage.getItem("name");
const input = document.getElementById("input");

if(name){
  input.value = name;
}

function playWithAnyone(){
  socket.emit("name", input.value, "anyone");
}

function privateGame(){
  socket.emit("name", input.value, "private");
}


socket.on("name", (res, type) => {
  if(res != true){
    localStorage.setItem("name", res);
  }

  if(type == "anyone"){
    socket.emit("waiting", localStorage.getItem("name"));
  } else {
    socket.emit("privateGame");
  }
});

socket.on("gamecode", code => {
  location.href = `/game/${code}`;
});