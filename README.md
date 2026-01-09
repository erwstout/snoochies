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
- `packages/cli/` — source for the published `get-snoochies` scaffolder.
- `templates/` — extra assets the CLI can copy into new projects (e.g., the Docker profile).
- `prisma/` — shared Prisma schema, migrations, and seed data.
- `docs/` — additional notes about the scaffolder prompts and emitted files.
- `eslint.config.js`, `tsconfig.json`, and `prettier` config — shared tooling at the repo root, referenced by the API, frontend, and CLI.

## 🧰 Scaffold anywhere with `npx`

Spin up a fresh project without cloning this repository:

```sh
npx get-snoochies my-snoochies-app             # Default Node + API layout
npx get-snoochies my-snoochies-app --with-docker # Adds docker-compose.yml, .dockerignore, and .env.docker.example
```

- Copies the starter template, including Prettier, ESLint, Jest, and TypeScript configs.
- Prunes repo-only files like `docker-compose.dev.yml`, `.github` workflows, and Husky hooks.
- Installs dependencies automatically (pass `--no-install` to skip).
- Updates `package.json` and `package-lock.json` to match your chosen project name.
- Normalizes project names to kebab-case so folders and package names stay safe and consistent.
- Lets you choose between the default Node-only scaffold or a dockerized stack (API + frontend + Postgres) with a `--with-docker` flag or interactive prompt.

See [docs/scaffold.md](docs/scaffold.md) for a full walkthrough of the prompts, defaults, emitted files, and package manager choices when running `npx get-snoochies`.

## 🚀 Getting started

Choose the install mode that fits your workflow. The API, frontend, and CLI are now separated into their own folders while still sharing Prisma, TypeScript, ESLint, and Prettier tooling from the repo root.

### Node-only (default)

1. Install dependencies

```sh
npm install
```

2. Create an `.env` file in the repo root. At minimum, set the port (defaults to 3000) and allowed CORS origins (required for cross-origin frontend access). Ports must be numeric and between 1-65535; empty values are rejected.

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

### Dockerized stack (use `--with-docker` when scaffolding)

The docker profile emits `docker-compose.yml`, `.dockerignore`, and `.env.docker.example`. It runs the API and frontend in Node containers alongside a Postgres database.

1. Copy the Docker env file and adjust as needed

```sh
cp .env.docker.example .env.docker
```

2. Start the stack

```sh
docker compose up --build
```

- API: http://localhost:3000
- Frontend: http://localhost:5173 (talks to `http://api:3000` inside Compose)
- Database: exposed on port 5432 for admin tools; Prisma points at `postgresql://postgres:postgres@db:5432/snoochies`

3. Run Prisma and tests inside the API container

```sh
docker compose exec api npm run db:generate
docker compose exec api npm run typecheck
docker compose exec api npm test
# Optional seed hook
# docker compose exec api npm run db:seed
```

4. Tear down when finished

```sh
docker compose down --remove-orphans
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
- Prisma config lives in `prisma.config.ts`, which points at `DATABASE_URL` (defaults to `postgresql://postgres:postgres@localhost:5432/snoochies`).
- Prisma client is generated on install (`npm install` / `npm ci`), but you can rerun via `npm run db:generate`.
- Develop migrations: `npm run db:migrate` (creates migrations in `prisma/migrations`).
- Deploy migrations in CI/production: `npm run db:deploy`.
- Inspect data: `npm run db:studio`.
- Seed sample data: `npm run db:seed`.
- Uses Prisma 7 with the PostgreSQL driver adapter (`@prisma/adapter-pg` + `pg`).

## 🛠️ Useful scripts

- `npm run dev` — run API (`api/src/index.ts`) and frontend together.
- `npm run build` — compile the API, build the CLI package, and bundle the frontend.
- `npm run start` — serve the compiled API from `api/dist`.
- `npm run typecheck` — run TypeScript type checks for the API, frontend, and CLI.
- `npm run lint` — ESLint over `api/src`, `frontend/src`, and `packages/cli/src`.
- `npm test` — run linting plus tests (frontend uses Jest; API uses Jest with handler-level tests).
- `npm run db:*` — Prisma helpers (generate client, migrate, deploy, studio).
- Node version: >= 24.11.1 (see `.nvmrc` for local use).

## 📦 Scaffold vs. repo-only assets

- Shipped in `npx` starter: API + frontend code, Prisma schema, scripts, tests.
- Repo-only (developer conveniences and scaffolder internals): `packages/` (CLI source), `templates/` (scaffold-only assets), `docker-compose.dev.yml`, CI/release automation, Dependabot config, and coverage artifacts. These are for maintaining the template and won’t be emitted in generated apps.

## 📄 License

MIT
