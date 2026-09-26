import { User } from "../domain/User";
import { UserPort } from "../domain/UserPort";

export class UserApplication {
  constructor(private readonly port: UserPort) {}

  async createUser(user: Omit<User, "id">): Promise<number> {
    const existingUser = await this.port.getUserByEmail(user.email);

    if (existingUser) {
      throw new Error("Este email ya está registrado");
    }

    return await this.port.createUser(user);
  }

  async updateUser(
    id: number,
    user: Partial<User>
  ): Promise<boolean> {
    const existingUser = await this.port.getUserById(id);

    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    if (user.email && user.email !== existingUser.email) {
      const userWithEmail = await this.port.getUserByEmail(user.email);

      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error("El email ya está en uso");
      }
    }

    return await this.port.updateUser(id, user);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.port.deleteUser(id);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.port.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.port.getUserByEmail(email);
  }
  
async login(email: string, password: string): Promise<User | null> {
  const user = await this.port.getUserByEmail(email);

  if (!user) {
    return null;
  }

  if (user.status !== 1) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  return user;
}
  async getAllUsers(): Promise<User[]> {
    return await this.port.getAllUsers();
  }
}