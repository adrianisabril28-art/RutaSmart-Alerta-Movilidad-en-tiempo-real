import app from "./app";
import { ServerBootstrap } from "./bootstrap/ServerBootstrap";
import { connectDB } from "./bootstrap/config/database";

const startServer = async () => {
  await connectDB();

  const serverBootstrap = new ServerBootstrap(app.getApp());

  serverBootstrap.initialize();
};

startServer();