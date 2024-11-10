const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));

let userCount = 0;

io.on("connection", (socket) => {
  userCount++;
  io.emit("userCountUpdate", userCount);

  socket.on("sendMessage", (message) => {
    io.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    userCount--;
    io.emit("userCountUpdate", userCount);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
