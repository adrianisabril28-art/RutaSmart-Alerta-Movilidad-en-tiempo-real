import { Request, Response } from "express";
import { UserApplication } from "../../application/UserApplication";
import {
  loadCreateUserData,
} from "../../modules/validations/UserCreateValidation";
import {
  loadUpdateUserData,
} from "../../modules/validations/UserUpdateValidation";
import {
  loadEmailData,
} from "../../modules/validations/EmailValidation";

export class UserController {
  constructor(private readonly application: UserApplication) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = loadCreateUserData(req.body);

      if (error) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      const id = await this.application.createUser(value);

      res.status(201).json({
        message: "Usuario creado correctamente",
        id,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(500).json({
        message,
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: "ID inválido",
        });
        return;
      }

      const { error, value } = loadUpdateUserData(req.body);

      if (error) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      const updated = await this.application.updateUser(id, value);

      if (!updated) {
        res.status(404).json({
          message: "Usuario no encontrado o sin cambios",
        });
        return;
      }

      res.status(200).json({
        message: "Usuario se actualizó correctamente",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(500).json({
        message,
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: "ID inválido",
        });
        return;
      }

      const user = await this.application.getUserById(id);

      if (!user) {
        res.status(404).json({
          message: "Usuario no encontrado",
        });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = loadEmailData({
        email: req.params.email,
      });

      if (error) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      const user = await this.application.getUserByEmail(value.email);

      if (!user) {
        res.status(404).json({
          message: "Usuario no encontrado",
        });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.application.getAllUsers();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: "ID inválido",
        });
        return;
      }

      const deleted = await this.application.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          message: "Usuario no encontrado",
        });
        return;
      }

      res.status(200).json({
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
}