# ASSETS.md — where every file on these pages came from

Every picture is either a capture of the **running app**, taken fresh, or a copy of an existing
artwork file. Nothing was drawn, invented, or upscaled.

---

## The nine app windows

Captured on **2026-08-30** from the app that was running at the time — `WorkSpace Labs.app`
version **2.8.1** — by driving its own navigation functions over a debugging port. No mock data,
no fixture, no clicking: the board shows the real card that was in flight while these pages were
being built.

| On the page | Window | Captured via |
|---|---|---|
| `overview.webp` | Overview | `showHome()` |
| `backloop.webp` | BackLoop | `showBoard()` |
| `notes.webp` | Notes | `showNotes()` |
| `knowledge.webp` | Knowledge | `showKnowledge()` |
| `the-brief.webp` | The Brief | `showWorkspaceBrief()` |
| `prompt.webp` | Prompt Generator | `showWorkspacePrompt()` |
| `agents-labs.webp` | Agents Labs | `showWorkspaceCockpit()` |
| `plan.webp` | Plan | `showPlan()` |
| `projects.webp` | Projects | `showProjectsList()` |

**Two files per window.**

- `assets/screens/4k/<name>.png` — the master, **4500 × 3000**. An 1800 × 1200 logical window at
  device scale factor 2.5. Above 4K, and roughly three times the resolution of the previous set.
- `assets/screens/<name>.webp` — what the pages load, **2304 × 1536** at quality 84. Nine of them
  come to 858 KB. On the site the hero is capped at **1100** CSS px and is the widest any picture
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

To take the set again, launch the app with `--remote-debugging-port=9222` and drive those same
nine functions. That is the app's own navigation path, so nothing is faked into place.

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
