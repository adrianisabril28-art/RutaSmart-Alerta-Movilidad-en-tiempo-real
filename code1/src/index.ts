import { ServerBootstrap } from "./bootstrap/ServerBootstrap";
import { connectDB } from "./bootstrap/config/database";

const startServer = async () => {
  await connectDB();

  const { default: app } = await import("./app");

  const serverBootstrap = new ServerBootstrap(app.getApp());

  serverBootstrap.initialize();
};

startServer();