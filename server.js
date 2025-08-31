const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 10000;

// Servir estáticos
app.use(express.static(path.join(__dirname, "public")));

// Cargar preguntas
let questions = JSON.parse(fs.readFileSync("questions.json", "utf8"));

let players = {};
let currentQuestion = 0;

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("joinGame", (name) => {
    players[socket.id] = { name, score: 0 };
    io.emit("playerList", Object.values(players));
  });

  socket.on("startGame", () => {
    currentQuestion = 0;
    io.emit("newQuestion", questions[currentQuestion]);
  });

  socket.on("answer", (answerIndex) => {
    let player = players[socket.id];
    if (!player) return;
    let correctIndex = questions[currentQuestion].answer;
    if (answerIndex === correctIndex) {
      player.score += 10;
    }
    io.emit("playerList", Object.values(players));
  });

  socket.on("nextQuestion", () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      io.emit("newQuestion", questions[currentQuestion]);
    } else {
      io.emit("gameOver", Object.values(players));
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("playerList", Object.values(players));
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
