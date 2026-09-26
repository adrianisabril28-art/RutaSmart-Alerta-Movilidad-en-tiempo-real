import { Incidente } from "../domain/Incidente";
import { IncidentePort } from "../domain/IncidentePort";

export class IncidenteApplication {
  constructor(private readonly port: IncidentePort) {}

  async createIncidente(
    incidente: Omit<Incidente, "id">
  ): Promise<number> {
    return await this.port.createIncidente(incidente);
  }

  async updateIncidente(
    id: number,
    incidente: Partial<Incidente>
  ): Promise<boolean> {
    const existingIncidente =
      await this.port.getIncidenteById(id);

    if (!existingIncidente) {
      throw new Error("Incidente no encontrado");
    }

    return await this.port.updateIncidente(id, incidente);
  }

  async deleteIncidente(id: number): Promise<boolean> {
    return await this.port.deleteIncidente(id);
  }

  async getIncidenteById(
    id: number
  ): Promise<Incidente | null> {
    return await this.port.getIncidenteById(id);
  }

  async getAllIncidentes(): Promise<Incidente[]> {
    return await this.port.getAllIncidentes();
  }
}
