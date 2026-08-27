import express from "express";
import { inject, injectable } from "inversify";

import type { Routes } from "../../types/routes.model";

import { BabyService } from "../../service/baby/baby.service";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";

@injectable()
export class BabyRoutes implements Routes {
  public readonly path = "/babies";

  public readonly router = express.Router();

  constructor(
    @inject(BabyService)
    private readonly babyService: BabyService,

    @inject(AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware,
  ) {
    this.router.use(this.authMiddleware.middleware);

    this.initRoutes();
  }

  private initRoutes(): void {
    this.getBabies();
    this.getBaby();
    this.createBaby();
    this.updateBaby();
    this.deleteBaby();
  }

  private getBabies(): void {
    this.router.get("/", async (req, res) => {
      try {
        const babies = await this.babyService.getAll(req.userId);
        res.json(babies);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to get babies." });
      }
    });
  }

  private getBaby(): void {
    this.router.get("/:babyId", async (req, res) => {
      try {
        const baby = await this.babyService.getById(
          req.userId,
          req.params.babyId,
        );

        if (!baby) {
          res.status(404).json({ message: "Baby not found." });
          return;
        }

        res.json(baby);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to get baby." });
      }
    });
  }

  private createBaby(): void {
    this.router.post("/", async (req, res) => {
      try {
        const { name, dateOfBirth, gender, feedingMethod } = req.body;

        if (!name || !dateOfBirth || !gender || !feedingMethod) {
          res.status(400).json({
            message:
              "name, dateOfBirth, gender and feedingMethod are required.",
          });
          return;
        }

        const baby = await this.babyService.create(req.userId, {
          name,
          dateOfBirth,
          gender,
          feedingMethod,
        });

        res.status(201).json(baby);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to create baby." });
      }
    });
  }

  private updateBaby(): void {
    this.router.patch("/:babyId", async (req, res) => {
      try {
        const baby = await this.babyService.update(
          req.userId,
          req.params.babyId,
          req.body,
        );

        if (!baby) {
          res.status(404).json({ message: "Baby not found." });
          return;
        }

        res.json(baby);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to update baby." });
      }
    });
  }

  private deleteBaby(): void {
    this.router.delete("/:babyId", async (req, res) => {
      try {
        const deleted = await this.babyService.delete(
          req.userId,
          req.params.babyId,
        );

        if (!deleted) {
          res.status(404).json({ message: "Baby not found." });
          return;
        }

        res.status(204).send();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to delete baby." });
      }
    });
  }
}
