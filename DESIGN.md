# DESIGN.md — the identity this site is locked to

The visual law for this project (Rule 15). It governs **one live page**: `index.html`, the
WorkSpace Labs site. The site is built from the Workspace app's own **daylight** identity, so the
site and the app read as one product.

There is no second palette. The dark alternative that once lived in this file belonged to a
rejected shape and was deleted with it — nothing on the site uses a dark ground, and leaving the
tokens here would only invite someone to reach for them.

The three shapes the site was chosen from are kept in `archive/` as the record of that decision.
They are **not** governed by this file and nothing on the site links to them.

---

## Typography — one face, bundled locally

`--sans` = **`"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif`**, weight range `200 800`,
line-height `1.5`. The app's own face, chosen by eye on 2026-08-26.

- Bundled in `assets/fonts/` as two `woff2` subsets (latin, latin-ext), each declared with its
  `unicode-range`. **No page fetches a font from the network.** The latin subset carries the page;
  latin-ext is fetched only if a character in its range appears, which is the browser doing the
  right thing rather than a missing asset — both files were loaded from disk and verified.
- **Never Urbanist** — the Nulox reference's face is not this product's face.
- Numbers that should read as figures use the app's `--num` stack: `-apple-system,
  BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif`. The live page carries
  no figure strip today; the stack stays the law for any that lands later.
- No italics are used, so no italic file is bundled.

---

## Colour — the daylight palette (the whole law)

Straight from the app's `DESIGN.md`. Use the tokens, never a raw hex.

| Token | Role | Value |
|---|---|---|
| `--space` | page ground | `#F2F5FF` |
| `--panel` | card / surface | `#FFFFFF` |
| `--ink` | primary text | `#10182E` |
| `--ink-soft` | secondary text, captions | `#4A5478` |
| `--accent` | **decorates** — dots, borders, washes, rules | `#3E5BFF` (Aurora) |
| `--accent-ink` | **is read** — links, button fills carrying white | `#3E5BFF` |
| `--accent-2` | read **on a tinted wash**, and button hover | `#2F48E0` |
| `--accent-soft` | 12 % wash | `rgba(62,91,255,.12)` |
| `--line` / `--line-strong` | hairlines | `rgba(40,58,120,.10)` / `rgba(40,58,120,.16)` |

**Reserved, and honestly not painted today.** `--ok` (`#1EA36A`), `--gold` (`#C4962E`), `--grok`
(`#7B4ED4`), `--ink-faint` (`#8A93B2`) and `--r-chip` are declared on the live page but nothing
uses them. They are the app's palette held open for a section that lands later, not a claim about
the current screen. `--ink-faint` in particular is **not for text**: it measures 2.80:1 on the
ground and 3.04:1 on a white card. Small text uses `--ink-soft`.

**The two-token rule, and the third token this project had to add.** The app's law is *`--accent`
decorates, `--accent-ink` is read*. Measured on the real page, that is not enough here: text
sitting on a **12 % wash of its own colour** loses contrast against the wash, not against the page.
So anything read **on a wash** uses `--accent-2`, which measures **6.01:1** there against Aurora's
under-AA reading.

**Nulox's neon pair — `#42EA6D` and `#EA4242` — is not taken.** Status, if this site ever needs it,
uses the app's `--ok` and `--danger`.

---

## Shape, spacing, motion

- **Radius** — `20px` big surfaces · `12px` cards · `9px` buttons · `6px` chips · `99px` pills.
- **Gaps** — `8 / 12 / 16 / 24px`, widening at section breaks.
- **Borders** — one `1px` hairline. Never heavy.
- **Elevation** — a resting shadow on cards, a deeper one on the hero shot. Sparingly.
- **Measure** — body copy is capped around 52–64 characters.
- **The window row is flex, never grid.** The gallery is `display:flex; flex-wrap:wrap;
  justify-content:center`, Notes is the lead tile at double width, and no tile may `flex-grow`.
  That is what makes five tiles fill six cells with no hole *and* a sixth window land centred
  later instead of stretching across its row. A grid reopens the gap; this is a locked decision
  (2026-08-30), not a layout preference.
- **Motion serves meaning only.** Everything is inside
  `@media (prefers-reduced-motion: no-preference)` — on this page that is smooth in-page
  scrolling, and nothing else. With reduced motion on, the page is identical in content: measured
  both ways, the same 3,710 characters of copy, the same nine pictures, and the same four
  elements invisible either way (the rail's baseline spacers).
- **Targets** — every control is at least 24 × 24 CSS px at phone width (WCAG 2.2 AA).

---

## Verified, not asserted

Every number here was measured on the **rendered pixel** of the live page in a real browser — the
page screenshotted over a debug port, the image read back into a canvas, and the colour behind
each run of text sampled where the glyphs actually sit. Not from declared backgrounds: a declared
colour can be a number that is never on screen.

**243 runs of text measured across 360, 768 and 1440 px. 0 WCAG AA failures.** These are the 14
distinct colour pairs the page really paints, worst instance of each:

| Measured | Needs | Text | On | Where |
|---|---|---|---|---|
| **4.65:1** | 4.5 | `#3E5BFF` | `#F2F5FF` ground | eyebrow, kickers — the tightest pair on the page |
| 5.07:1 | 4.5 | white | `#3E5BFF` | the solid button |
| 6.01:1 | 4.5 | `#2F48E0` | Aurora 12 % wash | the rail's "You" markers |
| 6.17:1 | 4.5 | `#2F48E0` | `#F2F5FF` ground | the same markers off the wash |
| 6.23:1 | 4.5 | `#4A5478` | tinted card | figure captions |
| 6.64:1 | 4.5 | `#4A5478` | Aurora 12 % wash | rail sub-labels |
| 6.81:1 | 4.5 | `#4A5478` | `#F2F5FF` ground | nav links, body copy |
| 7.42:1 | 4.5 | `#4A5478` | `#FFFFFF` card | rule-card copy |
| 11.12:1 | 4.5 | `#C6CDE4` | `#10182E` band | the closing band's paragraph |
| 14.93:1 | 4.5 | `#10182E` | ground beside the rail line | rail station names |
| 15.59:1 | 4.5 | `#10182E` | tinted ground | rail station names |
| 16.17:1 | 4.5 | `#10182E` | `#F2F5FF` ground | headings, brand, body |
| 17.62:1 | 4.5 | `#10182E` | `#FFFFFF` card | the ghost button |
| 17.62:1 | 3 | white | `#10182E` band | the closing band's heading |

The method was cross-checked against the arithmetic, which is how you know the reading is real:
`#10182E` on `#F2F5FF` computes to **16.17:1** and measures **16.17:1** off the pixel.

Re-run it before changing any colour.
