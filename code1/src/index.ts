import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});