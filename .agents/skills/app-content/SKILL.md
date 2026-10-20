---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Kopfrechnen is an interactive trainer: no pages of text, no question bank. Learners choose settings, then solve generated
mental arithmetic tasks. All content is in the core (`src/core/index.ts`), the settings data (`src/data/settings.json`),
the messages (`src/messages/de.json`) and the start page (`src/app.yaml`).

## Curriculum

- Klasse 3 und 4, Mathematik; no Land or school named, so the orientation is the KMK-Bildungsstandards.
- *Bildungsstandards für das Fach Mathematik, Primarbereich*, Kultusministerkonferenz, Beschluss vom 15.10.2004, i. d. F.
  vom 23.06.2022, <https://www.kmk.org/fileadmin/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-Primarbereich-Mathe.pdf>,
  Seite 14, Leitidee „Zahl und Operation“, „Rechenoperationen verstehen und beherrschen“ (Kopfrechnen, Umkehroperation).
- Which tasks belong to Klasse 3 and which to Klasse 4 is up to the Land and was not checked. No creator material exists.

## Competencies

Chapter = operation, chosen on the setup screen or by the route (`#plus`, `#minus`, `#mal`, `#geteilt`, `#gemischt`).
They are the `competencies` of `src/app.yaml`, in this order:

- Plus: 2 to 4 Summanden im Zahlenraum bis 100 and bis 1000.
- Minus: im Zahlenraum bis 100 and bis 1000.
- Mal: kleines Einmaleins; übertragen auf Zehner- und Hunderterzahlen (6 · 40).
- Geteilt: ohne Rest, mit der Umkehraufgabe; mit Zehner- und Hunderterzahlen (240 : 6).

## Content structure

- A round = `count` tasks (5, 10, 15 or 20) in the chosen number range (100 or 1000), generated from the seed in
  `makeTasks`; no task is stored in a file.
- Plus and minus: `terms` numbers (2 to 4); result and every step between 0 and the range. Mal: the small times table
  to 100; to 1000 a single digit (2 to 9) times 20 to 90 or 200 to 900, product at most 1000. Geteilt: the inverse of a
  Mal task, always without remainder.
- A task has four options (the result and three typical mistakes) or a typed answer, chosen on the setup screen.
- A wrong answer is a failed attempt with a message for the mistake; the third failed attempt ends that task with its
  solution (`path`) and moves on. The stopwatch is optional, has no limit and stops with the round.

## Terminology

- Words: Runde, Aufgabe, Zahlenraum, Summand, Fehlversuch, Zeit, Stoppuhr, Umkehraufgabe, Rechenweg, Zehnerübergang.
- Avoid: "Test", "Note", "Punkte", "Fehler" for a failed attempt (it is an Fehlversuch), anything that sounds like ranking.
- Address learners with "du". Signs: + − · : with spaces around them.

## Exercise patterns

- **Berechnen** (all four operations): fixed are the operation, the number range and the count of terms; varied are
  the numbers. Example: route `plus`, seed 1, first task `26 + 24`. Data: `src/data/settings.json` (ranges, counts,
  terms, `maxFailures`); the generators `plus`, `minus`, `mal`, `geteilt` in `src/core/index.ts`.
- Right is exactly the value of the task. Typical wrong answers per operation with their message key
  `<operation>-<kind>` in `src/messages/de.json`:
  - plus: `carry` (±10), `slip` (±1);
  - minus: `columns` (smaller digit from the larger per place), `carry`, `added`, `slip`;
  - mal: `added`, `zero`, `neighbour`;
  - geteilt: `minus`, `zero`, `neighbour`.
- Each wrong option and each message names the real mistake and says what to do, never the answer.

## Figures

None. The task is shown as text, a calculation with `= ?`. Colours: accent and orange on a light or dark background
(`prefers-color-scheme`); no flashing, motion only without `prefers-reduced-motion`, no sound.

## Sources

KMK-Bildungsstandards (opened and read, see above). Second sources per competency were not found: Wikipedia answered
HTTP 429 when checked, so none is cited. Nothing from the creator's material is used.

## Adding a chapter or round

1. Add the competencies to `competencies` in `src/app.yaml` and to the list above.
2. New operation or number range: add its generator in `src/core/index.ts`, the typical mistakes with their messages
   `<operation>-<kind>` in `src/messages/de.json`, and the choice in `src/data/settings.json` and the setup screen
   (`src/ui/App.vue`).
3. New route: `routes` in `src/data/settings.json` and in `src/app.yaml`.
4. Add a playthrough in `src/playthroughs/` with the right answer, a typical mistake and the end of the round.
5. Update this guide and the plan, run `npx lernapps check`, commit.

## Rules learned from mistakes

None yet.
