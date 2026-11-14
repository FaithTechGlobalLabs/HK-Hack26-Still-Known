# HTTP API

> Status: pre-implementation · Last reviewed 2026-11-14 · Related:
> [ARCHITECTURE.md](ARCHITECTURE.md) · [SCHEMA.md](SCHEMA.md) · [PAGES.md](PAGES.md) ·
> [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md)

## 1. Conventions

| Topic          | Rule                                                                 |
|----------------|----------------------------------------------------------------------|
| Base path      | `/api/v1`                                                            |
| Resource paths | `kebab-case`, for example `/places/{slug}/nearby`                    |
| JSON fields    | `camelCase`                                                          |
| Enum values    | `SCREAMING_SNAKE_CASE`, for example `CAMPUS_MINISTRY`                |
| Dates          | ISO-8601 UTC instant with `Z`, for example `2026-09-12T10:00:00Z`    |
| Content type   | `application/json; charset=utf-8`                                    |
| Errors         | RFC 7807 `application/problem+json`                                  |
| Collections    | An object with a named array and `meta`, never a bare array          |
| Nulls          | `null` is explicit; absent means "not part of this representation"   |
| IDs            | Public endpoints use slugs; admin endpoints use numeric ids          |
| Caching        | Public GETs are cacheable; admin and report responses are `no-store` |

The API never returns JPA entities. Every response is a DTO with a stable shape. Internal fields (`curatorNote`,
`lastImportBatchId`, `version`) appear only in admin representations.

### 1.1 Scope: no people endpoints

This API exposes **places, cities, universities, taxonomy and private reports**. It does not expose
students, parents, connectors, matchmakers or matches. There is deliberately:

- no `POST /students`, `/connectors`, `/matches` or `/introductions`;
- no "request an introduction" endpoint, because that is the handover itself and carries consent,
  safeguarding and response-time obligations that this system cannot meet;
- no endpoint that accepts a student's name, school, age, phone number or destination;
- no endpoint that reveals whether a given student or connector exists.

The low-tech pilot keeps those records in a restricted spreadsheet and handles introductions by
email. See [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md). The map's only public write is
`POST /api/v1/reports` (§3.7), which stores an optional reply email and no other identifier.

If a future matchmaker tool is built, it gets its own API, its own authentication and its own
consent model. It must not reuse the public map's anonymous surface.

## 2. Authentication

Public browsing and report submission require no account and no cookie.

Admin endpoints use a server-side session created by a form login. The SPA and API share an origin,
so no CORS configuration is required in production; local development uses Angular's proxy.

### 2.1 CSRF bootstrap

`GET /api/v1/auth/csrf` returns `200` and sets an `XSRF-TOKEN` cookie. Angular's
`HttpClientXsrfModule` reads that cookie and sends `X-XSRF-TOKEN` on every state-changing request.

```json
{
	"headerName": "X-XSRF-TOKEN",
	"parameterName": "_csrf"
}
```

### 2.2 Login

`POST /api/v1/auth/login` with `application/x-www-form-urlencoded`:

```text
username=curator&password=...&_csrf=...
```

The CSRF token may be sent as the `_csrf` form field or the `X-XSRF-TOKEN` header.

| Outcome         | Status | Body                                                                    |
|-----------------|--------|-------------------------------------------------------------------------|
| Success         | `204`  | empty; sets `JSESSIONID` (HttpOnly, SameSite=Lax, Secure in production) |
| Bad credentials | `401`  | Problem detail, generic message                                         |
| Rate limited    | `429`  | Problem detail with `Retry-After`                                       |

### 2.3 Session and logout

- `GET /api/v1/auth/me` → `200 {"username":"curator","role":"ADMIN"}` or `401`.
- `POST /api/v1/auth/logout` with a valid CSRF token → `204`; invalidates the session.
- Idle timeout: 60 minutes.
- Admin failures are logged without the attempted password.

## 3. Public endpoints

### 3.1 Taxonomy

`GET /api/v1/taxonomy`

Returns the enum vocabulary and visibility policy so clients do not hardcode it. Display labels and
definitions are **not** returned; they live in the frontend translation bundle.

```json
{
	"placeTypes": ["CHURCH", "CAMPUS_MINISTRY", "STUDENT_SOCIETY"],
	"traditions": ["ANGLICAN", "BAPTIST", "CATHOLIC", "CHARISMATIC", "EVANGELICAL", "LUTHERAN", "METHODIST", "NON_DENOMINATIONAL", "ORTHODOX", "PENTECOSTAL", "PRESBYTERIAN", "OTHER"],
	"languages": ["ENGLISH", "CANTONESE", "MANDARIN", "OTHER"],
	"sizeCategories": ["SMALL", "MEDIUM", "LARGE", "UNKNOWN"],
	"hkStudentPresence": ["NONE", "A_FEW", "SEVERAL", "LARGE", "UNKNOWN"],
	"reportTypes": ["OUTDATED", "WRONG_INFO", "CLOSED", "NEW_SUGGESTION", "SAFETY_CONCERN", "OTHER"],
	"visibilityPolicy": {
		"agingAfterDays": 180,
		"hideAfterDays": 365
	}
}
```

### 3.2 Cities

`GET /api/v1/cities`

Returns published cities that have at least one publicly visible place.

```json
{
	"items": [
		{
			"name": "London",
			"slug": "london",
			"countryName": "United Kingdom",
			"countrySlug": "uk",
			"summary": "Eight verified churches and three campus ministries near the universities Hong Kong students attend.",
			"center": { "latitude": 51.507200, "longitude": -0.127600 },
			"verifiedPlaceCount": 9,
			"lastVerifiedAt": "2026-11-02T14:20:00Z"
		}
	],
	"meta": { "generatedAt": "2026-11-14T09:00:00Z" }
}
```

`GET /api/v1/cities/{countrySlug}/{citySlug}` returns the same city object as `{"city": {...}}`, or
`404` if the city is unpublished or has no visible places.

### 3.3 City places

`GET /api/v1/cities/{countrySlug}/{citySlug}/places`

| Query parameter | Type       | Rules                                                                |
|-----------------|------------|----------------------------------------------------------------------|
| `types`         | comma list | Any of the taxonomy place types                                      |
| `traditions`    | comma list | Any of the taxonomy traditions                                       |
| `languages`     | comma list | Matches a place with **any** of the listed languages                 |
| `sizes`         | comma list | Any of the size categories                                           |
| `tckFriendly`   | `true`     | Omit for "any"                                                       |
| `international` | `true`     | Omit for "any"                                                       |
| `carFree`       | `true`     | Omit for "any"                                                       |
| `university`    | slug       | University must belong to the city                                   |
| `q`             | string     | 1–80 characters; matches name, description and university short name |

Invalid enum values return `400`. The frontend sanitises URL state before calling, so a bad shared
link degrades to a corrected request or a clear error rather than a crash.

```json
{
	"city": {
		"name": "London",
		"slug": "london",
		"countryName": "United Kingdom",
		"countrySlug": "uk",
		"summary": "Eight verified churches and three campus ministries near the universities Hong Kong students attend.",
		"center": { "latitude": 51.507200, "longitude": -0.127600 },
		"verifiedPlaceCount": 9,
		"lastVerifiedAt": "2026-11-02T14:20:00Z"
	},
	"places": [
		{
			"slug": "st-marys-london",
			"name": "St Mary's Church",
			"type": "CHURCH",
			"tradition": "ANGLICAN",
			"sizeCategory": "MEDIUM",
			"languages": [
				{ "code": "ENGLISH", "isPrimary": true },
				{ "code": "CANTONESE", "isPrimary": false }
			],
			"internationalCongregation": true,
			"tckFriendly": true,
			"hkStudentPresence": "SEVERAL",
			"carFreeAccess": true,
			"description": "An Anglican church near Marble Arch with a large international student group.",
			"address": "York Street, London W1H 7JX",
			"location": { "latitude": 51.518900, "longitude": -0.158400 },
			"nearestTransit": "Marble Arch (Central)",
			"walkMinutesFromTransit": 4,
			"transitNote": "Central line to Marble Arch, then a 4-minute walk. Use the York Street exit.",
			"universities": [
				{ "slug": "imperial-college-london", "name": "Imperial College London", "shortName": "Imperial", "walkMinutes": 20 }
			],
			"verification": {
				"lastVerifiedAt": "2026-09-12T10:00:00Z",
				"verifiedBy": "Rachel C.",
				"staleness": "FRESH",
				"ageDays": 63
			}
		}
	],
	"meta": {
		"generatedAt": "2026-11-14T09:00:00Z",
		"count": 9,
		"filtersApplied": { "carFree": true, "languages": ["CANTONESE"] },
		"visibilityPolicy": { "agingAfterDays": 180, "hideAfterDays": 365 }
	}
}
```

The city payload is intentionally complete. The client can filter, search and render without a
second request. `verifiedPlaceCount` counts all public places in the city, not the filtered result.

### 3.4 City universities

`GET /api/v1/cities/{countrySlug}/{citySlug}/universities`

```json
{
	"items": [
		{ "slug": "imperial-college-london", "name": "Imperial College London", "shortName": "Imperial", "websiteUrl": "https://www.imperial.ac.uk" }
	],
	"meta": { "count": 6 }
}
```

### 3.5 Place detail

`GET /api/v1/places/{slug}`

Returns the full public record plus up to three nearby places. Hidden, draft, expired or unknown
slugs all return the same `404`; the response never reveals that a hidden place exists.

```json
{
	"place": {
		"slug": "st-marys-london",
		"name": "St Mary's Church",
		"type": "CHURCH",
		"tradition": "ANGLICAN",
		"sizeCategory": "MEDIUM",
		"languages": [
			{ "code": "ENGLISH", "isPrimary": true },
			{ "code": "CANTONESE", "isPrimary": false }
		],
		"internationalCongregation": true,
		"tckFriendly": true,
		"hkStudentPresence": "SEVERAL",
		"carFreeAccess": true,
		"description": "An Anglican church near Marble Arch with a large international student group.",
		"address": "York Street, London W1H 7JX",
		"location": { "latitude": 51.518900, "longitude": -0.158400 },
		"websiteUrl": "https://example.org",
		"nearestTransit": "Marble Arch (Central)",
		"walkMinutesFromTransit": 4,
		"transitNote": "Central line to Marble Arch, then a 4-minute walk. Use the York Street exit.",
		"accessibilityNote": "Step-free entrance from York Street. No accessible toilet confirmed.",
		"serviceNote": "Sundays 10:30 and 17:00 during term; check the website before visiting.",
		"universities": [
			{ "slug": "imperial-college-london", "name": "Imperial College London", "shortName": "Imperial", "walkMinutes": 20 }
		],
		"verification": {
			"lastVerifiedAt": "2026-09-12T10:00:00Z",
			"verifiedBy": "Rachel C.",
			"sourceUrl": "https://example.org/students",
			"staleness": "FRESH",
			"ageDays": 63
		}
	},
	"city": {
		"name": "London",
		"slug": "london",
		"countryName": "United Kingdom",
		"countrySlug": "uk",
		"summary": "Eight verified churches and three campus ministries near the universities Hong Kong students attend."
	},
	"nearby": [
		{ "slug": "another-place", "name": "Another Place", "type": "CAMPUS_MINISTRY", "walkMinutesFromTransit": 8 }
	]
}
```

`sourceUrl` is public on the detail page because it is the evidence for the verification claim. It
must point to an organisation's public page, never to a private message or a personal profile.

### 3.6 Search

`GET /api/v1/search?q=impe&limit=8`

Typeahead across published cities and universities only. It does not search places; place search is
a within-city filter.

```json
{
	"items": [
		{ "kind": "UNIVERSITY", "name": "Imperial College London", "shortName": "Imperial", "citySlug": "london", "countrySlug": "uk" },
		{ "kind": "CITY", "name": "London", "citySlug": "london", "countrySlug": "uk" }
	],
	"meta": { "query": "impe", "count": 2 }
}
```

`limit` defaults to 8 and is capped at 20. `q` shorter than two characters returns an empty list.

### 3.7 Submit a report

`POST /api/v1/reports`

No authentication. No cookie is required. The request is rate-limited per in-memory IP hash.

```json
{
	"placeSlug": "st-marys-london",
	"type": "OUTDATED",
	"message": "The 17:00 service moved to 18:00 this term.",
	"contactEmail": null,
	"website": ""
}
```

`website` is a honeypot. It must be empty; a non-empty value is accepted with `202` and discarded,
so bots do not learn the rule.

| Field          | Rules                                                    |
|----------------|----------------------------------------------------------|
| `placeSlug`    | Must reference a publicly visible place; otherwise `404` |
| `type`         | One of the report types                                  |
| `message`      | 10–1,000 characters, plain text                          |
| `contactEmail` | Optional, valid, max 254 characters                      |
| `website`      | Honeypot, max 0 characters in practice                   |

Success:

```text
202 Accepted
```

```json
{
	"received": true,
	"message": "Thank you. A curator will check this."
}
```

The response deliberately does not return a report id or queue position. A safety concern response
adds an emergency-services line but still returns `202`.

## 4. Admin endpoints

All admin endpoints require an authenticated `ADMIN` session and a CSRF token on writes. Responses
use `Cache-Control: no-store`.

### 4.1 Stats

`GET /api/v1/admin/stats`

```json
{
	"places": { "published": 9, "draft": 2, "needsReverify": 0, "aging": 1, "expired": 1, "hidden": 0 },
	"reports": { "open": 3, "safety": 0, "inReview": 1 },
	"imports": { "lastSuccessAt": "2026-11-02T14:20:00Z", "lastFailureAt": null }
}
```

### 4.2 Places

`GET /api/v1/admin/places?status=&city=&type=&q=&page=0&size=25`

| Parameter | Rules                                           |
|-----------|-------------------------------------------------|
| `status`  | `DRAFT`, `VERIFIED`, `NEEDS_REVERIFY`, `HIDDEN` |
| `city`    | City slug                                       |
| `type`    | Place type                                      |
| `q`       | Name or slug contains                           |
| `page`    | Zero-based, default 0                           |
| `size`    | Default 25, max 100                             |

```json
{
	"items": [
		{
			"id": 42,
			"slug": "st-marys-london",
			"name": "St Mary's Church",
			"city": { "slug": "london", "name": "London" },
			"type": "CHURCH",
			"status": "VERIFIED",
			"lastVerifiedAt": "2026-09-12T10:00:00Z",
			"verificationAgeDays": 63,
			"openReportCount": 0,
			"updatedAt": "2026-09-12T10:00:00Z"
		}
	],
	"meta": { "page": 0, "size": 25, "total": 14, "totalPages": 1 }
}
```

`POST /api/v1/admin/places` creates a `DRAFT` place. `GET /api/v1/admin/places/{id}` returns the full
editable representation, including internal fields. `PUT /api/v1/admin/places/{id}` replaces the
editable fields and requires `If-Match` with the current version; a mismatch returns `412`.

Create/update body:

```json
{
	"name": "St Mary's Church",
	"slug": "st-marys-london",
	"type": "CHURCH",
	"cityId": 3,
	"address": "York Street, London W1H 7JX",
	"latitude": 51.518900,
	"longitude": -0.158400,
	"websiteUrl": "https://example.org",
	"description": "An Anglican church near Marble Arch with a large international student group.",
	"tradition": "ANGLICAN",
	"sizeCategory": "MEDIUM",
	"languages": [
		{ "code": "ENGLISH", "isPrimary": true },
		{ "code": "CANTONESE", "isPrimary": false }
	],
	"universities": [
		{ "universityId": 7, "walkMinutes": 20 }
	],
	"internationalCongregation": true,
	"tckFriendly": true,
	"hkStudentPresence": "SEVERAL",
	"carFreeAccess": true,
	"nearestTransit": "Marble Arch (Central)",
	"walkMinutesFromTransit": 4,
	"transitNote": "Central line to Marble Arch, then a 4-minute walk. Use the York Street exit.",
	"accessibilityNote": "Step-free entrance from York Street.",
	"serviceNote": "Sundays 10:30 and 17:00 during term; check the website.",
	"curatorNote": "Spoke to the student worker on 12 Sep."
}
```

Verification is a separate action so evidence cannot be skipped:

`POST /api/v1/admin/places/{id}/verify`

```json
{
	"verifiedBy": "Rachel C.",
	"verifiedAt": "2026-09-12T10:00:00Z",
	"sourceUrl": "https://example.org/students",
	"note": "Confirmed by phone and the term card."
}
```

- Sets `verification_status = VERIFIED` and `last_verified_at`.
- Rejects a future `verifiedAt`, a missing verifier or a missing source URL with `400`.
- Writes an audit row in the same transaction.
- Returns the updated admin representation.

`POST /api/v1/admin/places/{id}/hide`

```json
{ "reason": "Church requested removal while leadership changes." }
```

Sets `verification_status = HIDDEN`, records the reason in the audit log and the internal note, and
removes the place from public view immediately. A reason is required.

`DELETE /api/v1/admin/places/{id}` soft-deletes a draft created by mistake. For published places,
`hide` is the correct action. Deleting a verified place requires `?confirm=slug` and is audited.

### 4.3 Reports

`GET /api/v1/admin/reports?status=&type=&city=&page=0&size=25`

Default sort: `SAFETY_CONCERN` first, then oldest open first.

```json
{
	"items": [
		{
			"id": 91,
			"place": { "id": 42, "slug": "st-marys-london", "name": "St Mary's Church" },
			"type": "OUTDATED",
			"message": "The 17:00 service moved to 18:00 this term.",
			"status": "OPEN",
			"hasContactEmail": true,
			"createdAt": "2026-11-10T08:30:00Z",
			"ageHours": 96
		}
	],
	"meta": { "page": 0, "size": 25, "total": 3, "totalPages": 1 }
}
```

`GET /api/v1/admin/reports/{id}` adds `contactEmail` and `resolutionNote`.

`PATCH /api/v1/admin/reports/{id}`

```json
{
	"status": "RESOLVED",
	"resolutionNote": "Called the church; service note updated and place re-verified.",
	"reverifyPlace": true
}
```

Allowed transitions: `OPEN` → `IN_REVIEW` → `RESOLVED` | `DISMISSED`. A direct
`OPEN` → `RESOLVED` is allowed for spam or duplicates. `reverifyPlace` is a convenience flag; the
client should call the verify endpoint explicitly if it needs to set evidence fields.

### 4.4 Import

`POST /api/v1/admin/imports?dryRun=true` with `multipart/form-data` and a `file` part.

- CSV only, max 2 MB, UTF-8.
- `dryRun=true` (default) parses, validates and rolls back. `dryRun=false` commits in one transaction.
- Returns an `ImportBatchDto` with counts and errors.

```json
{
	"id": 12,
	"filename": "london.csv",
	"dryRun": true,
	"status": "COMPLETED",
	"rowCount": 9,
	"insertedCount": 3,
	"updatedCount": 6,
	"skippedCount": 0,
	"failedCount": 0,
	"errors": [],
	"createdAt": "2026-11-14T09:00:00Z",
	"finishedAt": "2026-11-14T09:00:02Z"
}
```

When `failedCount > 0`, the response is still `200` for a dry run (the report is the result), but a
commit request returns `422` and nothing is written. Error objects use
`{ "row": 4, "field": "tradition", "code": "E002", "message": "Unknown tradition" }`.

`GET /api/v1/admin/imports?page=0&size=20` lists history.

### 4.5 Taxonomy and reference data for the editor

The admin editor uses the public taxonomy plus:

- `GET /api/v1/admin/cities` — all cities, including unpublished, with ids.
- `GET /api/v1/admin/universities?cityId=` — all universities for a city, with ids.

These are deliberately separate from the public endpoints because they expose ids and unpublished
reference data.

## 5. Errors

All errors use `application/problem+json`:

```json
{
	"type": "https://stillknown.app/problems/validation",
	"title": "Validation failed",
	"status": 400,
	"detail": "One or more fields are invalid.",
	"instance": "/api/v1/admin/places",
	"errors": [
		{ "field": "description", "code": "TOO_LONG", "message": "Must be 240 characters or fewer." }
	]
}
```

| Status | When                                                                       |
|--------|----------------------------------------------------------------------------|
| `400`  | Malformed JSON, invalid enum, validation failure, future verification date |
| `401`  | No admin session or bad login                                              |
| `403`  | CSRF failure or insufficient role                                          |
| `404`  | Unknown, hidden, draft or expired place; unknown city                      |
| `409`  | Duplicate slug, conflicting state transition                               |
| `412`  | `If-Match` version mismatch                                                |
| `413`  | CSV larger than 2 MB                                                       |
| `422`  | Import commit with row errors                                              |
| `429`  | Rate limited; includes `Retry-After`                                       |
| `500`  | Unexpected error; includes a `traceId`, never a stack trace                |

Stable `type` URIs: `/problems/validation`, `/problems/not-found`, `/problems/unauthorized`,
`/problems/forbidden`, `/problems/conflict`, `/problems/rate-limited`, `/problems/import-invalid`,
`/problems/server`.

## 6. Caching and conditional requests

| Endpoint                             | Headers                                                                        |
|--------------------------------------|--------------------------------------------------------------------------------|
| Public city, place, taxonomy, search | `Cache-Control: public, max-age=60, stale-while-revalidate=300`, strong `ETag` |
| `304 Not Modified`                   | Returned when `If-None-Match` matches                                          |
| Admin endpoints                      | `Cache-Control: no-store`                                                      |
| Report submission                    | `Cache-Control: no-store`                                                      |

ETags are content-derived. Any change to a place, its languages, its university links or its city
must change the city ETag. A simple hash of the serialised payload is sufficient at this scale.

## 7. Rate limits

| Endpoint           | Limit                                      | Scope                             |
|--------------------|--------------------------------------------|-----------------------------------|
| `POST /reports`    | 5 per hour, burst 2 per minute             | In-memory IP hash, daily rotation |
| `POST /auth/login` | 5 failures per 15 minutes                  | In-memory IP hash, daily rotation |
| Public GETs        | No application limit; rely on platform/CDN | —                                 |

Limits are configuration properties. The response includes `Retry-After` but not the exact
remaining quota, so probing is less useful to abusers.

## 8. Versioning and compatibility

- The path carries the major version: `/api/v1`.
- Additive fields are not a breaking change.
- Removing or renaming a field, changing an enum value's meaning, or changing a status code is
  breaking and requires `/api/v2` or a documented deprecation window.
- The frontend and backend are deployed together from one container, so the compatibility window is
  short; third-party consumers are not supported in v1.
- OpenAPI is generated by springdoc. The spec is available in development at
  `/api/v1/openapi.json` and is disabled or admin-protected in production. Frontend types are
  hand-written in v1 and may be generated in a later phase.
