import { Request, Response } from "express";
import { IncidenteApplication } from "../../application/IncidenteApplication";

export class IncidenteController {
  constructor(
    private readonly application: IncidenteApplication
  ) {}

  async createIncidente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = await this.application.createIncidente(req.body);

      res.status(201).json({
        message: "Incidente creado correctamente",
        id,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(500).json({
        message,
      });
    }
  }

  async getAllIncidentes(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const incidentes =
        await this.application.getAllIncidentes();

      res.status(200).json(incidentes);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(500).json({
        message,
      });
    }
  }

  async getIncidenteById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      const incidente =
        await this.application.getIncidenteById(id);

      if (!incidente) {
        res.status(404).json({
          message: "Incidente no encontrado",
        });
        return;
      }

      res.status(200).json(incidente);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(500).json({
        message,
      });
    }
  }

  async updateIncidente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      await this.application.updateIncidente(id, req.body);

      res.status(200).json({
        message: "Incidente actualizado correctamente",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(404).json({
        message,
      });
    }
  }

  async deleteIncidente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      const deleted =
        await this.application.deleteIncidente(id);

      if (!deleted) {
        res.status(404).json({
          message: "Incidente no encontrado",
        });
        return;
      }

      res.status(200).json({
        message: "Incidente eliminado correctamente",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(500).json({
        message,
      });
    }
  }
}