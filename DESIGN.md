---
name: Four houses
description: Compact HIST 212 sorting practice in navy and gold.
colors:
  bg: "#171b2b"
  surface: "#222839"
  raised: "#2d3446"
  ink: "#f2f2ed"
  muted: "#bcc3ce"
  gold: "#f0d17b"
  line: "#515b70"
  ok: "#b5e3be"
  bad: "#ffc1b9"
  focus: "#ffdf86"
typography:
  display:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.65rem, 3vw, 2.4rem)"
    fontWeight: 650
    lineHeight: 1.2
  headline:
    fontSize: "1.5rem"
    fontWeight: 700
  body:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  label:
    fontSize: ".8rem"
rounded:
  control: "8px"
  field: "5px"
spacing:
  compact: "8px"
  grid: "16px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "9px"
  category-current:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control}"
  card:
    padding: "10px 0"
  feedback:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px"
---

# Design System: Four houses

## Overview

**Creative North Star: "Compact course practice"**

A compact course practice interface for sorting cards among Ru, Dao, Mo, and Fa. Navy surfaces, gold actions, and sans-serif text keep card content and placement controls prominent. The custom-card editor uses the same controls and typography.

**Key Characteristics:**
- Compact, text-led practice layout.
- Gold identifies actions, current category, and selected cards.
- Visible keyboard focus and persistent placement controls.

This records the implemented system in `style.css`, `index.html`, and `admin.html`. Product behavior and content policy remain in `README.md`.

## Colors

The palette uses dark navy layers with warm gold for actions and state emphasis.

- **Primary:** Gold marks the main action, active category, selected card, links, and house rules.
- **Neutral:** Background, surface, and raised navy separate the page, feedback, and selected controls. Ink carries primary text; muted text carries descriptions and counts; line defines dividers and control boundaries.
- **Feedback:** Pale green and pale red support correct and incorrect labels. Written feedback communicates the result as well.
- **Focus:** The light gold focus outline remains distinct from ordinary control borders.

## Typography

Helvetica Neue with Arial and sans-serif fallbacks is shared across the page and form controls. The responsive page heading uses the display role; section headings use the headline role. Body text is regular weight. Card labels use medium weight and a tighter line height (1.4); small kind labels use the label role. Progress uses tabular numerals. Chinese text remains alongside the English house names.

## Layout

The masthead, main content, and storage note share a centered maximum width (1280px) with desktop horizontal padding (28px). The introduction is limited to 78ch. The editor narrows to 760px. Section actions and category controls wrap.

The house board has four equal columns with a 16px gap; the card bank has three columns with a 22px gap. At 900px and below, both use two columns. At 540px and below, page padding becomes 16px, the bank becomes one column, and category and destination controls form two-column grids. The house board retains two columns for empty houses, while occupied houses span the full width. Long card content wraps.

A sticky bottom placement bar keeps selection and destination controls available. Its destination row wraps on narrower screens; scroll padding (240px) leaves room for focused content above it.

## Elevation & Depth

Most separation comes from navy surface changes and thin borders. Only the sticky placement bar has a structural upward shadow (`0 -8px 24px #0003`). Cards are divided rows, not floating panels.

## Shapes

Controls and feedback have gently rounded corners using the control radius; fields use the smaller field radius. House columns begin with a gold top rule (2px). Empty destinations use dashed borders. Buttons and fields have a minimum height (44px).

## Components

- **Primary button:** Gold fill and dark text, bold weight, lighter gold hover. Used for checking placements and adding a custom card.
- **Secondary button:** Navy surface and line border; hover raises the surface and turns the border gold. Disabled controls reduce opacity (.55).
- **Fields:** Dark background, thin border, light text, and gold caret. Search and editor fields share this treatment.
- **Category navigation:** A row of ordinary buttons with the current category filled gold. The current state is exposed through `aria-current`.
- **Practice card:** A divided text row with a full-width selectable label, optional pronunciation button, kind label, and prompt. Selection uses a raised surface, gold border, and gold text through `aria-pressed`.
- **Feedback:** A compact rounded navy inset with a distinct text label, explanation, and source links. Correct and incorrect label colors complement the wording.
- **Placement bar:** Selection text above house destinations plus return and cancel controls; active status text uses a polite live region.

Interactive elements receive a focus outline (3px) offset by 4px. Button background and border transitions last .12s with ease-out only when reduced motion is not requested. The skip link appears on focus.

## Do's and Don'ts

- Do retain readable card text and explicit selected, current, and feedback states.
- Do use the shared sans-serif stack and visible focus outline.
- Do let long card text wrap and preserve the mobile full-width occupied houses.
- Don't distinguish answer states by color alone; retain the feedback text.
- Don't introduce decorative imagery or large banners into the compact practice layout.
