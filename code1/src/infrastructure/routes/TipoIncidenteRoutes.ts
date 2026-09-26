import { Router } from "express";

import { TipoIncidenteAdapter } from "../adapters/TipoIncidenteAdapter";
import { TipoIncidenteApplication } from "../../application/TipoIncidenteApplication";
import { TipoIncidenteController } from "../controllers/TipoIncidenteController";

const router = Router();

const tipoIncidenteAdapter = new TipoIncidenteAdapter();
const tipoIncidenteApplication =
  new TipoIncidenteApplication(tipoIncidenteAdapter);
const tipoIncidenteController =
  new TipoIncidenteController(tipoIncidenteApplication);

router.post(
  "/tipos-incidente",
  (req, res) => tipoIncidenteController.createTipoIncidente(req, res)
);

router.get(
  "/tipos-incidente",
  (req, res) => tipoIncidenteController.getAllTiposIncidente(req, res)
);

router.get(
  "/tipos-incidente/:id",
  (req, res) => tipoIncidenteController.getTipoIncidenteById(req, res)
);

router.put(
  "/tipos-incidente/:id",
  (req, res) => tipoIncidenteController.updateTipoIncidente(req, res)
);

router.delete(
  "/tipos-incidente/:id",
  (req, res) => tipoIncidenteController.deleteTipoIncidente(req, res)
);

export default router;