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
    } else if(guess[i] in word){
      
    }
  }
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

server.listen(3000, () => {
  console.log("server started");
});

// https://github.com/Morgenstern2573/wordle_clone

// https://wordle-clone-drab.vercel.app