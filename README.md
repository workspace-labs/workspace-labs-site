# WorkSpace Labs — the site

**One page.** It explains a human-gated build system: three AI agents plan, build and check each
other, and every point where something could be lost, changed or shipped is a button only a person
can press.

It is a folder of static files. Nothing here is hosted, pointed at a domain, or published —
**where it lives is a separate decision**, and this repo does not make it. The build produces
something that can be published anywhere — and that is meant literally: every file under this
root is either part of the page or a text record of it. **No picture that was ever rejected for
showing a person, a machine name or a home path is kept inside this folder**, so uploading the
whole tree cannot serve one by URL. The two rejected Agents Labs captures live outside the
project, in the catalog at
`~/Desktop/Workspace/workspace-labs-website/.backup-pipeline/leaked-captures-20260830/`.

---

## Open it

Double-click **`index.html`**, or:

```bash
open index.html
```

That is the site. There is no picker, no chooser, and no second page to compare it with — opening
`index.html` is opening the product page.

It works with the network switched off: every font and every picture is a relative path on disk.

---

## What is in here

```
index.html          the site — hero, the board, the agents, the rules, the windows
archive/            the three shapes the site was chosen from, kept as the record
assets/screens/     nine app windows, web-sized
assets/screens/4k/  the same nine at 4500 x 3000, so any later size is a resize
assets/orbit/       the orbital artwork, plus the source HTML it re-renders from
assets/fonts/       Plus Jakarta Sans, bundled locally (SIL OFL 1.1)
tests/              regression pins, one per defect (`npm test`)
.backup-pipeline/   pre-edit copies of the text files, kept for rollback — text only, no pictures
ASSETS.md           where every picture came from, and how to remake it
DESIGN.md           the identity the site is locked to, with measured contrast
CHANGELOG.md        what changed and why
```

No framework. No build step. No dependencies. No network calls.

**The archive is the record, not part of the site.** `archive/a-the-line.html`,
`archive/b-the-product.html` and `archive/c-the-bay.html` are the three shapes that were built so
one could be picked by eye on 30 August 2026. B was chosen and became `index.html`. The other two
are kept so the choice is still visible; **nothing on the site links to them**, and they are not
governed by `DESIGN.md`.

---

## The one command

```bash
npm test
```

Node's own test runner — no packages to install. It names `tests/journey-site.test.js`
**explicitly** rather than handing the runner a folder, and that is deliberate: `node --test tests/`
passes a directory, which Node 18 and 20 walk but Node 22 resolves as a module and exits 1. Naming
the file behaves identically on 18, 20 and 22. A second test file would have to be added to that
script on purpose.

Each case is titled with the defect it holds shut, so an edit that reopens one fails by that
defect's own words rather than quietly.

---

## Built to grow

A later version might add a way to get the app. That is a constraint on this build, not a future
problem:

- Every section is an **independent block**. A new one drops in between two existing sections
  without re-cutting anything around it.
- The header carries a **visible dashed slot** with room for one more item — visible on a phone
  too, which is where it first was not. On a 360 px screen the nav lays out as an even
  three-column grid and the slot ends at 200 px, inside the screen, with no sideways scroll.
- **The window row is flex, not grid.** Notes is the lead tile at double width, so five tiles fill
  six cells with no hole — and because no tile may grow into leftover space, a sixth window added
  later wraps onto its own row and **centres** instead of stretching across it. Proven rather than
  intended: a sixth tile inserted into the live page measures one cell wide (332 px at 768,
  331 px at 1440) with equal gaps either side, then removed.
- Every picture is referenced from its own source file, so a later size is a re-render, not a
  re-capture.
- Nothing in the visible copy says the app is unavailable, closed, or private — version one is
  simply quiet about getting it, so nothing has to be hunted down and deleted later. (This
  paragraph and the *Not in here* section below are the handoff, not the page.)

---

## What was checked

Driven in a real browser, not asserted:

- **65 structural, layout, keyboard and asset checks pass** at 360, 768, 1024 and 1440 px.
- **Contrast: 0 failures.** 243 runs of text measured across three widths — read off the
  **rendered pixel**, not off a declared background. The tightest pair on the page is 4.65:1
  against a 4.5 floor. `DESIGN.md` carries the full table.
- **Nothing paints past the viewport edge** at any of the four widths, measured on real boxes.
- **Every control is at least 24 × 24 px** at phone width; the focus ring is 3 px and visible;
  the skip link parks off-screen and returns on focus.
- **Reduced motion loses nothing.** With `prefers-reduced-motion: reduce`, the page carries the
  same 3,710 characters of copy and the same nine pictures as it does without.
- **No remote requests.** No font fetch, no script, no form, no analytics, no API call.
- **Every asset resolves** and no image is broken.

---

## About the pictures

Every window was captured on 2026-08-30 from the app that was actually running — version 2.8.1 —
by driving the app's own navigation functions over a debugging port. No mock data and no fixture:
the board screenshot shows the real card that was in flight while these pages were being built,
and Agents Labs shows the three agents working on it. **This build re-captured nothing** — it uses
that same set.

Masters are **4500 x 3000** (an 1800 x 1200 window at 2.5x). The pages load 2304-wide copies. On
this page the hero is capped at **1100** CSS px, and it is the widest any picture paints — measured
at 1440, 1920, 2560 and 3840 px viewports, the answer is 1100 px every time. So every picture on
the site renders at **2.09x** and, unlike a page that lets its hero grow, it never thins out. The
master is right there at 4500 x 3000 if a larger size is ever wanted — any other size is a resize
of the master, never a re-capture.

The 1800 width was measured, not guessed: at 1536 the board's column div ran 27 px past the
viewport and the COMPLETE column was cut out of the picture entirely. 1760 is the first clean
width; 1800 leaves margin. Every window uses that one size so the set stays consistent.

**Settings is not on the site.** That window prints the catalog folder as
`/Users/<name>/Desktop/Workspace`, which sits against *"WorkSpace Labs only — no person"*. It was
cut rather than cropped or blurred. Agents Labs had the same problem and was missed the first
time — its terminal panes showed the owner's name and his Mac's name, which peer review caught. It
was **re-taken**, not cropped and not blurred, after clearing the pane scrollback the app replays.

**The rule for any future capture:** count `/Users/`, the user name and the host in the **app's own
rendered text**, never in the terminal — tmux keeps a scrollback behind each pane and the app
replays it, so a pane that reads clean in the terminal can still paint the old lines inside the
app. Re-take; never crop and never blur. `ASSETS.md` has the full account and the steps.

An earlier set of pictures was replaced: they were 1536 x 1024, and they turned out to be a mockup
and a demo shell rather than the app — their rail read `Backloop · V2.6.0` where the app now reads
`BackLoop` and 2.8.1, and they showed five board columns where the app has six. `ASSETS.md` has
the full trace.

---

## Not in here

No login. No dashboard. No live data. No CMS. The app is not embedded and no app source is
published. No download, no pricing, no install instructions, no waitlist, no email address, no
analytics, no favicon, no social cards. Hosting and a domain are a separate decision, and not one
this repo makes.
