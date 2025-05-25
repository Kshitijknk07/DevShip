const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/info", (req, res) => {
  res.json({
    project: "DevShip",
    status: "Production Ready!",
    time: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// --- WebSocket for real-time updates ---
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send time every second
  const interval = setInterval(() => {
    socket.emit("time", { time: new Date().toISOString() });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
