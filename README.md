# 🐄 Snoochies Starter

A small Express + React starter that ships a minimal API and a Vite front-end already wired together. It is meant for quick prototypes or homelab utilities where you want a typed backend and a simple UI without a lot of ceremony.

## ✨ What you get

- **Express API** with Helmet, CORS, rate limiting, and structured logging via Pino.
- **Typed configuration** validated with Zod.
- **Prisma + Postgres** ready with a starter model and a singleton client helper.
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

2. Create an `.env` file in the repo root to configure the API and optional database values. At minimum, set the port (defaults to 3000) and allowed CORS origins (required for cross-origin frontend access). Ports must be numeric and between 1-65535; empty values are rejected.

```sh
PORT=3000
CORS_ORIGINS=http://localhost:5173
# Optional database settings if you wire up Prisma/Postgres
# DATABASE_URL=postgresql://user:password@localhost:5432/snoochies
```

3. Run both the API and frontend in development mode

```sh
npm run dev
```

- API: http://localhost:3000
- Frontend: http://localhost:5173 (set `VITE_API_URL` to point at the API if it is on a different origin)

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
- `GET /readyz` — readiness (returns 200 if DB is reachable, 503 otherwise).
- `GET /` — returns the View Askewniverse greeting.
- `POST /echo` — accepts `{ "message": "text" }` and echoes it back (validated with Zod).
- `GET /messages` — returns messages from Prisma.
- `POST /messages` — create a message with `{ "text": "..." }` (Prisma-backed example).

## 🖥️ Frontend overview

The Vite React app displays the API greeting and lets you refresh it. Set `VITE_API_URL` in your `.env` to point at a remote API or a locally running API on a different port (e.g., `http://localhost:3000`). If unset, the frontend will call the same origin it is served from (useful in production when API and frontend are hosted together).

## 🧑‍💻 Local development

When working on this template locally (not in the eventual `npx` scaffold), you can spin up a throwaway Postgres instance via Docker Compose to exercise Prisma and API changes without touching your personal databases.

1. Ensure Docker is running, then start the database

```sh
docker compose -f docker-compose.dev.yml up -d
```

This launches Postgres 16 on `localhost:5432` with user/password `postgres` and database `snoochies_dev` (data is persisted to a local Docker volume).

2. Point your env at the local DB

```sh
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/snoochies_dev" >> .env
```

3. Generate Prisma client and apply migrations as needed

```sh
npm run db:generate
npm run db:migrate   # creates prisma/migrations entries for local dev
npm run db:seed      # optional: seed sample data
```

4. Run the app or tests as usual

```sh
npm run dev
npm test
```

5. Tear down when done (data persists in the volume; use `docker volume rm snoochies_postgres_data` to wipe)

```sh
docker compose -f docker-compose.dev.yml down
```

This Compose file is for contributor/local testing only and is not intended to ship with any `npx`-delivered starter output.

## 🗄️ Database (Prisma)

- Schema lives in `prisma/schema.prisma` with a starter `Message` model.
- Prisma client is generated on install (`npm install` / `npm ci`), but you can rerun via `npm run db:generate`.
- Develop migrations: `npm run db:migrate` (creates migrations in `prisma/migrations`).
- Deploy migrations in CI/production: `npm run db:deploy`.
- Inspect data: `npm run db:studio`.
- `DATABASE_URL` defaults to `postgresql://postgres:postgres@localhost:5432/snoochies`; update it when you connect a real database.

## 🛠️ Useful scripts

- `npm run dev` — run API (`api/src/index.ts`) and frontend together.
- `npm run build` — compile the API and bundle the frontend.
- `npm run start` — serve the compiled API from `api/dist`.
- `npm run typecheck` — run TypeScript type checks for API and frontend.
- `npm run lint` — ESLint over `api/src` and `frontend/src`.
- `npm test` — run linting plus tests (frontend uses Vitest; API uses Jest with handler-level tests).
- `npm run db:*` — Prisma helpers (generate client, migrate, deploy, studio).
- Node version: >= 24.11.1 (see `.nvmrc` for local use)

## 🗄️ Database (Prisma)

- Schema lives in `prisma/schema.prisma` with a starter `Message` model.
- Prisma client is generated on install (`npm install` / `npm ci`), but you can rerun via `npm run db:generate`.
- Develop migrations: `npm run db:migrate` (creates migrations in `prisma/migrations`).
- Deploy migrations in CI/production: `npm run db:deploy`.
- Inspect data: `npm run db:studio`.
- `DATABASE_URL` defaults to `postgresql://postgres:postgres@localhost:5432/snoochies`; update it when you connect a real database.
- Seed sample data: `npm run db:seed`.

## 📦 Scaffold vs. repo-only assets

- Shipped in `npx` starter: API + frontend code, Prisma schema, scripts, tests.
- Repo-only (developer conveniences): `docker-compose.dev.yml`, release workflow, Dependabot config, and other CI/pipeline wiring. These are for maintaining the template and won’t be emitted in generated apps.

## 📄 License

MIT
