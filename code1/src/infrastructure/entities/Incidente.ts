import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("incidente")
export class Incidente{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  tipo_incidente_id!: number;

  @Column({ type: "varchar", length: 500 })
  descripcion!: string;

  @Column({ type: "varchar", length: 255 })
  ubicacion!: string;

  @Column({ type: "timestamp" })
  fecha!: Date;

  @Column({ type: "int" })
  status!: number;
}