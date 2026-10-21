# ASSETS.md — where every file on these pages came from

Every picture is either a capture of the **running app**, taken fresh, or a copy of an existing
artwork file. Nothing was drawn, invented, or upscaled.

---

## The eleven app windows

**Ten were re-captured on 2026-10-22** from `WorkSpace Labs.app` version **8.0.8** (site v1.5.0).
**Agents Labs is the 2026-08-30 capture from 2.8.1**, kept on purpose (below).

| On the page | Window | Captured via | Taken |
|---|---|---|---|
| `overview.webp` | Overview (Home) | `showHome()` | 2026-10-22 |
| `backloop.webp` | A finished card over the board | `showBoard()` then `openTask('workspace-app', 't-1788262729033')` | 2026-10-22 |
| `knowledge.webp` | Knowledge | `showKnowledge()` | 2026-10-22 |
| `notes.webp` | Notes | `showNotes()` | 2026-10-22 |
| `plan.webp` | Plan, one roadmap open | `showPlan()` then the first `[data-plan]` card | 2026-10-22 |
| `tasks.webp` | Tasks | `showWorkspaceTasks()` | 2026-10-22 |
| `calendar.webp` | Calendar | `showWorkspaceCalendar()` | 2026-10-22 |
| `palette.webp` | Palette | `showPaletteWindow()` | 2026-10-22 |
| `agents.webp` | Agents | `topBarRoute('agents')` over Home | 2026-10-22 |
| `projects.webp` | Projects | `showProjectsList()` | 2026-10-22 |
| `agents-labs.webp` | Agents Labs | `showWorkspaceCockpit()` | 2026-08-30 |

**How the 2026-10-22 set was taken.** The owner's running app was never touched. The installed
app's own code (`WorkSpace Labs.app/Contents/Resources/app.asar`) was started as a **hidden**
private copy — no window on screen, no Dock icon — with its own profile and `WS_DIR` pointing at a
**private catalog**. That catalog held only the two public projects, the app itself and this
site; every board card, lesson, plan line and bug entry naming another project, a person, a home
path or the machine was left out of it. Every capture's rendered text was then scanned for the
same terms before the picture was used, and every picture was looked at. The Tasks and Calendar
windows show real tasks from that week's public work.

**Why the board section shows a card, not the board.** On capture day every card had been
accepted, and a finished card leaves the board two hours after Accept — the honest board was six
empty columns. The section shows a finished card opened over the board instead: the same six
stages, ticked, with its plan, exam, delivery and review.

**Why Agents Labs was not re-taken.** Opened in a private copy, that window attaches to the live
agents' terminal sessions — and it is the window that leaked the owner's name once (below). The
August picture stays, and its caption on the page says when it was captured.

The Brief (removed from the app in 5.0.0) and the Prompt Generator (retired 2026-10-09) left the
site with this set; their pictures were deleted, not kept.

**Two files per window.**

- `assets/screens/4k/<name>.png` — the master, **4500 × 3000**. An 1800 × 1200 logical window at
  device scale factor 2.5. Above 4K, and roughly three times the resolution of the previous set.
- `assets/screens/<name>.webp` — what the pages load, **2304 × 1536** at quality 84. All eleven
  come to 952 KB. On the site the hero is capped at **1100** CSS px and is the widest any picture
  paints — measured at 1440, 1920, 2560 and 3840 px viewports, the answer is 1100 px every time —
  so every picture renders at **2.09×** and never thins out on a wide screen. The master is right
  there at 4500 × 3000 if a larger size is ever wanted — a resize, not a re-capture.

**Why 1800 logical and not 1536.** The board is the widest window in the app, and it was measured
rather than guessed: at 1536 the `.pcol` column div ran 27 px past the viewport and the COMPLETE
column was silently cut out of the picture. 1760 is the first width with zero overflow; 1800 was
taken so the whole board — Idea, Plan, Checklist, Active, Review, Complete — sits clear of the
edge with room to spare. Every window is captured at that one size so the set is consistent.

Any other size is a resize of the master, not a re-capture:

```bash
cwebp -q 84 -m 6 -resize <width> 0 assets/screens/4k/<name>.png -o <out>.webp
```

To take the set again, start a hidden private copy on a private catalog as above, with
`--remote-debugging-port`, and drive the functions in the table — the app's own navigation path, so nothing is faked into place.

**Nothing was re-captured when Concept B became the site (2026-08-30).** That build reused this
exact set, byte for byte; the only picture change on the whole card was the page moving up one
folder, so the URLs went from `../assets/screens/…` to `assets/screens/…`.

### Settings is deliberately not here

The Settings window prints the catalog folder as `/Users/<name>/Desktop/Workspace`, which sits
against the answer *"WorkSpace Labs only — no person"*. It was cut from the site rather than
cropped or blurred.

### Agents Labs was re-taken, because the first capture was NOT clean

This file used to claim Agents Labs had been checked for the same problem and was clean. **That
was wrong**, and peer review caught it (2026-08-30, round 4). The first capture showed
`/Users/<name>/Desktop/workspace-app/agent-watch grok` in the terminal panes and
`<name>@<Host>-MacBook-Pro` at the shell prompt — the owner's name and his machine's name, eight
times over, on a page answered *"Customers or the public"*.

The cause was not the live screen. tmux keeps a **scrollback** behind each pane, the launch lines
sat in it, and the app replays that scrollback when it attaches — so a pane that reads clean in
the terminal still painted the old lines inside the app.

It was **re-captured, not cropped and not blurred**, the same standard the rest of the set is
held to: the pane scrollback was cleared, the viewer re-attached, and the window was shot again
at the same 1800 × 1200 @ 2.5. The replacement carries no name, no host and no home path, and it
happens to show the board handing this very card to the builder. The leaked pair is kept **outside this
project entirely** — in the catalog, at
`~/Desktop/Workspace/workspace-labs-website/.backup-pipeline/leaked-captures-20260830/` — and
pinned by hash in `tests/journey-site.test.js`, so neither file can come back unnoticed. It used
to sit under this root in `.backup-pipeline/round5-105558/`, which a whole-folder upload would
have served by URL even though no page links it.

**Taking this window again:** clear the pane scrollback first — `tmux clear-history -t agents:0.N`
for each pane — then Stop watching and Start in the app so the viewer replays the clean history.
Check the result before shipping it: the rendered page must contain no `/Users/`, no user name and
no host name.

### What replaced the previous set

The earlier ten pictures in `~/Desktop/workspace labs design/` were **1536 × 1024** and were not
the shipped app:

- `overview.PNG` traced to `galaxy-overview.mockup.html` and `wireframe.html` — a **mockup**.
- Most of the rest traced to `demos/redesign-shell/index.html` — a **demo shell**.
- Their rail read `Backloop · UNIVERSE · V2.6.0`. The app now reads **`BackLoop`** and **v2.8.1**,
  and the board has **six** columns where those pictures showed five.

Those originals are untouched where they are. Nothing on this site uses them any more.

---

## The orbital art — used by the **archive** only

The site does not paint the orbital artwork. It was Concept A's opening screen, and A is now in
`archive/`, so these three files exist for the record rather than for `index.html`. They are kept
because the archived pages still render, and because the source HTML re-renders at any size.

| On the page | Where it came from |
|---|---|
| `assets/orbit/orbit.source.html` | copy of `WorkSpace-Labs-Orbit-AI-Can-Act-3024x1964.source.html` — self-contained, fonts embedded, re-renders at any size |
| `assets/orbit/orbit-desktop.webp` | `WorkSpace-Labs-Orbit-AI-Can-Act-3024x1964.png`, resized 3024 → 2048 wide. 1.95 MB → 51 KB |
| `assets/orbit/orbit-phone.webp` | **re-rendered from `orbit.source.html`**, not cropped from the PNG |

**How the phone orbital was made.** The idea named a phone orbital at 1320 × 2868; that file does
not exist on disk, so it was not invented. The source HTML was loaded in a real browser and
re-rendered instead. Its canvas is a fixed landscape 3024 × 1964, so a literal 1320 × 2868 render
would be a small band of artwork floating in a tall empty field. What ships is the same painted
canvas framed for a portrait screen: **1320 × 1376**, centred on the orb (source x 1030 → 2914),
on the artwork's own ground `#F4F6FF`.

The baked wordmark block is outside that frame **on purpose**. Scaled to a 360 px phone, the
artwork's own "WORKSPACE LABS" falls to about 11 px cap height. So on phones the archived Concept A
sets the
wordmark and the line as real text at a readable size, and the artwork supplies the orb. On
desktop the artwork carries its own typography, full-bleed, exactly as the piece was drawn.

---

## The link-preview card

`assets/og-card.png` — **2400 × 1260**, a 1200 × 630 canvas rendered at 2×, which is the 1.91:1
shape every timeline crops to. It is what X, LinkedIn, iMessage and Slack paint when
`https://workspace-labs.net/` is shared.

**Where the layout came from.** Three cards were drawn and shown side by side on 2026-08-30 —
A (the app window full-bleed), B (the headline and mark alone), C (both: headline beside the
window). **He picked C by eye.** A and B were not shipped and are not in this repo.

**Nothing here was drawn or invented.** The card is built from three files this site already
serves, by relative path, so it can never drift from the page:

| In the card | The site's own file |
|---|---|
| the type | `assets/fonts/plus-jakarta-sans-var.woff2` — the face the page reads in |
| the mark | `assets/logo-mark.png` — the mark the header carries |
| the window | `assets/screens/overview.webp` — the capture the hero paints |

The three approved lines, exactly as he accepted them: **WorkSpace Labs** · *The AI does the work.
You keep every decision.* · *AI can act. Human decide.*

**Remake it** — from the project root:

```bash
"$HOME/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell" \
  --headless --disable-gpu --hide-scrollbars --force-color-profile=srgb \
  --allow-file-access-from-files --force-device-scale-factor=2 \
  --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot=assets/og-card.png "file://$PWD/assets/og-card.source.html"
```

`--allow-file-access-from-files` is what lets the page read its three sibling assets off disk;
`--virtual-time-budget` is what waits for the woff2 before the shutter. `--force-color-profile=srgb`
keeps the colours on the tokens.

**Any other size is a re-render of that source, never an upscale of the PNG.** Change
`--window-size` (the CSS canvas stays 1200 × 630) or `--force-device-scale-factor`.

**It was checked against the accepted mock, not assumed to match.** Rendering it here uses a
different rasterizer than the Electron shot he approved, so the two PNGs are compared pixel by
pixel: **79.7 % of pixels identical**, mean difference **1.4/255**, and the amplified difference
mask is nothing but **hollow glyph outlines** — the signature of antialiasing. A layout that had
shifted would show solid doubled shapes instead. Same picture, different pen.

**If the header mark, the font, or the Overview capture ever changes, remake this card** — it
reads those exact files, so a stale card is the one way it can lie about the page. **Remade
2026-10-22** (v1.5.0) when the Overview capture became the 8.0.8 Home; layout C and the three lines
are unchanged.

---

## Fonts

| On the page | Original | Licence |
|---|---|---|
| `assets/fonts/plus-jakarta-sans-var.woff2` | `workspace-app/fonts/` — latin subset | SIL OFL 1.1 |
| `assets/fonts/plus-jakarta-sans-ext-var.woff2` | `workspace-app/fonts/` — latin-ext subset | SIL OFL 1.1 |
| `assets/fonts/plus-jakarta-sans-OFL.txt` | the licence text, copied with the files | — |

Both are declared with the same `unicode-range` and `font-weight: 200 800` the app uses. The
italic faces are **not** bundled: nothing on these pages is italic. **No page fetches a font from
the network** — same rule as the app.

---

## Not used here

`workspace labs logo.jpg`, `splash workspace labs.PNG`, `workspace-banner-cleanx.png`,
`WorkSpace-Labs-Orbit-3024x1964.png` (the pre-tagline orbital), and the journey diagrams in
`Workspace-Showcase-Private/` were all available and none were needed. They remain where they are.
