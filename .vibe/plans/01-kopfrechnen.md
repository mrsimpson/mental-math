---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype, null until chosen in Explore. Allowed values: explainer, interactive, quiz.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: written by the pre-push hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: { checks-pass: 4 }
---

# Plan: <app name>, first version

<!--
For you, the assistant.
1. Path: `.vibe/plans/01-<short name>.md`. Every later change gets its own plan from the increment template.
2. Read this plan before each step. One phase at a time, tasks in order.
3. Task done → tick `[x]` at once and move it to "Completed" of its phase. An unticked box counts as not done.
4. New task found → add it.
5. Each phase names its skills. Load a skill when its task comes, not before. Read it in full, from its file.
6. Checkpoint: stop, ask, wait for the creator's answer. A message sent before the question is no yes.
7. At most 2 questions per message, one topic each. No questions inside drafts or lists.
8. Work on the branch `work` until the first publish; push only `work`. Commit brings it into `main`.
9. Rules of the workflow, with their ids: `@lernapps/tooling/guidance/workflow-rules.md`.
10. Plan in the creator's language. Keep headings and front matter keys. Delete a comment once its part is filled.
-->

*Started <date>. Explore, Plan, Code, Commit.*

## Goal

<!-- 1–2 sentences: what learners do, what they learn. -->

## Key decisions

- Archetyp `interactive`: Lernende handeln auf einer App-Seite mit Stoppuhr und erzeugten Aufgaben; kein Erklärtext, keine feste Fragensammlung. (Skill `lernapps-app`: Tippspiel/Kopfrechnen mit Timer = interactive)
- (guess) Nichts wird gespeichert (`storage: none`); keine `limits`, da die Stoppuhr keinen Zeitdruck erzeugt.
- (guess) Dunkelmodus folgt dem Gerät; nur Deutsch.

## Notes

**Lehrplan-Orientierung** (kein Land genannt → KMK): *Bildungsstandards für das Fach Mathematik, Primarbereich*, Kultusministerkonferenz, Beschluss vom 15.10.2004, i. d. F. vom 23.06.2022, https://www.kmk.org/fileadmin/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-Primarbereich-Mathe.pdf (heruntergeladen und gelesen). Leitidee „Zahl und Operation“, S. 14, Abschnitt „Rechenoperationen verstehen und beherrschen“ (Kopfrechnen, Rechenstrategien, Umkehroperation als Kontrolle). Die Standards gelten am Ende von Jahrgangsstufe 4; die Verteilung auf Klasse 3 und 4 legt das jeweilige Land fest und wurde nicht geprüft.

**Kompetenzen nach Kapitel** (Kapitel = Rechenart, einzeln wählbar):

1. Addition
   - Ich kann Zahlen mit 2 bis 4 Summanden im Zahlenraum bis 100 im Kopf addieren.
   - Ich kann Zahlen mit 2 bis 4 Summanden im Zahlenraum bis 1000 im Kopf addieren.
2. Subtraktion
   - Ich kann im Zahlenraum bis 100 im Kopf subtrahieren.
   - Ich kann im Zahlenraum bis 1000 im Kopf subtrahieren.
3. Multiplikation
   - Ich kann Aufgaben des kleinen Einmaleins im Kopf berechnen.
   - Ich kann Einmaleins-Aufgaben auf Zehner- und Hunderterzahlen übertragen und berechnen (z. B. 6 · 40).
4. Division
   - Ich kann Divisionsaufgaben des kleinen Einmaleins ohne Rest im Kopf berechnen, indem ich die Umkehraufgabe nutze.
   - Ich kann Divisionsaufgaben mit Zehner- und Hunderterzahlen berechnen (z. B. 240 : 6).

Bezug KMK S. 14: „beherrschen die Grundaufgaben des Kopfrechnens … und leiten deren Umkehrungen sicher ab“; „übertragen die Grundaufgaben des Kopfrechnens auf analoge Aufgaben im Zahlenraum bis zur Million“; „kontrollieren Lösungen … (Umkehroperation)“. Welche Aufgaben in Klasse 3 bzw. 4 vorgesehen sind, ist landesabhängig (ungeprüft).

**Weg zur Kompetenz und Fehlvorstellung** (alle (guess), da keine Quelle gelesen):
- Addition: Weg über Zerlegen/Zehnerübergang (47 + 8 = 47 + 3 + 5); Fehler: Zehnerübergang vergessen, Stellen falsch zusammensetzen. Feedback zeigt den Rechenweg.
- Subtraktion: Weg über schrittweises Abziehen oder Ergänzen; Fehler: kleinere Ziffer von größerer abziehen (52 − 18 = 46 statt 34).
- Multiplikation: Weg über Verdoppeln und bekannte Aufgaben; Fehler: Verwechslung mit Addition, Nullen verlieren bei 6 · 40.
- Division: Weg über die Umkehraufgabe (24 : 6 → 6 · ? = 24); Fehler: Divisor und Dividend vertauschen, Nullen verlieren.

**Umfang:** Enthalten: vier Grundrechenarten, Zahlenraum 100 oder 1000 wählbar, 2 bis 4 Summanden (+/−), genau 2 Faktoren bei ·/:, Division nur ohne Rest, Aufgabenzahl 5/10/15/20, Eingabe oder Multiple Choice, Stoppuhr ohne Limit, Fehlversuche zählen. Nicht enthalten: schriftliche Verfahren, Sachaufgaben, Brüche, Dezimalzahlen, Zahlenraum über 1000, Konten/Speicherung über Sitzungen hinaus, Division mit Rest (nicht gefragt). Sprache: nur Deutsch. Gemischte Rechenarten in einer Runde: ja, wenn mehrere gewählt (guess).

**Quellen:** KMK-Bildungsstandards (geöffnet und gelesen, geprüft). Zweitquellen je Kompetenz: nicht geprüft. Wikipedia (de.wikipedia.org) antwortete beim Prüfen mit HTTP 429 (Rate-Limit), serlo.org-Artikel wurden nicht geöffnet, weil keine Adresse ohne Suchergebnis bekannt ist. Daher keine Zweitquelle eingetragen (keine schwachen Treffer). Landeslehrpläne: nicht geprüft.

**Offene Fragen:** keine; Details von der Creatorin bzw. dem Creator ausdrücklich delegiert.

## Explore

<!--
- Find out what the app teaches, for whom, how much and how it looks. All content questions belong here; Plan only
  maps the answers onto the archetype.
- Ask. Write no code, run no `create`.
- An answer counts only in the creator's words under "Answers". Never tick a topic you assumed.
- Skills: `lernapps-app`, `lernapps-content-research`.
-->

### Tasks

- [x] Install the skills, if missing (the app commits them): `npx --yes skills add
      lernapps/tooling#exp/compact-guidance -y -s lernapps-app lernapps-content-research lernapps-exercise-patterns
      lernapps-content-growth lernapps-check lernapps-github-setup lernapps-content-questions lernapps-github
      lernapps-listing`.
- [x] Load skill `lernapps-app`. Tell the creator in two sentences what a lernapps app is and where it will live: in
      their own GitHub repo, free, public, at their own address. Offer to explain GitHub; they need not know it.
      Example: "Deine App wird über GitHub veröffentlicht, kostenlos und öffentlich, unter deiner eigenen Adresse.
      Soll ich dir kurz erklären, was GitHub ist?"
- [x] Interview: ask the topics of "Answers" in order. Skip a topic only when an earlier answer covers it; note
      which. No answer → ask once more; still none → write your assumption with "(guess)". Done when every topic
      has an answer or a guess.
- [x] Load skill `lernapps-content-research`. Research as it says. Under "Notes": curriculum orientation,
      competencies by chapter as "Ich kann …", verified sources. No competencies → not done.
- [x] Under "Notes", one line per competency: how learners get there (derive, not only read off; e.g. a tree diagram
      shows how a probability comes about), which misconception the feedback catches.
- [x] Under "Notes", the scope: what is in, what is out and why, the data range (e.g. "all main-group elements",
      never a silent "1–20"), the languages.
- [x] Fetch https://lernapps.net/apps/schemas/entry.v1.schema.json and read each property's description. Ask what
      helps teachers and parents find the app. Fill "Entry draft". Search words: one or two words each, as people
      type them.
- [x] Choose the archetype with skill `lernapps-app`. Write it and its reason under "Key decisions". Set
      `archetype`.
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, competencies by chapter, didactic
      approach, scope, every "(guess)", sources and how you checked them, what is unchecked, archetype and reason.
      Stop and wait. Changes → change, ask again.
- [x] Install the archetype's skills: `npx --yes skills add lernapps/tooling#exp/compact-guidance -y -s
      lernapps-<archetype>-plan lernapps-<archetype>`.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

<!-- The interview: per topic the creator's answer, in their words. Keep the topics. -->

- Goal: what learners do in the app, what they learn.
  - Creator: "Einfach nur Kopfrechnen, Anzahl Summanden und Zahlenraum wählbar, multiple choice + Eingabe des Ergebnisses". Timer (from the first request). Asked about GitHub: creator asked "Wozu brauche ich GitHub?" (explained).
- Learners: subject, school year, prior knowledge. Land and Schulform only if the creator names a school or class,
  at most once; none → KMK-Bildungsstandards.
  - Creator on round size: number of tasks chosen at the start of the app ("wählbar beim Start der Anwendung"). Look and feel: "spielerisch" (game-like). Dark mode: not answered yet.
  - Creator on operations: "alle Grundrechenarten, wählbar". Timer: "kein Zeitdruck, nur Messung" (stopwatch, no limit, no countdown).
  - Creator: "Klasse 3 und 4, Zahlenraum bis 100 oder 1000 wählbar, Gesamtzeit pro Runde. Messen, wie lange gebraucht + Fehlversuche". No school named → KMK-Bildungsstandards.
- Model and focus: an app of the catalog (read https://lernapps.net/apps/llms.txt) as model; what matters most
  - (guess) Creator delegated the remaining details ("Denk Dir die restlichen Details selbst aus"). Focus: exercises with game feel; no catalog model chosen.
  (exercises, visualisations, game feel).
- Hurdles: misconceptions and mistakes of the learners; the creator's examples and experiments.
  - (guess) Zehnerübergang, Subtraktion mit Übertrag/Entbündeln, Nullen im Tausenderraum, Verwechslung von Multiplikation und Addition, Rest bei Division.
- Content: who writes it (creator, you, from sources); own material (worksheets, tests); how it is made (sources,
  - (guess) Tasks are generated by the app from the chosen settings; I write the code, texts and feedback. No own material.
  research, a data format).
- Amount: how much content per level or chapter in the first version (e.g. "one text per school year"); what comes
  - (guess) Rechenarten +, −, ×, ÷ einzeln wählbar; 2 bis 4 Summanden (bei × und ÷ genau 2 Faktoren); Zahlenraum 100 oder 1000; Aufgabenzahl 5/10/15/20 beim Start.
  later.
- Languages: German only, or more (texts, code).
  - (guess) German only.
- Look and feel: calm like a worksheet, or like a game (colours, praise, effects); dark mode.
  - Checkpoint "research" confirmed: "passt". Creator name for the entry: "Ida Interaktiv".
  - (guess) Dark mode included, follows the device setting.
- Terms: the creator's words for the main things in the app, used everywhere.
  - (guess) Runde, Aufgabe, Zahlenraum, Summand, Fehlversuch, Zeit.

### Entry draft

<!-- YAML valid against the entry schema, with its property names. Only known values, never invented. -->

```yaml
# Offen bis Commit: url (Adresse aus dem Deploy), checked (setzt lernapps.net).
title: Kopfrechnen
subject: Mathematik
grades: [3, 4]
summary: >-
  Du übst Kopfrechnen mit Plus, Minus, Mal und Geteilt. Du wählst Rechenart, Zahlenraum bis 100 oder 1000, Anzahl der
  Aufgaben und Summanden. Du antwortest mit Auswahl oder Eingabe, die Stoppuhr misst deine Zeit und die Fehlversuche.
keywords:
  - Kopfrechnen
  - Einmaleins
  - Rechentraining
  - Grundrechenarten
  - Grundschule
  - Rechnen üben
creator:
  name: Ida Interaktiv
fitness:
  account: false
  install: false
  storage: none
  thirdParty: none
```

### Completed

## Plan

<!--
- Map the confirmed content onto the archetype: structure, screens or pages, exercise patterns, data files,
  components.
- No new content questions. A content gap → back to Explore; say so.
- Confirmable in one read. After the yes, work on your own: at most 3 creator turns until the listing.
- Skills: `lernapps-<archetype>-plan`, `lernapps-exercise-patterns`.
-->

### Tasks

- [x] Load skill `lernapps-<archetype>-plan`. Map the content as it says.
- [x] Load skill `lernapps-exercise-patterns`. Choose a pattern per competency. Write "Content method".
- [x] Write the Code tasks under "Code": pages or screens, their content, what each shows. Each ends in a commit.
- [x] Each screen, component or interactive exercise: a sketch (static SVG or image, or the steps with what
      learners see after each). Words alone are not enough.
- [x] Show the creator, short: goal, competencies by chapter, entry draft, tasks, sketches; the content method in
      plain words (what learners see and do, what it cannot do). At most 2 questions.
- [x] **Checkpoint:** confirm the plan and the content method, with the sketches shown. Stop and wait for an
      explicit yes. Changes → change, ask again. No `create` before the yes.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

- **Muster „berechnen“** (Kompetenz: im Kopf rechnen), je Rechenart. Fest: Aufgabe aus Seed, Rechenart, Zahlenraum, Anzahl Summanden; veränderlich: Zahlen. Beispiel: 47 + 8 + 15 = ? Daten: `src/data/settings.ts` (Wertebereiche, Rechenarten, Rundenlängen); Aufgaben werden im Kern erzeugt, nicht als Datei.
- **Zahlen:** Addition/Subtraktion: Ergebnis und jeder Zwischenwert liegen zwischen 0 und dem Zahlenraum (100 oder 1000). Multiplikation bis 100: kleines Einmaleins (Faktoren 1–10, Produkt ≤ 100); bis 1000: einstelliger Faktor × Zehner/Hunderter (z. B. 6 · 40, 3 · 200, Produkt ≤ 1000). Division: Umkehrung der Multiplikation, immer ohne Rest. Mehrere Rechenarten gewählt → gemischte Runde, Reihenfolge aus dem Seed.
- **Richtig ist** jede Antwort, die den Wert der Aufgabe ergibt (genau ein Wert; Eingabe ohne Leerzeichen, nur Ziffern). Antwortart wird beim Start gewählt: Auswahl (4 Karten) oder Eingabe (Zahlenfeld) (guess: Auswahl vs. Eingabe als Startwahl).
- **Typische falsche Antworten** (je 2–3 pro Rechenart, mit Meldung): Plus: Zehnerübergang vergessen (±10), eine Stelle falsch addiert. Minus: kleinere von größerer Ziffer abgezogen (52 − 18 = 46), Entbündeln vergessen. Mal: addiert statt multipliziert, Null verloren (6 · 40 = 24). Geteilt: Dividend/Divisor vertauscht, Null verloren. Auswahlkarten bestehen aus dem richtigen Ergebnis und diesen echten Fehlern (aufgefüllt mit Nachbarwerten).
- **Rückmeldung:** falsch → Fehlversuch +1, Meldung mit kurzem Rechenweg, Aufgabe bleibt offen; nach 3 Fehlversuchen bei derselben Aufgabe ist diese Aufgabe zu Ende: Lösung mit Weg, dann die nächste (Creator: "nach drei Schluss"; Lesart: Schluss für die Aufgabe, nicht für die Runde). Richtig → kurzes Lob (bunt, ohne Blinken; weniger Bewegung bei reduzierter Bewegung; Ton aus).
- **Stoppuhr:** optional, beim Start an/aus (Creator: "Stoppuhr optional"). Tick des Kerns (1 Tick = 1 s, vom Rahmen geliefert); kein Limit; Zeit stoppt mit der letzten richtigen Antwort. Ergebnis: Fehlversuche, und die Zeit nur bei eingeschalteter Stoppuhr; nicht gespeichert.
- **Komponenten:** `Start` (Einstellungen), `Aufgabe` (Aufgabe, Karten oder Eingabe, Rückmeldung, Stoppuhr), `Ende` (Ergebnis). Sie prüfen nichts; der Kern prüft.
- **Beispiele als Tests (Durchspiele):** pro Rechenart ein Durchspiel mit Seed und Eingaben (richtig, typischer Fehler, drei Fehlversuche), eines für das Rundenende mit Zeit, eines für gemischte Runde. Routen: `#plus`, `#minus`, `#mal`, `#geteilt`, `#gemischt` (wählen die Rechenarten vor).
- **Neues Kapitel später:** neue Rechenart oder Zahlenraum = Wertebereich in `settings.ts`, Fehlermeldungen und ein Durchspiel ergänzen.
- **Grenze:** Division mit Rest, schriftliche Verfahren und Sachaufgaben können die Muster nicht.

**Skizzen:** `.vibe/plans/sketches/1-start.svg`, `2-aufgabe.svg`, `3-ende.svg` (360 px breit).

### Completed

## Code

<!--
- Build the app from the archetype and the confirmed plan. Work on your own.
- Commit after each task; the hooks check. A check fails → skill `lernapps-check`. Fix from the message; never
  bypass a hook.
- Undecidable → choose, mark "(guess)" under "Key decisions", go on.
- Creator asks for a change → first say your reading in one sentence ("Ich nehme alle 44 Hauptgruppenelemente
  auf."); never narrow it silently. Content change → update "Notes" too.
- Skills: `lernapps-check`, `lernapps-github-setup`, `lernapps-<archetype>`, `lernapps-content-questions`, and the
  app's content guide `app-content`.
-->

### Tasks

- [x] Load skill `lernapps-check`. Create the app in this plan's folder as it says. `create` keeps this plan. Never
      write the app by hand.
- [x] Load skill `lernapps-github-setup`. Put the app on GitHub as it says: repo, branches, Pages, the app committed
      on `work`, the preview pull request. Give the creator the preview link once.
- [x] Fill the content guide `.agents/skills/app-content/SKILL.md` from "Notes" and "Content method"
      (`app-content-guide`). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0. Commit it before
      any content.
- [x] Load skill `lernapps-<archetype>` and the content guide. Questions with options and feedback: also skill
      `lernapps-content-questions`.
- [x] Kern (`src/core`): Aufgaben aus Seed erzeugen (vier Rechenarten, Wertebereiche), Antwort prüfen, Fehlversuche, Rundenende, Stoppuhr-Ticks; Commit.
- [x] Durchspiele für alle Rechenarten, Rundenende und gemischte Runde; Commit.
- [x] Daten `settings.ts` und Fehlermeldungen (Deutsch, in Message-Dateien); Commit.
- [x] Oberfläche: Start (Einstellungen, Routen), Aufgabe (Auswahl und Eingabe, Tastatur, 360 px), Ende; Commit.
- [x] Spielerisches Aussehen, Dunkelmodus, reduzierte Bewegung; statische Startseite mit Erklärung; Commit.
- [x] The content guide matches what was built (`app-content-matches`).
- [x] `npx lernapps check` passes.
- [x] Look at a screenshot of every screen and state (start, each mode, pause, end), desktop and 360 px. Compare
      each with the confirmed sketches.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).

### Completed

## Commit

<!--
- Publish with the creator's yes, then list the app. A push to `main` publishes.
- Skills: `lernapps-github`, `lernapps-listing`.
-->

### Tasks

- [ ] Load skill `lernapps-github`. Push `work` and see the pull request's checks to green as it says.
- [ ] Verify the default branch and Pages as the skill says. Note each click only the creator can make.
- [ ] **Checkpoint:** publish. Show the preview link; ask before the app goes online; put the noted clicks into the
      same question. Wait for the yes.
- [ ] Publish as skill `lernapps-github` says: `work` into `main`, the run of `Pages` watched to the end.
- [ ] Open the address the job `deploy` printed; confirm the app shows. Use that address, never a derived one.
- [ ] Load skill `lernapps-listing`. Complete the entry draft (e.g. the address).
- [ ] **Checkpoint:** list. Ask before opening the listing pull request; wait for the yes.
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it: the listing check and the review read it there.
- [ ] Open the listing pull request as the skill says; see it to "bestanden".
- [ ] Plan changed since its last push → commit it on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit, before the listing pull request. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: at most 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, messages or answers, and your choice. "None" if none. -->
