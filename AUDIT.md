# HIST 212 full quiz audit — September 29, 2026

Baseline: main `2b36e1a`, following the supplied packet audit and PR #1. The later request to redo the whole quiz expands the earlier minimal-patch scope. All 56 existing cards, their IDs, wording, and intentional supplementary material remain. One concept, rectification of names, has been added. The four houses and four categories remain; no fifth house or category was introduced.

## Findings and corrections

| Finding | Correction |
| --- | --- |
| Color alone indicated correctness; there were no explanations or totals. | Text feedback, per-category totals, specific explanations, and related reader links. |
| Shared vocabulary was graded as exclusively belonging to one house. | Yi and xiao accept Ru/Mo; wu wei accepts Ru/Dao/Fa; centralization accepts Mo/Fa. Feedback explains differences. These are course associations, not exhaustive claims about historical use. |
| Broad words and modern disciplines were rigidly right/wrong. | The People, Dao, Yin-Yang, Realism, and all 12 Applications are unscored. Modern labels retain their wording and gain concrete situations. Feedback offers a starting point, not validation of every possible argument. |
| Rectification of names was missing. | Added Zhengming 正名, grounded in Analects 12.11 and 13.3. |
| The matrix forced all four categories into one crowded drag interface. | One category at a time, searchable bank, responsive house columns, click/touch/keyboard controls as well as drag. |
| Placed cards could not return to the bank. | Select-and-return control and bank drop target. Moving a card clears obsolete feedback. |
| Refresh lost progress; reset could retain a stale selected card. | Versioned, validated browser persistence and category-specific reset with cleared selection. |
| Custom-card editor wrote data the quiz never loaded. | Quiz imports the existing format; editor has real labels, buttons, validation, storage errors, and explicit browser-local scope. User-entered card text is rendered as text, not HTML. |
| Supplementary sayings looked like exact assigned quotations. | Paraphrases, story titles, supplementary formulations, and prior-course material are labeled. Related reader links do not claim every cited supplementary line is included. |

## Content and sources

Compared against the instructor-supplied September 29 audit and the current course Reading 01–08 working editions. The supplied audit had already checked the readable contents of September 24/29 and October 1 packets. The full pass additionally used Reading 01 for Kongzi; its commentary on Analects 2.4 explicitly connects Ru cultivation with wu wei.

- [Kongzi reader](https://drive.google.com/file/d/1emibfvbdqQzbkvP06jRgV9CKmIKAZbu8/view): Analects 1.2, 2.3–4, 4.16, 12.1, 12.11, 13.3, 15.24 and accompanying course commentary.
- [September 24 — Mozi](https://drive.google.com/file/d/1ZR_jv9bJUShgKZgy-WdSpjamrXIhXnkO/view): Reading 02; Ivanhoe translations; Ebrey pp.27–28; Fraser pp.1–5, 17–19. Worthiness includes moral conduct; impartial care is not identical emotion; nonaggression permits defense; Heaven remains part of the account.
- [September 29 — Laozi, Zhuangzi, Mengzi](https://drive.google.com/file/d/1K_jfC8zaTjdB1VYEi4FXZO3yqAtY2Tj3/view): Readings 03–05; Daodejing 17/37/48; Zhuangzi 1–3; Mengzi 2A6, 6A2, 7B14 (Bloom p.159).
- [October 1 — Xunzi, Han Feizi, Lord Shang](https://drive.google.com/file/d/1Y426EWeCiphSUSY-Phh9vrf3uR8wvu1L/view): Readings 06–08; Xunzi 17/19/23; Han Feizi 5/7/40/43/49; Book of Lord Shang 1/3/4. Han Feizi's positional-power chapter includes a critique, not unqualified endorsement.

The supplied audit's intentional supplementary material is preserved: Daodejing 28's carver formulation; the broader Han Feizi law-as-teaching formulation; retained one-versus-ten and historical-adaptation paraphrases; Analects 2.15 as prior-course material. No text is represented as an exact translation merely because it is familiar. Shang Yang/Lord Shang remains one person. The People remains a constituency card, not a ninth thinker. Traditional characters and Mandarin speech synthesis (`zh-CN`) remain.

This exercise is selective, not a complete inventory of the readings. In particular, modern management analogies do not summarize Fa statecraft or erase its coercive aims. The school labels are teaching groupings, not claims that each thinker agreed with every other member.

## Validation

Node tests check all 57 cards against all four houses, independently specified scored answers, unscored handling, score denominators, move/return transitions, reset isolation, saved-state recovery, and legacy custom cards. Manual browser checks cover correct/incorrect feedback, keyboard selection and placement, return to bank, persisted progress, category changes, search, unscored discussion, reset, and custom-card import. Desktop and narrow mobile layouts are inspected for overflow and readable feedback. Speech controls remain dependent on installed browser/OS voices.
