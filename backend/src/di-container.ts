import { Container } from "inversify";

import { FirebaseAdminService } from "./service/firebase-admin/firebase-admin.service";

import { BabyService } from "./service/baby/baby.service";
import { SleepService } from "./service/sleep/sleep.service";

import { BabyRoutes } from "./routes/baby/baby.routes";
import { SleepRoutes } from "./routes/sleep/sleep.routes";
import { AuthRoutes } from "./routes/auth/auth.routes";
import { AuthService } from "./service/auth/auth.service";

const DIContainer = new Container();

// Core services
DIContainer.bind<FirebaseAdminService>(FirebaseAdminService)
  .toSelf()
  .inSingletonScope();

// API services
DIContainer.bind<BabyService>(BabyService).toSelf();

DIContainer.bind<SleepService>(SleepService).toSelf();

DIContainer.bind<AuthService>(AuthService).toSelf();


// Routes
DIContainer.bind<BabyRoutes>(BabyRoutes).toSelf();

DIContainer.bind<SleepRoutes>(SleepRoutes).toSelf();

DIContainer.bind<AuthRoutes>(AuthRoutes).toSelf();


export default DIContainer;
