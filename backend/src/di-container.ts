import { Container } from "inversify";

import { FirebaseAdminService } from "./service/firebase-admin/firebase-admin.service";

import { BabyService } from "./service/baby/baby.service";
import { SleepService } from "./service/sleep/sleep.service";

import { BabyRoutes } from "./routes/baby/baby.routes";
import { SleepRoutes } from "./routes/sleep/sleep.routes";
import { AuthRoutes } from "./routes/auth/auth.routes";
import { AuthService } from "./service/auth/auth.service";
import { UserService } from "./service/user/user.service";
import { UserRoutes } from "./routes/user/user.routes";
import { FeedingRoutes } from "./routes/feeding/feeding.routes";
import { FeedingService } from "./service/feeding/feeding.service";

// Middlewares
import { AuthMiddleware } from "./middlewares/auth/auth.middleware";

const DIContainer = new Container();

// Core services
DIContainer.bind<FirebaseAdminService>(FirebaseAdminService)
  .toSelf()
  .inSingletonScope();

// API services
DIContainer.bind<BabyService>(BabyService).toSelf();

DIContainer.bind<SleepService>(SleepService).toSelf();

DIContainer.bind<AuthService>(AuthService).toSelf();

DIContainer.bind<UserService>(UserService).toSelf();

DIContainer.bind<FeedingService>(FeedingService).toSelf();

// Middlewares
DIContainer.bind<AuthMiddleware>(AuthMiddleware).toSelf();

// Routes
DIContainer.bind<BabyRoutes>(BabyRoutes).toSelf();

DIContainer.bind<SleepRoutes>(SleepRoutes).toSelf();

DIContainer.bind<AuthRoutes>(AuthRoutes).toSelf();

DIContainer.bind<UserRoutes>(UserRoutes).toSelf();

DIContainer.bind<FeedingRoutes>(FeedingRoutes).toSelf();

export default DIContainer;
