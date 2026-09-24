import express from "express";
import type { Request, Response } from "express";

class App {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.routers();
    }

    private routers(): void {
        this.app.get("/", (req: Request, res: Response) => {
            res.send("Hello World");
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}

export default new App();