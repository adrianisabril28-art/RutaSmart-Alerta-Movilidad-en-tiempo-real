export interface Incidente {
  id: number;
  tipo_incidente_id: number;
  descripcion: string;
  ubicacion: string;
  fecha: Date;
  status: number;
}
