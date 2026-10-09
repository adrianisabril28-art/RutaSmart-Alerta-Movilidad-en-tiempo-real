import { Repository } from "typeorm";
import { TipoIncidente as TipoIncidenteDomain } from "../../domain/TipoIncidente";
import { TipoIncidentePort } from "../../domain/TipoIncidentePort";
import { TipoIncidente as TipoIncidenteEntity } from "../entities/TipoIncidente";
import { AppDataSource } from "../../bootstrap/config/database";

export class TipoIncidenteAdapter implements TipoIncidentePort {
  private tipoIncidenteRepository: Repository<TipoIncidenteEntity>;

  constructor() {
    this.tipoIncidenteRepository =
      AppDataSource.getRepository(TipoIncidenteEntity);
  }

  private toDomain(
    entity: TipoIncidenteEntity
  ): TipoIncidenteDomain {
    return {
      id: entity.id,
      nombre: entity.nombre,
      status: entity.status,
    };
  }

  async createTipoIncidente(
  tipoIncidente: Omit<TipoIncidenteDomain, "id">
): Promise<number> {
  const entity = this.tipoIncidenteRepository.create({
    ...tipoIncidente,
    status: 1,
  });

  const savedTipoIncidente =
    await this.tipoIncidenteRepository.save(entity);

  return savedTipoIncidente.id;
}

  async updateTipoIncidente(
    id: number,
    tipoIncidente: Partial<TipoIncidenteDomain>
  ): Promise<boolean> {
    const existingTipoIncidente =
      await this.tipoIncidenteRepository.findOne({
        where: { id },
      });

    if (!existingTipoIncidente) {
      return false;
    }

    Object.assign(existingTipoIncidente, tipoIncidente);

    await this.tipoIncidenteRepository.save(existingTipoIncidente);

    return true;
  }

  async deleteTipoIncidente(id: number): Promise<boolean> {
    const existingTipoIncidente =
      await this.tipoIncidenteRepository.findOne({
        where: { id },
      });

    if (!existingTipoIncidente) {
      return false;
    }

    existingTipoIncidente.status = 0;

    await this.tipoIncidenteRepository.save(existingTipoIncidente);

    return true;
  }

  async getTipoIncidenteById(
    id: number
  ): Promise<TipoIncidenteDomain | null> {
    const tipoIncidente =
      await this.tipoIncidenteRepository.findOne({
        where: { id, status: 1 },
      });

    if (!tipoIncidente) {
      return null;
    }

    return this.toDomain(tipoIncidente);
  }

  async getAllTiposIncidente(): Promise<TipoIncidenteDomain[]> {
    const tiposIncidente =
      await this.tipoIncidenteRepository.find({
        where: { status: 1 },
      });

    return tiposIncidente.map((tipo) => this.toDomain(tipo));
  }
}