# Copilot Instructions for Fish Focus

## Build, Test, and Lint Commands

### Frontend (Expo)
- **Start:** `npm start` (or `npx expo start`)
- **Android:** `npm run android`
- **iOS:** `npm run ios`
- **Web:** `npm run web`
- **Lint:** `npm run lint` (runs `expo lint`)

### Backend (Node.js/Express)
- **Dev Server:** `cd server && npm run dev`
- **Build:** `cd server && npm run build`
- **Start:** `cd server && npm start`

### Database (Prisma)
- **Generate Client:** `cd server && npm run prisma:generate`
- **Migrate:** `cd server && npm run prisma:migrate`

## High-Level Architecture

Fish Focus is a full-stack mobile productivity application.

- **Frontend:** Built with **Expo SDK 57** using **Expo Router** for file-based navigation.
  - Styling is handled by **NativeWind** (Tailwind CSS for React Native).
  - State management uses **Zustand**.
  - Screens are defined in the `app/` directory, where the file structure maps directly to the application routes.
- **Backend:** A **Node.js/Express** REST API located in the `server/` directory.
  - Uses a controller-route-middleware pattern.
  - Authentication is implemented via **JWT**.
- **Database:** **PostgreSQL** managed by **Prisma ORM**.

## Key Conventions

- **Expo Versioning:** This project uses Expo SDK 57. Always refer to the versioned documentation at `https://docs.expo.dev/versions/v57.0.0/` before implementing new frontend features.
- **Styling:** Use **NativeWind** utility classes (e.g., `className="flex-1 bg-blue-500"`) for all components.
- **Navigation:** Add new screens by creating files/folders in the `app/` directory following Expo Router conventions.
- **Backend Structure:**
  - `server/src/routes/`: Define API endpoints.
  - `server/src/controllers/`: Implement business logic.
  - `server/src/middleware/`: Handle cross-cutting concerns like JWT authentication.
  - `server/src/config/prisma.ts`: Single entry point for the Prisma client.
