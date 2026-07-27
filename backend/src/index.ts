import "reflect-metadata";

import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";

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