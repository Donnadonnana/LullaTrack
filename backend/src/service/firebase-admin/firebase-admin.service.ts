import { injectable } from "inversify";
import { getAuth } from "firebase-admin/auth";

import {
  applicationDefault,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";

import {
  FieldValue,
  getFirestore,
  type Firestore,
} from "firebase-admin/firestore";

@injectable()
export class FirebaseAdminService {
  public readonly app: App;
  public readonly auth;
  public readonly db: Firestore;
  public readonly fieldValue = FieldValue;

  constructor() {
    this.app =
      getApps()[0] ??
      initializeApp({
        credential: applicationDefault(),
      });

    this.db = getFirestore(this.app);
    this.auth = getAuth();

    this.db.settings({
      ignoreUndefinedProperties: true,
    });
  }
}
