const socket = io();
socket.emit("joinRoom", localStorage.getItem("name"));
