# Still Known

**A verified, filterable map of churches and campus ministries for Hong Kong students moving abroad — and one layer of a
larger, mostly low-tech handover.**

> Status: pre-MVP planning · Decisions last reviewed 2026-11-14
>
> This repository builds the **map**. The human handover model — the send-off ritual, the connection
> card, the matchmaker and the personal introduction — is documented in
> [doc/LOW_TECH_PILOT.md](doc/LOW_TECH_PILOT.md). The map supports that model; it does not replace
> it.

## The problem

Every year, Hong Kong international-school students leave for universities in the UK, Canada,
Australia and the United States. Many have a church home in Hong Kong and want one abroad. The
information they need is scattered across WhatsApp threads, a youth leader's memory, denominational
websites and generic church directories that assume you own a car, speak the local language and
already know what you are looking for.

The result is predictable: the first few Sundays are spent guessing, some students drift, and
parents worry. The handover problem is real, but much of it is a **discovery** problem before it is
a **connection** problem.

There is a second, harder layer. A student who moves overseas is not only looking for a building. They
are working out who they are away from home, whether they will disappoint their parents, and whether
anyone will notice if they quietly stop going. A directory cannot answer those questions. A named
person can.

## The full solution is mostly low-tech

The churches and ministries that do this well do not start with an app. They start with a relational
ritual, a small amount of information collected in a normal conversation, and a personal
introduction to a named person in the destination city.

| Tier            | Model                                                          | What it does                                                                                                                                           | What it does not do                                                                             |
|-----------------|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| **1. Non-tech** | Relational ritual and human introductions                      | A send-off, prayer by name, a connection card, a leader conversation, a personal email or call to someone in the new city                              | Does not scale beyond the leader's network; depends on one person's contacts                    |
| **2. Low-tech** | Connection cards, a curated spreadsheet and a human matchmaker | Matches each student to one named connector before departure; the connector reaches out first; two follow-ups after arrival                            | Depends on matchmaker capacity and connector quality; needs consent and safeguarding discipline |
| **3. Tech**     | The map in this repository                                     | Lets a student find verified places, transport notes and tags when there is no personal contact yet; gives the matchmaker a shared, verified city list | Cannot create belonging; a stale or unverified listing destroys trust faster than a missing one |

A future app or WhatsApp bot would be a later Tier 3 extension. It is **not** this repository, and it
is not the first thing to build.

> **The evidence that matters.** Newman Connection, a Catholic campus ministry matching model,
> reports that a personal invitation from a campus minister makes a young person four times more
> likely to remain active in their faith. Whether or not the exact multiplier transfers to Hong
> Kong, the mechanism is clear: **expectation and a named person**, not information. The student
> arrives already expected, already known, already invited.

### Why not build the app first

- The app can become the output, while the relationship becomes optional. A polished map can create
  the appearance of a solution while no one is making the introduction.
- Students do not adopt a handover tool; **leaders do the work**. The student receives a gift, not
  homework.
- The first 50 students do not need a backend. They need a card, a spreadsheet, a matchmaker and a
  named connector.
- The low-tech pilot is cheap, fast and tests the real hypothesis: **do students want a connection,
  and can the church sustain the matching?**
- Build the app only if the pilot proves the bottleneck is **operational scale**, not relational
  capacity. Then build the smallest tool that removes that specific bottleneck.

### Where this repository fits

- The map is the **discovery layer**. It helps a student who has no personal contact, and it gives
  the matchmaker a verified list to work from.
- The map carries a low-tech prompt: **"If a leader sent you this link, ask them for a personal
  introduction."** No account, no form, no matching backend.
- The map **does not store students, connectors or matches**. Those live in a restricted
  spreadsheet governed by consent, described in [doc/LOW_TECH_PILOT.md](doc/LOW_TECH_PILOT.md).
- The map is not a directory of every church. It is a small, curated set that a named curator has
  checked.

## The map (this repository)

Still Known is a **no-account, web-first map** of a curated selection of churches and campus
ministries near the universities Hong Kong students actually attend.

Every listing is:

- **curated, not scraped** — a named curator has checked it;
- **dated** — "last verified" is visible on every card;
- **tagged for the questions students actually ask** — tradition, language, size,
  international congregation, TCK-friendliness and car-free access;
- **honest about its limits** — a starting point for discernment, not a guarantee of belonging.

A youth leader can send one link — `stillknown.app/uk/london` — to a student going to London. The
student opens it, filters by university and preference, and sees five to ten places worth visiting,
with transport notes written for someone without a car.

## What the map is not

| It is                                         | It is not                                  |
|-----------------------------------------------|--------------------------------------------|
| A curated discovery tool                      | A directory of every church                |
| A reference for students, parents and leaders | A social network or messaging app          |
| A starting point for a visit                  | A matchmaking or introduction service      |
| A list of verified facts                      | A review site or rating platform           |
| Web-first, no account required                | An app-store product (yet)                 |
| A support for the low-tech handover           | The handover itself                        |
| A public, curator-owned dataset               | A student roster or a connector database   |
| Honest about freshness                        | A guarantee of welcome, safety or doctrine |

> **Framing rule:** we say **"listed"**, not **"recommended"**. We describe what a place is and what
> a curator confirmed. We do not promise that a student will fit in, be safe, or agree with
> everything taught.

## Who it is for

| User                          | What they need                                                      | What the MVP gives them                                                                                   |
|-------------------------------|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **Student leaving Hong Kong** | "Where can I go near my campus, and will I understand the service?" | A city map, university filter, language and tradition tags, transport notes, a place card they can act on |
| **Parent**                    | "Is there a church community near my child's university?"           | A shareable city link, listings with a visible verification date, and a parent briefing                   |
| **Youth leader or chaplain**  | "What do I hand over that is better than a WhatsApp contact?"       | One link per city, a connection card, and a short distribution pack                                       |
| **Matchmaker**                | "Which place and which person fit this student?"                    | A shared verified list, transport notes and a city link to send when there is no connector                |
| **Curator**                   | "How do I keep this accurate without a huge admin team?"            | A protected admin screen, CSV import and a report queue                                                   |

## MVP scope

### In scope for v1

1. **City map plus list view.** Search by city or university. Pins for churches and campus
   ministries. Clicking a pin opens a card with name, address, one-sentence description, tags,
   transport note and last-verified date.
2. **Filters that match real questions:** type, tradition, language, size, international
   congregation, TCK-friendly, car-free access and university.
3. **Campus ministry layer.** Campus ministries and student societies are often more useful than
   churches to a first-year student, and generic church finders ignore them.
4. **Shareable city links** with filters in the URL, so a leader can send the right link and a
   student can bookmark a view.
5. **"Report outdated or wrong information"** with no login. Optional email for a reply. This is the
   maintenance mechanism, not a social feature.
6. **Verification rules enforced by the product.** Only verified entries are public; entries aged six
   to twelve months carry a warning; entries older than twelve months disappear from public view
   until re-verified.
7. **Protected admin area** for create, edit, verify, hide, CSV import and report triage.
8. **Method and disclaimer pages** that explain the tags, the verification policy and the limits of
   the tool.
9. **A low-tech handover prompt** on city and place pages: "If a leader sent you this link, ask them
   for a personal introduction." No accounts, no matching backend, no student data.

### Explicitly out of scope for v1

- Student accounts, profiles, favourites or saved lists.
- Messaging, automated introductions or a matchmaker workflow inside the app.
- Student rosters, connector records or any personal data about the people being matched.
- Reviews, ratings, rankings or star scores.
- Automated scraping, live ingestion or inferred church data.
- Global coverage. Three pilot cities, then a deliberate second wave.
- A native app-store release. The web app is responsive and Capacitor-ready, but v1 is the web.
- Payments, advertising or paid placement.
- The low-tech pilot itself. It runs on paper, a spreadsheet and email; this repository only
  supports it.

## Pilot cities

Coverage is deliberately narrow. **Signal beats coverage.** A student in London does not need four
hundred churches; they need a handful that are worth a visit and a note on how to get there.

| City                       | Why first                                                                                                           | Seed target              | Status      |
|----------------------------|---------------------------------------------------------------------------------------------------------------------|--------------------------|-------------|
| **London**, United Kingdom | One of the largest concentrations of Hong Kong students in the UK; strong transit; many international congregations | 8 churches, 3 ministries | Not started |
| **Toronto**, Canada        | Large Hong Kong diaspora; car-centric suburbs make transport notes especially valuable                              | 7 churches, 3 ministries | Not started |
| **Vancouver**, Canada      | Dense Hong Kong community; compact and transit-friendly                                                             | 6 churches, 3 ministries | Not started |
| Next wave                  | Manchester, Edinburgh, Sydney, Melbourne                                                                            | 5–8 places each          | Backlog     |

**Launch threshold:** at least **21 verified places** across three cities, with every place checked
by a named curator and every transport note written from a student's perspective. If three cities
cannot be filled to that standard, launch with two.

The first cohort is one Hong Kong church youth group. The map is a support for that cohort, not a
prerequisite for the pilot.

## The low-tech pilot

This is the part that does not need code, and it is the part that tests whether the handover works.
The full run sheet, spreadsheet columns and message templates are in
[doc/LOW_TECH_PILOT.md](doc/LOW_TECH_PILOT.md). The shape is deliberately simple.

### 1. A send-off ritual

A 30–45 minute segment in a normal service or youth night:

- name each graduating student aloud and pray for them by name;
- a **cohort reveal** — "five of you are going to the UK, three to Canada, two to the US";
- fill in a **connection card** with a leader, not a form queue;
- a short **parent briefing**;
- a commissioning prayer. The student keeps the card.

The ritual is the product. It gives the student a moment of being sent, and it gives the leader a
natural reason to collect the three facts the matchmaker needs.

### 2. A connection card

A physical card, filled in with a leader:

- name, personal email, destination city, university and departure date;
- **one thing I'm excited about**;
- **one thing I'm nervous about**;
- **one thing I want in a church community**;
- optional on the back: **one thing I want to become this year**;
- consent to share the first three fields with one named connector; parental consent for under-18s.

The card is not a worksheet. It is a ritual object that gives the leader language for a
conversation and gives the matchmaker enough to make a warm introduction. The student keeps the
card; the leader photographs it with permission.

### 3. A curated spreadsheet with owners

Three tabs, kept in a restricted drive with two-factor authentication, never in this repository:

| Tab            | What it holds                                                                                                                                                        |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Students**   | Name, email, destination, university, consent, connector assigned, intro date, two- and six-week follow-up outcomes, one line of context the student agreed to share |
| **Connectors** | City, name, role or organisation, how the leader knows them, contact route, consent to be named, safeguarding reference, last verified, backup connector             |
| **Places**     | The same fields as the map CSV: church or ministry, address, coordinates, tags, transport note, website, verifier, last-verified date                                |

The `Places` tab is the low-tech source of truth until the map admin replaces it. The `Students` and
`Connectors` tabs never move into the map database.

### 4. A human matchmaker

One named person, plus a backup. Not a committee.

- Two hours per cohort to match and send introductions; about 30 minutes a week during departure
  season.
- **One named connector per student**, not a list of five churches.
- The match uses city, university, language, tradition, transport and the student's stated
  nervousness — not personality guesses.
- The matchmaker sends the introduction, records the date, and follows up at two and six weeks.
- If there is no connector, the student gets the map link and three questions to ask when they
  visit. Do not force a bad match.

### 5. A personal introduction before departure

One email introduces the student, the connector and the sending leader. For under-18s, the parent is
cc'd. The connector replies to the whole thread, not privately to the student, and offers one
concrete next step: a service, a meal, a small group or a campus meeting.

The message is short. The point is not information; it is **expectation**. The student arrives
already known.

### 6. Two follow-ups and a parent briefing

| When                    | What                                                                            |
|-------------------------|---------------------------------------------------------------------------------|
| Before departure        | Introduction sent                                                               |
| Two weeks after arrival | "Did [connector] reach out? Have you been able to visit anywhere? No pressure." |
| Six weeks after arrival | "Have you found a place you'd go back to? If not, would one more try help?"     |
| Three months            | Optional check-in and celebration                                               |

The parent briefing has three messages:

1. **Normalise the first term.** Church may be the last thing on the student's mind while school,
   housing and friendships settle. That is not a failure of faith.
2. **Lower the performance pressure.** Do not ask "Have you found a church yet?" every week. Ask
   "How are you?" first. A student should not feel they are disappointing you.
3. **Give one practical next step.** Know the emergency contacts, the transport route, the cost of
   living and one person they can call. At three weeks, ask: "Is there one person or place that feels
   like a beginning?"

### 7. Identity and formation

The map answers "where can I go?" The card and the leader conversation answer a different question:
"Who am I now, and who do I want to become?"

Useful prompts, not a form:

- Who were you at home?
- Who are you when no one from home is watching?
- Who do you want to become this year?
- What kind of community would help you become that person?

Do not force a definition. The goal is self-awareness and agency, not a personal brand. A student who
knows what they are looking for can survive a bad first visit; a student who does not may stay home.

### 8. Safety, consent and celebration

- **Student data:** minimum fields, explicit consent, parental consent for under-18s, restricted
  access, delete twelve months after the cohort.
- **Connectors:** known to a leader or trusted organisation, a reference recorded, consent to be
  named, a simple code of conduct, no private one-to-one meetings with under-18s.
- **Churches:** the map's curation standard applies, but listing is not vetting. No guarantee of
  safety or doctrine.
- **Incidents:** a named safeguarding lead, immediate escalation, hide the place, document facts, do
  not investigate alone.
- **Celebration:** commission by name, share a one-line update with the sending church only with
  permission, thank connectors personally. No leaderboard and no comparison between students.

### 9. What the low-tech pilot does not solve

- A city with no connector. The map helps, but it is not a relationship.
- A student who is too busy or does not reply. Two attempts, then leave the door open.
- A bad fit. The student may need to visit more than one place and talk to a leader.
- Safeguarding. It needs a named lead, a policy and an escalation route, not a spreadsheet.
- Deep identity and mental-health struggles. Refer to a professional; the matchmaker is not a
  counsellor.

### 10. What to measure

- Students with a named connector before departure.
- Introductions sent before departure.
- Reply or meeting at two weeks.
- A church visit by six weeks.
- A meaningful connection at three months.
- Matchmaker hours per cohort and connector response rate.
- Map usage, as a secondary signal.

Proposed first-cohort targets, to adjust after the pilot: 80% of students who want an introduction
have a named connector before departure; 60% have replied to or met the connector by two weeks; 50%
have visited a church or ministry by six weeks; the matchmaker spends no more than three hours per
cohort on matching and introductions.

These are tests of the model, not performance targets for students.

## How a student uses it

1. A youth leader sends `stillknown.app/uk/london` in the send-off group, ideally with a personal
   introduction to a named connector.
2. The student opens the link on a phone. The map centres on London, with a list of places.
3. They filter by **Imperial College London**, **car-free** and **Cantonese or bilingual**.
4. They tap a pin. The card says what the church is like, when it was last verified, and how to get
   there from campus without a car.
5. If a leader sent the link, they ask that leader for the personal introduction. If there is no
   connector, the map gives them a starting point and three questions to ask when they visit.
6. They open the church website, copy the address, or open it in their maps app.
7. If something is wrong, they tap **Report a problem** — no account needed.

## Product principles

1. **Relationship before software.** The personal invitation is the intervention. The map is a
   support.
2. **Low-tech first.** A card, a spreadsheet and a matchmaker beat an app for the first cohort.
3. **Signal over coverage.** A small, verified set beats a large, decaying directory.
4. **Verification is the feature.** The date and the curator are part of the product, not metadata.
5. **A starting point, not a guarantee.** The UI says so plainly, on every city page.
6. **No accounts, no reviews, no rankings.** These add friction, moderation burden and legal risk
   without solving discovery.
7. **Write for the car-less first-year.** Transit is a first-class filter, not an afterthought.
8. **One small next step.** A warm hello, one visit, one meal. Do not hand a student a programme.
9. **The curator and the connector are named humans.** "The community" cannot be asked to fix a
   wrong service time or make an introduction.
10. **Distribution through leaders, not app stores.** The link is the product surface.
11. **No dark patterns, no engagement metrics as goals.** Success is a student finding a church and a
    person, not time spent in the app.

## What success looks like

### Low-tech pilot (first cohort)

- Every student who wants an introduction has a named connector before departure.
- At least half have replied to or met the connector by two weeks.
- At least half have visited a church or ministry by six weeks.
- The matchmaker can sustain the work within three hours per cohort.
- Five student interviews and two connector interviews confirm what helped and what did not.
- The team can answer: is the bottleneck relational capacity, or operational scale?

### Map launch (week 6)

- Three city pages live with at least 21 verified places between them.
- Five students and two youth leaders have tested the prototype; at least three say they would use
  it and at least two would send it to a student.
- Every visible listing has a verification date, a named verifier and a transport note.
- The site is usable with a keyboard, on a phone, and with the map replaced by a list.

### Three months after launch

- At least one genuine correction or outdated report per month.
- No listing older than twelve months is visible.
- At least two leaders have distributed a city link without being asked.
- At least one student interview confirms that a listing led to an actual visit.
- The low-tech pilot has a documented decision: continue low-tech, add light digital, or build the
  next tool.

**Deliberately not a success metric:** page views, session length or number of listings.

## The existing landscape

These tools and models are useful, and several are better than nothing. None is built around the
outbound Hong Kong student, the car-free first year, or the combination of a directory and a human
handover.

| Tool or model                               | What it does well                                                                              | Gap for this use case                                                                                             |
|---------------------------------------------|------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Newman Connection**                       | A low-tech matching model: campus ministries personally invite students by name before arrival | Not a self-serve directory; depends on a maintained connector network; Catholic campus context                    |
| **Here's My Church**                        | Free worldwide map, no account required, denomination and language filters                     | Coverage is inferred from public data and can be uneven; no TCK or student-specific tagging; records can be stale |
| **Student Linkup** (Fusion)                 | UK university church matching with shortlists and messaging                                    | Requires sign-in; UK-focused; no Hong Kong or TCK context                                                         |
| **Every Student Sent**                      | Connects students to campus ministries and churches in the US                                  | Sign-up and social-platform model; US-focused; heavier than a reference tool                                      |
| **華人教會名錄 / Chinese Church Directory** | Global Chinese church directory with language filters and a curation signal                    | Built for the Chinese diaspora generally, not for students arriving abroad; no car-free or campus layer           |
| **Generic church finders**                  | Denomination, worship style and location filters                                               | Assume car ownership and local knowledge; rarely show who verified the data or when                               |

**Our edge is not better coverage.** It is a narrower promise: no account, student-specific tags,
transport notes written by people who have made the trip, a campus ministry layer, a visible
verification date, and a deliberate link to a human introduction.

## Technology

| Layer             | Choice                                              | Why                                                                                        |
|-------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------|
| Low-tech pilot    | Paper card, restricted spreadsheet, email/WhatsApp  | No adoption, no login, no student data in the map; tests the relationship first            |
| Frontend          | Angular (standalone components, signals) + Ionic    | Fast to build, mobile-friendly, and Capacitor-ready without committing to a native release |
| Map               | Leaflet + OpenStreetMap-compatible raster tiles     | No API key, no billing surprise, works with free and paid tile providers                   |
| Backend           | Java 21 + Spring Boot 3.5+                          | Familiar, well-documented, strong validation and security defaults                         |
| Database          | PostgreSQL 16+                                      | Reliable, free, easy to host, room for PostGIS later                                       |
| Migrations        | Flyway                                              | Explicit, reviewable schema history                                                        |
| Local environment | Docker Compose                                      | One command for the database; no "works on my machine"                                     |
| Deployment        | One container serving the Angular build and the API | One origin, no CORS, simplest possible hackathon deployment                                |

Pin exact framework versions when the projects are scaffolded. The architecture is documented in
[doc/ARCHITECTURE.md](doc/ARCHITECTURE.md). This repository does not implement the low-tech pilot's
spreadsheet, email automation or matchmaker workflow.

## Documentation

| Document                                       | What it covers                                                                                                                         |
|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| [doc/LOW_TECH_PILOT.md](doc/LOW_TECH_PILOT.md) | The send-off ritual, connection card, spreadsheet columns, matchmaker rhythm, introduction and follow-up templates, consent and safety |
| [doc/ARCHITECTURE.md](doc/ARCHITECTURE.md)     | System design, components, data flow, security, performance, deployment, decision log                                                  |
| [doc/PAGES.md](doc/PAGES.md)                   | Every route and screen, states, interactions, microcopy, accessibility                                                                 |
| [doc/SCHEMA.md](doc/SCHEMA.md)                 | Database tables, enums, visibility rules, indexes, CSV seed format                                                                     |
| [doc/API.md](doc/API.md)                       | Public and admin HTTP endpoints, payloads, errors, rate limits                                                                         |
| [doc/CURATION.md](doc/CURATION.md)             | The map's real product: tag definitions, verification SOP, report triage, takedowns                                                    |
| [doc/CODE_STYLES.md](doc/CODE_STYLES.md)       | Java, TypeScript, Angular, SQL and documentation conventions                                                                           |
| [doc/DEVELOPMENT.md](doc/DEVELOPMENT.md)       | Local setup, commands, environment variables, tests, CI                                                                                |
| [doc/DEPLOYMENT.md](doc/DEPLOYMENT.md)         | Hosting, containers, tiles, backups, security headers, Capacitor path                                                                  |
| [doc/ROADMAP.md](doc/ROADMAP.md)               | Phases, exit criteria, effort, post-MVP ideas and explicit non-goals                                                                   |
| [doc/OPEN_QUESTIONS.md](doc/OPEN_QUESTIONS.md) | Decisions still needed, with proposed defaults                                                                                         |

## Decisions at a glance

| Decision          | Choice                                         | Why                                                                    | Revisit when                                               |
|-------------------|------------------------------------------------|------------------------------------------------------------------------|------------------------------------------------------------|
| Full solution     | Low-tech human matching first                  | The relationship is the intervention; software is a support            | The pilot proves a scale bottleneck                        |
| Audience          | Outbound Hong Kong students                    | Narrowest coherent dataset; strongest distribution story               | Inbound demand appears from HK churches                    |
| Map stack         | Leaflet + OSM tiles                            | No key, no billing, sufficient for pins and clustering                 | We need vector styling, 3D or heavy custom cartography     |
| Curation          | Admin CRUD + CSV import                        | Spreadsheet for bulk seeding, UI for corrections                       | More than one city curator needs accounts                  |
| Database          | PostgreSQL via Docker Compose                  | Production-realistic; one-command local setup                          | Never, realistically                                       |
| Auth              | Public reads, one admin session                | No student friction; small attack surface                              | Multiple curators or moderators are hired                  |
| Deployment        | Single container                               | One origin, no CORS, one thing to deploy                               | Traffic or team structure demands a split                  |
| Filtering         | Client-side per city                           | Payloads are tiny; interactions feel instant; filters live in the URL  | A city exceeds roughly 500 places or a global map is added |
| Public visibility | Verified entries only                          | A stale or unverified listing destroys trust faster than a missing one | Never; unverified data stays in admin                      |
| Student data      | Kept out of the map; consent-based spreadsheet | The map does not need it, and holding it creates risk                  | A secure matchmaker tool is deliberately built             |
| Matchmaker        | One named person plus a backup                 | A committee diffuses responsibility                                    | Multiple churches share the load                           |
| App or bot        | Only after the low-tech pilot                  | Avoid building for a problem a spreadsheet can solve                   | The pilot proves operational scale is the bottleneck       |
| Language          | English UI first                               | Fastest path to student testing                                        | Parent-facing promotion needs Chinese                      |
| Service times     | Free-text note, not structured times           | Structured times rot weekly and imply precision we cannot maintain     | A reliable live source exists                              |
| Analytics         | None at launch; optional cookieless later      | Privacy and simplicity; avoid vanity metrics                           | A specific product question needs measurement              |

## Risks and mitigations

| Risk                             | Why it matters                                                             | Mitigation                                                                                                              |
|----------------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Building the app first**       | The app can become the output while the relationship stays under-resourced | Run the low-tech pilot first; build only the bottleneck it proves                                                       |
| **Curation decay**               | A student who finds a closed church will not trust the tool again          | Verification dates, six/twelve-month rules, report queue, named curator, weekly review                                  |
| **Subjective tags**              | "TCK-friendly" can become marketing or bias                                | Curator-assigned, narrowly defined, two-person check, definition on the page, no paid tags                              |
| **Safeguarding and endorsement** | Listing a place is not vetting its leadership or safety practices          | "Listed, not recommended"; explicit disclaimer; no claims about safeguarding; fast takedown route                       |
| **Student data and consent**     | A student roster is sensitive, especially for under-18s                    | Minimum fields, explicit and parental consent, restricted sheet, no data in the map, twelve-month deletion              |
| **Connector quality**            | A bad connector is worse than no connector                                 | Named, referenced, consenting connectors; code of conduct; cc the leader or parent; public or group settings for minors |
| **Matchmaker burnout**           | The model depends on one volunteer                                         | Cap the cohort, name a backup, template the messages, budget three hours per cohort                                     |
| **Adoption**                     | A useful link is still easy to forget                                      | Distribute through leaders, one link per city, WhatsApp-friendly previews, send-off pack                                |
| **Data staleness**               | Church websites lie and service times change                               | Prefer human confirmation; show dates; hide old entries; link out rather than copy volatile facts                       |
| **Map tile licensing**           | OSM's public tile servers are not a free production CDN                    | Use a proper tile provider in production, keep attribution visible, or self-host later                                  |
| **Report abuse**                 | Anonymous forms attract spam                                               | Honeypot, length limits, in-memory rate limiting, no public display of reports                                          |
| **Scope creep**                  | Accounts, messaging and reviews would swamp the MVP                        | Written non-goals; any new feature must beat curation or the handover on trust                                          |
| **App store rejection**          | A bare web wrapper can fail Apple's minimum-functionality rule             | Stay web-only until there is native value (offline pack, saved city, share extension)                                   |
| **Single curator bus factor**    | The map depends on one person                                              | Document the SOP, train a second reviewer, keep the seed data in version control                                        |

## Ideas worth stealing

These are not required for v1, but they fit the product and are cheap relative to their value.
[doc/ROADMAP.md](doc/ROADMAP.md) sequences them.

- **A leader distribution pack:** one link, a QR code, a six-line WhatsApp message and a short parent
  note in Chinese.
- **A "first Sunday" guide:** what to wear, when to arrive, how communion and giving usually work,
  and who to ask for after the service. This lowers the real anxiety, not just the search cost.
- **An arrival timeline:** what to do before flying, in the first week, and in the first month.
- **A parent-facing one-pager** in Chinese, because parents are co-decision-makers and often the ones
  who forward the link.
- **An offline city pack** (PWA or PDF) for the first week before a student has a local SIM.
- **A public freshness dashboard:** "92% of listings verified in the last six months." Trust as a
  visible number.
- **A church correction route** separate from student reports, so a church can fix its own details
  without creating an account.
- **A print-friendly city guide** for youth leaders who still hand out paper.
- **The three questions challenge:** give every student without a connector three questions to ask
  when they visit, and ask them to send back one line. It is a relational task, not a digital one.
- **The cohort reveal:** a simple slide at the send-off showing where the cohort is going. It builds
  identity and peer connection before departure, with zero tech.
- **A connector thank-you:** a personal note or small gift at the end of the year. Celebrate the
  people who made the introduction, not just the platform.

## Open questions

The big decisions are made; the remaining ones are listed with proposed defaults in
[doc/OPEN_QUESTIONS.md](doc/OPEN_QUESTIONS.md). The ones that block the next step are:

1. Is **Still Known** the final name, and is there a Chinese name?
2. Which three cities are final for the first curation sprint?
3. Who is the named curator, and how many hours per week can they commit?
4. Is a Chinese-language UI required before parents are invited, or is a Chinese parent note enough?
5. Where will it be hosted, and who owns the domain and the database?
6. Should the public map include Catholic and Orthodox churches from day one? (Proposed: yes, with
   tradition as a filter, because "church" is not a Protestant-only word.)
7. Who is the named matchmaker and backup for the low-tech pilot?
8. Which cohort and which three cities run the pilot?
9. What is the parental-consent process for under-18s, and who stores the consent record?
10. Does the low-tech pilot run before, alongside, or after the map build?
11. What happens when a student asks the map for an introduction? (Proposed: the map has no such
    feature; it points the student back to the leader who sent the link.)

## Contributing and running locally

Setup, commands and environment variables live in [doc/DEVELOPMENT.md](doc/DEVELOPMENT.md). The
project follows [doc/CODE_STYLES.md](doc/CODE_STYLES.md). The README stays a product summary; it does
not carry build instructions or API references.

## Data, licence and disclaimer

- Map tiles and map data are © OpenStreetMap contributors, available under the ODbL. Attribution
  must remain visible on every map view.
- Listing text, tags and transport notes are curated by the project and remain the project's
  responsibility. Church names, addresses and public facts belong to their respective owners.
- **We do not vet the leadership, safeguarding practices or doctrine of listed organisations.**
  Listing is not endorsement. Students and parents should use their own discernment and speak to a
  trusted leader before committing to a community.
- Corrections and removal requests are handled through the report form and the policy in
  [doc/CURATION.md](doc/CURATION.md).
- **Student and connector data is never part of this repository or the map database.** The low-tech
  pilot uses a separate, restricted spreadsheet governed by the consent and retention rules in
  [doc/LOW_TECH_PILOT.md](doc/LOW_TECH_PILOT.md).
- Source-code licence: TBD before public release.
