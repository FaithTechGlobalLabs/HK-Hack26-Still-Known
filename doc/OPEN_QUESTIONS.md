# Open questions

> Status: living document · Last reviewed 2026-11-14

The big architectural decisions are settled. This file records what is still open, with a proposed
default so work can continue while the answer is pending. To answer, edit this file or reply with
the question numbers.

## 1. Decisions already made

| #   | Decision             | Choice                                                                    |
|-----|----------------------|---------------------------------------------------------------------------|
| D1  | Audience             | Outbound Hong Kong students first                                         |
| D2  | Map stack            | Leaflet + OpenStreetMap-compatible tiles                                  |
| D3  | Curation workflow    | Admin CRUD plus CSV import                                                |
| D4  | Database             | PostgreSQL via Docker Compose locally, managed in production              |
| D5  | Auth                 | Public reads, one admin session login                                     |
| D6  | Deployment           | One container serving the Angular build and the API                       |
| D7  | Public visibility    | Verified places only; amber at 6 months; hidden after 12                  |
| D8  | Service times        | Free-text note, not structured schedules                                  |
| D9  | Reviews and ratings  | Not built                                                                 |
| D10 | Student accounts     | Not built                                                                 |
| D11 | Primary intervention | A personal introduction from a named person, not an app                   |
| D12 | First delivery       | Low-tech pilot in one cohort before any matchmaker software               |
| D13 | Pilot records        | A restricted spreadsheet, never this repository or the map database       |
| D14 | Map's role           | Discovery support for students without a connector and for the matchmaker |

## 2. Answer these before scaffolding

### Q1. Is **Still Known** the final name?

- **Proposed default:** keep it for the hackathon; check the domain, trademark and social handles
  before public launch.
- **Why it matters:** the name appears in URLs, the app shell, the Open Graph image and every
  distribution message. Renaming after launch costs links and trust.
- **Also decide:** a Traditional Chinese name for the parent-facing note and future `zh-Hant` UI.
- **Blocks:** domain, branding, launch.

### Q2. Which three cities are final for the first curation sprint?

- **Proposed default:** London, Toronto, Vancouver.
- **Why it matters:** the data collection effort is the critical path. A city without a local
  curator will produce thin, stale listings.
- **Also decide:** the order for Manchester, Edinburgh, Sydney and Melbourne.
- **Blocks:** P0b curation.

### Q3. Who is the named curator, and how many hours per week can they commit?

- **Proposed default:** one lead curator at 3–5 hours per week, plus one city curator per city at
  2–3 hours per week. The lead also does second reviews.
- **Why it matters:** the map is only as good as the weekly maintenance. If no one owns it, do not
  launch.
- **Also decide:** who is the second reviewer for TCK and international tags, and who handles a
  safety concern.
- **Blocks:** launch.

### Q4. Is a Chinese-language UI required at launch?

- **Proposed default:** English UI at launch, plus a Traditional Chinese parent note and a Chinese
  summary in the leader pack. Add `zh-Hant` before promoting the map to parent groups.
- **Why it matters:** students are comfortable in English; parents may not be. A half-translated UI
  is worse than an honest English one.
- **Also decide:** whether the method page needs a Chinese version before launch.
- **Blocks:** translation work, launch scope.

### Q5. Where will it be hosted, and who owns the domain and database?

- **Proposed default:** a managed container platform plus managed PostgreSQL, paid by the project
  lead, with a shared password manager for credentials and a second person on the billing account.
- **Why it matters:** a lapsed card or a single owner who disappears takes the map offline.
- **Also decide:** the production domain, the registrar account and who can restore a backup.
- **Blocks:** deployment.

### Q6. Do we include Catholic and Orthodox churches from day one?

- **Proposed default:** yes. "Church" is not a Protestant-only word, and the tradition filter lets a
  student choose. The method page explains that tradition is self-described.
- **Why it matters:** excluding them narrows the map and makes a theological judgement the project
  is not qualified to make.
- **Also decide:** whether to include chaplaincies and university Christian unions as separate types.
- **Blocks:** seed data, taxonomy.

### Q7. What is the legal owner of the curated data, and what licence applies?

- **Proposed default:** the project owns the descriptions, tags and transport notes; factual data (names, addresses)
  remains with the organisations. Publish the curated dataset under a permissive
  licence only if the team is comfortable with reuse.
- **Why it matters:** a church may ask who owns the entry; a partner may want to reuse the data.
  Map tiles are already ODbL and must be attributed.
- **Also decide:** the source-code licence (MIT or Apache-2.0 are the obvious candidates).
- **Blocks:** public release.

### Q8. Who handles takedowns, safety concerns and legal contact?

- **Proposed default:** the lead curator is the first contact; a named second person is the backup.
  A dedicated `corrections@` or `hello@` mailbox is monitored by both.
- **Why it matters:** a safety concern cannot wait for a volunteer to check a personal inbox.
- **Also decide:** the response-time promise published on the method page.
- **Blocks:** launch.

## 3. Low-tech pilot questions (block P0a)

These come from [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md) and [ROADMAP.md](ROADMAP.md) §2. They do not
block the map build, but they block running the pilot.

### Q25. Who is the named matchmaker, and who is the backup?

- **Proposed default:** one volunteer from the sending church, named in the pilot plan, with a second
  person trained on the spreadsheet and the templates. Not a committee and not a shared inbox.
- **Why it matters:** the model fails quietly if no one owns the matching. One person, two hours per
  cohort, is the whole operational cost — and the whole risk.
- **Also decide:** who is the safeguarding lead, who must be a different person from the matchmaker.
- **Blocks:** P0a.

### Q26. Which cohort and which three cities run the pilot?

- **Proposed default:** the current graduating cohort from the initial Hong Kong youth group, with the
  three cities where the church can name a real connector today. Do not choose cities for map
  coverage alone.
- **Why it matters:** a city without a connector produces the exact failure the pilot is meant to
  detect. A city with a weak connector produces a false negative.
- **Also decide:** the minimum number of connectors per city and whether a city can run with one.
- **Blocks:** P0a.

### Q27. What is the parental-consent process for under-18s, and who stores it?

- **Proposed default:** a written consent line on the connection card, signed by a parent or
  guardian, photographed with the card and stored in the restricted drive. The parent is cc'd on the
  first introduction. No consent, no match.
- **Why it matters:** the pilot shares a minor's name, email and personal reflection with an adult
  outside the church. That needs an explicit, recorded basis, not a verbal assumption.
- **Also decide:** the retention period (proposed: delete twelve months after the cohort), who can
  access the records, and how deletion is confirmed.
- **Blocks:** P0a for any under-18 participant.

### Q28. Does the low-tech pilot run before, alongside or after the map build?

- **Proposed default:** the pilot starts **before** the map is finished and runs alongside P0b
  curation. The send-off does not wait for software; the map link is a bonus, not a dependency.
- **Why it matters:** sequencing decides whether the map is a response to an observed bottleneck or a
  guess. Running the pilot first keeps the map honest and small.
- **Also decide:** what the pilot uses when a city has no map page yet — probably the spreadsheet's
  `Places` tab exported as a one-page PDF.
- **Blocks:** the build order in [ROADMAP.md](ROADMAP.md).

### Q29. What is the policy when a student asks for an introduction through the map?

- **Proposed default:** the map has no such feature. Copy directs the student back to the leader who
  sent the link. If a student arrives with no leader, the report form can carry a `NEW_SUGGESTION`
  message, but a curator replies with the three questions, not a match.
- **Why it matters:** the moment the map accepts "please introduce me", it becomes a matching service
  with safeguarding, consent and response obligations.
- **Revisit when:** the pilot proves demand from students with no sending-church relationship, and a
  named person is resourced to run it safely.

## 4. Product questions that can wait for the prototype

### Q9. Is "TCK-friendly" the right public label?

- **Proposed default:** keep the field name `tckFriendly`, show the label "TCK-friendly" with a
  one-line definition and a link to the method page.
- **Alternative:** "International student friendly" is clearer to a 17-year-old but loses the
  third-culture specificity.
- **Why it matters:** the label is the product's most subjective claim. Test both with five
  students.

### Q10. Should we add a separate "student ministry" tag for churches?

- **Proposed default:** not in v1. `tckFriendly` plus the description covers it. If students keep
  asking "does it have a student group?", add a boolean `studentMinistry` with the same two-person
  verification.
- **Why it matters:** a church can have a student group that is entirely local students, which is
  not the same as being TCK-friendly.

### Q11. Should the public card show Hong Kong student presence?

- **Proposed default:** yes, as a phrase: "A few", "Several", "Many", never a number. It is one of
  the most useful signals and one of the easiest to over-interpret.
- **Why it matters:** it can create a false expectation of an instant friend group. The copy must
  say it is an estimate from conversation.
- **Alternative:** keep it internal and use it only for curation ranking.

### Q12. Should churches be able to submit or claim their own listing?

- **Proposed default:** they can submit through the same report form; a curator verifies and
  publishes. No self-service account or self-publishing in v1.
- **Why it matters:** self-publishing turns the map into marketing and creates a moderation queue
  with no gatekeeper.
- **Later:** a claim flow with domain email verification and curator approval.

### Q13. Should we link to church social media, not just the website?

- **Proposed default:** website only. Social links rot, require login walls and add tracking
  surface. If a church has no website but an active public page, a curator may use it as the
  `websiteUrl` after checking it.
- **Why it matters:** students use Instagram, but the map should not become a social directory.

### Q14. Do we need a "near me" / geolocation feature?

- **Proposed default:** not in v1. The city and university filters are enough, and geolocation adds
  a permission prompt and a privacy conversation.
- **Later:** a Capacitor-only "near me" with an explicit permission explanation, never automatic.

### Q15. Do we want events, service times or an Alpha course calendar?

- **Proposed default:** no. Free-text service note only. Events are the highest-churn data in any
  church directory and would doubled the curation load.
- **Why it matters:** a stale events calendar is worse than no calendar.

### Q16. Do we want analytics?

- **Proposed default:** none at launch. If a specific question needs an answer, add cookieless
  Plausible or self-hosted Umami with the five events in [PAGES.md](PAGES.md) §10.
- **Why it matters:** vanity metrics can push the team toward coverage and engagement rather than
  freshness and student outcomes.

### Q17. Do we need a "request an introduction" feature?

- **Proposed default:** no. It is the original handover problem, and it brings safeguarding,
  consent, background-check and response-time obligations that a map does not.
- **If revisited:** treat it as a separate product with a named safeguarding lead, two-adult rule,
  parental consent for under-18s and logged introductions.

### Q18. Is a native app needed at all?

- **Proposed default:** no. Ship a responsive PWA, add an install prompt, and revisit Capacitor only
  when there is a native capability worth the store review (offline pack, saved city, share
  extension).
- **Why it matters:** a bare web wrapper risks rejection under Apple's minimum-functionality rule.

## 5. Technical questions with a proposed answer

### Q19. Single container or split frontend/API?

- **Proposed default:** single container. Revisit if the frontend needs a CDN or the API needs
  independent scaling. The split is documented but not built.

### Q20. Hand-written frontend API types or generated from OpenAPI?

- **Proposed default:** hand-written in v1, because the API surface is small and generated clients
  add a build step. Revisit when the admin API grows or a second client appears.

### Q21. Is per-city Open Graph metadata a v1 requirement?

- **Proposed default:** no. v1 ships a global card; v1.1 adds per-city metadata or SSR because the
  share preview is part of the distribution thesis.
- **Why it matters:** a WhatsApp share of `/uk/london` currently previews the generic app, not
  London.

### Q22. Do we need PostGIS?

- **Proposed default:** no. City-scoped queries and fewer than a few hundred places do not need a
  spatial index. Add PostGIS when a radius search or a global viewport query is required.

### Q23. Do we need a background job?

- **Proposed default:** no. Freshness is computed at read time. A weekly curator digest can be added
  later without changing the visibility model.

### Q24. What happens to the app after the hackathon?

- **Proposed default:** decide before launch. Either it becomes a maintained service with a named
  owner and a hosting budget, or it is archived with a clear notice and the data exported.
- **Why it matters:** a stale map with no owner is worse than a retired one. Do not let it rot
  silently.

## 6. How to use this document

- Answer the blocking questions in §2 before scaffolding the backend.
- Answer §3 before the send-off, even if the map build continues in parallel.
- For everything else, use the proposed default and note the decision in
  [ARCHITECTURE.md](ARCHITECTURE.md) §15 when it is confirmed.
- If an answer changes a contract, update [PAGES.md](PAGES.md), [SCHEMA.md](SCHEMA.md) or
  [API.md](API.md) in the same change.
