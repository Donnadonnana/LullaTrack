import { Router } from "express";
import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { AuthService } from "../../service/auth/auth.service.js";
import type { Routes } from "../../types/routes.model.js";
import type { RegisterRequest, LoginRequest } from "../../types/auth.model.js";

@injectable()
export class AuthRoutes implements Routes {
  public readonly path = "/auth";
  public readonly router = Router();

  constructor(
    @inject(AuthService)
    private readonly authService: AuthService,
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
  }

  private register = async (
    req: Request<unknown, unknown, RegisterRequest>,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);

      res.status(201).json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to register user";

      res.status(400).json({
        message,
      });
    }
  };

  private login = async (
    req: Request<unknown, unknown, LoginRequest>,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);

      res.status(200).json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to login user";

      res.status(400).json({
        message,
      });
    }
  };
}
