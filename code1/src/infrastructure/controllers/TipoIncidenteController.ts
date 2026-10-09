import { Request, Response } from "express";
import { TipoIncidenteApplication } from "../../application/TipoIncidenteApplication";

export class TipoIncidenteController {
  constructor(
    private readonly application: TipoIncidenteApplication
  ) {}

  async createTipoIncidente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = await this.application.createTipoIncidente(req.body);

      res.status(201).json({
        message: "Tipo de incidente creado correctamente",
        id,
      });
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(500).json({
        message,
      });
    }
  }

  async getAllTiposIncidente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const tipos = await this.application.getAllTiposIncidente();

      res.status(200).json(tipos);
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

  async getTipoIncidenteById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const tipo = await this.application.getTipoIncidenteById(id);

      if (!tipo) {
        res.status(404).json({
          message: "Tipo de incidente no encontrado",
        });
        return;
      }

      res.status(200).json(tipo);
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

  async updateTipoIncidente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      await this.application.updateTipoIncidente(id, req.body);

      res.status(200).json({
        message: "Tipo de incidente actualizado correctamente",
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

  async deleteTipoIncidente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      const deleted =
        await this.application.deleteTipoIncidente(id);

      if (!deleted) {
        res.status(404).json({
          message: "Tipo de incidente no encontrado",
        });
        return;
      }

      res.status(200).json({
        message: "Tipo de incidente eliminado correctamente",
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