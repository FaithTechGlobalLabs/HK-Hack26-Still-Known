# Still Known — frontend MVP

Angular + Leaflet prototype of the Still Known discovery layer. The backend
(Spring Boot/Gradle) is not implemented yet; this app runs entirely on hard-coded
demo data. Ionic and Capacitor are not wired in yet — this is the plain Angular +
Leaflet slice, so the map can be validated before the app shell is added.

## What the MVP does

- Full-screen Leaflet map using OpenStreetMap tiles.
- Floating university search with one option: **University of Washington**.
- Selecting the university shows two hard-coded churches:
  - Evangelical Chinese Church of Seattle — 651 NW 81st St (Metro Route 45)
  - Seattle Chinese Alliance Church — 2803 S Orcas St (1 Line to Beacon Hill, then Route 36)
- Clicking a dot opens a card with Sunday worship times, car-free transit directions,
  tags, an optional website link and an "Open in maps" action.
- Clearly labels the data as demo data and "listed, not recommended".

No student accounts, no report form, no database and no network API calls in this
version. Place data lives in `src/app/core/data/demo-data.ts`.

## Run it

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

## Build and test

```bash
npm run build
npm test -- --watch=false
```

The production build is written to `dist/frontend` and can later be copied into the
Spring Boot static resources.

## Where things live

```text
src/app/
├── core/
│   ├── data/demo-data.ts      # university and place fixtures
│   └── model/place.ts         # Place, University and WorshipTime types
├── feature/
│   └── city-map/              # Leaflet map, search and place detail panel
├── app.ts
├── app.html
└── styles.scss                # global theme and Leaflet CSS import
```

## Data notes

The two churches are real Seattle congregations. Coordinates come from
OpenStreetMap. Service times were checked against the churches' public pages on
14 Nov 2026, but the UI still presents everything as demo data until the curation
workflow exists. Verify before visiting.

The pilot's student and connector files must never be added here. The map only
contains public facts about organisations.
