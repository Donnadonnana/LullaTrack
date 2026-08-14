import express from "express";
import { inject, injectable } from "inversify";
import type { Routes } from "../../types/routes.model.js";
import { FeedingService } from "../../service/feeding/feeding.service.js";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware.js";

@injectable()
export class FeedingRoutes implements Routes {
  public readonly path = "/feeding";

  public readonly router = express.Router();

  constructor(
    @inject(FeedingService)
    private readonly feedingService: FeedingService,

    @inject(AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware,
  ) {
    this.router.use(this.authMiddleware.middleware);

    this.initRoutes();
  }

  private initRoutes(): void {
    this.getFeedingLogs();

    this.createFeedingLog();

    this.updateFeedingLog();

    this.deleteFeedingLog();
  }

  // GET /feeding?babyId=abc123&date=2026-08-03
  private getFeedingLogs(): void {
    this.router.get("/", async (req, res) => {
      try {
        const userId = req.userId;
        const babyId = String(req.query.babyId ?? "");
        const date = String(req.query.date ?? "");

        if (!babyId || !date) {
          res.status(400).json({
            message: "babyId and date are required.",
          });

          return;
        }

        const logs = await this.feedingService.getByDate(userId, babyId, date);

        res.json(logs);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to get feeding logs.",
        });
      }
    });
  }

  // POST /feeding
  private createFeedingLog(): void {
    this.router.post("/", async (req, res) => {
      try {
        const userId = req.userId;

        const { babyId, date, type, feedingNumber } = req.body;

        if (!babyId || !date || !type || feedingNumber === undefined) {
          res.status(400).json({
            message: "babyId, date, type and feedingNumber are required.",
          });

          return;
        }

        if (type !== "breastfeeding" && type !== "bottle") {
          res.status(400).json({
            message: "type must be either breastfeeding or bottle.",
          });

          return;
        }

        const log = await this.feedingService.create({
          userId,
          babyId,
          date,
          type,
          feedingNumber,
        });

        res.status(201).json(log);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to create feeding log.",
        });
      }
    });
  }

  private updateFeedingLog(): void {
    this.router.patch("/:feedingLogId", async (req, res) => {
      try {
        const log = await this.feedingService.update(
          req.params.feedingLogId,
          req.body,
        );

        if (!log) {
          res.status(404).json({
            message: "Feeding log not found.",
          });

          return;
        }

        res.json(log);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to update feeding log.",
        });
      }
    });
  }

  private deleteFeedingLog(): void {
    this.router.delete("/:feedingLogId", async (req, res) => {
      try {
        const deleted = await this.feedingService.delete(
          req.params.feedingLogId,
        );

        if (!deleted) {
          res.status(404).json({
            message: "Feeding log not found.",
          });

          return;
        }

        res.status(204).send();
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Unable to delete feeding log.",
        });
      }
    });
  }
}
