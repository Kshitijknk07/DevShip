import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import apiRoutes from "./routes/api";
import { setupSocket } from "./sockets/index";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend is running! (TypeScript)");
});

app.use("/api", apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
