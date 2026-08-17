# 👶 LullaTrack

> A baby tracking app for logging sleep and feeding, with insights into your baby's daily routines.

LullaTrack helps parents log daily sleep and feeding activities and turns those logs into meaningful summaries — wake windows, nap totals, and daily sleep breakdowns.

Built with **React**, **TypeScript**, **Redux Toolkit**, and **Material UI** on the frontend, and **Node.js**, **Express**, and **Firebase** on the backend.

---

## Table of contents

- [Features](#-features)
- [Tech stack](#-tech-stack)
- [Project structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting started](#-getting-started)
  - [1. Clone and install](#1-clone-and-install)
  - [2. Firebase project setup](#2-firebase-project-setup)
  - [3. Frontend environment variables](#3-frontend-environment-variables)
  - [4. Backend secrets](#4-backend-secrets)
  - [5. Run locally](#5-run-locally)
- [Environment variable reference](#-environment-variable-reference)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Why I built this](#-why-i-built-this)

---

## ✨ Features

### 📊 Dashboard

- Daily sleep and feeding summaries
- Weekly trends and insights
- Baby profile overview

### 😴 Sleep tracking

- Log morning wake-up, naps, and night sleep
- Track on-bed time, fell-asleep time, wake time, and pick-up time
- Automatic wake window calculation between sleeps
- End-of-day summary: nap count, total nap sleep, night sleep, average time to fall asleep
- Date navigation and multiple baby support

### 🍼 Feeding tracking

Supports both breastfeeding and bottle feeding.

| Breastfeeding                     | Bottle                                          |
| --------------------------------- | ----------------------------------------------- |
| Start and end time                | Start time                                      |
| Duration (calculated)             | Amount in ml                                    |
| Breast side (left / right / both) | Milk type (breast milk / formula / combination) |
| Notes                             | Notes                                           |

### 👶 Baby management

- Multiple baby profiles with quick switching
- Separate records per baby

### 🎨 User experience

- Light and dark mode
- Responsive layout with a collapsible sidebar
- Themed design system — all colors live in the MUI theme

---

## 🛠 Tech stack

**Frontend** — React · TypeScript · Vite · React Router · Redux Toolkit · Material UI

**Backend** — Node.js · Express · Inversify (DI) · Firebase Firestore · Firebase Authentication · Firebase Cloud Functions

---

## 📁 Project structure

```
lullatrack/
├── frontend/
│   ├── src/
│   │   ├── api/           # API client and endpoint functions
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom hooks (e.g. useAuthTokenRefresh)
│   │   ├── pages/         # Route-level pages
│   │   ├── store/         # Redux store, slices, typed hooks
│   │   ├── theme/         # MUI theme and design tokens
│   │   └── utils/         # Time and reporting helpers
│   ├── .env.development
│   ├── .env.production
│   └── firebase.json      # Hosting config + /api rewrite
│
└── backend/
    ├── src/
    │   ├── middlewares/   # Auth middleware
    │   ├── routes/        # Express route classes
    │   ├── service/       # Business logic + Firestore access
    │   └── types/         # Shared models
    └── firebase.json      # Functions + Firestore config
```

---

## 📋 Prerequisites

| Requirement          | Notes                                                  |
| -------------------- | ------------------------------------------------------ |
| **Node.js 22+**      | Match the runtime used by Cloud Functions              |
| **npm**              | Ships with Node                                        |
| **Firebase CLI**     | `npm install -g firebase-tools`                        |
| **Java 11+**         | Required by the Firestore emulator only                |
| **Firebase project** | On the **Blaze** plan — Cloud Functions v2 requires it |

Verify your setup:

```bash
node --version
firebase --version
java -version
```

---

## 🚀 Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/lullatrack.git
cd lullatrack

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Firebase project setup

```bash
firebase login
firebase use --add
```

Select your project and give it the alias `default`.

In the [Firebase Console](https://console.firebase.google.com), enable:

- **Authentication** → Sign-in method → Email/Password
- **Firestore Database** → Create database

### 3. Frontend environment variables

The frontend uses Vite's mode-based env files. Vite picks the right one automatically — `npm run dev` loads `.env.development`, `npm run build` loads `.env.production`.

Copy the example file:

```bash
cd frontend
cp .env.example .env.development
cp .env.example .env.production
```

Then set the API URL differently in each:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5001/YOUR_PROJECT_ID/us-central1/api

# .env.production
VITE_API_BASE_URL=/api
```

Fill in the Firebase web config values (identical in both files) from **Project settings → General → Your apps → SDK setup and configuration**.

> [!NOTE]
> Every `VITE_*` variable is inlined into the JavaScript bundle and is visible to anyone who opens devtools. Firebase **web** API keys are designed to be public — they identify your project, they don't grant access. Security comes from Firestore rules and the backend auth middleware. Never put a real secret in a `VITE_*` variable.

### 4. Backend secrets

The backend runs on Cloud Functions with an attached service account, so **Firebase Admin credentials don't need to be stored anywhere**. Initialize with:

```typescript
initializeApp({ credential: applicationDefault() });
```

For any genuine secrets (third-party API keys, webhook signing secrets), use Firebase Secret Manager:

```bash
cd backend
firebase functions:secrets:set SECRET_NAME
```

You'll be prompted for the value. It's stored in Google Secret Manager and injected at runtime.

Declare each secret in your function definition — without this, the variable will be missing at runtime:

```typescript
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

const SECRET_NAME = defineSecret("SECRET_NAME");

export const api = onRequest(
  { region: "us-central1", secrets: [SECRET_NAME] },
  app,
);
```

Useful commands:

```bash
firebase functions:secrets:access SECRET_NAME   # View a value
firebase functions:secrets:destroy SECRET_NAME  # Delete a secret
```

> [!WARNING]
> Secrets declared with `defineSecret` are only available **inside** the request handler, not at module load time. Code that reads `process.env.SECRET_NAME` at the top level will get `undefined` in production even though it works locally with dotenv.

Non-secret backend config (allowed origins, log level) goes in a plain `.env` file in the backend directory, which Firebase uploads with the deploy.

### 5. Run locally

Start the backend emulators:

```bash
cd backend
npm run build
firebase emulators:start
```

| Emulator    | Port |
| ----------- | ---- |
| Functions   | 5001 |
| Firestore   | 8080 |
| Auth        | 9099 |
| Emulator UI | 4000 |

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The app runs at `http://localhost:5173`.

---

## 🔑 Environment variable reference

### Frontend

| Variable                    | Example                        | Description                                                  |
| --------------------------- | ------------------------------ | ------------------------------------------------------------ |
| `VITE_API_BASE_URL`         | `/api`                         | Backend base URL. Relative in production via Hosting rewrite |
| `VITE_FIREBASE_API_KEY`     | `AIzaSy...`                    | Firebase web API key (public)                                |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Auth domain                                                  |
| `VITE_FIREBASE_PROJECT_ID`  | `your-project-id`              | Project ID                                                   |

### Backend

| Variable          | Storage               | Description                                           |
| ----------------- | --------------------- | ----------------------------------------------------- |
| Admin credentials | _Not stored_          | Provided automatically by the runtime service account |
| Third-party keys  | Secret Manager        | Set via `firebase functions:secrets:set`              |
| Non-secret config | `.env` in backend dir | Uploaded with the deploy                              |

---

## 📦 Deployment

### Backend

```bash
cd backend
npm run build
firebase deploy --only functions
```

Requirements for a successful deploy:

- `package.json` has `"main": "dist/index.js"` and `"engines": { "node": "22" }`
- The Express app is exported wrapped in `onRequest` — **not** calling `app.listen()`
- Every script referenced in the `predeploy` array actually exists

### Frontend

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Avoiding CORS with a Hosting rewrite

Routing API calls through Firebase Hosting keeps everything same-origin, so no CORS configuration is needed. In the frontend's `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      { "source": "/api/**", "function": "api" },
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

> [!IMPORTANT]
> Rewrite order matters. The `/api/**` rule must come **before** the `**` catch-all, or every API request returns `index.html` instead of hitting your function.

### Firestore rules and indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

The `sleepLogs` and `feedingLogs` collections each need a composite index on `userId + babyId + date`. On the first query Firestore returns an error containing a link that creates the index for you.

### Deploy everything

```bash
firebase deploy
```

---

## 🔧 Troubleshooting

<details>
<summary><strong>Missing script: "lint"</strong> during deploy</summary>

The `predeploy` array in `firebase.json` references a script that doesn't exist in `package.json`. Either add the script or remove it from `predeploy`. Run `npm run` to list available scripts.

</details>

<details>
<summary><strong>Deploy succeeds but no functions appear</strong></summary>

`package.json` is missing `"main"`, or it points at a path that doesn't exist after the build. Confirm the compiled entry file is where `main` says it is.

</details>

<details>
<summary><strong>API calls return HTML instead of JSON</strong></summary>

The Hosting catch-all rewrite is matching before the `/api/**` rule. Move `/api/**` first in the `rewrites` array.

</details>

<details>
<summary><strong>Production build points at localhost</strong></summary>

`.env.local` loads during **both** dev and build, so a localhost value there leaks into production. Put dev-only values in `.env.development` instead. Verify with `grep -r "localhost" dist/` before deploying.

</details>

<details>
<summary><strong>Firestore query fails with an index error</strong></summary>

Expected on first run. The error message includes a link that creates the required composite index — open it and wait a minute for the index to build.

</details>

<details>
<summary><strong>Emulators won't start</strong></summary>

The Firestore emulator requires Java. Check with `java -version` and install a JDK if it's missing. Also confirm ports 4000, 5001, 8080, and 9099 are free.

</details>

---

## 🔮 Roadmap

- [x] Sleep tracking with wake windows
- [x] Feeding tracking (breastfeeding and bottle)
- [x] User authentication with token refresh
- [x] Cloud data persistence
- [ ] Weekly and monthly analytics
- [ ] Personalized sleep and feeding insights
- [ ] Growth tracking
- [ ] Notifications and reminders
- [ ] Data export
- [ ] Multi-device synchronization

---

## 💡 Why I built this

As a new parent, I found myself constantly tracking my baby's sleep and feeding using spreadsheets and handwritten notes. Existing apps either felt overly complicated or lacked the flexibility I wanted.

LullaTrack began as a solution to a real problem I experienced every day. It also serves as a portfolio project demonstrating scalable frontend architecture, reusable React components, thoughtful UX, and production-style application design.
