import "reflect-metadata";

import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";

import { App } from "./app";
import DIContainer from "./di-container";

import { BabyRoutes } from "./routes/baby/baby.routes";
import { SleepRoutes } from "./routes/sleep/sleep.routes";
import { AuthRoutes } from "./routes/auth/auth.routes";
import { UserRoutes } from "./routes/user/user.routes";
import { FeedingRoutes } from "./routes/feeding/feeding.routes";

setGlobalOptions({
  region: "northamerica-northeast1",
  maxInstances: 10,
});

const app = new App({
  routes: [
    DIContainer.get(BabyRoutes),
    DIContainer.get(SleepRoutes),
    DIContainer.get(AuthRoutes),
    DIContainer.get(UserRoutes),
    DIContainer.get(FeedingRoutes),
  ],
});

export const api = onRequest(app.app);
