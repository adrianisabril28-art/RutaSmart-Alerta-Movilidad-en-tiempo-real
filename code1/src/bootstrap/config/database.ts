import { DataSource } from "typeorm";
import envs from "./environment-vars";

import { User } from "../../infrastructure/entities/User";
import { TipoIncidente } from "../../infrastructure/entities/TipoIncidente";
import { Incidente } from "../../infrastructure/entities/Incidente";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  synchronize: true,
  entities: [User, TipoIncidente, Incidente],
});

export const connectDB = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};