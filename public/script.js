/* 

 __  __ _   _ _   _____ ___ ____  _        _ __   _______ ____  
|  \/  | | | | | |_   _|_ _|  _ \| |      / \\ \ / / ____|  _ \ 
| |\/| | | | | |   | |  | || |_) | |     / _ \\ V /|  _| | |_) |
| |  | | |_| | |___| |  | ||  __/| |___ / ___ \| | | |___|  _ < 
|_|  |_|\___/|_____|_| |___|_|   |_____/_/   \_\_| |_____|_| \_\
                                                                
__        _____  ____  ____  _     _____ 
\ \      / / _ \|  _ \|  _ \| |   | ____|
 \ \ /\ / / | | | |_) | | | | |   |  _|  
  \ V  V /| |_| |  _ <| |_| | |___| |___ 
   \_/\_/  \___/|_| \_\____/|_____|_____|

*/

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