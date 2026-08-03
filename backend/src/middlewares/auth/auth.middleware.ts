import type { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../../service/firebase-admin/firebase-admin.service.js";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public readonly middleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
          message: "Missing authentication token.",
        });

        return;
      }

      const idToken = authorization.slice("Bearer ".length).trim();

      if (!idToken) {
        res.status(401).json({
          message: "Missing authentication token.",
        });

        return;
      }

      const decodedToken =
        await this.firebaseAdminService.auth.verifyIdToken(idToken);

      req.token = decodedToken;
      req.userId = decodedToken.uid;

      next();
    } catch (error) {
      console.error("Authentication failed:", error);

      res.status(401).json({
        message: "Invalid or expired authentication token.",
      });
    }
  };
}
