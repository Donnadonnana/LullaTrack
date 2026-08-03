import type { Timestamp } from "firebase-admin/firestore";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export type UpdateUserRequest = Partial<Pick<User, "firstName" | "lastName">>;
