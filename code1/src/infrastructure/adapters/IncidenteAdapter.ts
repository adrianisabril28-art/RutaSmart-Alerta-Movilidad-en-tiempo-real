import { Repository } from "typeorm";
import { Incidente as IncidenteDomain } from "../../domain/Incidente";
import { IncidentePort } from "../../domain/IncidentePort";
import { Incidente as IncidenteEntity } from "../entities/Incidente";
import { AppDataSource } from "../../bootstrap/config/database";

export class IncidenteAdapter implements IncidentePort {
  private incidenteRepository: Repository<IncidenteEntity>;

  constructor() {
    console.log("IncidenteEntity:", IncidenteEntity);

    console.log(
      "Entidades registradas:",
      AppDataSource.entityMetadatas.map(
        (metadata) => metadata.name
      )
    );

    this.incidenteRepository =
      AppDataSource.getRepository(IncidenteEntity);
  }

  private toDomain(
    entity: IncidenteEntity
  ): IncidenteDomain {
    return {
      id: entity.id,
      tipo_incidente_id: entity.tipo_incidente_id,
      descripcion: entity.descripcion,
      ubicacion: entity.ubicacion,
      fecha: entity.fecha,
      status: entity.status,
    };
  }

  async createIncidente(
    incidente: Omit<IncidenteDomain, "id">
  ): Promise<number> {
    const entity = this.incidenteRepository.create({
      ...incidente,
      fecha: incidente.fecha || new Date(),
      status: 1,
    });

    const savedIncidente =
      await this.incidenteRepository.save(entity);

    return savedIncidente.id;
  }

  async updateIncidente(
    id: number,
    incidente: Partial<IncidenteDomain>
  ): Promise<boolean> {
    const existingIncidente =
      await this.incidenteRepository.findOne({
        where: { id },
      });

    if (!existingIncidente) {
      return false;
    }

    Object.assign(existingIncidente, incidente);

    await this.incidenteRepository.save(existingIncidente);

    return true;
  }

  async deleteIncidente(id: number): Promise<boolean> {
    const existingIncidente =
      await this.incidenteRepository.findOne({
        where: { id },
      });

    if (!existingIncidente) {
      return false;
    }

    existingIncidente.status = 0;

    await this.incidenteRepository.save(existingIncidente);

    return true;
  }

  async getIncidenteById(
    id: number
  ): Promise<IncidenteDomain | null> {
    const incidente =
      await this.incidenteRepository.findOne({
        where: { id, status: 1 },
      });

    if (!incidente) {
      return null;
    }

    return this.toDomain(incidente);
  }

  async getAllIncidentes(): Promise<IncidenteDomain[]> {
    const incidentes =
      await this.incidenteRepository.find({
        where: { status: 1 },
      });

    return incidentes.map((incidente) =>
      this.toDomain(incidente)
    );
  }
}