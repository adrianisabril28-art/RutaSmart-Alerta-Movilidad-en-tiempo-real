import express from "express";
import type { Request, Response } from "express";
import webApp from "./infrastructure/routes/web";

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.routers();
  }

  private routers(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("RutaSmart Alerta API");
    });

    this.app.use(webApp);
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default new App();