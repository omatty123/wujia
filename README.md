# Five houses — HIST 212 · Fall 2026

LIVE: https://omatty123.github.io/wujia/

The starting page presents Ru, Dao, Mo, Fa, and Fo in five compact comparison rows. Optional details hold key terms, nuances, and course-reader links. Practice presents 20 paraphrased associations, four per house, one at a time. Feedback is immediate; a review round repeats missed statements. Basic practice is session-only, ungraded, and sends no data.

The original 57-card four-house exercise, custom cards, and browser-local progress remain available at `sorting.html`. No original card has been deleted. The simpler entry point replaces the former landing page; Git history and `sorting.html` preserve it.

New files: `basics-data.js`, `basics.js`, `basics.css`. Sources: existing audited Ru/Dao/Mo/Fa content; assigned October 13 readers, SCT 416–419 (editorial Buddhist basics), Mouzi and Huiyuan 421–428, and SKT Wŏn’gwang 44–46. All new practice statements are paraphrases, not quotations. Fo is explicitly distinguished from the earlier Warring States schools.

Run `npm test` and serve with `python3 -m http.server 8776`. GitHub Pages publishes the root of main. CI runs tests before changes are merged.

## Original sorting exercise documentation

# Four houses — HIST 212 practice

[Open the quiz](https://omatty123.github.io/wujia/).

A static course exercise for Ru, Dao, Mo, and Fa. Work through Key People, Key Concepts, Aphorisms, and Applications. Select a card and a house with a mouse, touch, or keyboard; dragging is optional. Check placements for explanations and links to related course readers. Return cards to the bank or reset one category.

## Answer policy

57 cards: 41 scored association cards and 16 unscored discussion/connection cards. Shared vocabulary accepts the documented associations in `data.js`; modern applications are not unique right/wrong answers. Scores count checked correct cards out of all scored cards in the active category. Nothing is submitted or connected to course grades. See [AUDIT.md](AUDIT.md) for evidence, preservation decisions, and scope.

Progress and custom cards stay in local browser storage. They are not synchronized or published. The custom editor retains the existing `matrixCustomItemsV1` format; the quiz now reads it. Custom answer keys are explicitly unverified. Opening the editor on another device will not display these cards.

## Run and verify

No dependencies or build step. Serve the directory over HTTP (ES modules do not run by opening `index.html` as a local file):

```sh
python3 -m http.server 8000
npm test
```

Open http://localhost:8000. Tests use Node's built-in test runner (Node 20+).

- `data.js`: card content, accepted houses, explanations, related reader links.
- `model.js`: pure grading, persistence validation, and custom-card import.
- `quiz.js` / `index.html` / `style.css`: accessible, responsive practice interface.
- `admin.js` / `admin.html`: browser-local custom-card editor.
- `tests/quiz.test.js`: exhaustive answer-key and state regression checks.

GitHub Pages publishes the root of `main`. Review changes in a PR, run tests and desktop/mobile browser checks, then merge. Do not add private student records or copyrighted source PDFs to this public repository.

### Light theme, automatic matching, and five-house matrix

The main page now includes Drag & drop matrix: 20 statements, five destinations, immediate feedback, movable placements, a count of correct placements, and reset. Tap or keyboard selection followed by a destination works without dragging. Practice matching advances automatically after five seconds of feedback; turn Auto-advance off to read at your own pace. Switching modes cancels pending advancement. The matrix state lasts for the current page session. All surfaces use the requested light theme.
