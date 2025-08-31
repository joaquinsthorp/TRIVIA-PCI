const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/questions", (req, res) => {
  res.json(require("./questions.json"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Trivia PCI up on http://localhost:${PORT}`);
});
