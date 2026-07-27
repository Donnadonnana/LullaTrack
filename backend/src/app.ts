import cors from "cors";
import express, { type Express } from "express";

import type { Routes } from "./types/routes.model";

type AppOptions = {
  routes: Routes[];
};

export class App {
  public readonly app: Express;

  constructor({ routes }: AppOptions) {
    this.app = express();

    this.app.use(
      cors({
        origin: true,
      }),
    );

    this.app.use(express.json());

    this.addRoutes(routes);
  }

  private addRoutes(routes: Routes[]): void {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }
}
