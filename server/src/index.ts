import express from "express";
import http from "http";
import ServerConfig from "./config/serverConfig";

const app = express();

const server = http.createServer(app);

server.listen(ServerConfig.PORT, () => {
  console.log(`server running on port ${ServerConfig.PORT}`);
});
