import type { DecodedIdToken } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      token: DecodedIdToken;
    }
  }
}

export {};