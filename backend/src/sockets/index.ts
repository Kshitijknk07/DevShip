import { Server } from "socket.io";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Example: send time every second
    const interval = setInterval(() => {
      socket.emit("time", { time: new Date().toISOString() });
    }, 1000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Client disconnected:", socket.id);
    });
  });
}
