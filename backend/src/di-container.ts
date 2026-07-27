import { Container } from "inversify";

import { FirebaseAdminService } from "./service/firebase-admin/firebase-admin.service";

import { BabyService } from "./service/baby/baby.service";
import { SleepService } from "./service/sleep/sleep.service";
import { FeedingService } from "./service/feeding/feeding.service";

import { BabyRoutes } from "./routes/baby/baby.routes";
import { SleepRoutes } from "./routes/sleep/sleep.routes";
import { FeedingRoutes } from "./routes/feeding/feeding.routes";

const DIContainer = new Container();

// Core services
DIContainer.bind<FirebaseAdminService>(FirebaseAdminService)
  .toSelf()
  .inSingletonScope();

// API services
DIContainer.bind<BabyService>(BabyService).toSelf();

DIContainer.bind<SleepService>(SleepService).toSelf();

DIContainer.bind<FeedingService>(FeedingService).toSelf();

// Routes
DIContainer.bind<BabyRoutes>(BabyRoutes).toSelf();

DIContainer.bind<SleepRoutes>(SleepRoutes).toSelf();

DIContainer.bind<FeedingRoutes>(FeedingRoutes).toSelf();

export default DIContainer;
