import express from "express";
import http from "http";
import ServerConfig from "./config/serverConfig";
import cors from "cors";
import { Server } from "socket.io";
import roomHandler from "./handlers/roomHandler";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new user connected !");

  roomHandler(socket);// * pass the socket connection to room handler for room creation and joining

  socket.on("disconnect", () => {
    console.log("User got disconnected !");
  });
});

server.listen(ServerConfig.PORT, () => {
  console.log(`server running on port ${ServerConfig.PORT}`);
});
