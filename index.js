import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

const PORT = 3000;
const app = express();
app.use(express.static("app"));

const socketServer = createServer(app);
socketServer.listen(3000, () => {
  console.log(`socket io server listening on *:${PORT}`);
});

const io = new Server(socketServer);
io.on("connection", (socket) => {
  console.log("a user connected");
});
