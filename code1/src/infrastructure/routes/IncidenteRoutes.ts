import { Router } from "express";

import { IncidenteAdapter } from "../adapters/IncidenteAdapter";
import { IncidenteApplication } from "../../application/IncidenteApplication";
import { IncidenteController } from "../controllers/IncidenteController";

const router = Router();

const incidenteAdapter = new IncidenteAdapter();
const incidenteApplication =
  new IncidenteApplication(incidenteAdapter);
const incidenteController =
  new IncidenteController(incidenteApplication);

router.post(
  "/incidentes",
  (req, res) => incidenteController.createIncidente(req, res)
);

router.get(
  "/incidentes",
  (req, res) => incidenteController.getAllIncidentes(req, res)
);

router.get(
  "/incidentes/:id",
  (req, res) => incidenteController.getIncidenteById(req, res)
);

router.put(
  "/incidentes/:id",
  (req, res) => incidenteController.updateIncidente(req, res)
);

router.delete(
  "/incidentes/:id",
  (req, res) => incidenteController.deleteIncidente(req, res)
);

export default router;