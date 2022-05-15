const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { getGuesses, getAnswers } = require("./words");

app.use(express.static("public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

global.guesses = [];
global.answers = [];

function random(num1, num2){
  return Math.round(Math.random() * (num2 - num1)) + num1;
};

getGuesses().then(guesses => {
  global.guesses = guesses;
});

getAnswers().then(answers => {
  global.answers = answers;
});


io.on("connection", socket => {
  socket.on("name", name => {
    if(!name.replace(" ", "")){
      socket.emit("name", `Player_${random(1000, 9999)}`);
    } else {
      socket.emit("name", true);
    }
  });
});

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/regular", (req, res) => {
  res.render("regular.html");
});

app.get("/game/:id", (req, res) => {
  res.render("multiplayer.html");
});

server.listen(3000, () => {
  console.log("server started");
});

// https://github.com/codergautam/wordle-wordlist