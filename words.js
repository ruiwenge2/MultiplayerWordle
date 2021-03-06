const axios = require("axios");

async function getData(url){
  let data = await axios.get(url);
  return data.data.split("\n");
}

module.exports = {
  getGuesses: async function(){
    return await getData("https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt");
  },
  getAnswers: async function(){
    return await getData("https://gist.githubusercontent.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b/raw/5d752e5f0702da315298a6bb5a771586d6ff445c/wordle-answers-alphabetical.txt");
  }
};