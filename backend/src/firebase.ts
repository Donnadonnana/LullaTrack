import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, type ServiceAccount } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "../firebase-service-account.json"), "utf8")
) as ServiceAccount;

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
