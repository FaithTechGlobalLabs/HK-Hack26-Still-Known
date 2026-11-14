# Development

> Status: frontend MVP in progress · Last reviewed 2026-11-14 · Related:
> [CODE_STYLES.md](CODE_STYLES.md) · [ARCHITECTURE.md](ARCHITECTURE.md) ·
> [DEPLOYMENT.md](DEPLOYMENT.md)

This document is for running the project locally and shipping a change. Product planning lives in
[README.md](../README.md); screens are in [PAGES.md](PAGES.md).

**Current state:** `frontend/` contains an Angular 22 + Leaflet MVP with one hard-coded university
(University of Washington) and two hard-coded Seattle churches. It has no backend, no database and no
report form yet. Run it with `cd frontend`, `npm install`, `npm start`. The backend and Gradle
scaffold described below are still planned, not implemented.

## 1. Planned repository layout

```text
still-known/
├── backend/
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   ├── gradlew
│   ├── gradlew.bat
│   └── src/
│       ├── main/java/hk/stillknown/
│       ├── main/resources/
│       │   ├── application.yml
│       │   ├── application-local.yml
│       │   └── db/migration/
│       └── test/java/hk/stillknown/
├── frontend/
│   ├── package.json
│   ├── angular.json
│   ├── proxy.conf.json
│   └── src/
│       ├── app/
│       ├── assets/i18n/
│       └── environments/
├── data/
│   └── seed/
│       ├── london.csv
│       ├── toronto.csv
│       └── vancouver.csv
├── doc/
├── docker-compose.yml
├── Dockerfile
├── .editorconfig
├── .gitattributes
├── .nvmrc
├── .java-version
└── README.md
```

The backend and frontend are separate projects but one deployable unit. The Dockerfile builds the
frontend, copies the output into the Spring Boot static resources, and produces one image.

### 1.1 Data that must never enter this repository

`data/seed/` holds **place data only** — one CSV per city, columns defined in
[SCHEMA.md](SCHEMA.md) §11. The low-tech pilot's working files never go here, or anywhere else in the
repository or its history.

Never commit:

- the pilot `Students` tab, or any student name, email, school, destination or departure date;
- the pilot `Connectors` tab, or any connector's contact details, references or consent record;
- match outcomes, introduction emails, follow-up notes, safeguarding notes or consent images;
- photos of connection cards, even with names blurred or cropped;
- a `.env` file containing real admin credentials, a session secret or a database URL with a password.

The `Places` tab may be exported to `data/seed/<city>.csv` **after** removing any pilot-only columns.
That export contains public facts about organisations, not people. If a file contains a person's name
as a contact, it does not belong in the repository.

Use `data/seed/` for reproducible fixtures only. Local databases may be seeded from it; CI and demo
environments use synthetic or curated public data. Student and connector data lives in the restricted
drive described in [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md) §6.

If personal data is committed by mistake, treat it as an incident: remove it, rotate any exposed
credential, and rewrite history rather than deleting it in a later commit. The history is the leak.

## 2. Prerequisites

| Tool           | Version                  | Check                    |
|----------------|--------------------------|--------------------------|
| Java           | 21 LTS                   | `java -version`          |
| Node           | 22 LTS (pin in `.nvmrc`) | `node --version`         |
| npm            | Bundled with Node        | `npm --version`          |
| Docker Desktop | Current                  | `docker compose version` |
| Git            | Current                  | `git --version`          |

The Gradle wrapper is committed; do not install Gradle globally. Angular CLI is invoked through
`npx` or the project's npm scripts; a global install is optional.

## 3. First run

### 3.1 Start the database

```powershell
docker compose up -d db
docker compose ps
```

The local database is defined in `docker-compose.yml`:

| Setting  | Local value               |
|----------|---------------------------|
| Host     | `localhost`               |
| Port     | `5432`                    |
| Database | `stillknown`              |
| User     | `stillknown`              |
| Password | `stillknown` (local only) |

These credentials are deliberately trivial and must never be used outside local development.

### 3.2 Start the backend

```powershell
cd backend
.\gradlew.bat bootRun --args="--spring.profiles.active=local"
```

On macOS or Linux:

```bash
cd backend
./gradlew bootRun --args="--spring.profiles.active=local"
```

Flyway applies migrations on startup. The API is available at `http://localhost:8080/api/v1`. Health
is at `http://localhost:8080/actuator/health`.

### 3.3 Start the frontend

```powershell
cd frontend
npm ci
npm start
```

Open `http://localhost:4200`. The dev server proxies `/api` to `http://localhost:8080` using
`proxy.conf.json`, so cookies and CSRF behave exactly as they do in production. Do not solve local
problems by enabling broad CORS; fix the proxy.

### 3.4 Sign in to the admin area

Local credentials come from environment variables, not the repository:

```powershell
$env:STILLKNOWN_ADMIN_USERNAME = "curator"
$env:STILLKNOWN_ADMIN_PASSWORD = "{noop}local-only"
```

Then open `http://localhost:4200/admin/login`. The `{noop}` prefix is accepted **only** in the
`local` profile. Production refuses to start without a BCrypt hash.

Generate a BCrypt hash with `htpasswd` from `apache2-utils` (Git Bash or WSL):

```bash
htpasswd -bnBC 12 "" "your-password" | tr -d ':\n'
```

If `htpasswd` is unavailable, add a small Gradle task that uses Spring Security's
`BCryptPasswordEncoder`; do not paste a plaintext password into a configuration file.

## 4. Seed data

Seed files live in `data/seed/` and use the CSV format in [SCHEMA.md](SCHEMA.md). Two ways to load
them:

1. **Admin import (preferred).** Sign in, open `/admin/import`, upload a file, review the dry run,
   then commit.
2. **Local auto-import.** Set `STILLKNOWN_SEED_ON_START=true` before starting the backend. On the
   `local` profile only, the app imports each CSV through the same parser **when the `place` table
   is empty**. It never overwrites existing edits.

Auto-import logs a summary and fails the startup if a seed file is invalid. That is intentional: a
broken seed is a development bug, not a warning.

## 5. Configuration

Environment variables use Spring Boot's relaxed binding; the table lists the canonical names.

### 5.1 Backend

| Variable                                 | Default (local)                               | Purpose                                      |
|------------------------------------------|-----------------------------------------------|----------------------------------------------|
| `SPRING_PROFILES_ACTIVE`                 | `local`                                       | `local`, `staging`, `prod`                   |
| `SPRING_DATASOURCE_URL`                  | `jdbc:postgresql://localhost:5432/stillknown` | JDBC URL                                     |
| `SPRING_DATASOURCE_USERNAME`             | `stillknown`                                  | Database user                                |
| `SPRING_DATASOURCE_PASSWORD`             | `stillknown`                                  | Database password; secret in production      |
| `STILLKNOWN_ADMIN_USERNAME`              | `curator`                                     | Single admin identity                        |
| `STILLKNOWN_ADMIN_PASSWORD`              | `{noop}local-only`                            | BCrypt hash in production                    |
| `STILLKNOWN_PUBLIC_BASE_URL`             | `http://localhost:4200`                       | Canonical links and redirects                |
| `STILLKNOWN_SESSION_TIMEOUT`             | `60m`                                         | Admin idle timeout                           |
| `STILLKNOWN_VISIBILITY_AGING_AFTER_DAYS` | `180`                                         | Amber threshold                              |
| `STILLKNOWN_VISIBILITY_HIDE_AFTER_DAYS`  | `365`                                         | Public expiry                                |
| `STILLKNOWN_REPORT_RATE_LIMIT_PER_HOUR`  | `5`                                           | Report submissions per IP hash               |
| `STILLKNOWN_REPORT_RATE_LIMIT_BURST`     | `2`                                           | Burst allowance                              |
| `STILLKNOWN_LOGIN_RATE_LIMIT`            | `5`                                           | Failed logins per 15 minutes per IP hash     |
| `STILLKNOWN_SEED_ON_START`               | `false`                                       | Local-only seed import                       |
| `STILLKNOWN_CORS_ORIGINS`                | empty                                         | Dev-only override; production is same-origin |
| `STILLKNOWN_LOG_LEVEL`                   | `INFO`                                        | Root log level                               |

### 5.2 Frontend (build-time)

| Variable           | Default                        | Purpose                       |
|--------------------|--------------------------------|-------------------------------|
| `API_BASE_URL`     | `/api/v1`                      | Same-origin API base          |
| `TILE_URL`         | OpenStreetMap dev URL          | Raster tile template          |
| `TILE_ATTRIBUTION` | `© OpenStreetMap contributors` | Required attribution          |
| `TILE_MAX_ZOOM`    | `19`                           | Map adapter limit             |
| `PUBLIC_BASE_URL`  | `http://localhost:4200`        | Canonical and Open Graph URLs |

Tile keys are public by nature; they are not secrets. Restrict them by domain/referrer at the
provider. Never put a private API key in the frontend.

## 6. Commands

| Task                      | Command                                                                     |
|---------------------------|-----------------------------------------------------------------------------|
| Start database            | `docker compose up -d db`                                                   |
| Stop database             | `docker compose stop db`                                                    |
| Reset database            | `docker compose down -v` then start again                                   |
| Backend run               | `cd backend; .\gradlew.bat bootRun --args="--spring.profiles.active=local"` |
| Backend tests             | `cd backend; .\gradlew.bat test`                                            |
| Backend format check      | `cd backend; .\gradlew.bat spotlessCheck`                                   |
| Backend format apply      | `cd backend; .\gradlew.bat spotlessApply`                                   |
| Frontend install          | `cd frontend; npm ci`                                                       |
| Frontend dev server       | `cd frontend; npm start`                                                    |
| Frontend tests            | `cd frontend; npm test -- --watch=false`                                    |
| Frontend lint             | `cd frontend; npm run lint`                                                 |
| Frontend format check     | `cd frontend; npm run format:check`                                         |
| Frontend production build | `cd frontend; npm run build`                                                |
| End-to-end tests          | `cd frontend; npm run e2e`                                                  |
| Build container           | `docker build -t still-known .`                                             |

On macOS or Linux, replace `.\gradlew.bat` with `./gradlew`.

## 7. Database workflow

1. Add a migration under `backend/src/main/resources/db/migration/`:
   `V003__add_place_accessibility_note.sql`.
2. Never edit a migration that has been applied anywhere. Fix forward.
3. Update [SCHEMA.md](SCHEMA.md) in the same pull request.
4. Restart the backend; Flyway applies pending migrations.
5. For a destructive change, take a backup first and note it in the pull request.
6. Run the integration tests against Testcontainers PostgreSQL. Do not test migrations against H2.

Local repair after a checksum mismatch (only when the migration was never shared):

```powershell
docker compose down -v
docker compose up -d db
cd backend
.\gradlew.bat bootRun --args="--spring.profiles.active=local"
```

Never use `flyway repair` on production to hide an edited migration.

## 8. Tests and quality gates

A change is ready when:

- `.\gradlew.bat test` passes, including Testcontainers integration tests.
- `npm test -- --watch=false` passes.
- `npm run lint` and `npm run format:check` pass.
- `.\gradlew.bat spotlessCheck` passes.
- `npm run build` succeeds within the configured bundle budgets.
- New behaviour has a test at the lowest sensible level (see [CODE_STYLES.md](CODE_STYLES.md) §7).
- Accessibility smoke checks pass on any changed public page.
- [API.md](API.md), [SCHEMA.md](SCHEMA.md) or [PAGES.md](PAGES.md) is updated if the contract
  changed.

Useful test slices:

```powershell
# One backend test class
cd backend
.\gradlew.bat test --tests "hk.stillknown.place.VisibilityPolicyTest"

# One frontend spec
cd frontend
npm test -- --watch=false --include="**/filter.predicate.spec.ts"
```

## 9. Continuous integration

GitHub Actions runs on every pull request:

1. **Backend:** Java 21, Gradle cache, `spotlessCheck`, `test` (Testcontainers starts PostgreSQL).
2. **Frontend:** Node from `.nvmrc`, `npm ci`, `lint`, `format:check`, unit tests, production build.
3. **End-to-end:** Playwright against a seeded compose stack; allowed to run on pull requests that
   touch UI or API code.
4. **Container:** build the image on `main` and on release tags; do not push from pull requests.

CI must not require production secrets. If a test needs an admin login, it uses a test-only profile
with a `{noop}` password that exists only in the CI environment.

## 10. Local troubleshooting

| Symptom                                | Likely cause                        | Fix                                                                                    |
|----------------------------------------|-------------------------------------|----------------------------------------------------------------------------------------|
| `Connection refused` to PostgreSQL     | Docker not running or port conflict | Start Docker Desktop; check `docker compose ps`; change the host port if 5432 is taken |
| Flyway checksum mismatch               | An applied migration was edited     | Recreate the local database; never edit shared migrations                              |
| `401` on every admin call              | Session cookie not sent             | Use the Angular proxy, not a direct cross-origin API URL; check `withCredentials`      |
| `403` on POST                          | Missing CSRF token                  | Call `/api/v1/auth/csrf` first; confirm the `XSRF-TOKEN` cookie is present             |
| Login works, then immediately logs out | `Secure` cookie on plain HTTP       | `Secure` is enabled only in the `prod` profile; use `local`                            |
| Map is grey after navigation           | Leaflet container size is stale     | Call `invalidateSize()` after layout changes                                           |
| Tiles blocked in production            | Content Security Policy             | Add the tile host to `img-src`; see [DEPLOYMENT.md](DEPLOYMENT.md)                     |
| `npm ci` fails on Windows              | Line endings or stale lockfile      | Check `.gitattributes`; do not mix npm and pnpm                                        |
| Java version error                     | Wrong JDK on `PATH`                 | `java -version` must be 21; set `JAVA_HOME`                                            |
| Seed import fails on startup           | Invalid CSV                         | Read the row error in the log; fix the file, not the parser                            |

## 11. Definition of done

A pull request is done when:

- The user-visible behaviour matches [PAGES.md](PAGES.md) or the page spec is updated.
- Public visibility rules still hold for the new code path.
- No new non-goal has crept in.
- Tests and lint pass locally and in CI.
- The change is documented where the contract lives.
- No secret, personal data or debug logging is included.
- No student, parent, connector or match data — and no pilot spreadsheet or card image — is added to
  the repository, a fixture or a test snapshot.
- No endpoint, table or form has been introduced that collects or stores student or connector data.
- A reviewer can understand the change from the description without reading every line.
