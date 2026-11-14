# Deployment

> Status: pre-implementation · Last reviewed 2026-11-14 · Related:
> [ARCHITECTURE.md](ARCHITECTURE.md) · [DEVELOPMENT.md](DEVELOPMENT.md) · [API.md](API.md) ·
> [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md)

The default deployment is deliberately boring: **one container, one PostgreSQL database, one
domain**. No CDN is required, no message broker, no background worker. A hackathon team should be
able to deploy on a Friday and not think about infrastructure on Saturday.

## 1. Topology

```text
Internet
	│  HTTPS
	▼
Platform load balancer / TLS
	│
	▼
┌──────────────────────────────────────────────┐
│ Container: still-known                       │
│                                              │
│ Spring Boot :8080                            │
│  ├── /                 Angular static files  │
│  ├── /api/v1/**        REST API              │
│  ├── /actuator/health  liveness              │
│  └── SPA fallback      index.html            │
└──────────────────────┬───────────────────────┘
											 │ TLS, private network
											 ▼
								Managed PostgreSQL
```

Characteristics:

- One origin. No CORS. Cookies and CSRF work without special cases.
- Deep links work because the backend serves the SPA shell for client routes.
- Flyway runs at startup on a single instance. If the app ever scales horizontally, move migrations
  to a release job.
- The database is **not** publicly reachable. Only the application connects to it.

### 1.1 Data that must not be deployed

The deployment serves **public place data and private reports**. It must never contain or have
network access to the low-tech pilot's records.

- No `Students`, `Connectors` or match data in the production database, a seed file, a backup, a
  mounted volume or an object store bucket.
- No pilot spreadsheet in the image, the build context or a CI artifact.
- The pilot's restricted drive is a separate system with separate access control. It is not mounted
  into the container and the application has no credentials for it.
- Database backups are treated as potentially public data. Before restore or export, confirm the
  backup contains only place, report and audit tables.
- If a pilot file is found in a deployed artifact, treat it as a data incident: remove the artifact,
  rotate credentials, notify the safeguarding lead and follow the church's data-breach policy.

This is not a caching decision. The map's API has no concept of a student, so there is nothing
legitimate for a student record to be doing in this deployment. See
[ARCHITECTURE.md](ARCHITECTURE.md) §1.1 and [SCHEMA.md](SCHEMA.md) §1.1.

## 2. Container build

A multi-stage Docker build produces one image:

```dockerfile
# 1. Frontend
FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG API_BASE_URL=/api/v1
ARG TILE_URL=https://tile.example.com/{z}/{x}/{y}.png
ARG TILE_ATTRIBUTION=© OpenStreetMap contributors
ARG TILE_MAX_ZOOM=19
RUN npm run build

# 2. Backend, with the frontend copied into static resources
FROM gradle:8-jdk21 AS backend
WORKDIR /build
COPY backend/ ./
COPY --from=frontend /frontend/dist/ /build/src/main/resources/static/
RUN ./gradlew bootJar --no-daemon

# 3. Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=backend /build/build/libs/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
```

Notes:

- The exact Angular output path depends on the project name; adjust the `COPY --from=frontend` line.
- The image contains no build tools and no `.env` file.
- Run as a non-root user.
- Set `SPRING_PROFILES_ACTIVE=prod` at runtime, not build time.
- Pin the base image tags in the repository and update them deliberately.

## 3. Environments

| Environment | Purpose            | Database           | Admin             | Data                                              |
|-------------|--------------------|--------------------|-------------------|---------------------------------------------------|
| Local       | Development        | Docker Compose     | `{noop}` password | Seed CSV, disposable                              |
| Staging     | Pre-release checks | Managed, separate  | Real hash         | Anonymised or seed data, never production reports |
| Production  | Public             | Managed, backed up | Real hash         | Curated                                           |

Rules:

- Staging and production never share a database.
- Production report emails are not copied to staging.
- The environment name is visible in the admin header (`LOCAL`, `STAGING`, `PROD`) so a curator
  cannot confuse them.
- `prod` refuses to start if the admin password is not a BCrypt hash or the database URL is not
  configured.

## 4. Hosting options

Any platform that runs a container and provides managed PostgreSQL works. The decision is about
operational comfort, not architecture.

| Option                                                | Fit                                            | Trade-offs                                                           |
|-------------------------------------------------------|------------------------------------------------|----------------------------------------------------------------------|
| **Render** (web service + managed Postgres)           | Good default for a small team                  | Simple deploys, predictable pricing, sleeps on low tiers unless paid |
| **Fly.io** (machine + Postgres or external DB)        | Good for low latency and cheap small instances | More operational knobs; volume/DB choices need care                  |
| **Azure App Service + Azure Database for PostgreSQL** | Good if the team or school already uses Azure  | Heavier setup, cost management needed                                |
| **Railway**                                           | Fast hackathon deploy                          | Less mature for long-lived production                                |
| **Self-hosted VPS + Docker Compose**                  | Cheapest, most control                         | You own TLS, backups, monitoring and security patches                |

**Recommendation:** a managed container platform plus managed PostgreSQL, in a region close to Hong
Kong or the pilot cities (Singapore, London, Frankfurt or Toronto). Latency matters less than
reliability for this app; a student on a train will tolerate 200 ms, not a dead page.

Do not run PostgreSQL in the same container as the app. Backups and upgrades become your problem at
the worst possible moment.

## 5. Database operations

- Require TLS between the app and the database.
- Use a dedicated database user with rights only on the application schema.
- Connection pool: HikariCP defaults, sized below the database's connection limit. A single small
  instance does not need 50 connections.
- Backups: nightly automated backups, at least 7 daily and 4 weekly. Enable point-in-time recovery if
  the provider offers it.
- **Restore drill:** before launch and then quarterly, restore a backup into a scratch database and
  run the application against it. An untested backup is a rumour.
- Before a destructive migration, take a manual backup and record it in the release notes.
- Flyway runs at application startup. It holds a lock, so two instances starting at once do not both
  migrate. Still, prefer one instance during a release.
- Do not expose the database port to the internet. Use the platform's private network or an IP
  allowlist for administration.

## 6. Migrations and releases

Release sequence:

1. CI builds and tests the image, tagged with the git SHA.
2. Deploy the image to staging; run the smoke test.
3. Take a database backup if the release includes a destructive migration.
4. Deploy to production.
5. Flyway applies pending migrations.
6. Run the smoke test: health, a city page, a place page, report submission (test row removed or
   ignored), admin login, admin edit on a staging-only record.
7. Watch logs and the error rate for 15 minutes.

Rules:

- Migrations are forward-only. Flyway Community has no automatic rollback.
- A rollback deploys the previous image. If the previous code cannot read the new schema, restore the
  backup instead.
- Never edit an applied migration. If a migration is wrong, add a corrective one.
- Destructive changes (drop column, narrow a type) ship in two releases: add and dual-write, then
  remove later. At this scale, a short maintenance window is also acceptable, but say so.

## 7. Map tiles

| Environment | Provider                                                                                                        |
|-------------|-----------------------------------------------------------------------------------------------------------------|
| Local       | OpenStreetMap public tiles, low volume, correct attribution                                                     |
| Staging     | The production provider's free tier, or OSM with a low request cap                                              |
| Production  | A commercial or community provider with clear terms: MapTiler, Stadia Maps, Thunderforest, or self-hosted tiles |

Rules:

- The public OSM tile server is **not** a production CDN. Do not point a launch at it.
- Attribution is mandatory and visible: `© OpenStreetMap contributors`, linked to
  `https://www.openstreetmap.org/copyright`.
- The tile host must be allowed in the Content Security Policy `img-src`.
- Restrict the tile key by domain/referrer. A tile key is public, but an unrestricted key can be
  abused.
- If tiles fail, the list view remains usable. Test this by blocking the tile host in devtools.
- For a zero-cost long-term option, consider self-hosting vector tiles or PMTiles later; it is not a
  v1 task.

## 8. Security headers

Set these at the platform proxy or in a Spring filter. Test the CSP before launch; Ionic and Leaflet
both inject styles.

```text
Content-Security-Policy:
	default-src 'self';
	img-src 'self' data: https://tile.example.com;
	style-src 'self' 'unsafe-inline';
	script-src 'self';
	connect-src 'self';
	font-src 'self' data:;
	frame-ancestors 'none';
	base-uri 'self';
	form-action 'self';
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Cross-Origin-Opener-Policy: same-origin
```

- `'unsafe-inline'` in `style-src` is a pragmatic concession to Angular/Ionic style injection. Do
  not add it to `script-src`.
- If Leaflet marker icons are data URLs, `img-src data:` is required.
- If fonts are self-hosted, `font-src 'self'` is enough.
- Enable HSTS only after HTTPS is confirmed working; a bad HSTS header is hard to undo.
- Do not add a third-party script without updating the CSP and the privacy page.

## 9. Domain, SEO and sharing

- Canonical host: `https://stillknown.app` (or the final domain). Redirect `www` to the apex, or the
  reverse, but pick one.
- HTTPS only. Renew certificates automatically.
- `robots.txt`: allow public city and place pages; disallow `/admin`, `/api`, `/actuator`.
- `sitemap.xml`: generated from published cities and visible places. Update it on deploy or serve it
  dynamically from the API.
- Hidden, draft and expired places return `404` and are excluded from the sitemap.
- Global Open Graph and Twitter card tags ship in v1. Per-city and per-place preview images are a
  v1.1 improvement; until then, a WhatsApp share shows the generic card.
- The SPA fallback must return a real `404` status for unknown paths, not `200` with the shell. A
  soft 404 confuses search engines and users.
- Analytics, if enabled, must be cookieless and disclosed. No tag manager, no session recording.

## 10. Observability

- Uptime check: `GET /actuator/health` every minute, alert after three failures.
- Synthetic check: a city page and a place API response once every five minutes from one region.
- Logs: structured JSON, 30-day retention, no request bodies, no email addresses, no session ids.
- Error tracking (optional): Sentry or similar, with PII scrubbing, sampling and a clear data
  processing note. Disabled by default.
- Alerts: 5xx rate above 1% for five minutes, health check failing, database connections above 80%,
  disk above 80% (if self-hosted), certificate expiring in 14 days.
- A weekly curator digest is a product feature, not a monitoring requirement. If it is added, it
  runs from the app or a scheduled job and contains counts only, never report messages.

## 11. Capacitor and the app-store path

The web app is designed to be Capacitor-compatible, but **v1 ships on the web**. Adding a native
shell is a distribution decision, not a technical inevitability.

When the time comes:

1. `npx cap add ios` and `npx cap add android`.
2. Set `webDir` to the Angular browser build output.
3. Decide between bundling the web assets or loading the hosted app. Bundling is faster and works
   offline; it also means every content change needs an app release unless the data comes from the
   API. A hybrid (bundled shell + API data) is the usual choice.
4. Configure the API base URL for the native origin and add the exact Capacitor origin to CORS.
5. Add Universal Links (iOS) and App Links (Android) if city links should open the app.
6. Respect safe-area insets and test map gestures inside the native WebView.
7. Update the privacy manifest and store listing. The app collects no account data; report emails
   are optional and must be disclosed.

**App-store risk:** Apple's App Store Review Guideline 4.2 rejects apps that are only a repackaged
website with no native value. Do not submit a bare wrapper. Add at least one genuinely native or
offline capability first:

- an offline city pack for arrival week;
- a saved city stored on the device;
- a share extension for sending a city link;
- "near me" using device location with a clear permission prompt.

Google Play is more permissive but has similar quality expectations. Budget for review time and a
rejection cycle. A PWA with an install prompt is a cheaper first step and avoids the stores
entirely.

## 12. Cost estimate

| Item                               | Monthly                                          |
|------------------------------------|--------------------------------------------------|
| Container hosting (small instance) | $0–20                                            |
| Managed PostgreSQL (small)         | $0–15                                            |
| Domain                             | ~$1–2 (annualised)                               |
| Tile provider                      | $0 on a free tier; budget $0–20 if traffic grows |
| Error tracking / uptime            | $0 on free tiers                                 |
| **Total**                          | **$0–35**                                        |

The main cost is curator time, not infrastructure. Optimise for reliability and low maintenance, not
for saving five dollars on a database.

## 13. Runbook

| Situation                     | Action                                                                                                                                    |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| **Site down**                 | Check platform status and `/actuator/health`; check database connectivity; redeploy the last known good image if the app is crash-looping |
| **Database down**             | Follow the provider's recovery runbook; do not delete volumes; restore the latest backup into a new instance if needed                    |
| **Tiles down**                | Confirm the provider status page; the list view still works; switch the tile URL via a redeploy if the outage is prolonged                |
| **Admin locked out**          | Reset the admin password hash in the platform's secret store and restart; never add a backdoor endpoint                                   |
| **Report spam**               | Tighten the rate limit, add a temporary block on the pattern, keep the queue clean; do not disable reports entirely                       |
| **Bad data published**        | Hide the place immediately; correct the source; re-verify with a second reviewer; record the incident in the audit note                   |
| **Safety concern**            | Hide the place, notify the lead curator, follow [CURATION.md](CURATION.md) §8; do not debate publicly                                     |
| **Certificate expired**       | Renew via the platform; enable auto-renewal; add a 14-day expiry alert                                                                    |
| **Bad release**               | Roll back the image; if the schema changed incompatibly, restore the pre-release backup                                                   |
| **Suspicious login attempts** | Check rate-limit logs, rotate the admin password, review the audit log, keep the session timeout short                                    |
| **Church requests removal**   | Hide within 7 days, record the reason, do not argue                                                                                       |

## 14. Launch checklist

- [ ] Production database provisioned, private, backed up, restore tested.
- [ ] `SPRING_PROFILES_ACTIVE=prod`, admin password is a BCrypt hash, session secret set.
- [ ] HTTPS and HSTS working; HTTP redirects to HTTPS.
- [ ] Security headers and CSP verified; tiles load under the CSP.
- [ ] Tile provider terms reviewed; attribution visible; key restricted.
- [ ] SPA fallback returns the app for city/place routes and a real 404 for unknown files.
- [ ] `robots.txt` and `sitemap.xml` correct; admin and API disallowed.
- [ ] Global Open Graph tags and a default image present.
- [ ] Rate limits enabled for reports and login.
- [ ] Uptime and synthetic checks configured; alerts reach a human.
- [ ] Privacy notice and method pages live and accurate.
- [ ] At least 21 verified places across three cities.
- [ ] Smoke test passed: city, place, filter deep link, report, admin login, edit, import dry run.
- [ ] No secret in the image, the repository or a client bundle.
- [ ] No student, parent, connector or match data in the image, database, backups or CI artifacts.
- [ ] The low-tech pilot's restricted drive is separate and not mounted or linked from the app.
- [ ] The previous image tag is recorded for rollback.
