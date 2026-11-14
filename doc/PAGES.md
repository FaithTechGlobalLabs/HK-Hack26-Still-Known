# Pages and routes

> Status: pre-implementation · Last reviewed 2026-11-14 · Related:
> [ARCHITECTURE.md](ARCHITECTURE.md) · [API.md](API.md) · [CURATION.md](CURATION.md) ·
> [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md)

This document is the screen-level contract: routes, URL state, data needs, interactions, empty and
error states, mobile behaviour, accessibility and acceptance criteria. Copy shown here is
illustrative; final copy lives in the translation bundle.

## 1. Route map

Static routes are declared before the two-segment city route, otherwise `/about/foo` would be
interpreted as a country/city pair.

| Route                     | Page             | Auth   | Purpose                                                      |
|---------------------------|------------------|--------|--------------------------------------------------------------|
| `/`                       | Landing          | Public | Explain the product, pick a city or university               |
| `/:countrySlug/:citySlug` | City map         | Public | Primary browse and filter surface (for example `/uk/london`) |
| `/places/:placeSlug`      | Place detail     | Public | Shareable full record and trust signals                      |
| `/about`                  | About and method | Public | Tag definitions, verification policy, limits                 |
| `/privacy`                | Privacy notice   | Public | What is and is not collected                                 |
| `/admin/login`            | Admin login      | Public | Curator sign-in                                              |
| `/admin`                  | Dashboard        | Admin  | Freshness, reports and import overview                       |
| `/admin/places`           | Place list       | Admin  | Find and triage listings                                     |
| `/admin/places/new`       | Place editor     | Admin  | Create a listing                                             |
| `/admin/places/:id`       | Place editor     | Admin  | Edit, verify or hide a listing                               |
| `/admin/reports`          | Report queue     | Admin  | Triage student and church reports                            |
| `/admin/import`           | CSV import       | Admin  | Dry-run and commit a seed file                               |
| `**`                      | Not found        | Public | Recover to a city or the landing page                        |

Reserved top-level segments: `about`, `privacy`, `admin`, `places`, `api`, `assets`, `actuator`.
City slugs must not collide with these; the backend and import validator enforce the list.

The canonical city URL is short enough to send in a message: `/uk/london`, `/ca/toronto`,
`/ca/vancouver`. Country slugs are curated (`uk`, `ca`, `au`), not derived from ISO names.

## 2. Shared page shell

### Public shell

- **Header:** wordmark, city switcher (opens a searchable sheet), "About" link.
- **Trust strip:** on city and place pages only, one line: "Listed, not recommended. Confirm
  details before you visit."
- **Footer:** About, Method, Privacy, "Report a correction", OpenStreetMap attribution, last data
  refresh date.
- **Low-tech handover prompt:** on city and place pages only, a quiet line and link: "If a leader
  sent you this link, ask them for a personal introduction." It opens a short explanation and links
  to the method page. It never opens a form and never collects student data.
- **Skip link:** "Skip to results" on map pages.

### Admin shell

- **Header:** wordmark with "Admin" tag, current user, sign out.
- **Navigation:** Dashboard, Places, Reports, Import.
- **Environment badge:** visible in non-production builds (`LOCAL`, `STAGING`) so a curator never
  edits production by accident.
- **Session expiry:** a modal warns two minutes before idle logout and preserves unsaved form state
  in memory for one re-login attempt.

### Breakpoints

| Name    | Width             | Layout                                                 |
|---------|-------------------|--------------------------------------------------------|
| Mobile  | under 768 px      | Full-screen map, collapsible sheet, single-column list |
| Tablet  | 768–1199 px       | Map with overlay sheet, two-column cards               |
| Desktop | 1200 px and above | Persistent sidebar (filters + list) and map            |

No layout relies on hover. Every hover action has a tap or keyboard equivalent.

## 3. URL and query state

Filters and selection live in the URL so a view can be shared, bookmarked and restored by the back
button.

| Parameter       | Values                                   | Behaviour                                          |
|-----------------|------------------------------------------|----------------------------------------------------|
| `types`         | `CHURCH,CAMPUS_MINISTRY,STUDENT_SOCIETY` | Comma-separated; omitted means all                 |
| `traditions`    | enum codes                               | Comma-separated; omitted means all                 |
| `languages`     | `ENGLISH,CANTONESE,MANDARIN,OTHER`       | Comma-separated; omitted means all                 |
| `sizes`         | `SMALL,MEDIUM,LARGE`                     | Comma-separated; omitted means all                 |
| `tckFriendly`   | `true`                                   | Present only when enabled                          |
| `international` | `true`                                   | Present only when enabled                          |
| `carFree`       | `true`                                   | Present only when enabled                          |
| `university`    | university slug                          | Single value                                       |
| `q`             | free text                                | Debounced 250 ms; case-insensitive client filter   |
| `place`         | place slug                               | Opens the preview card                             |
| `view`          | `map` or `list`                          | Optional; mobile defaults to map, desktop to split |

Rules:

- Canonical order and deduplication: arrays are sorted by enum order before writing the URL.
- Unknown values are ignored client-side before a request is made, with a console warning. They are
  not a crash and not a 400; the API only sees sanitised parameters.
- Changing a filter uses `replaceUrl` for continuous controls (text, checkboxes) and a normal
  history entry for discrete actions (open a place, change city). Back must never trap the user in a
  loop of every keystroke.
- Closing a place card removes `place`; it does not reset filters.
- Switching city preserves compatible filters (language, car-free) and drops university, because
  university slugs are city-scoped.

## 4. Page specifications

### 4.1 Landing `/`

**Purpose:** explain the product in ten seconds, establish trust, and route the visitor to a city.

**Sections, in order:**

1. **Hero.** "Find a church before you land." Subhead: "A verified map of churches and campus
   ministries for Hong Kong students moving abroad." Search field: "Search a city or university".
2. **City cards.** One card per pilot city: name, country, count of verified places, one-sentence
   summary, "Open map".
3. **How it works.** Three steps: pick your city → filter by what matters → check the date and go.
4. **What we verify.** Short trust block: named curator, last-verified date, transport note,
   link to the method page.
5. **What this is not.** One paragraph, with links to the method and disclaimer.
6. **For youth leaders.** "Sending a student?" link to the distribution pack (a static section or
   downloadable one-pager).

**Data:** `GET /api/v1/cities`, `GET /api/v1/search?q=` for the combobox.

**States:**

- Loading: three skeleton city cards; search disabled with a spinner.
- Error: "We couldn't load the cities. Try again." Retry button; no blank page.
- No results for a search: "We haven't reached that city yet." Offer the three pilot cities and a
  "Suggest a city" link to the report form.
- No published cities (development only): an explicit setup message, not a fake empty map.

**Interactions:** selecting a university result routes to that university's city with the
`university` filter applied. Selecting a city routes to the city map. Enter selects the first
result; Escape closes the list.

**Mobile:** stacked cards, no map.

**Accessibility:** the search is a labelled combobox with `aria-expanded`, `aria-controls` and an
`aria-live` result count. Cards are links, not click-handled divs.

**Acceptance:** searching "Toronto" and "Imperial" both reach a city page; the page states the
product's limits without scrolling on a 390 × 844 viewport.

### 4.2 City map `/:countrySlug/:citySlug`

**Purpose:** the working surface. Find a shortlist near a university, compare it, and act.

**Desktop layout:**

- Left sidebar (360–400 px): city name and verified count, search field, filter panel, result list.
- Map fills the remaining width.
- Selecting a pin highlights the list row and opens a compact preview card docked at the bottom of
  the map. "View details" navigates to the place page.
- A filter summary chip row sits above the list: "Car-free · Cantonese · Imperial College London",
  with a "Clear all" action.

**Mobile layout:**

- Full-screen map with a floating search bar and a filter button.
- Bottom sheet with three snap points: collapsed (result count), half (scrollable list), full (filters and list).
- Selecting a pin expands a preview card above the sheet; the sheet does not cover it.

**Data:** `GET /api/v1/cities/{countrySlug}/{citySlug}/places` plus
`GET /api/v1/cities/{countrySlug}/{citySlug}/universities`.

**Content of a result row / preview card:**

- Name and type icon.
- Verification badge: green "Verified 12 Sep 2026 · Rachel C." or amber "May be outdated".
- Tags: tradition, primary language, size, international, TCK-friendly, car-free.
- One-line transport summary: "6 min from South Kensington · Piccadilly line".
- Distance to the selected university if one is chosen.

**States:**

| State                        | Treatment                                                                                                                   |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Loading                      | Sidebar skeleton; map shows the city centre with a subtle progress indicator                                                |
| City not found / unpublished | 404 page with a city picker, not an empty map                                                                               |
| No verified places in city   | "We haven't verified places in this city yet." Explain the policy; link to suggest a place. Do **not** show unverified pins |
| No results for filters       | "No places match those filters." List the active filters and a "Clear filters" button                                       |
| Tiles fail                   | A neutral map panel with "Map unavailable — use the list" and the list still fully usable                                   |
| API error                    | Sidebar error with retry; map shows the last known data if it exists, otherwise a neutral panel                             |
| Aging data                   | Amber banner on the affected card and a tooltip explaining the six-month rule                                               |

**Interactions:**

- Filter changes are instant and update the URL.
- Text search filters the already-loaded city dataset; no request per keystroke.
- Panning the map does **not** filter results. The city is the scope; a student who drags the map
  must not silently lose listings.
- Cluster click zooms to the cluster bounds.
- "Reset" clears all filters but keeps the city.
- "Open in maps" is available from the preview card, not only the detail page.
- Copying the address shows a toast confirmation.
- **Low-tech handover prompt:** a persistent, dismissible line above the result list says "If a
  leader sent you this link, ask them for a personal introduction." Dismissal is stored in
  `sessionStorage` only, so the reminder returns on a later visit. The line links to `/about#handover`;
  it does not open a form, ask for an email, or start a chat. The same copy appears on every place
  page.

**Accessibility:**

- The result list is the accessible representation of the map. It is keyboard navigable, and each
  row exposes the same information as its pin.
- Filters are grouped in fieldsets with legends; each checkbox has a visible label and a hit area of
  at least 44 × 44 px.
- Opening a preview moves focus to its heading; closing returns focus to the originating row or pin
  control.
- The map container has `aria-label="Map of churches and campus ministries in London"` and a text
  alternative linking to the list.
- Status is never conveyed by colour alone; the verification badge includes text.

**Mobile specifics:** sheet drag must not pan the map underneath; map controls respect safe areas;
the filter sheet has a sticky "Show N places" button.

**Acceptance:**

- A deep link with `university`, `carFree` and `languages` reproduces the same filtered view after a
  refresh and in a new tab.
- With the map disabled (tiles blocked), the page still lists and filters every place.
- Twenty places render and filter without a visible delay on a mid-range phone.
- A place older than 365 days never appears, even when called directly.

### 4.3 Place detail `/places/:placeSlug`

**Purpose:** the shareable, indexable record. A student should be able to decide whether to visit
from this page alone.

**Sections:**

1. **Breadcrumb:** country → city → name.
2. **Header:** name, type, tradition, verification badge.
3. **Description:** one curator-written sentence, no superlatives.
4. **Tags:** language(s), size, international congregation, TCK-friendly, Hong Kong student
   presence, car-free access. Each tag has an accessible definition on the method page.
5. **Getting there:** nearest transit, walk time, route note, "Open in Google Maps" and "Open in
   Apple Maps".
6. **Address:** full address with copy button.
7. **Service note:** free text, for example "Sundays 10:30 and 17:00 during term; check the website
   before visiting." No structured schedule.
8. **Accessibility note:** only facts a curator confirmed; otherwise omitted.
9. **Website:** external link with `rel="noopener noreferrer"`, labelled "Visit [name]'s website".
10. **Before you go:** a short checklist — check the website, arrive ten minutes early, ask for the
    student worker or welcome team, and contact a leader if you have questions.
11. **If a leader sent you this link:** "A personal introduction is better than a directory. Ask the
    leader who sent you this link to introduce you to one named person in this city. If they cannot,
    these three questions are a good way to start." Link to `/about#handover`. No form.
12. **Nearby places:** up to three other verified places in the same city.
13. **Disclaimer and report:** "Listed, not recommended" and a "Report a problem" action.

**Data:** `GET /api/v1/places/{slug}`; the response includes the city summary and nearby places.

**States:**

- Loading: article skeleton with a stable header.
- Not found, hidden, draft or expired: the same 404 page. Do not reveal that a place exists but is
  hidden.
- Error: retry; keep the page shell.
- Report success: inline confirmation, no navigation away.

**Sharing and SEO:** page title and meta description are set from the place; canonical URL is the
public path; hidden places are not in the sitemap and return 404. Per-place Open Graph metadata is a
v1.1 improvement (see [ROADMAP.md](ROADMAP.md)).

**Mobile:** sticky bottom bar with two actions: "Open in maps" and "Website"; the report action
lives in the overflow menu to avoid accidental taps.

**Accessibility:** a single `h1`, logical heading order, external links announce that they open a
new tab, tags are read in a meaningful order, and the transport card is a definition list rather
than a table of unlabelled text.

**Acceptance:** every visible place is reachable by URL without the map; hidden places return 404;
the report dialog receives the place context automatically.

### 4.4 About and method `/about`

**Purpose:** carry the trust argument and make the tags falsifiable.

**Content:**

- What Still Known is and is not.
- Who curates, how a place gets listed, and the two-source rule.
- **Tag glossary:** tradition, language, size bands, international congregation, TCK-friendly, Hong
  Kong student presence, car-free access, accessibility note. Each definition says what was
  verified and what was not.
- **Freshness policy:** green under six months, amber six to twelve, hidden after twelve.
- **What we do not claim:** welcome, safety, safeguarding, doctrine, or that a student will fit.
- **Handover (`#handover`):** why a personal introduction matters more than a directory, what a
  connection card is, and how a leader can run a send-off. A plain-text explanation, not a sign-up
  or a promise of matching. Links to the downloadable leader pack when it exists.
- How to suggest a place, correct an entry, or request removal.
- Contact route and response expectations.
- OpenStreetMap attribution and data notes.

**States:** static content; no loading state. Include an anchor per tag so tooltips and support
messages can link to a definition.

**Acceptance:** every tag used on a card has a definition here, and the copy is understandable to a
17-year-old and a parent without church jargon.

### 4.5 Privacy `/privacy`

**Purpose:** legal and trust hygiene. Required before public launch.

Covers: no account, no public cookies, admin session cookie only, optional report email and its
retention, server logs, analytics (none or cookieless), IP handling, contact details, and the date of
the last policy change. It must match the implementation in [ARCHITECTURE.md](ARCHITECTURE.md).

### 4.6 Not found `**`

A short page: "We couldn't find that page." Search field, three city links, link to About. No stack
trace, no automatic redirect that hides the error.

## 5. Report flow (dialog, not a route)

**Triggers:** "Report a problem" on a place card, place page, and footer.

**Fields:**

| Field    | Rules                                                                            |
|----------|----------------------------------------------------------------------------------|
| Place    | Pre-filled and visible; not editable in the dialog                               |
| Type     | `OUTDATED`, `WRONG_INFO`, `CLOSED`, `NEW_SUGGESTION`, `SAFETY_CONCERN`, `OTHER`  |
| Message  | Required, 10–1,000 characters, plain text                                        |
| Email    | Optional, valid address, max 254 characters, labelled "Only if you want a reply" |
| Honeypot | Hidden field named `website`; must remain empty                                  |

**States:** idle → validating → submitting → success / rate-limited / error. The success copy is
specific: "Thank you. A curator will check this. We only reply if you leave an email." Rate-limit
copy gives a retry time without revealing exact thresholds.

**Accessibility:** modal focus trap, labelled fields, an error summary with links to fields,
`aria-live` for submission status, Escape closes unless submitting.

**Privacy:** the dialog must not ask for a name, phone number or school. A safety concern gets a
clear "If someone is in immediate danger, contact local emergency services" line.

## 6. Admin pages

### 6.1 Login `/admin/login`

- Username and password form; submits form-encoded credentials to `POST /api/v1/auth/login` with the
  CSRF token.
- On success, redirect to `returnUrl` or `/admin`.
- Error copy is deliberately generic: "That username or password is incorrect."
- No "forgot password". Copy: "Contact the project maintainer."
- Already-authenticated visitors are redirected to the dashboard.

### 6.2 Dashboard `/admin`

**Cards:** published places, drafts, needs re-verification, aging (6–12 months), expired (over 12
months), open reports, safety reports, last successful import, last failed import.

**Quick actions:** add a place, review reports, import a CSV.

**Rules:** every count links to the filtered list it describes. No charts in v1. A warning banner
appears if the admin password is still the local default or if the database has zero verified
places.

### 6.3 Place list `/admin/places`

**Table columns:** name, city, type, status, last verified (with age), open reports, updated at.

**Filters:** status, city, type, text search, "needs re-verification".

**Default sort:** last verified ascending, so the most rotten records appear first.

**Row actions:** edit, verify now (opens a confirmation with source URL), hide. No bulk actions in
v1; destructive actions should be deliberate.

**States:** empty (no places yet) links to import; error retry; no search results with clear filters.

### 6.4 Place editor `/admin/places/new` and `/admin/places/:id`

A single form, split into sections:

1. **Identity:** name, slug (auto-generated from name, editable before first publication), type,
   city, universities served.
2. **Location:** address, latitude, longitude, click-to-set map picker, "geocode from address"
   button that opens the provider in a new tab rather than calling a geocoder inline.
3. **Description:** one-sentence description with a 30–240 character counter and a "no superlatives"
   hint.
4. **Tags:** tradition, size, languages (multi-select with one primary), international congregation,
   TCK-friendly, Hong Kong student presence, car-free access.
5. **Transport and access:** nearest transit, walk minutes, transit note, accessibility note,
   service note.
6. **Verification:** status (read-only; changed by the verify, hide and re-verify actions), last
   verified date, verified by, source URL, internal curator note.
7. **Audit footer:** created at/by, updated at/by, last import batch.

**Behaviour:**

- A live preview rail renders the public card exactly as a student sees it.
- "Save draft" is always available. "Verify and publish" validates required fields first.
- Publishing requires a source URL, a verifier name and coordinates.
- Hiding requires a reason, stored in the audit log and the internal note.
- Unsaved changes trigger a guard on navigation.
- Concurrency: a stale `version` returns a conflict message with a reload action, not a silent
  overwrite.

### 6.5 Report queue `/admin/reports`

**Tabs:** Open, In review, Resolved, Dismissed. Safety concerns are pinned above the list with a
distinct label.

**Row content:** age, type, place, excerpt, contact-present indicator.

**Detail panel:** full message, place link, contact email if provided (copy button), resolution note,
and actions:

- **Resolve** with a note and an optional "re-verify place" step.
- **Dismiss** with a reason (spam, duplicate, not actionable).
- **Hide place** shortcut for safety concerns; requires confirmation and a reason.

**SLA hint:** a small label shows the target resolution time from
[CURATION.md](CURATION.md): 24 hours for safety, 72 hours for closed, 7 days for stale or wrong
details, 14 days for suggestions.

### 6.6 Import `/admin/import`

- Upload a UTF-8 `.csv` up to 2 MB.
- The default action is **dry run**. Show inserted, updated, skipped and failed counts, plus an
  error table with row number and field.
- "Commit import" is enabled only when the dry run has no blocking errors.
- A download link provides the error report as CSV.
- History lists previous batches with file name, actor, counts, duration and status.
- A short format reminder links to [SCHEMA.md](SCHEMA.md); do not duplicate the column list here.

## 7. Shared components

| Component            | Used by               | Responsibility                                             |
|----------------------|-----------------------|------------------------------------------------------------|
| `city-picker`        | Landing, 404          | Searchable city and university list                        |
| `filter-panel`       | City map              | Renders filter groups from taxonomy; emits a filter model  |
| `place-card`         | City map, nearby      | Compact card with tags, verification and transport summary |
| `place-detail-panel` | Place detail          | Full record layout                                         |
| `verification-badge` | Cards, detail, admin  | Green / amber / hidden states and the policy tooltip       |
| `transport-summary`  | Cards, detail         | Transit line, walk time and "open in maps" actions         |
| `report-dialog`      | Cards, detail, footer | Anonymous report form                                      |
| `empty-state`        | All lists             | Message, explanation and a primary recovery action         |
| `confirm-dialog`     | Admin                 | Destructive actions with a required reason                 |
| `csv-dropzone`       | Admin import          | File selection, size and type validation                   |
| `admin-data-table`   | Admin lists           | Sorting, filtering and pagination shell                    |

No component fetches its own data; page components own data loading, shared components receive
inputs and emit outputs.

## 8. Copy and tone

| Context                  | Copy                                                                                                                                                                  |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Verification, fresh      | "Verified 12 Sep 2026 by Rachel C."                                                                                                                                   |
| Verification, aging      | "May be outdated — confirm before visiting."                                                                                                                          |
| Verification, admin only | "Unverified — not public."                                                                                                                                            |
| Empty city               | "We haven't verified places here yet."                                                                                                                                |
| Empty filters            | "No places match those filters."                                                                                                                                      |
| Car-free tag             | "No car needed"                                                                                                                                                       |
| TCK tag                  | "TCK-friendly" with definition: "Has an active international student ministry or a sustained third-culture student presence, confirmed by a curator."                 |
| International tag        | "International congregation" with definition: "A meaningful share of regular attenders were born outside the host country, confirmed by a leader or a curator visit." |
| Disclaimer               | "Listed, not recommended. We don't vet leadership or safeguarding practices."                                                                                         |
| Handover prompt          | "If a leader sent you this link, ask them for a personal introduction."                                                                                               |
| Handover, no connector   | "A map is a starting point. A named person is better. Ask your leader, or use the three questions above."                                                             |
| Report                   | "Tell us what's wrong. A curator will check it."                                                                                                                      |
| Safety                   | "If someone is in immediate danger, contact local emergency services."                                                                                                |

Tone rules: plain English, no church jargon without a definition, no superlatives, no promises of
welcome or safety, and no "we think you'll love it". British spelling in prose.

## 9. Accessibility standard

Target **WCAG 2.2 AA** for every public page.

- The list view is a complete alternative to the map, not a fallback.
- All interactive elements are reachable and operable by keyboard.
- Focus is visible and managed when dialogs, sheets and preview panels open or close.
- Colour is never the only carrier of meaning; verification state includes text.
- Text contrast meets 4.5:1 for body text and 3:1 for large text and UI boundaries.
- Touch targets are at least 44 × 44 px.
- Form errors are announced and linked to their fields.
- `prefers-reduced-motion` disables map fly-to animations and sheet transitions.
- The page works at 200% zoom without horizontal scrolling.

## 10. Analytics events (optional, cookieless)

Only if privacy-friendly analytics are enabled. No identifiers, no free text, no email.

| Event            | Properties                                   |
|------------------|----------------------------------------------|
| `city_view`      | `country`, `city`                            |
| `filter_apply`   | `filter` name and selected count only        |
| `place_open`     | `city`, `place`                              |
| `outbound_click` | `place`, `destination` (`website` or `maps`) |
| `report_submit`  | `type` only                                  |

## 11. Global acceptance criteria

- Every public route works on a cold load with a deep link.
- A hidden or expired place returns 404 on both the API and the page.
- The map can fail without taking the list down.
- No public page requires a login, a cookie banner or an age gate.
- No public page asks for a student name, school, age, phone number or destination. The report form
  is the only public input.
- Every city and place page carries the low-tech handover prompt and does not imply that the map
  performs matching or introductions.
- Every public page links to the method and privacy pages.
- Every admin mutation is reflected in the audit log.
- Keyboard-only and screen-reader smoke tests pass on landing, city and place pages.
- No hardcoded user-facing English in templates; all strings come from the translation bundle.
