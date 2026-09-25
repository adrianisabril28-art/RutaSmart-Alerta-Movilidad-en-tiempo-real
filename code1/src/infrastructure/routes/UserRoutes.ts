import { Router } from "express";
import { UserAdapter } from "../adapters/UserAdapter";
import { UserApplication } from "../../application/UserApplication";
import { UserController } from "../controllers/UserController";

const router = Router();

const userAdapter = new UserAdapter();
const userApplication = new UserApplication(userAdapter);
const userController = new UserController(userApplication);

router.post("/users", (req, res) => userController.createUser(req, res));

router.get("/users", (req, res) => userController.getAllUsers(req, res));

router.get("/users/:id", (req, res) => userController.getUserById(req, res));

router.get(
  "/users/email/:email",
  (req, res) => userController.getUserByEmail(req, res)
);

router.put("/users/:id", (req, res) => userController.updateUser(req, res));

router.delete("/users/:id", (req, res) => userController.deleteUser(req, res));

export default router;