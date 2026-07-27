import "reflect-metadata";

import { onRequest } from "firebase-functions/https";
import { setGlobalOptions } from "firebase-functions";

import { App } from "./app";
import DIContainer from "./di-container";

import { BabyRoutes } from "./routes/baby/baby.routes";
import { SleepRoutes } from "./routes/sleep/sleep.routes";

setGlobalOptions({
  region: "northamerica-northeast1",
  maxInstances: 10,
});

const app = new App({
  routes: [
    DIContainer.get(BabyRoutes),
    DIContainer.get(SleepRoutes),
  ],
});

export const api = onRequest(app.app);