# AGENTS.md — Sohnic ERP Backend

Express v5 + TypeScript (CommonJS) + PostgreSQL 16 + Drizzle ORM. Single package, no workspaces. Entry: `src/server.ts` → `src/app.ts` → `/api/v1/*` + `/health-check`.

## Commands

```bash
npm run start:dev   # auto-runs db:migrate, then nodemon src/server.ts
npm run build       # tsc → dist/ (only verification available: no tests/lint)
npm run start:prod  # auto-runs db:migrate, then node dist/server.js
npm run db:generate # drizzle-kit generate (schema → drizzle/migrations)
npm run db:migrate  # drizzle-kit migrate
docker compose up db -d        # DB only for local dev
docker compose up --build      # full stack: API :3001→:3000, pgAdmin :5051
```

- No test runner, no linter, no formatter. Verify with `npm run build` (`tsc` is strict + `noUnusedLocals` — unused vars fail the build).
- `start:dev`/`start:prod` always migrate first; don't run the app without a reachable DB.

## Env / DB gotchas

- Env is Zod-validated at import (`src/config/env.ts`); missing key crashes on startup. `NODE_ENV` allows only `development | production`.
- `.env.example` `DATABASE_URL` points at host `db:` (compose networking). For local `npm run start:dev` against host Postgres, use `localhost`. Keep `.env` in sync with `src/config/env.ts` + `.env.example`.
- Compose maps host ports differently: DB `5434→5432`, API `3001→3000`. `DB_PORT`/`DATABASE_URL` must match whichever path you use.
- Drizzle source of truth: `drizzle/schema/*` (re-exported via `drizzle/schema/index.ts`); config `drizzle.config.ts`; migrations output `drizzle/migrations`. Workflow: edit schema → `db:generate` → `db:migrate`.
- DB singleton lives in `src/config/drizzle.ts` (`pg` Pool + `DATABASE_URL`). Repositories import it — never open a second pool.
- Seed (`drizzle/seeds/seed.ts`) has no npm script; run explicitly, e.g. `npx ts-node drizzle/seeds/seed.ts`.

## Architecture (follow the layering)

`routes/v1/*.routes.ts` → `middlewares/validate.ts` (+ auth) → `containers/*.container.ts`-wired controller → `services/*` (typed by `src/interfaces/`) → `repositories/*` → Drizzle.

- Manual DI: wire new services/controllers in `src/containers/*.container.ts` (see `auth.container.ts`); shared repos in `repositories.container.ts`; shared auth middleware in `middleware.container.ts`. Don't `new` services/repos inside routes.
- Route convention (see `items.routes.ts`): `isAuthenticated` → `isAuthorized(...roles)` → `validate*` → `controller.method`. Role strings come from `UserRole` enum in `drizzle/schema` — check it before inventing a role name.
- Validation: build Zod DTOs under `src/dtos/`, expose via `src/validators/*.validator.ts` using `validate({ body, query, params })`. Reuse `validators/common.validator.ts` (`validateId`, `validatePagination`, …). Query strings parse with `qs` (nested filter syntax supported). Failures throw `HttpUnprocessableEntity` (422) via `@httpx/exception`.
- Errors: throw `APIError` (`src/utils/APIError.ts`) or `@httpx/exception` HTTP errors; `middlewares/globalErrorHandler.ts` maps Zod/JWT/Postgres `23505`→409 / `23503`→400. Success via `sendResponse` envelope (`size, message, data, accessToken, refreshToken, timestamp`).
- Auth: `Authorization: Bearer <accessToken>`; `isAuthenticated` rejects missing/inactive/deleted users. `express.d.ts` augments `req.user`.
- `PATCH /items/:id` has `checkImmutableItemFields` before validation — item `type` fields are immutable; respect that pattern for similar guards.
