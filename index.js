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

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { getGuesses, getAnswers } = require("./words");

app.use(express.static("public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

const currentwords = {};
const waitingList = [];
const rooms = {};

global.guesses = [];
global.answers = [];


function random(num1, num2){
  return Math.round(Math.random() * (num2 - num1)) + num1;
};

function generateCode(){
  const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var code = "";
  for(i = 0; i < 10; i++){
    code += characters[random(0, characters.length - 1)];
  }
  return code;
};

function getWord(){
  return answers[random(0, answers.length - 1)];
}

function makeLetterCount(guess){
  count = {};
  for(let i of guess){
    if(Object.keys(count).includes(i)){
      count[i] ++;
    } else {
      count[i] = 1;
    }
  }
  return count;
}

function checkGuess(guess, word){
  let colors = [];
  let count = makeLetterCount(guess);
  let letter_count = makeLetterCount(word);
  for(let i = 0; i < 5; i++){
    if(guess[i] == word[i]){
      colors.push("green");
    } else if(word.includes(guess[i])){
      if(count[guess[i]] > letter_count[guess[i]] && letter_count[guess[i]] > 0){
        colors.push("gray");
        count[guess[i]] -= 1;
      } else {
        colors.push("yellow");
      }
    } else {
      colors.push("gray");
    }
  }
  return colors;
}

getGuesses().then(guesses => {
  global.guesses = guesses;
});

getAnswers().then(answers => {
  global.answers = answers;
});

io.on("connection", socket => {

  // regular wordle
  socket.on("regular player", () => {
    currentwords[socket.id] = getWord();
    console.log(currentwords);
  });

  socket.on("regular_guess", guess => {
    if(!Object.keys(currentwords).includes(socket.id)){
      socket.emit("disconnected");
    }
    if(typeof guess != "string" || guess.length > 5 || !Object.keys(currentwords).includes(socket.id)) return;
    if(guess.length < 5){
      socket.emit("regular_guess_error", "Not enough letters.");
      return;
    }
    if(!guesses.includes(guess)){
      socket.emit("regular_guess_error", "Not in word list.");
      return;
    }
    socket.emit("regular_guess_success", checkGuess(guess, currentwords[socket.id]));
  });

  socket.on("regular_lost", () => {
    if(!Object.keys(currentwords).includes(socket.id)) return;
    socket.emit("regular_lost", currentwords[socket.id]);
  });
  
  socket.on("name", (name, type) => {
    if(!name.replace(/\s/g, "")){
      socket.emit("name", `Player_${random(1000, 9999)}`, type);
    } else {
      socket.emit("name", true, type);
    }
  });

  // play with anyone
  socket.on("waiting", name => {
    waitingList.push(socket.id);
    console.log(`${name} is waiting`);
  });

  socket.on("privateGame", () => {
    let code = generateCode();
    while(Object.keys(rooms).includes(code)){
      code = generateCode();
    }
    rooms[code] = {};
    socket.emit("gamecode", code);
  });

  socket.on("joinRoom", () => {
    
  });

  socket.on("disconnect", () => {
    if(Object.keys(currentwords).includes(socket.id)){
      delete currentwords[socket.id];
      console.log(currentwords);
    }
  })
});

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/regular", (req, res) => {
  res.render("regular.html");
});

app.get("/game/:id", (req, res) => {
  if(!Object.keys(rooms).includes(req.params.id)){
    res.status(404).render("404.html");
  } else {
    res.render("multiplayer.html");
  }
});

app.get("/getword", (req, res) => {
  res.type("text/plain").send(getWord());
});

app.get("/*", (req, res) => {
  res.status(404).render("404.html");
})

server.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});