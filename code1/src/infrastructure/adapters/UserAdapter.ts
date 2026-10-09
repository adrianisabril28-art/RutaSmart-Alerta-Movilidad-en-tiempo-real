import { Repository } from "typeorm";
import { User as UserDomain } from "../../domain/User";
import { UserPort } from "../../domain/UserPort";
import { User as UserEntity } from "../entities/User";
import { AppDataSource } from "../../bootstrap/config/database";

export class UserAdapter implements UserPort {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  private toDomain(entity: UserEntity): UserDomain {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      status: entity.status,
    };
  }

  private toEntity(domain: UserDomain): UserEntity {
    const entity = new UserEntity();

    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.status = domain.status;

    return entity;
  }

  async createUser(user: Omit<UserDomain, "id">): Promise<number> {
    const entity = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(entity);

    return savedUser.id;
  }

  async updateUser(
    id: number,
    user: Partial<UserDomain>
  ): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!existingUser) {
      return false;
    }

    Object.assign(existingUser, user);

    await this.userRepository.save(existingUser);

    return true;
  }

  async deleteUser(id: number): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!existingUser) {
      return false;
    }

    existingUser.status = 0;

    await this.userRepository.save(existingUser);

    return true;
  }

  async getUserById(id: number): Promise<UserDomain | null> {
    const user = await this.userRepository.findOne({
      where: { id, status: 1 },
    });

    if (!user) {
      return null;
    } 

    return this.toDomain(user);
  }

  async getUserByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return this.toDomain(user);
  }

  async getAllUsers(): Promise<UserDomain[]> {
    const users = await this.userRepository.find({
      where: { status: 1 },
    });

    return users.map((user) => this.toDomain(user));
  }
}