
import { Incidente } from "./Incidente";

export interface IncidentePort {
  createIncidente(
    incidente: Omit<Incidente, "id">
  ): Promise<number>;

  updateIncidente(
    id: number,
    incidente: Partial<Incidente>
  ): Promise<boolean>;

  deleteIncidente(id: number): Promise<boolean>;

  getIncidenteById(id: number): Promise<Incidente | null>;

  getAllIncidentes(): Promise<Incidente[]>;
}
