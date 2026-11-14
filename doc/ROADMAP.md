# Roadmap

> Status: pre-implementation · Last reviewed 2026-11-14 · Related:
> [README.md](../README.md) · [CURATION.md](CURATION.md) · [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)

The sequence is deliberate: **prove the human handover first, curate data second, prototype third,
build the backend fourth, launch fifth.** Writing code before the relationship and the data exist
produces a beautiful empty map and a handover nobody tested.

The no-code pilot in P0a is defined in full in [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md). It runs on a
paper card, a restricted spreadsheet and email. This repository supports it; it does not implement
it.

Effort estimates assume one developer and a part-time curator. They are ranges, not commitments.

## 1. Phase overview

| Phase                              | Outcome                                                                                                               | Effort                                                                                   | Gate to the next phase                                                                    |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| **P0a — Low-tech pilot (no code)** | One cohort with a send-off ritual, a connection card, a named matchmaker and a personal introduction before departure | 2–3 hours of leader time, plus about 30 minutes a week of matchmaker time, over 3 months | Students who want an introduction have a named connector; the six-week review is complete |
| **P0b — Curation sprint**          | Three cities of verified data in a spreadsheet                                                                        | 5–8 days                                                                                 | At least 21 places meet the standard in [CURATION.md](CURATION.md)                        |
| **P1 — Static prototype**          | Clickable Angular + Leaflet map with hard-coded JSON                                                                  | 2–3 days                                                                                 | Five students and two leaders test it; at least three would use it                        |
| **P2 — Backend MVP**               | Spring Boot, PostgreSQL, admin CRUD, CSV import, reports                                                              | 8–12 days                                                                                | A curator can add, edit, verify and hide a place without a developer                      |
| **P3 — Launch readiness**          | Trust copy, accessibility, deployment, distribution pack                                                              | 3–5 days                                                                                 | 21 verified places live; smoke test and accessibility pass                                |
| **P4 — Second wave**               | More cities, campus layer, PWA/offline                                                                                | 5–8 days                                                                                 | Freshness stays above 90% while coverage grows                                            |
| **P5 — Optional**                  | Bilingual, per-city sharing cards, native shell, curator tools                                                        | Ongoing                                                                                  | A specific user problem justifies each item                                               |

P0a and P0b can run in parallel if the same person is not doing both: the pilot needs a graduating
cohort and a matchmaker, while curation needs a data curator. They share the `Places` tab, so
curation output feeds the pilot directly. If the team is one person, run P0a first — it is cheaper
and it tells you whether the map is worth curating at all.

## 2. P0a — Low-tech pilot (no code)

**Goal:** prove that a personal introduction, not an app, is what changes the handover — and learn
where the operational bottleneck actually is.

The run sheet, spreadsheet columns, message templates and safety rules are in
[LOW_TECH_PILOT.md](LOW_TECH_PILOT.md). This section is only the roadmap view.

Deliverables:

- A named matchmaker and a named backup.
- A named safeguarding lead, distinct from the matchmaker.
- Three pilot cities, each with at least one consenting connector.
- A 30–45 minute send-off ritual for one graduating cohort.
- Printed connection cards and a Traditional Chinese parent note.
- A restricted spreadsheet with `Students`, `Connectors` and `Places` tabs.
- One personal introduction email per student who wants one, sent before departure.
- Follow-ups at two weeks, six weeks and (optionally) three months.
- A short written review: what worked, what did not, and matchmaker hours.

Exit criteria:

- At least 80% of students who want an introduction have a named connector before departure.
- At least 60% have replied to or met the connector by two weeks.
- At least 50% have visited a church or ministry by six weeks.
- The matchmaker can sustain the work within three hours per cohort.
- The team can answer the only question that justifies more software: **is the bottleneck
  relational capacity, or operational scale?**

Decision gates:

| Finding                                                                        | Next move                                                                                                                                      |
|--------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Students want a connection and the model fits in three hours per cohort        | Keep it low-tech. Improve the spreadsheet and templates. Build no app beyond the map.                                                          |
| The bottleneck is coordination — names copied between sheets, reminders missed | Add the smallest coordination aid: a better shared sheet, the map's `Places` CSV import, or a one-page form. No accounts, no matching backend. |
| Many churches, many cities, matchmaker saturated by volume                     | Consider a matchmaker tool as a **separate** application with its own safeguarding and consent model. Still not this repository.               |
| Connectors do not respond, or students do not want an introduction             | The problem is not software. Fix connector quality, the send-off conversation or the offer.                                                    |

If this phase fails, the most likely causes are relational capacity, connector quality or a student
who did not want an introduction. None of those is fixed by code. Do not compensate by building the
app.

## 3. P0b — Curation sprint

**Goal:** prove that the data can be collected to the standard before building anything.

Deliverables:

- Three city CSVs in `data/seed/`, following [SCHEMA.md](SCHEMA.md) §11.
- 5–8 churches and 2–3 campus ministries per city.
- Every place has a description, transport note, verifier, source URL and verification date.
- A named second reviewer for TCK and international tags.
- A city summary and map centre for each city.
- A shortlist of youth leaders who will distribute the links.

Exit criteria:

- At least 21 places are verified, not merely scraped or copied.
- At least one Cantonese or Mandarin provision is listed in each city.
- At least one car-free option exists near each target university.
- A student who has been to the city reviews the shortlist and says it is plausible.
- The lead curator can explain every tag on every card.

If this phase fails, the product is not ready. Do not compensate with code.

## 4. P1 — Static prototype

**Goal:** test the interaction and the framing with real students before adding a backend.

Deliverables:

- Angular + Ionic shell with a Leaflet map.
- City data loaded from a static JSON file generated from the CSVs.
- Map pins, clustering, list view, filters, place cards and a detail panel.
- Verification badge and "may be outdated" state.
- A visible disclaimer and a method page.
- Deployed to a free static host with a shareable city URL.

Explicitly not included: login, database, admin, report submission (use a mailto link or a form
service), per-city Open Graph images.

Test script:

1. Show the landing page for ten seconds. Ask: "What is this?"
2. Ask a student to find a church near their university without a car.
3. Ask them to explain what "last verified" means.
4. Ask: "What would make you distrust this?"
5. Ask a leader: "Would you send this link? What is missing?"

Exit criteria:

- At least three of five students would use it.
- At least two leaders would send it.
- No one believes it is a recommendation or a guarantee.
- The transport note is the most-mentioned useful feature, or the hypothesis is wrong and the plan
  changes.

## 5. P2 — Backend MVP

**Goal:** make the data maintainable by a non-developer.

Deliverables:

- Spring Boot API, PostgreSQL, Flyway migrations.
- Public city, place, taxonomy and search endpoints.
- Admin session login, place CRUD, verify and hide actions, audit log.
- CSV import with dry run, row errors and commit.
- Public report submission with rate limiting and a queue.
- Server-enforced visibility rules (verified, aging, expired).
- Seed import for local development.
- Integration tests against Testcontainers PostgreSQL.

Exit criteria:

- A curator can import a city CSV, fix a row error, verify a place and hide a stale place without
  asking a developer.
- A hidden or expired place returns 404 on the API and the page.
- The report queue is usable on a phone.
- Backup and restore have been rehearsed once.

## 6. P3 — Launch readiness

**Goal:** ship something that deserves to be forwarded.

Deliverables:

- Final copy on landing, city, place, method and privacy pages.
- Accessibility pass: keyboard, screen reader smoke test, contrast, 44 px targets, list parity.
- Mobile pass on a real iPhone and a mid-range Android.
- Global Open Graph tags and a default share image.
- `robots.txt`, `sitemap.xml`, canonical URLs, real 404 status.
- Production deployment, uptime check, error alerts, backups.
- Distribution pack: city links, WhatsApp message, parent note, QR card, leader briefing.
- A feedback loop: five student interviews and two leader interviews after two weeks.

Exit criteria:

- Three city pages live with 21+ verified places.
- No listing older than 180 days at launch.
- A leader can send one link without explaining the product first.
- The site works with tiles blocked and with JavaScript enabled but no map.
- The privacy and method pages are accurate.

## 7. P4 — Second wave

**Goal:** grow coverage without letting freshness collapse.

Candidates, in order:

1. **Campus ministry layer** as a first-class filter and map layer, if it is not already complete.
2. **Manchester, Edinburgh, Sydney, Melbourne** — one city at a time, with a local curator.
3. **PWA and offline city pack** for arrival week.
4. **Per-city Open Graph images and metadata**, so a share preview names the city.
5. **A public freshness dashboard** ("92% verified in the last six months").
6. **A church correction route** separate from student reports.
7. **A print-friendly city guide** for leaders who hand out paper.

Gate: do not add a city until the existing cities are above 90% fresh and the report backlog is
under the SLA.

## 8. P5 — Optional ideas

These are ranked by value relative to effort. None is required for the MVP.

| Idea                             | Value                         | Effort    | Notes                                                                                                         |
|----------------------------------|-------------------------------|-----------|---------------------------------------------------------------------------------------------------------------|
| Chinese UI (`zh-Hant`)           | High for parents              | Medium    | Requires full translation parity and testing                                                                  |
| Per-city OG metadata / SSR       | High for WhatsApp sharing     | Medium    | The share preview is part of distribution                                                                     |
| Offline city pack (PWA)          | High for arrival week         | Medium    | Cache the shell and one city payload                                                                          |
| "First Sunday" guide             | High for student confidence   | Low       | Content, not code; what to wear, when to arrive, communion, giving                                            |
| Arrival timeline                 | Medium                        | Low       | Before you fly, first week, first month                                                                       |
| Parent one-pager in Chinese      | High for distribution         | Low       | A PDF or static page                                                                                          |
| Curator freshness dashboard      | Medium                        | Low       | Counts, aging, report SLA                                                                                     |
| Church self-service claim        | Medium                        | High      | Verification and moderation complexity; defer                                                                 |
| "Ask a curator" question form    | Medium                        | Medium    | Not messaging; a routed email with a response expectation                                                     |
| Saved city (local storage)       | Low–medium                    | Low       | Useful in the native shell                                                                                    |
| Native app                       | Low until native value exists | High      | App-store review risk; see [DEPLOYMENT.md](DEPLOYMENT.md) §11                                                 |
| Events or Alpha course calendar  | Low                           | High      | High churn, stale data, moderation                                                                            |
| Alumni connector / introductions | Very high risk                | Very high | Separate product with safeguarding, consent and background checks; the human version runs in P0a without code |

### Ideas explicitly not on the roadmap

- Star ratings, reviews or public comments.
- Direct messages or a matching algorithm.
- User profiles or a social feed.
- Automated scraping of church websites.
- Global coverage.
- Paid placement or advertising.
- AI-generated descriptions without a curator's review.
- A "heresy filter" or doctrinal ranking.

Each of these either creates a moderation burden the team cannot carry or turns a reference tool
into a relationship platform with safeguarding obligations.

## 9. Hackathon weekend cut

If the goal is a demo in 48 hours, build the smallest honest slice:

**Friday**

- Finalise the schema and the three city CSVs (even 3 places per city is enough for a demo).
- Scaffold Angular + Leaflet and Spring Boot + PostgreSQL.
- Deploy a walking skeleton: one city endpoint, one map page.

**Saturday**

- Map, list, filters, place card, verification badge.
- Public city and place endpoints.
- Admin login and a minimal place editor, or CSV import if time is short.
- Deploy to a public URL.

**Sunday morning**

- Report form, disclaimer, method page.
- Mobile pass and keyboard pass.
- Seed the demo data and rehearse the story.
- Test with two students and one leader.

**Cut first if time is short:** clustering, search typeahead, per-city OG, analytics, audit UI, bulk
actions, import history, accessibility beyond the basics.

**Never cut:** verification dates, the disclaimer, the list view, the car-free note, and the rule
that unverified places are not public. Those are the product.

## 10. Success gates and review cadence

Review after each phase, and monthly after launch:

- **Handover (P0a):** students with a named connector before departure, introductions sent,
  reply or meeting at two weeks, church visit by six weeks, matchmaker hours per cohort. These are
  tests of the model, not performance targets for students.
- **Coverage:** verified places per city against the 8–11 target.
- **Freshness:** percentage verified within 180 days; target 90%.
- **Report health:** median resolution time against the SLA.
- **Distribution:** leaders who shared a city link; students who arrived from a leader's link.
- **Qualitative:** five student interviews per city at launch, three after three months.
- **Curation load:** hours per week. If it exceeds the available volunteer time, reduce the number
  of cities rather than lowering the standard.

If freshness falls below 80%, pause new cities. If the curator cannot sustain three cities, launch
with two. A small, true map is the product.
