import express from "express";
import http from "http";
import envs from "./config/environment-vars";

export class ServerBootstrap {
  app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  initialize() {
    const server = http.createServer(this.app);

    const PORT = envs.PORT;

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
}