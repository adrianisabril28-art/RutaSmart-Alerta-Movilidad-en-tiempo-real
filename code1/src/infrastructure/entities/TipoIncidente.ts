import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("tipo_incidente")
export class TipoIncidente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "int" })
  status!: number;
}
