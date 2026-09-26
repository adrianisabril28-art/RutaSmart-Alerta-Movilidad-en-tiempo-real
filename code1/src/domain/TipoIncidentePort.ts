import { TipoIncidente } from "./TipoIncidente";

export interface TipoIncidentePort {
  createTipoIncidente(
    tipoIncidente: Omit<TipoIncidente, "id">
  ): Promise<number>;

  updateTipoIncidente(
    id: number,
    tipoIncidente: Partial<TipoIncidente>
  ): Promise<boolean>;

  deleteTipoIncidente(id: number): Promise<boolean>;

  getTipoIncidenteById(id: number): Promise<TipoIncidente | null>;

  getAllTiposIncidente(): Promise<TipoIncidente[]>;
}