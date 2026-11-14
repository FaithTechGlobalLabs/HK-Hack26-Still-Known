# Curation and verification

> Status: pre-implementation · Last reviewed 2026-11-14 · Related:
> [PAGES.md](PAGES.md) · [SCHEMA.md](SCHEMA.md) · [ARCHITECTURE.md](ARCHITECTURE.md) ·
> [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md)

The map is the easy part. **Curation is the product.** A directory of unverified church pins is
worse than no directory, because a student who turns up to a closed building on their first Sunday
will not trust the next link they are sent.

This document is the operating manual for the person or team who keeps the data true.

## 1. What gets listed

### 1.1 Inclusion criteria

A place is eligible only if **all** of these are true:

1. It is a Christian church, campus ministry or student Christian society with **regular public
   gatherings**.
2. It is reachable from at least one target university by public transport in **45 minutes or less**
   door to door, or is on or adjacent to campus.
3. It has a **working public web presence** or a named, contactable leader. A dead Facebook page is
   not a web presence.
4. A curator or a trusted local contact can confirm that it **currently exists and meets**.
5. There is no unresolved, credible **safety or safeguarding concern**. A concern does not require
   the curator to adjudicate doctrine; it requires escalation (see §8).

### 1.2 Exclusion criteria

Do not list:

- a building or cathedral that is only a tourist attraction and has no regular congregation;
- an online-only community with no local gathering;
- a place that has closed, moved beyond the travel threshold, or stopped meeting;
- a place whose only evidence is an old directory entry, a social post or an AI-generated summary;
- a place that has asked not to be listed;
- a place where the only contact details are personal and consent to publish is absent;
- a place with an unresolved safety concern.

### 1.3 Do not adjudicate doctrine

Tradition is the organisation's **self-description**, condensed to a broad family. We do not rank
churches by theological soundness and we do not publish a "heresy filter". That is a job for a
theological body with accountability, not a student map.

If a student or leader raises a doctrinal concern, record it as feedback for the lead curator. Do not
add a public warning label without a documented policy and a second reviewer.

## 2. Roles

| Role                     | Responsibility                                                                                    | Time                    |
|--------------------------|---------------------------------------------------------------------------------------------------|-------------------------|
| **Lead curator**         | Owns this document, the two-person checks, safety escalations and takedowns; signs off a new city | 3–5 hours/week          |
| **City curator**         | Local knowledge, visits, calls, writes descriptions and transport notes                           | 2–3 hours/week per city |
| **Second reviewer**      | Checks TCK and international tags, and any place connected to the lead curator                    | 1 hour/week             |
| **Technical maintainer** | Admin access, imports, deployment, backups                                                        | 1–2 hours/week          |

One person may hold more than one role at launch, but **no one verifies their own church alone**.
Disclose the connection and have the second reviewer confirm the record.

### 2.1 Listing a place is not vetting a connector

These roles curate **places**. They do not vet the people the low-tech pilot introduces to students.

| Question                                                        | Answer                                                                                                                                   |
|-----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Does a verified map listing mean the church's leaders are safe? | No. Listing means the place exists, meets and is reachable; it is not an endorsement.                                                    |
| Can a curator add a person as a connector?                      | No. Connectors are recorded in the pilot's restricted `Connectors` tab, not in the map.                                                  |
| Does a connector need the map's verification?                   | No. A connector has a separate standard: known to a leader, referenced, consenting to be named, and willing to follow a code of conduct. |
| What if a listed place has a safeguarding concern?              | Hide the place per §8.1 **and** escalate to the pilot's safeguarding lead if a connector or student is involved.                         |

The connector standard, the introduction rules and the two-adult and parental-consent requirements
for under-18s are in [LOW_TECH_PILOT.md](LOW_TECH_PILOT.md) §13. Do not import a connector record into
the map to "keep it together".

## 3. Tag definitions (normative)

These definitions are public on the method page. If the implementation and this section disagree,
this section is the policy and the implementation is a bug.

### 3.1 Tradition

Use the organisation's own description. Choose the broad family it uses first; record nuance in the
description. Do not upgrade a church to "evangelical" because it is lively, or to "charismatic"
because the music is modern.

### 3.2 Language

- **Primary language** is the language of preaching in the main Sunday service.
- Add a secondary language only if there is **regular provision**: a service, live translation, a
  language-specific small group, or a bilingual liturgy.
- Do not tag a church with a language because one member or one student speaks it.
- Bilingual churches have two language rows, one primary.

### 3.3 Size

| Code      | Definition                                     |
|-----------|------------------------------------------------|
| `SMALL`   | Fewer than 50 regular weekly attenders         |
| `MEDIUM`  | 50–150 regular weekly attenders                |
| `LARGE`   | More than 150 regular weekly attenders         |
| `UNKNOWN` | A leader declined or no reliable figure exists |

Ask a leader or count a typical service. Never estimate from building size or car park capacity.

### 3.4 International congregation

**Definition:** a meaningful share of regular attenders were born outside the host country, or the
church runs a regular international gathering with at least ten attendees.

**Evidence:** leader confirmation, or a curator visit across at least two services. "All are
welcome" on a website is not evidence.

### 3.5 TCK-friendly

**Definition:** at least one of the following is true and confirmed within the last 12 months:

1. The church or ministry has an **active international student ministry** with a named leader or
   regular gathering.
2. There is a **sustained presence** of students from outside the host country, including
   third-culture students, with at least ten regular attenders.
3. A Hong Kong student or a trusted leader confirms that a newly arrived student would be **known
   and followed up**, not merely greeted at the door.

**Evidence:** two independent confirmations, at least one of them human. A website claim alone is
not enough.

**Not the same as:** "Asian-friendly", "welcoming", "multicultural", "we love internationals".
Those phrases are marketing until a person confirms the behaviour.

**Never:** let a church self-assign the tag, pay for the tag, or keep it after a leadership change
without re-verification.

### 3.6 Hong Kong student presence

| Code      | Definition                             |
|-----------|----------------------------------------|
| `NONE`    | Curator knows of no Hong Kong students |
| `A_FEW`   | One or two known students              |
| `SEVERAL` | Roughly three to ten known students    |
| `LARGE`   | More than ten known students           |
| `UNKNOWN` | Not established                        |

This is a conversation-based estimate, not a count scraped from social media. The public UI shows a
phrase, not a number, and never implies that a student will find a ready-made friend group.

### 3.7 Car-free access

**Definition:** the place is reachable without a car when **all** of these are true:

1. The nearest stop has frequent service: rail, or a bus at least every 15 minutes during weekday
   daytime.
2. The walk from the stop is **15 minutes or less**, on a route a new arrival can follow.
3. The total journey from the target campus is **45 minutes or less**.
4. A curator has checked the route on an official journey planner and, where possible, walked it.

The transport note must include:

- the line, route number or station name;
- the exit or stop;
- the walking time and a landmark;
- any late-night or Sunday caveat;
- a note if the last leg is uphill, poorly lit, or awkward with luggage.

"Near the station" is not a transport note. "Central line to Marble Arch, exit onto Oxford Street,
four-minute walk past the cinema; the 17:00 service ends after dark, so use the main road" is.

### 3.8 Accessibility note

Record only confirmed facts: step-free entrance, lift, accessible toilet, hearing loop, large
print, a quiet room. Do not infer from photographs or assume a historic building is inaccessible.
If nothing is confirmed, leave the field empty rather than writing "unknown".

### 3.9 Service note

A free-text snapshot of what was true at verification, ending with a check-the-website caveat. Do
not store structured weekly times. If the church publishes a term card, link to the website and
mention the term card in the note.

## 4. Verification standard

### 4.1 Evidence hierarchy

1. **Direct human confirmation** by a leader, student worker or trusted local contact, recorded with
   a date and a name.
2. **Official organisation page** for address, service language and public activities.
3. **A curator visit** for atmosphere, accessibility and transport.
4. **A trusted student report** for a recent change; still confirm with the organisation before
   publishing.

Not evidence: anonymous social posts, old directories, hearsay, a search-engine snippet, an AI
summary, or a church's generic "internationals welcome" banner.

### 4.2 The two-source rule

| Claim                          | Minimum evidence                                            |
|--------------------------------|-------------------------------------------------------------|
| Name, address, website         | Official page                                               |
| Service language, service note | Official page **and** a human confirmation within 12 months |
| Size band                      | Leader estimate or a curator visit                          |
| International congregation     | Leader confirmation **or** two curator visits               |
| TCK-friendly                   | Two confirmations, at least one human                       |
| Hong Kong student presence     | Conversation with a leader, student or chaplain             |
| Car-free access                | Journey planner **and** a walked route where possible       |
| Accessibility                  | Direct confirmation from the organisation or a visit        |

### 4.3 Step-by-step

**Step 0 — Eligibility.** Check the criteria in §1 before spending time.

**Step 1 — Desk research.** Read the official website, the term card, the safeguarding page and the
contact page. Note the address, service times, languages, student work and leadership. Check that
the site is alive.

**Step 2 — Human contact.** Email, call or message the student worker or welcome team. Use the
script in §4.4. Record who you spoke to, the date and what they confirmed. Do not publish a personal
phone number or email.

**Step 3 — Visit if possible.** Attend a service. Observe the welcome, the language, the
demographics and the journey. Do not photograph people. Do not identify individuals in notes.

**Step 4 — Write the record.** One factual description sentence. One transport note from a
student's perspective. Tags with definitions in mind. No superlatives.

**Step 5 — Second review.** A second reviewer checks TCK and international tags, and any place
connected to the curator. The reviewer signs off in the admin note.

**Step 6 — Publish and date.** Set `verified_by`, `last_verified_at`, `source_url` and the status
`VERIFIED`. The date is the date of the evidence, not the date of the data entry.

**Step 7 — Schedule re-verification.** Six months from the evidence date. The product will age the
entry automatically; the curator should beat the amber warning.

### 4.4 Contact script

> Hello, I'm helping build a free reference map for Hong Kong students moving to [city]. We're
> considering listing [church/ministry] because [reason]. Could you confirm:
>
> 1. your main Sunday service time and language;
> 2. whether you have an international student ministry or a student worker;
> 3. roughly how many students from outside [country] attend regularly;
> 4. whether the building has step-free access;
> 5. the best public page for students to check before visiting.
>
> We don't publish personal phone numbers or emails, and we're happy to correct or remove the
> listing at any time. Thank you.

If the leader does not reply after two attempts, use the official page for basic facts and mark the
TCK/international tags `false` or `UNKNOWN`. Do not guess.

## 5. Writing the public record

### 5.1 Description

One sentence, 30–240 characters, factual, specific, no marketing.

- ✅ "An Anglican church near Marble Arch with a Sunday evening student service and a large
  international congregation."
- ❌ "A vibrant, welcoming family church where everyone belongs!"
- ❌ "The best church for Hong Kong students in London."

Do not claim welcome, safety or doctrinal soundness. Describe what exists.

### 5.2 Transport note

Write for a first-year with a suitcase, no car and a phone with a dead battery. Include the route,
the exit, the walk, the landmark and the night-time caveat. If the journey is awkward, say so. An
honest "30 minutes and two buses" is more useful than silence.

### 5.3 Tone

- Say **listed**, not **recommended**.
- No superlatives: best, vibrant, thriving, amazing, perfect, safe, welcoming.
- No ranking, scoring or star ratings.
- No promises: "you will find friends", "you will love it", "sound teaching".
- Use plain English. Define church jargon or link to the method page.
- British spelling in public copy.
- If a fact is uncertain, omit it. An empty field is honest; a guess is not.

## 6. Freshness and re-verification

| Age since evidence | Public treatment               | Curator action                 |
|--------------------|--------------------------------|--------------------------------|
| 0–180 days         | Green "Verified" badge         | None                           |
| 181–365 days       | Amber "May be outdated" banner | Re-verify within 30 days       |
| More than 365 days | Hidden automatically           | Re-verify before it can return |

Rules:

- Re-verify every **six months** as the default rhythm.
- A website check alone may refresh basic facts once; at least **once a year** requires a human
  confirmation.
- Any of these triggers immediate re-verification: a report, a leadership change, a dead website, a
  move, a service-time change, a safety concern.
- Verification dates reflect the **evidence**, not the admin edit. Importing a CSV does not refresh
  a date.
- If a place cannot be re-verified, hide it. Do not leave it visible because it is the only listing
  in an area.

## 7. Report triage

Reports arrive through the public form. They are private; they are never displayed publicly.

| Type             | Target   | First action                                                      |
|------------------|----------|-------------------------------------------------------------------|
| `SAFETY_CONCERN` | 24 hours | Hide the place, notify the lead curator, do not investigate alone |
| `CLOSED`         | 72 hours | Check the website, call, hide if closed or moved                  |
| `OUTDATED`       | 7 days   | Check the source, update, re-verify                               |
| `WRONG_INFO`     | 7 days   | Check the source, correct, re-verify                              |
| `NEW_SUGGESTION` | 14 days  | Assess against §1, add to the curation backlog                    |
| `OTHER`          | 14 days  | Read, classify, reply only if an email was provided               |

Process:

1. Read the report and open the place.
2. Change the report to `IN_REVIEW` if it needs work.
3. Check the source or contact the organisation. Do not publish the reporter's message.
4. Update the place and record the source.
5. Resolve or dismiss with a resolution note. Dismissal needs a reason.
6. If an email was provided and a reply is appropriate, reply briefly. Never argue.
7. If the report reveals a policy gap, update this document.

Safety concerns are not a normal moderation task. Follow §8.

## 8. Safety, takedowns and escalation

### 8.1 Safety concern

1. **Hide the place first.** Do not wait for a full investigation.
2. Preserve the report and the place record; do not edit away evidence.
3. Notify the lead curator within 24 hours.
4. Do not contact the organisation alone, and do not promise confidentiality you cannot keep.
5. Record only facts you have verified. Do not add allegations, names or speculation to public data
   or internal notes.
6. Involve a safeguarding-trained adviser or the relevant church body before relisting.
7. Relist only with lead curator approval and a documented reason.

If a reporter is in immediate danger, the UI tells them to contact local emergency services. The
curator does not provide emergency support.

### 8.2 Organisation requests removal

Honour a request from a church or ministry to remove its listing within **7 days**. Do not debate.
Record the reason, hide the place and note that relisting requires their consent. A removal is not
an admission of wrongdoing.

### 8.3 Closed, moved or merged

- Closed: hide; keep the record for history.
- Moved within the travel threshold: update the address, coordinates and transport note; re-verify.
- Moved outside the threshold: hide and note the new location if the organisation wants it recorded.
- Merged: update the name and description if the new entity is eligible, otherwise hide.

### 8.4 Conflict of interest

A curator must disclose a personal connection to a place. The second reviewer confirms the record.
The lead curator decides on any disputed tag. No curator overrides a second reviewer alone.

### 8.5 Legal

- Keep public claims factual, dated and sourced.
- Do not publish allegations, confidential information or personal contact details.
- Route legal threats to the lead curator and the project's legal adviser; do not respond publicly.
- A takedown request is handled even if the legal position is unclear.

## 9. Data handling

- Collect only public organisational information and confirmed facts.
- Do not store personal phone numbers, home addresses or personal social accounts.
- A leader's name may appear as `verified_by` only with their consent. Otherwise use a role, for
  example "Student worker, confirmed by phone".
- Do not photograph people. If a building photo is used, check its licence and attribution.
- Report emails are used only to reply; they are deleted on the schedule in
  [SCHEMA.md](SCHEMA.md).
- Internal notes contain facts, not opinions about people.
- Do not paste a report message into a public field.
- Never copy student, parent or connector data from the pilot spreadsheet into a place record,
  curator note, import file or report. The two datasets are separate by design.

## 10. Distribution playbook

The map does not distribute itself. The most reliable channel is a youth leader who already has the
student's attention.

### 10.1 Before a student leaves

1. Send the city link, not the home page: `stillknown.app/uk/london`.
2. Send it **before** departure, while the student is still in Hong Kong and the leader still has
   their attention.
3. Add one sentence of context: "This is a starting point; check the date and the website before you
   go."
4. Offer to answer questions, but do not promise an introduction.

### 10.2 Message template

> Hi [name] — here's a map we've put together for students going to [city]. It lists a small number
> of churches and campus ministries, with notes on language, transport and when each was last
> checked. It's a starting point, not a recommendation: check the website and the "last verified"
> date before you visit. `stillknown.app/uk/london`

### 10.3 Parent note (Traditional Chinese)

> 這是一個給準備到外地升學的香港學生使用的地圖，列出一些教會和大學校園事工，並註明語言、交通方式和資料最後核實的日期。這只是起點，不是推薦；出發前請再查看教會網站和核實日期。

### 10.4 Leader briefing (five minutes)

- What the map is and is not.
- How to read the verification date.
- How to report a correction.
- Why we do not list every church.
- Who to contact if a student has a bad experience.

### 10.5 Other channels

- A QR card in a send-off pack.
- A one-page PDF city guide for leaders who prefer paper.
- A short link in the school chaplain's departure email.
- A parent WhatsApp group message, sent by a leader, not by the project.
- No paid advertising, no app-store listing, no influencer campaign in v1.

## 11. Metrics

| Metric                                | Target                                           |
|---------------------------------------|--------------------------------------------------|
| Verified places per city              | 8–11 at launch                                   |
| Places verified within 180 days       | 90% or more                                      |
| Median report resolution              | Within the SLA for its type                      |
| Leaders who distributed a city link   | At least two per city                            |
| Student interviews at launch          | Five per city                                    |
| Student interviews after three months | Three per city                                   |
| Outbound clicks per 100 city views    | Tracked only if cookieless analytics are enabled |

Page views are not a success metric. A small number of students finding a church is the point.

## 12. Bus factor and succession

- Two curators per city where possible; one lead curator.
- This document, the CSV files and the admin credentials live in a shared password manager and the
  repository (never the credentials in the repository).
- A quarterly review checks freshness, report backlog and whether a second person can run an import
  without help.
- If the lead curator steps away, the second reviewer becomes the interim lead and the project
  pauses new cities until a replacement is trained.
- Do not let a single volunteer's inbox become the only copy of a verification.

## 13. Launch checklist per city

- [ ] 5–8 churches and 2–3 campus ministries verified.
- [ ] Every place has a named verifier, a source URL and a verification date.
- [ ] Every place has a transport note written from a student's perspective.
- [ ] At least one Cantonese or Mandarin provision is listed.
- [ ] At least one car-free option exists near each target university.
- [ ] The city summary is written and the map centre is correct.
- [ ] TCK and international tags have a second review.
- [ ] No place is older than 180 days at launch.
- [ ] The method and privacy pages are live.
- [ ] At least one youth leader has agreed to distribute the link.
- [ ] Two students have tested the city page on a phone.

## 14. Common mistakes

- Listing a famous church because it is famous, not because it is reachable or suitable.
- Trusting a website's "international students welcome" claim without a human confirmation.
- Tagging a whole city from one visit to one congregation.
- Confusing a campus ministry with a student society, or a church's student work with a separate
  ministry.
- Writing marketing copy instead of facts.
- Spending three hours on one place and leaving the rest of the city empty.
- Letting a church self-assign TCK-friendly because it wants the tag.
- Keeping a stale listing visible because it is the only one nearby.
- Publishing a leader's personal phone number.
- Photographing students without consent.
- Treating a safety report as a normal correction.
