import App from "./app";
import { ServerBootstrap } from "./bootstrap/ServerBootstrap";

const serverBootstrap = new ServerBootstrap(App.getApp());

serverBootstrap.initialize();