# WorkSpace Labs — the site

**One page, plus its privacy policy.** It explains a human-gated build system: three AI agents plan, build and check each
other, and every point where something could be lost, changed or shipped is a button only a person
can press.

It is a folder of static files, and it is **live at https://workspace-labs.net** — published to
GitHub Pages from `workspace-labs/workspace-labs-site`, on his own domain, over HTTPS. It still opens
from a double-click with the network switched off, because every font and picture is a relative
path on disk and the page makes no request of its own. Every file under this root is either part
of the page or a text record of it. **No picture that was ever rejected for showing a person, a
machine name or a home path is kept inside this folder**, so uploading the whole tree cannot
serve one by URL. The two rejected Agents Labs captures live outside the
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

**The privacy policy is one folder down** (`privacy/index.html`), because its address has to be
`https://workspace-labs.net/privacy/`. Served over the web, and in Chrome from a double-click, it
loads the same font and mark as the home page (both measured 2026-10-22). Safari opened from a
double-click refuses files one folder up (`../assets/`) - found on another of these sites, not
re-measured on this one - so expect the text there in the system font with no mark. The real
site is unaffected.

---

## What is in here

```
index.html          the site — hero, the board, the agents, the rules, the windows
privacy/index.html  the privacy policy, at /privacy/ — the address Apple is given
archive/            the three shapes the site was chosen from, kept as the record
assets/screens/     nine app windows, web-sized
assets/screens/4k/  the same nine at 4500 x 3000, so any later size is a resize
assets/orbit/       the orbital artwork, plus the source HTML it re-renders from
assets/logo-mark.png     the header mark — the logo trimmed and exported at 96px for a 30px slot
assets/favicon-32.png    the browser tab icon
assets/apple-touch-icon.png  the 180px icon for an iOS home screen
assets/og-card.png       the picture a shared link paints (2400 x 1260)
assets/og-card.source.html   the HTML that card is remade from
assets/fonts/       Plus Jakarta Sans, bundled locally (SIL OFL 1.1)
robots.txt          what search engines may read — and the sitemap's address
sitemap.xml         the two pages, for Google Search Console
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

**Being found in Google.** `robots.txt` invites crawlers in, names the sitemap, and turns them
away from `/archive/` — those drafts are live at their own URLs and one is a near-copy of the
homepage, which would compete with it in a search result. `sitemap.xml` lists the home page and
the privacy policy, nothing else. `index.html` carries a **canonical** line naming
`https://workspace-labs.net/`, and the policy one naming `https://workspace-labs.net/privacy/`.

The canonical is *not* what unifies the site's addresses: `www`, plain `http` and the
`workspace-labs.github.io/workspace-labs-site/` backup all **301 to the domain already**, which GitHub
does automatically once a CNAME and HTTPS are set. What the canonical earns is the case a redirect
cannot see — a link shared with tracking parameters (`?utm_source=…`) is a separate URL to a
crawler, and this points every variant at the clean address.

`robots.txt` only has authority at a domain root, so it governs `workspace-labs.net`; on the
github.io backup the crawler reads that domain's own root file instead. The canonical is what
covers the backup.

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

## Reaching him, and what a shared link shows

The footer carries **three quiet handles**, under the two sentences that were always there:

| Reads | Goes to |
|---|---|
| `github.com/workspace-labs` | `https://github.com/workspace-labs` |
| `@workspacelabs91` | `https://x.com/workspacelabs91` |
| `hello@workspace-labs.net` | `mailto:hello@workspace-labs.net` |

The third one is the domain's own address; it forwards to the brand inbox, whose Gmail address is
never shown (v1.4.0). Under the handles sits **`© 2026 WorkSpace Labs`**, with **Privacy** at the
other end of the line - the one footer link that stays on this site, so it opens in the same tab.
The policy at `/privacy/` says the website collects nothing, that GitHub Pages logs visitor IP
addresses for security, how a message to `hello@` is handled, and how to have it deleted. It
describes no app yet; each app gets its own section there before it is released.

Text only — no GitHub or X marks, and no word-label standing in for a handle. Each opens a new
tab with `rel="noopener noreferrer"`, so the page it opens gets no handle back on this one. They
**wrap**: at 360 CSS px they sit on two rows with nothing past the edge. Hover and keyboard focus
both **underline**, so the link is not signalled by colour alone.

**The link preview.** `assets/og-card.png` (2400 × 1260) is the picture X, LinkedIn, iMessage and
Slack paint when the address is shared — the headline and the mark beside the Overview window, on
the site's own daylight ground. It is built from the site's own font, mark and screenshot, so it
cannot drift from the page; `assets/og-card.source.html` remakes it and `ASSETS.md` carries the
command. The head declares it **absolutely** (`https://workspace-labs.net/assets/og-card.png`) —
a crawler has no page to resolve a relative path against — with the width and height that match
the real file, and `twitter:card: summary_large_image` so X paints it wide rather than as a
thumbnail.

Checked in a real browser at 1440, 768 and 360 px: all three links open a new page and leave the
site standing, the keyboard reaches them and the 3 px focus ring shows, every hit area is at
least 24 × 24 px, nothing paints past the viewport edge, and the handles measure 4.65:1 against
the ground.

---

## Not in here

No login. No dashboard. No live data. No CMS. The app is not embedded and no app source is
published. No download, no pricing, no install instructions and no waitlist. **No contact form,
no newsletter, no analytics, and nothing that sends a visitor's details anywhere** — the footer's
three handles are ordinary links a reader chooses to follow, and the page still makes zero
network requests of its own.

**No LinkedIn, and no real name anywhere on the page or one click from it.** The site is
handle-only by decision: `github.com/workspace-labs`, `@workspacelabs91`, and the brand inbox
`hello@workspace-labs.net`. **Three** regression pins hold that shut — one names the three
permitted addresses one at a time, the second refuses any other `@handle` in visible copy and any
linkedin.com or twitter.com address in the source, and the third refuses **the name itself**.

That third one was added after a reviewer showed the first two were not enough: refusing a
LinkedIn *address* does not refuse a *name*, so the name could be typed straight into the footer
with the suite still green. Because this repo **is** the public site, the pin could not simply
spell the name out — that would have been the leak it guards against. It holds the name as salted
digests of its parts instead, hashes every run of letters the page could spell a name with, and
refuses a match; it reads the visible copy *and* the whole source, since an HTML comment is served
to every visitor too. Nothing readable is stored, and regenerating the digests takes the parts on
the command line and keeps none of them.

Its limit is written in the test beside it, so nobody trusts it further than it goes: a name
carries too little entropy for any published check to survive a determined dictionary attack by
someone who already suspects the exact name — no slow hash fixes that, so none is pretended. What
it does buy is complete: the name is not in the repo, not in a grep, not in GitHub search, not in
a search engine, and an accidental re-introduction fails the suite the moment it lands.

*(Three lines used to sit here that are no longer true, and are corrected rather than deleted so
the record reads straight: the tab icon shipped in v1.1.0, the brand inbox and the social card
ship in v1.3.0, and the site has been hosted on its own domain since 30 August 2026.)*
