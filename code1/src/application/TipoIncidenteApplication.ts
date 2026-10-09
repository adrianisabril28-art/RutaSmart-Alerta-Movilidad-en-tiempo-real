import { TipoIncidente } from "../domain/TipoIncidente";
import { TipoIncidentePort } from "../domain/TipoIncidentePort";

export class TipoIncidenteApplication {
  constructor(private readonly port: TipoIncidentePort) {}

  async createTipoIncidente(
    tipoIncidente: Omit<TipoIncidente, "id">
  ): Promise<number> {
    return await this.port.createTipoIncidente(tipoIncidente);
  }

  async updateTipoIncidente(
    id: number,
    tipoIncidente: Partial<TipoIncidente>
  ): Promise<boolean> {
    const existingTipoIncidente =
      await this.port.getTipoIncidenteById(id);

    if (!existingTipoIncidente) {
      throw new Error("Tipo de incidente no encontrado");
    }

    return await this.port.updateTipoIncidente(id, tipoIncidente);
  }

  async deleteTipoIncidente(id: number): Promise<boolean> {
    return await this.port.deleteTipoIncidente(id);
  }

  async getTipoIncidenteById(
    id: number
  ): Promise<TipoIncidente | null> {
    return await this.port.getTipoIncidenteById(id);
  }

  async getAllTiposIncidente(): Promise<TipoIncidente[]> {
    return await this.port.getAllTiposIncidente();
  }
}