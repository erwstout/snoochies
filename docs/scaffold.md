# Scaffolding with `npx get-snoochies`

Use the published CLI to generate a fresh Snoochies starter without cloning this repository.

## Quick start

```sh
npx get-snoochies my-snoochies-app
```

- Runs an interactive wizard to capture your project details.
- Copies the starter template (TypeScript everywhere) with ESLint, Prettier, and Jest prewired.
- Installs dependencies by default; pass `--no-install` or `--skip-install` to opt out.
- Prunes repo-only tooling files so the generated app stays lean.

## Wizard questions and defaults

The CLI asks a handful of questions; press **Enter** to accept the suggested default for each.

| Prompt              | Default                                                        | Notes                                                    |
| ------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| Project name        | From the first CLI argument, or `snoochies-starter` if omitted | Accepts any non-empty string; also sets the folder name. |
| Project description | `A Snoochies starter project.`                                 | Saved to `package.json`.                                 |
| Author              | `Anonymous`                                                    | You can provide your name/email.                         |
| License             | `MIT`                                                          | Used for `package.json`.                                 |
| Package manager     | `npm`                                                          | Choose between **npm** (default) or **pnpm**.            |

### Package manager selection

- Pick the manager in the prompt; the CLI adjusts install and run commands accordingly.
- When you choose **pnpm**, the starter records `pnpm` as the package manager and prints pnpm-friendly next steps.
- If you skip installation (`--no-install`/`--skip-install`), run the suggested `npm install` or `pnpm install` afterward before development.

## Files that ship vs. repo-only assets

Everything except the items below is copied into your new project, including the API, frontend, shared configuration, and tests.

**Repo-only (removed from generated apps):**

- `.git`
- `.github`
- `.husky`
- `.npmignore`
- `docker-compose.dev.yml`
- `node_modules`
- `api/dist`
- `frontend/dist`
- `packages`
- `coverage`
- `.nyc_output`
- `.tmp`

## What comes prewired

- **TypeScript** across the API and frontend with shared `tsconfig` settings.
- **ESLint** with project-wide configuration.
- **Prettier** for formatting.
- **Jest** for API tests (frontend uses Vitest but `npm test` runs both suites).

After generation, follow the printed next steps: change into the new directory, copy `.env.example` to `.env`, install dependencies if you skipped them, then run `dev`, `test`, and `lint` using your chosen package manager.
