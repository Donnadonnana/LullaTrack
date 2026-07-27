import express from "express";
import { inject, injectable } from "inversify";

import type { Routes } from "../../types/routes.model";

import { SleepService } from "../../services/sleep/sleep.service";

@injectable()
export class SleepRoutes implements Routes {
  public readonly path = "/sleep";

  public readonly router = express.Router();

  constructor(
    @inject(SleepService)
    private readonly sleepService: SleepService,
  ) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.getSleepLogs();
    this.createSleepLog();
    this.updateSleepLog();
    this.deleteSleepLog();
  }

  private getSleepLogs(): void {
    this.router.get("/", async (req, res) => {
      try {
        const userId = String(req.query.userId ?? "");
        const babyId = String(req.query.babyId ?? "");
        const date = String(req.query.date ?? "");

        if (!userId || !babyId || !date) {
          res.status(400).json({
            message:
              "userId, babyId and date are required.",
          });

          return;
        }

        const logs = await this.sleepService.getByDate(
          userId,
          babyId,
          date,
        );

        res.json(logs);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to get sleep logs.",
        });
      }
    });
  }

  private createSleepLog(): void {
    this.router.post("/", async (req, res) => {
      try {
        const {
          userId,
          babyId,
          date,
          type,
          sleepNumber,
        } = req.body;

        if (
          !userId ||
          !babyId ||
          !date ||
          !type ||
          sleepNumber === undefined
        ) {
          res.status(400).json({
            message:
              "userId, babyId, date, type and sleepNumber are required.",
          });

          return;
        }

        const log = await this.sleepService.create({
          userId,
          babyId,
          date,
          type,
          sleepNumber,
        });

        res.status(201).json(log);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to create sleep log.",
        });
      }
    });
  }

  private updateSleepLog(): void {
    this.router.patch("/:sleepLogId", async (req, res) => {
      try {
        const log = await this.sleepService.update(
          req.params.sleepLogId,
          req.body,
        );

        if (!log) {
          res.status(404).json({
            message: "Sleep log not found.",
          });

          return;
        }

        res.json(log);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to update sleep log.",
        });
      }
    });
  }

  private deleteSleepLog(): void {
    this.router.delete("/:sleepLogId", async (req, res) => {
      try {
        const deleted = await this.sleepService.delete(
          req.params.sleepLogId,
        );

        if (!deleted) {
          res.status(404).json({
            message: "Sleep log not found.",
          });

          return;
        }

        res.status(204).send();
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to delete sleep log.",
        });
      }
    });
  }
}