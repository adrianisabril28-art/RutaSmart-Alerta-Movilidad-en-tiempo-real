import express from "express";
import userRoutes from "../UserRoutes";
import tipoIncidenteRoutes from "../TipoIncidenteRoutes";
import incidenteRoutes from "../IncidenteRoutes";

const app = express();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", tipoIncidenteRoutes);
app.use("/api", incidenteRoutes);

export default app;