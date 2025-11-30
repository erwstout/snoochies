# 🐄 Snoochies Starter

A small Express + React starter that ships a minimal API and a Vite front-end already wired together. It is meant for quick prototypes or homelab utilities where you want a typed backend and a simple UI without a lot of ceremony.

## ✨ What you get

- **Express API** with Helmet, CORS, rate limiting, and structured logging via Pino.
- **Typed configuration** validated with Zod.
- **React + Vite frontend** that calls the API using TanStack Query.
- Ready-to-run npm scripts for local development, builds, linting, and tests.

## 📂 Project layout

- `api/` — Express server code, environment parsing, and helpers.
- `frontend/` — React app powered by Vite with a simple API message card.
- `eslint.config.js` and `tsconfig.json` — shared linting and TypeScript configuration.

## 🚀 Getting started

1. Install dependencies

```sh
npm install
```

2. Create an `.env` file in the repo root to configure the API and optional database values. At minimum, set the port (defaults to 3000) and allowed CORS origins:

```sh
PORT=3000
CORS_ORIGINS=http://localhost:5173
# Optional database settings if you wire up Knex/PG later
# DATABASE_URL=postgres://user:password@localhost:5432/snoochies
```

3. Run both the API and frontend in development mode

```sh
npm run dev
```

- API: http://localhost:3000
- Frontend: http://localhost:5173 (configured to call the API via `VITE_API_URL` if provided)

4. Build for production

```sh
npm run build
```

5. Lint and test

```sh
npm run lint
npm test
```

## 🧭 API overview

- `GET /healthz` — liveness check with uptime info.
- `GET /` — returns the View Askewniverse greeting.
- `POST /echo` — accepts `{ "message": "text" }` and echoes it back (validated with Zod).

## 🖥️ Frontend overview

The Vite React app displays the API greeting and lets you refresh it. Update `VITE_API_URL` in your `.env` to point at a remote API, or leave it unset to target `http://localhost:3000` during local development.

## 🛠️ Useful scripts

- `npm run dev` — run API (`api/src/index.ts`) and frontend together.
- `npm run build` — compile the API and bundle the frontend.
- `npm run start` — serve the compiled API from `api/dist`.
- `npm run lint` — ESLint over `api/src` and `frontend/src`.
- `npm test` — run linting plus frontend Jest tests.
- `npm run db:*` — Knex helpers (migrate, rollback, seed) should you connect a database.

## 📄 License

MIT
