# Low-tech handover pilot

> Status: pilot design · Last reviewed 2026-11-14 · Related:
> [README.md](../README.md) · [CURATION.md](CURATION.md) · [ROADMAP.md](ROADMAP.md) ·
> [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)

This is the one-page-plus plan for the part of the solution that does not need code: a send-off
ritual, a connection card, a curated spreadsheet with named owners, a human matchmaker, a personal
introduction before departure, and two follow-ups after arrival.

The map in this repository supports this layer. It does not replace it.

## 1. Why this exists

The handover problem is not primarily a directory problem. The churches and ministries that do this
well do not ask a student to fill in a worksheet or adopt an app. They ask a leader to have a normal
pastoral conversation, collect three facts, and make a personal introduction to a named person in the
destination city.

The reported effect is large: Newman Connection describes a personal invitation from a campus
minister as making a young person four times more likely to remain active in their faith. The
intervention is the invitation, not the database.

So the pilot tests the relationship first:

- Does the student want a connection, or only information?
- Can one matchmaker sustain the work for a cohort?
- Do named connectors actually reply and follow through?
- Is the bottleneck relational capacity or operational scale?

Only the last question justifies building more software.

## 2. Pilot scope

| Item           | Proposal                                                         |
|----------------|------------------------------------------------------------------|
| Sending church | One Hong Kong church youth group (the initial context)           |
| Cohort         | One graduating cohort, roughly 10–25 students                    |
| Destinations   | Three cities where the church already knows at least one person  |
| Matchmaker     | One named person, plus one backup                                |
| Connectors     | One named person per student, not a list of organisations        |
| Duration       | From the send-off to three months after arrival                  |
| Tools          | Paper card, restricted spreadsheet, email/WhatsApp, the map link |
| Code required  | None; the map is optional support                                |

Do not start with every destination. Start with the cities where a leader can name a real person
today. For everywhere else, give the student the map and the three questions in §11.

## 3. Roles

| Role                   | Responsibility                                                                                                  | Time                                                              |
|------------------------|-----------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| **Sending leader**     | Knows the student, runs the send-off conversation, collects the card, makes the first ask                       | 2–3 hours per cohort                                              |
| **Matchmaker**         | Maintains the spreadsheet, matches students to connectors, sends introductions, follows up at two and six weeks | 2 hours per cohort, then ~30 minutes/week during departure season |
| **Connector**          | A named person in the destination city who agrees to reach out before arrival and offer one next step           | 15–30 minutes per student                                         |
| **Parent or guardian** | Consent for under-18s, receives the parent briefing, cc'd on the first introduction                             | 20 minutes                                                        |
| **Safeguarding lead**  | Named person for any concern; decides on escalation and removal                                                 | As needed                                                         |
| **Student**            | Shares only what they want, receives the introduction, decides whether to visit                                 | A two-minute conversation                                         |

No one should hold all roles. The matchmaker and safeguarding lead must be different people.

## 4. The send-off ritual

A 30–45 minute segment in a normal service, youth night or graduation gathering. The ritual matters
more than the format.

| Time      | Step                                                                                                                                    |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 0–5 min   | Welcome and explain the handover: "We are not just saying goodbye; we are sending you with names."                                      |
| 5–10 min  | Name each graduating student aloud. Pray for them by name.                                                                              |
| 10–15 min | **Cohort reveal:** a simple slide — "Five of you are going to the UK, three to Canada, two to the US." Build identity before departure. |
| 15–25 min | Fill in the connection card with a leader, one student at a time or in small groups.                                                    |
| 25–30 min | Parent note: normalise the first term, lower the performance pressure, give one practical next step.                                    |
| 30–35 min | Commissioning prayer. Students keep the card.                                                                                           |
| 35–40 min | Optional photo of the cards or the group, with consent. Refreshments.                                                                   |

Do not turn the card into a form-filling queue. The leader asks the questions, writes if the student
prefers, and keeps the conversation normal.

## 5. The connection card

A physical card, roughly A6. The student keeps it. The leader photographs it with permission and
gives the photo to the matchmaker.

**Front:**

- Name
- Personal email
- Destination city and country
- University or course, if known
- Departure date

**Three prompts:**

1. One thing I'm excited about.
2. One thing I'm nervous about.
3. One thing I want in a church community.

**Back (optional):**

- One thing I want to become this year.
- Consent: "I agree that my name, email and the three prompts above may be shared with one named
  connector in my destination city."
- For under-18s: "Parent/guardian consent received" and a signature or date.
- A short line: "You do not have to have this figured out."

The card is not a data-collection form. It is a ritual object that gives the leader language for a
conversation and gives the matchmaker enough to make a warm introduction.

Never write sensitive information on the card: no mental-health details, family conflict, grades,
or anything the student has not explicitly agreed to share.

## 6. The curated spreadsheet

Three tabs. Keep it in a restricted drive with two-factor authentication. Do not put it in this
repository.

### 6.1 `Students`

| Column                 | Notes                                                       |
|------------------------|-------------------------------------------------------------|
| `student_id`           | Local code; avoid using the name as the key                 |
| `student_name`         |                                                             |
| `student_email`        | Personal email the student agrees to share                  |
| `destination_city`     |                                                             |
| `destination_country`  |                                                             |
| `university`           | If known                                                    |
| `departure_date`       |                                                             |
| `consent_share`        | `Y` / `N`; without `Y`, no match                            |
| `parent_consent`       | `Y` / `N` / `N/A` (18+)                                     |
| `connector_id`         | From the `Connectors` tab                                   |
| `intro_sent_at`        | Date                                                        |
| `follow_up_2w_at`      | Date                                                        |
| `follow_up_2w_outcome` | `Met` / `Replied` / `No reply` / `Not yet`                  |
| `follow_up_6w_at`      | Date                                                        |
| `follow_up_6w_outcome` | `Connected` / `Visited` / `Still looking` / `No reply`      |
| `church_visited`       | `Y` / `N` / `Unknown`                                       |
| `notes`                | Only what the student agreed to share; no sensitive details |
| `status`               | `New` / `Matched` / `Introduced` / `Connected` / `Closed`   |

### 6.2 `Connectors`

| Column                   | Notes                                                                |
|--------------------------|----------------------------------------------------------------------|
| `connector_id`           |                                                                      |
| `city`                   |                                                                      |
| `country`                |                                                                      |
| `name`                   |                                                                      |
| `role_or_organisation`   | Campus minister, church student worker, former student, chaplain     |
| `how_known`              | The leader or trusted person who can vouch for them                  |
| `contact_route`          | Email preferred; no personal phone number in a shared sheet          |
| `consent_to_be_named`    | `Y` / `N`                                                            |
| `safeguarding_reference` | `Y` / `N` and date; a reference from a known leader or organisation  |
| `last_verified`          | When the connector last confirmed they are willing                   |
| `backup_connector_id`    | A second name for the same city                                      |
| `notes`                  | Language, tradition, campus, availability; no sensitive student data |

### 6.3 `Places`

This tab is the same data as the map's CSV, in a simpler form:

`name`, `type`, `address`, `latitude`, `longitude`, `tradition`, `primary_language`,
`other_languages`, `size`, `international_congregation`, `tck_friendly`, `car_free_access`,
`nearest_transit`, `walk_minutes`, `transit_note`, `website`, `last_verified`, `verified_by`,
`source_url`, `published`.

Export it to the map when the city is ready. The spreadsheet is the low-tech source of truth until
the map admin replaces it; the map never becomes the place where student data lives.

## 7. The matchmaker

One named person. Not a committee, not "the church office".

**Before departure, per cohort:**

1. Collect the cards and check consent.
2. Match each student to one connector using city, university, language, tradition, and the
   student's stated nervousness. Use the map for transport and context.
3. Send the introduction email (§8) before the student flies.
4. Record the date and outcome.
5. If there is no connector, use §11 and send the map link.

**During departure season:**

- 30 minutes a week to clear introductions and replies.
- Two follow-ups per student: two weeks and six weeks after arrival.
- Escalate any safeguarding concern immediately to the safeguarding lead.
- Do not chase a student more than twice. Leave the door open.

**A good match is:**

- a named person, not an organisation;
- reachable by email or a group chat;
- able to offer one concrete next step (a service, a meal, a small group, a campus meeting);
- close enough to campus to be realistic without a car;
- willing to be introduced before the student arrives.

Do not match on personality guesses. Do not send a list of five churches and call it a handover.

## 8. The introduction

Send one email that introduces the student, the connector and the sending leader. For under-18s,
cc the parent or guardian.

**Subject:** A student from Hong Kong is coming to [city] — could you reach out?

> Hi [connector],
>
> I'm [name], [role] at [church] in Hong Kong. [Student] is heading to [university] in [month].
> They would love to find a church community, and I said I knew someone in [city].
>
> [One thing they are nervous about — only with consent.]
>
> Could you send them a short note before they arrive and invite them to [service/group]? No
> pressure to commit; a warm hello and one concrete next step is enough.
>
> I've cc'd [student] and [leader/parent]. Thank you.
>
> [Name]

The connector should reply to the whole thread, not privately to the student, for the first contact.
For under-18s, the parent stays on the thread and any in-person meeting happens in a public or group
setting.

## 9. Follow-up rhythm

| When                  | Message                                                                                    | Purpose                                      |
|-----------------------|--------------------------------------------------------------------------------------------|----------------------------------------------|
| Before departure      | Introduction email                                                                         | Student arrives expected, not cold           |
| 2 weeks after arrival | "Did [connector] reach out? Have you been able to visit anywhere? No pressure."            | Catch a missed connection early              |
| 6 weeks after arrival | "How is [city]? Have you found a place you'd go back to? If not, would one more try help?" | Normalise the search and offer one more step |
| 3 months              | Optional check-in and celebration                                                          | Learn what worked; thank the connector       |

**2-week template:**

> Hi [student], just checking in. Did [connector] reach out? Have you been able to visit anywhere?
> No pressure at all — the first few weeks are busy. Is there one thing I can help with?

**6-week template:**

> Hi [student], how's [city]? Have you found a church or group you'd like to go back to? If not,
> that's normal; would it help to try one more place or talk to [connector] again?

If there is no reply after two attempts, record `No reply` and stop. Do not guilt the student. A
message at three months can reopen the door once.

## 10. Parent briefing

Twenty minutes at the send-off, or a one-page note if parents cannot attend.

**Three messages:**

1. **Normalise the first term.** Church may be the last thing on the student's mind while school,
   housing and friendships settle. That is not a failure of faith.
2. **Lower the performance pressure.** Do not ask "Have you found a church yet?" every week. Ask
   "How are you?" first. The student should not feel they are disappointing you.
3. **Give one practical next step.** Know the emergency contacts, the transport route, the cost of
   living, and one person they can call. At three weeks, ask: "Is there one person or place that
   feels like a beginning?"

**Chinese parent note (Traditional Chinese):**

> 孩子離家後，教會可能不是第一件會想到的事，這很正常。請先關心他們的生活和心情，不要每週追問「找到教會了嗎」。若他們願意，可以問：「有沒有一個人或一個地方，讓你覺得開始有點著落？」這比安排一個完美的教會更重要。

## 11. When there is no connector

Do not force a bad match. Send the map link and three questions the student can ask when they visit:

1. What does community look like here outside Sunday?
2. How do I get involved without overcommitting in the first month?
3. Who can I talk to if I am struggling?

Ask the student to send back one line about the visit. That gives the matchmaker a real update and
gives the map a correction or a new place to verify.

## 12. Identity and formation

The map answers "where can I go?" The card and the leader conversation answer a different question:
"Who am I now, and who do I want to become?"

Useful prompts for the leader conversation, not a form:

- Who were you at home?
- Who are you when no one from home is watching?
- Who do you want to become this year?
- What kind of community would help you become that person?

Do not force a definition. The goal is self-awareness and agency, not a personal brand. A student
who knows what they are looking for can survive a bad first visit; a student who does not may stay
home.

## 13. Safety, consent and vetting

| Area               | Rule                                                                                                                   |
|--------------------|------------------------------------------------------------------------------------------------------------------------|
| Student data       | Minimum fields; explicit consent; parental consent for under-18s; restricted sheet; delete 12 months after the cohort  |
| Connector          | Known to a leader or trusted organisation; reference recorded; agrees to a simple code of conduct; consent to be named |
| First contact      | Matchmaker cc's the student and sending leader; for under-18s, cc the parent                                           |
| Meetings           | Public or group settings for under-18s; no private 1:1; two-adult rule where the church requires it                    |
| Church or ministry | The map's curation standard applies; listing is not vetting; no guarantee of safety or doctrine                        |
| Incident           | Named safeguarding lead; hide the place; document facts; escalate; do not investigate alone                            |
| Photos             | Consent only; no photos of students on public channels                                                                 |
| Social media       | Do not scrape or search a student's accounts; do not ask for passwords                                                 |
| Data breach        | Notify the safeguarding lead and follow the church's policy                                                            |

The matchmaker is not a counsellor. If a student discloses a safeguarding concern or a mental-health
crisis, follow the church's safeguarding policy and refer to a professional. Do not promise
confidentiality you cannot keep.

## 14. Celebration loop

- Commission students by name in the send-off.
- With permission, share a one-line update with the sending church when a student connects.
- Thank connectors with a personal note; celebrate them publicly only with consent.
- Mark the milestone, not the performance. "You took one step" is worth celebrating.
- No leaderboard, no points, no comparison between students.

## 15. Measures

Measure the handover, not the app.

| Measure                                          | Why                                   |
|--------------------------------------------------|---------------------------------------|
| Students with a named connector before departure | The core promise                      |
| Introductions sent before departure              | Whether the matchmaker delivered      |
| Reply or meeting at 2 weeks                      | Whether the connector landed          |
| Church visit by 6 weeks                          | Whether the student took a step       |
| A meaningful connection at 3 months              | The outcome that matters              |
| Matchmaker hours per cohort                      | Whether the model is sustainable      |
| Connector response rate                          | Whether the network is real           |
| Map usage (secondary)                            | Whether the discovery layer is useful |

Proposed targets for the first cohort, to adjust after the pilot:

- 80% of students who want an introduction have a named connector before departure.
- 60% have replied to or met the connector by two weeks.
- 50% have visited a church or ministry by six weeks.
- The matchmaker spends no more than three hours per cohort on matching and introductions.

Do not treat these as performance targets for students. They are tests of the model.

## 16. After the pilot

Review at six weeks and three months. Then choose one path:

1. **Continue low-tech only.** The relational model works and the cohort is small. Improve the
   spreadsheet and templates; do not build an app.
2. **Add light digital.** The bottleneck is coordination, not relationships. Add a one-page form, a
   shared Airtable, or the map's admin import. Keep the card and the introduction.
3. **Build the app.** Only if the pilot proves the bottleneck is scale: many churches, many cities,
   or a matchmaker copying names between systems. Build the smallest tool that removes that exact
   bottleneck. Do not build the full platform because it is exciting.

If the pilot fails, the most likely reasons are relational capacity, connector quality, or a student
who did not want an introduction. None of those is fixed by software.

## 17. Checklists

**Before the send-off**

- [ ] Matchmaker and backup named.
- [ ] Safeguarding lead named.
- [ ] Three pilot cities chosen, with at least one connector each.
- [ ] Connectors contacted and consent recorded.
- [ ] Cards printed.
- [ ] Parent note ready.
- [ ] Restricted spreadsheet created with two-factor authentication.
- [ ] Map city links ready for students without a connector.

**After the send-off**

- [ ] Cards photographed with consent and returned to students.
- [ ] Consent checked for every row.
- [ ] Every student matched or marked "no connector yet".
- [ ] Introductions sent before departure.
- [ ] Follow-up dates scheduled.

**At two and six weeks**

- [ ] Follow-up sent.
- [ ] Outcome recorded.
- [ ] Connector thanked.
- [ ] Safeguarding concern escalated if any.
- [ ] Map correction or new place suggested from what the student learned.

**At three months**

- [ ] Student interview or short survey.
- [ ] Matchmaker time recorded.
- [ ] Connector feedback recorded.
- [ ] Decision on the next path in §16.
- [ ] Student data deleted or scheduled for deletion.
