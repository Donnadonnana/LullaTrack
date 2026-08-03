import express from "express";
import { inject, injectable } from "inversify";

import type { Routes } from "../../types/routes.model.js";
import type { UpdateUserRequest } from "../../types/user.model.js";

import { UserService } from "../../service/user/user.service.js";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware.js";

@injectable()
export class UserRoutes implements Routes {
  public readonly path = "/users";

  public readonly router = express.Router();

  constructor(
    @inject(UserService)
    private readonly userService: UserService,

    @inject(AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware,
  ) {
    this.router.use(this.authMiddleware.middleware);

    this.initRoutes();
  }

  private initRoutes(): void {
    this.getMe();
    this.updateMe();
  }

  private getMe(): void {
    this.router.get("/me", async (req, res) => {
      try {
        const user = await this.userService.getById(req.userId);

        if (!user) {
          res.status(404).json({
            message: "User not found.",
          });

          return;
        }

        res.json(user);
      } catch (error) {
        console.error("Unable to get user:", error);

        res.status(500).json({
          message: "Unable to get user.",
        });
      }
    });
  }

  private updateMe(): void {
    this.router.patch("/me", async (req, res) => {
      try {
        const changes = req.body as UpdateUserRequest;

        const user = await this.userService.update(req.userId, changes);

        if (!user) {
          res.status(404).json({
            message: "User not found.",
          });

          return;
        }

        res.json(user);
      } catch (error) {
        console.error("Unable to update user:", error);

        res.status(500).json({
          message: "Unable to update user.",
        });
      }
    });
  }
}
