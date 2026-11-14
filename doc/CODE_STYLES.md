# Code styles

> Conventions for the Still Known codebase. New rules land here when they are agreed.
>
> Adapted from the
> [Transport Simulation Core code style guide](https://github.com/Minecraft-Transit-Railway/Transport-Simulation-Core/blob/master/docs/CODE_STYLES.md)
> and rewritten for an Angular + Spring Boot application. The structure and many of the rules are
> deliberately shared; the stack-specific sections are not.

These rules apply to the Java backend in `backend/` and the Angular frontend in `frontend/` unless
otherwise noted. Anything not listed here defers to the compiler, the linter or the formatter:
Java 21 `javac` warnings, ESLint, Prettier, Spotless and Angular's strict template checks.

For the system these rules apply to, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 0. Build system and enforcement

- **Backend:** Gradle Kotlin DSL (`.gradle.kts`). Do not use Groovy DSL syntax in new build logic.
  Use type-safe accessors (`tasks.jar { ... }`, not `tasks.named("jar") { ... }`) and explicit
  types for task configuration.
- **Frontend:** Angular CLI and npm. Commit `package-lock.json`; do not mix package managers.
- **Versions:** pin Node, Java and framework versions in `.nvmrc`, `.java-version` and the build
  files. A build that depends on "whatever is installed" is not reproducible.
- **Formatting:** Prettier for TypeScript, HTML, SCSS, JSON and Markdown; Spotless with the
  committed Eclipse formatter for Java. If the formatter disagrees with this document, the
  formatter wins and this document is wrong.
- **Linting:** ESLint with the Angular and TypeScript rules; no `any`; strict templates. Java
  warnings are treated as errors in CI.
- **Line endings:** LF in the repository. `.gitattributes` handles Windows checkouts.
- **Generated files:** never edit generated build output, `dist/`, or a Flyway migration that has
  already been applied.

## 1. Naming

### 1.1 Package and folder names are singular

- ✅ `hk.stillknown.place`, `hk.stillknown.report`, `frontend/src/app/component/filter-panel/`,
  `frontend/src/app/service/`, `frontend/src/app/model/`
- ❌ `places/`, `reports/`, `components/`, `services/`, `models/`

The database follows the same rule: `place`, `city`, `report`, not `places`, `cities`, `reports`.

### 1.2 No abbreviations in identifiers

Package names, class names, method names, fields, parameters and local variables spell out their
meaning.

- ✅ `places.forEach((place) => { ... })`
- ❌ `places.forEach((p) => { ... })`
- ✅ `for (final Place place : places) { ... }`
- ❌ `for (final Place pl : places) { ... }`

**Allowed exceptions:**

| Context           | Allowed                                          | Example                                                                                                  |
|-------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| Caught exceptions | `e`, `ex`                                        | `} catch (Exception e) { ... }`                                                                          |
| Loop indices      | `i`, `j`, `k`                                    | `for (int i = 0; i < length; i++) { ... }`                                                               |
| Domain idioms     | `id`, `url`, `uri`, `api`, `http`, `dto`, `uuid` | These are de-facto whole words                                                                           |
| Geography         | `lat`, `lng`                                     | `latitude`/`longitude` are preferred in public APIs; `lat`/`lng` are acceptable in map adapter internals |
| Geometry / colour | `x`, `y`, `r`, `g`, `b`                          | Map projection and design-token code                                                                     |
| Library type echo | match the imported type                          | `Path path = Paths.get(...)`, `Map map`, `Clock clock`                                                   |
| Transloco         | `t`                                              | `*transloco="let t"`                                                                                     |

The "library type echo" rule: when a local holds a value of an imported type, prefer the type's own
name in lowerCamelCase (`Place place`, `PlaceRepository placeRepository`). It removes a class of
bikeshedding and makes refactor-rename trivial.

### 1.3 Casing

- **Java classes, records, interfaces, enums:** `PascalCase`.
- **TypeScript classes, interfaces, types, components:** `PascalCase`.
- **Java methods, fields, locals, parameters; TypeScript methods, fields, locals, parameters,
  signals:** `camelCase`.
- **Java `static final` constants; TypeScript module-level constants:** `SCREAMING_SNAKE_CASE`
  (`VisibilityPolicy.AGING_AFTER_DAYS`, `MAP_DEFAULT_ZOOM`).
- **Database tables and columns:** `snake_case`, singular table names.
- **HTTP paths:** `kebab-case` (`/cities/{countrySlug}/{citySlug}/places`).
- **JSON fields:** `camelCase` (`carFreeAccess`).
- **JSON enum values:** `SCREAMING_SNAKE_CASE` (`CAMPUS_MINISTRY`).
- **CSS / SCSS classes:** `kebab-case`.
- **Transloco i18n keys:** `camelCase`, no abbreviations (`placeCard.lastVerified`, not
  `placeCard.lastVer`).
- **Angular files:** `place-card.component.ts`, `place-card.component.html`,
  `place-card.component.scss`, `place.service.ts`, `place.guard.ts`.

### 1.4 British English in prose, American English in identifiers

- All Markdown docs and source comments use **British English**: `colour`, `behaviour`, `centre`,
  `organisation`, `localise`, `organise`, `analyse`, `licence` (noun).
- All code identifiers use **American English**: `color`, `behavior`, `center`, `organization`,
  `localize`, `organize`, `analyze`, `license`.

The split keeps reader-facing copy consistent with Hong Kong and UK readers, while keeping API and
code identifiers on the convention every framework already uses (`Color`, `localStorage`,
`behavior` events). When in doubt: prose British, code American.

### 1.5 Names describe intent, not implementation

- ✅ `visiblePlaces`, `isAging`, `hasActiveFilters`
- ❌ `filteredList2`, `data`, `temp`, `flag`

A boolean reads as a predicate (`carFreeAccess`, `published`, `isSubmitting`). A method reads as a
verb (`verifyPlace`, `hidePlace`, `findVisibleByCity`). A DTO names its role (`PublicPlaceDto`, `AdminPlaceDto`), not
its storage.

## 2. Formatting

### 2.1 Indentation

- **Tabs**, not spaces, for Java, TypeScript, HTML, SCSS and JSON. One tab per nesting level.
- Continuation lines in chained calls and many-argument calls are indented one tab beyond their
  parent.
- YAML files use **2 spaces** per level; YAML forbids tabs at indentation positions.
- Markdown uses normal prose formatting; code blocks inside Markdown follow the language rules.

### 2.2 No mid-expression line wrapping

Lines stay on a single line. Do not pre-emptively wrap arguments or method bodies.

**Allowed exceptions:** chained streams/pipes and calls with many arguments.

```ts
this.httpClient.get<CityResponse>("/api/v1/cities/uk/london/places")
	.pipe(
		tap((response) => this.city.set(response.city)),
		map((response) => response.places),
	)
	.subscribe();
```

```java
return places.stream()
	.filter(Place::isPubliclyVisible)
	.map(PlaceMapper::toPublicDto)
	.collect(Collectors.toList());
```

```ts
this.reportService.submit(
	placeSlug,
	type,
	message,
	contactEmail,
);
```

Each chained call gets its own line, indented one tab beyond the receiver. The closing paren sits at
the original indent level, on its own line or with the last argument.

### 2.3 Trailing newline

Every file ends with **exactly one** trailing newline. No blank line at EOF, no missing newline.

### 2.4 Always brace control statements

Every `if`, `else`, `else if`, `for`, `while` and `do` block uses braces, even for a single
statement.

```java
// ✅
if (place == null) {
	return;
}

for (final Place place : places) {
	audit(place);
}

// ❌
if (place == null) return;
for (final Place place : places) audit(place);
```

```ts
// ✅
if (this.places().length === 0) {
	return;
}

// ❌
if (this.places().length === 0) return;
```

The only allowed exception is a lambda or arrow-function expression body (`place -> place.getSlug()`,
`(value) => value * 2`), which is an expression, not a control
statement.

### 2.5 String quotes

- **TypeScript:** double quotes for ordinary strings; backticks only for interpolation.
- **Java:** standard double quotes; text blocks (`"""..."""`) only for genuinely multi-line
  literals such as SQL.
- **HTML attributes:** double quotes only.
- **JSON:** double quotes (RFC 8259; there is no choice).
- **SQL:** single quotes for literals; do not build SQL with string concatenation.

### 2.6 Imports

Group imports by origin, separated by a blank line. Within each group, sort alphabetically by
module path. The same rule applies to the `imports: [...]` array in every Angular
`@Component({ ... })` decorator.

Frontend grouping, top to bottom:

1. **Angular framework** — `@angular/*`.
2. **Third-party packages** — `@ionic/*`, `@jsverse/transloco`, `leaflet`, `rxjs`.
3. **Internal modules** — `../core/...`, `../shared/...`, anything under `frontend/src/app/`.

```ts
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";

import {IonContent, IonHeader} from "@ionic/angular/standalone";
import {TranslocoDirective} from "@jsverse/transloco";

import {CityStore} from "../../core/city.store";
import {FilterPanelComponent} from "../../shared/component/filter-panel/filter-panel.component";
```

Java grouping, top to bottom:

1. **Project imports** — `hk.stillknown.*`.
2. **Third-party** — `jakarta.*`, `org.springframework.*`, `com.fasterxml.*`, JSpecify.
3. **JDK** — `java.*`, `javax.*` (matching IntelliJ's default).

Do not use re-export barrels (`index.ts`) unless absolutely necessary. Prefer direct imports so
refactor tools can move files cleanly.

### 2.7 No dead SCSS

Every selector in a component's `.scss` file must match a class actually used by the matching
`.html` file, or be referenced by runtime-injected DOM (Ionic overlays, Leaflet controls, teleported
popovers). When a rule targets runtime DOM, leave a comment naming the source so the next reader
does not delete it as dead code.

When you remove markup, delete the orphaned SCSS in the same change.

### 2.8 Comments

Comments explain **why**, not what. A comment that restates the code is noise.

- ✅ `// Curators can backdate a verification by up to 30 days; older dates need a new visit.`
- ❌ `// Set status to verified.`
- Use `TODO(name):` with a reason and a link to the issue if one exists.
- Delete commented-out code. Git remembers it.

## 3. Backend architecture rules

### 3.1 Package by feature, layer inside

A feature package owns its controller, service, repository, entity and DTOs. Do not create a global
`controller/`, `service/` or `repository/` package.

```text
hk.stillknown.place/
├── PlaceController.java
├── PlaceService.java
├── PlaceRepository.java
├── Place.java
├── PlaceMapper.java
├── PlaceDto.java
└── VisibilityPolicy.java
```

Feature packages may depend on `common/`. They must not reach into another feature's repository.
Cross-feature reads go through the other feature's service or a deliberately shared DTO.

### 3.2 No entities over the wire

Controllers accept and return DTOs, never JPA entities. An entity has lazy relationships, internal
notes and a version column; none of that belongs in JSON.

- DTOs are Java records unless they need mutation during mapping.
- Mappers are explicit static methods or small classes. No reflection-based mapping in v1.
- `@JsonIgnore` on an entity is a warning sign that the boundary is wrong.

### 3.3 Constructor injection only

Use constructor injection. Do not use field injection.

```java
// ✅
@Service
public class PlaceService {

	private final PlaceRepository placeRepository;
	private final Clock clock;

	public PlaceService(final PlaceRepository placeRepository, final Clock clock) {
		this.placeRepository = placeRepository;
		this.clock = clock;
	}
}
```

```java
// ❌
@Autowired
private PlaceRepository placeRepository;
```

A class with more than five constructor dependencies is usually doing too much. Split it.

### 3.4 Transactions belong to services

- `@Transactional(readOnly = true)` on read service methods.
- `@Transactional` on write service methods.
- No `@Transactional` on controllers or repositories.
- The service returns DTOs, not managed entities that the controller might accidentally mutate
  outside a transaction.
- External calls (email, geocoding) never happen inside a database transaction. v1 has none at
  request time, and that is intentional.

### 3.5 Validate at the boundary

- `@Valid` on request bodies; Jakarta Validation annotations on DTOs.
- Cross-field rules live in the service or a custom validator.
- Database constraints are the last line of defence, not the first.
- Reject unknown enum values with `400`, not a silent default.
- Trim and length-limit every free-text field before persisting.

### 3.6 Records, Lombok and nullness

- Use **records** for DTOs, value objects and small immutable results.
- Use plain classes for JPA entities. Do not put `@Data`, `@EqualsAndHashCode` or `@ToString` on an
  entity; generated `toString` can trigger lazy loading and leak fields into logs.
- Lombok is allowed only where it removes pure noise: `@RequiredArgsConstructor` on a service,
  `@Getter` on a simple non-JPA value class, or `@Slf4j` for logging.
- Use **one** logging style across the backend: either an explicit
  `private static final Logger log = LoggerFactory.getLogger(...)` or Lombok's `@Slf4j`. Do not mix
  them in the same codebase.
- Prefer explicit code over annotation magic in a codebase meant to be read by students.

Every package has a `package-info.java` annotated with JSpecify's `@NullMarked`. Everything is
non-null by default; mark nullable values with `@Nullable`.

```java
@NullMarked
package hk.stillknown.place;

import org.jspecify.annotations.NullMarked;
```

- Do not use `Optional` for fields or method parameters. `Optional` is for return values only.
- The frontend counterpart is `strictNullChecks` and `strictTemplates`, both enabled.

### 3.7 Flyway owns the schema

- `spring.jpa.hibernate.ddl-auto=validate`.
- Every schema change is a new `V###__description.sql` migration.
- Applied migrations are immutable. Fix a mistake with a new migration.
- Reference data for countries, cities and universities is versioned SQL. Place data is imported
  through the admin flow, not a migration.
- Test migrations against a real PostgreSQL container, not H2.

### 3.8 Constants and configuration

Magic numbers in service or controller code are forbidden. Either:

- a `static final` constant on the closest owning class (`VisibilityPolicy.DEFAULT_AGING_AFTER_DAYS`), or
- a typed configuration property for anything an operator might tune (`stillknown.visibility.aging-after-days`).

The rule of thumb: if an operator or curator might change it without a code review, it is
configuration. If it is a domain invariant, it is a constant. If it lives on both sides of the wire,
comment it in both places.

### 3.9 Logging and exceptions

- Use SLF4J with parameterised messages: `log.warn("Place {} has no coordinates", slug);`
- Never log request bodies, report messages, email addresses, passwords or session ids.
- `catch (Exception ignored) {}` is forbidden. At minimum, log at `debug` with a comment naming the
  recovery path.
- Domain exceptions are explicit and mapped to RFC 7807 in one `@RestControllerAdvice`.
- Never return a stack trace, SQL error or Hibernate message to the client.
- A `500` response includes a generated `traceId`; the same id appears in the log.

### 3.10 Time

Inject `java.time.Clock`. Do not call `Instant.now()` or `LocalDate.now()` in business code.
Visibility thresholds, "future verification" checks and tests all depend on a controllable clock.

### 3.11 Repository rules

- Prefer explicit query methods or `@Query` over derived-method names longer than three segments.
- Use `@EntityGraph` or a join fetch to avoid N+1 queries for languages and university links.
- Do not return `Page<Entity>` to a controller; map to a DTO page in the service.
- A repository does not encode product rules. "Expired after 365 days" lives in
  `VisibilityPolicy`, not in a method named `findAllNotExpired` that duplicates the threshold.
- Use `exists` queries for uniqueness checks; do not load a row to test for null.

### 3.12 API rules

- Public endpoints use slugs; admin endpoints use numeric ids.
- Never trust a client-supplied id for authorisation decisions.
- Return `201` with a `Location` header on create, `204` on a successful delete/logout.
- Validate `If-Match` for optimistic updates.
- Collection responses include `meta` with counts and pagination.
- Date fields are UTC instants; never return a local date-time without an offset.
- Enum values are codes, not display labels.

## 4. Frontend architecture rules

### 4.1 Angular style

Follow <https://angular.dev/style-guide>:

- **Standalone components.** No `NgModule` unless a library forces one.
- **Signals** for local and feature state; `computed()` for derived values; `effect()` only for
  side effects that must react to a signal, not as a general data flow.
- `input()` and `output()` instead of `@Input` / `@Output` decorators.
- `inject()` instead of constructor parameter properties.
- `ChangeDetectionStrategy.OnPush` on every component.
- `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- `track` is mandatory in every `@for`.
- Lazy-load routes; the admin bundle must not be in the initial download.
- Strict TypeScript: no `any`, no non-null assertion (`!`) unless the invariant is obvious and
  commented. Prefer `unknown` plus narrowing.

### 4.2 Component file layout

Always split a component into three sibling files:

```text
shared/component/place-card/
├── place-card.component.ts
├── place-card.component.html
└── place-card.component.scss
```

No inline `template:` or `styles:` blocks, even one-liners. Use `templateUrl` and `styleUrl`.

### 4.3 Smart pages and presentational components

- A **page** component (`feature/...`) loads data, owns route state and composes shared components.
- A **shared component** receives `input()`s and emits `output()`s. It does not inject an HTTP
  service.
- If a shared component needs data it does not receive, the page is not passing enough.
- Common shapes (cards, badges, empty states, dialogs) live in `shared/component/<name>/`. Build
  features by composing them; do not copy markup.

### 4.4 State lives in services, filters live in the URL

- Feature services own signals (`CityStore`, `FilterStore`, `AdminSession`).
- Filters and the selected place are serialised to query parameters; the URL is the source of truth.
- A component does not keep a private copy of a filter that the URL cannot reproduce.
- No NgRx in v1. If the state graph becomes genuinely complex, propose it with a concrete problem
  first.

### 4.5 Map rules

The map is the highest-risk part of the UI.

1. All Leaflet access goes through `core/map/map-adapter.ts`. Feature components never import
   `leaflet` directly.
2. Create and mutate the map outside Angular's zone; re-enter only to update signals or UI state.
3. Markers are built from a pure view model, not from an HTTP response or an entity.
4. Call `invalidateSize()` after every layout change: sheet snap, sidebar toggle, orientation change,
   route re-entry.
5. Remove event listeners, clusters and the map instance in `ngOnDestroy`.
6. Tile URL, attribution, min/max zoom come from runtime configuration, never a hardcoded string.
7. The list view must expose the same data without the map. A tile failure is not a page failure.
8. Do not add "current location" without a privacy review and a visible permission explanation.

### 4.6 Ionic rules

- Use Ionic components for shell chrome and touch controls, not as a replacement for the map.
- A full-screen map page uses `IonContent` with `scrollY="false"`.
- Respect safe-area insets on every fixed or sticky control.
- No hover-only affordance. Long-press is not a substitute for a visible action.
- A sheet modal must not pan the map underneath when the user drags the sheet.
- Capacitor APIs are optional enhancements; the web build must work without them.

### 4.7 Reusable UI and design tokens

- Use Ionic CSS variables and project custom properties for colour, spacing and typography.
- Custom hex colours are reserved for map pins and domain status colours. A one-off hex value in a
  component is a review comment.
- Status colour is never the only signal; pair it with text or an icon.
- Every icon-only button has an accessible name and a tooltip. The text comes from the translation
  bundle, not a hardcoded string.

### 4.8 Accessibility is a code rule

- The list view is a complete alternative to the map.
- Every interactive element is a real `button` or `a`, not a click handler on a `div`.
- Focus is visible and is moved deliberately when dialogs and sheets open or close.
- Form fields have labels; errors are linked with `aria-describedby`.
- Touch targets are at least 44 × 44 px.
- Respect `prefers-reduced-motion`.
- A pull request that breaks keyboard access is a failing pull request.

### 4.9 Internationalisation

- All user-facing text lives in `frontend/src/assets/i18n/<lang>.json`, managed by Transloco.
- Hardcoded English in templates or TypeScript is forbidden.
- **Translation-key parity is mandatory.** Every key in `en.json` must exist in every shipped
  locale. Do not ship a partially translated file; ship `en` only until the second locale is
  complete.
- Enum display labels are translation keys, not database values:
  `taxonomy.tradition.ANGLICAN`.
- Tag definitions live on the method page and are linked from cards; do not duplicate a long
  definition in five places.
- Dates, numbers and times use Angular's locale-aware pipes, not manual string concatenation.
  Format with the **browser's** locale (`navigator.language`), not the active translation language.

### 4.10 HTTP and errors

- Components never call `HttpClient` directly. They call a feature service.
- Every request has a typed response model. No `any` from `HttpClient`.
- Map `HttpErrorResponse` to a small frontend error type: `validation`, `notFound`, `rateLimited`,
  `unauthorized`, `server`, `offline`.
- Never render a raw server message. User-facing copy comes from the i18n bundle.
- Show a retry action for transient failures; do not silently retry a write.
- Do not swallow an error in an empty `catch`. Log at `console.debug` with a comment naming the
  recovery path, or surface it.

### 4.11 No unsafe HTML

- Never bind user-submitted content with `innerHTML`, `bypassSecurityTrustHtml` or a raw HTML pipe.
- Angular interpolation escapes by default; keep it that way.
- Report messages, place descriptions and curator notes are plain text.
- External links use `rel="noopener noreferrer"` and an accessible "opens in a new tab" cue.

## 5. Data and API contracts

- Database `snake_case` never leaks into JSON. DTOs are `camelCase`.
- Enum codes are stable API values. Changing a code is a breaking change.
- Dates are ISO-8601 UTC instants. A date-only value is only used where the time genuinely does not
  matter, and the API documents the convention.
- Return `null` explicitly; do not omit a field to mean "empty" unless the field is optional by
  contract.
- No HTML, Markdown or rich text in place descriptions, notes or report messages. Plain text only.
- Pagination is `page` (zero-based) and `size`; the response includes `total` and `totalPages`.
- Errors use RFC 7807 and stable `type` URIs. A new error shape needs a new `type`, not a new field
  convention.
- Public responses never include `curatorNote`, `sourceUrl` on list endpoints, `version`, contact
  emails or report counts.

## 6. Security and privacy rules

- Never commit secrets, tokens, passwords, private keys or production data.
- Admin credentials and session secrets come from environment variables.
- Every state-changing admin request is CSRF-protected.
- Validate and length-limit every input; encode every output.
- Do not add a third-party script, font or analytics tag without a privacy and performance review.
- No PII in logs. No IP addresses in the database.
- Report emails are optional and deleted on the schedule in [SCHEMA.md](SCHEMA.md).
- A feature that collects a new personal field needs a privacy notice update in the same change.
- If a query returns a hidden place to a public endpoint, that is a security bug, not a display bug.

## 7. Testing

- Every bug fix includes a regression test at the lowest level that reproduces it.
- Backend unit tests cover the visibility policy (0, 179, 180, 365, 366 days), report rate limits,
  slug rules and CSV validation.
- Backend integration tests use Testcontainers PostgreSQL; do not mock repositories for query
  behaviour.
- Frontend unit tests cover the filter predicate, URL serialisation, verification badge states and
  error mapping.
- Playwright covers the journeys in [PAGES.md](PAGES.md): city load, filter, place detail, report,
  admin login and edit.
- Accessibility checks run with axe on landing, city and place pages.
- A test that depends on the wall clock is flaky; inject a fixed `Clock` or freeze time.
- Do not assert on exact copy that is likely to change; assert on roles, labels and stable keys.

## 8. Documentation

- The user-facing project blurb stays in the top-level [README.md](../README.md). Do not add API
  references, build commands or package layouts there.
- System overview: [ARCHITECTURE.md](ARCHITECTURE.md).
- Screens and routes: [PAGES.md](PAGES.md).
- Database and imports: [SCHEMA.md](SCHEMA.md).
- HTTP contract: [API.md](API.md).
- Curation policy: [CURATION.md](CURATION.md).
- Local workflow: [DEVELOPMENT.md](DEVELOPMENT.md).
- Hosting and operations: [DEPLOYMENT.md](DEPLOYMENT.md).
- Planning and open decisions: [ROADMAP.md](ROADMAP.md), [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

When behaviour changes, update the document that describes it in the same pull request. A schema
change without a [SCHEMA.md](SCHEMA.md) update is incomplete. A new endpoint without an
[API.md](API.md) entry is incomplete.

## 9. Git conventions

- **Commits:** Conventional Commits — `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
  The subject is imperative and under 72 characters.
- **Branches:** `feat/city-filters`, `fix/report-rate-limit`, `docs/curation-sop`.
- **Pull requests:** one concern per pull request; describe the user-visible change and the test
  performed. Screenshots for UI changes, including the mobile layout.
- **Migrations:** never edit an applied migration. A migration PR states whether it is destructive
  and whether a backup is required.
- **Generated files:** commit generated lockfiles and OpenAPI output if the build uses them; do not
  commit build output.
- **No secrets:** a committed secret is rotated, not just deleted.

## 10. Review checklist

Before requesting review, confirm:

- [ ] The change is consistent with the product principles and does not add a non-goal.
- [ ] Names are spelled out, singular and in the correct casing.
- [ ] Tabs, braces, quotes and imports follow this document.
- [ ] No entity crosses the API boundary; no `any` crosses the frontend boundary.
- [ ] Visibility rules are enforced in the service, not only hidden in the UI.
- [ ] Public endpoints cannot leak `curatorNote`, emails or hidden places.
- [ ] The list view still works without the map.
- [ ] Keyboard access, focus management and labels are correct.
- [ ] Every new string is in the translation bundle; locale parity holds.
- [ ] Tests cover the new behaviour and the bug being fixed.
- [ ] Docs are updated, including the API, schema or page spec if affected.
- [ ] No secret, PII or debug logging is included.

## 11. Known follow-ups

This is a new codebase, so the list is a scaffold checklist rather than accumulated debt.

- Add `.editorconfig`, `.gitattributes` and Prettier configuration with `useTabs: true` before the
  first feature branch.
- Add Spotless with the committed Eclipse formatter so Java formatting is not a review topic.
- Enable ESLint's `no-explicit-any`, `no-floating-promises` and Angular template accessibility
  rules in CI.
- Add a CI job that runs the backend tests against Testcontainers PostgreSQL and the frontend build
  with production budgets.
- Decide whether the frontend API types are hand-written or generated from the OpenAPI spec; record
  the decision in [ARCHITECTURE.md](ARCHITECTURE.md).
- Add a documentation check that [API.md](API.md), [SCHEMA.md](SCHEMA.md) and [PAGES.md](PAGES.md)
  are touched when their contracts change. A human checklist is acceptable until it is skipped
  twice.
