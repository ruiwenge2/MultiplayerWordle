let name = localStorage.getItem("name");

if(name){
  document.getElementById("input").value = name;
}