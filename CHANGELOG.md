# Changelog

All notable changes to this project. The version lives in `package.json` at this code root and
moves once per board card (Rule 27).

## [1.4.0] - 2026-10-22

**The site is ready for Apple Developer enrollment.** Apple looks for a real site on the
company's own domain, a way to contact the company, and a privacy policy address for each app.
The footer had no copyright line and no policy, and its contact link showed the Gmail inbox.

- **Contact address** — the footer's third handle is now `hello@workspace-labs.net`, the domain's
  own address, which forwards to the brand inbox. The Gmail address is no longer shown anywhere.
- **Copyright line** — `© 2026 WorkSpace Labs` sits on a new line under the handles, with the
  **Privacy** link at its other end. Same size, colour and underline rule as the handles; no new
  token, font or colour. The two sentences and three handles above it are untouched.
- **Privacy policy** — a new page at `privacy/index.html`, so the address is
  `https://workspace-labs.net/privacy/`. It uses the home page's own tokens, header and footer. It
  covers who we are and the contact address, what the website collects (nothing: no cookies,
  analytics, forms or accounts), who else sees anything (GitHub Pages logs visitor IP addresses
  for security, per GitHub's own documentation), messages sent to us, how to have data deleted,
  and the date it was last updated. **No app is described yet**: Planvy is left out by the
  owner's decision, and the page says each app gets its own section before it is released.
- **Sitemap** — now lists the home page and the policy, both with `lastmod` 2026-10-22.
  `robots.txt` changed only in a comment that said the site is one page.
- **Tests** — the three pins that named the Gmail address, or allowed the sitemap one page only,
  were widened to the new address and the second page. One new pin checks the footer's address,
  copyright line and Privacy link; that the policy exists, keeps its sections and a real date,
  carries no TODO and names no AI model; that neither page shows Gmail; and that the policy's
  tokens, header and footer match the home page. The owner's-name check now reads both pages.
  12 deliberate breaks in a disposable copy were all caught. `npm test`: 20 of 20 pass.
- Direct chat authorization, no Backloop card.

## [1.3.2] - 2026-10-19

- Document the existing colors, font sources and readability pairs in DESIGN.md for the Workspace Palette window, using the owner-approved preview contract. Today's application colors and fonts are unchanged.
- Record the actual translucent hairline as `#283A781A` (`rgba(40,58,120,.10)`) for the Palette preview instead of the former solid stand-in; site styling is unchanged.
- Direct chat authorization for the Palette window documentation; no Backloop card.

## [1.3.1] - 2026-09-19

**The GitHub handle on the page is the renamed account.** The footer still carries exactly three
outbound addresses, in the same order. The GitHub one is now `github.com/workspace-labs` (the
account formerly `itsmk91`). X and the brand inbox are unchanged. The regression pin names the
new address in full, so the old handle would fail the suite.

## [1.3.0] - 2026-08-31

**There is now a way to reach him, and a shared link paints a picture instead of a grey box.**
The site had no outbound link of any kind — someone who read the whole page and wanted to see the
code, or say something, had nowhere to go — and pasting the address into X, LinkedIn or iMessage
produced a bare unfurl with no image, because the head carried a title and a description and
nothing else.

- **Three quiet handles in the footer**, under the two sentences that were already there, in the
  order he answered them on the card: `github.com/itsmk91`, `@workspacelabs91`, and
  `workspacelabs91@gmail.com`. Text only — no GitHub or X marks, no word-labels standing in for
  the handles, no LinkedIn and no real name. Each opens a new tab with
  `rel="noopener noreferrer"`, so the page it opens gets no handle back on this one. They **wrap**
  rather than queue: at 360 CSS px they sit on two rows with nothing past the edge, the same
  lesson the phone nav paid for at launch.
- **Colour is not the only cue.** The handles read in `--accent-ink` (4.65:1 on the ground,
  measured off the rendered pixel), and both hover and keyboard focus add an underline — so a
  reader who cannot separate `#3E5BFF` from the neighbouring `#4A5478` still sees a link. The
  honest limit: at rest, colour is the only difference from that neighbouring text (**1.46:1**
  between them). They sit in their own labelled `<nav>` row rather than inside a sentence, and
  every one of them reads as an address, so nothing is hidden inside prose — and the site's own
  identity has never underlined a link at rest.
- **The link-preview card** — `assets/og-card.png`, 2400 × 1260 (a 1200 × 630 canvas at 2×). It is
  picture **C**, the layout he picked by eye from three: the headline and the mark on the left,
  the Overview window on the right, on the site's daylight ground. It was **rebuilt into the
  repo** from the site's own three files — the same woff2 the page reads in, the same
  `logo-mark.png` the header carries, the same `screens/overview.webp` the hero paints — so the
  card cannot drift from the page. `assets/og-card.source.html` remakes it, and `ASSETS.md`
  carries the one command. Checked against the accepted mock pixel by pixel: 79.7 % of pixels
  identical and a mean difference of 1.4/255, all of it glyph antialiasing (the difference mask
  is hollow letter outlines, not doubled shapes — nothing moved).
- **The head tags a crawler actually reads**: `og:title`, `og:type`, `og:url`, the page's own
  description reused verbatim, an **absolute** `og:image` (a relative path resolves against
  nothing and shows no picture), width and height matching the real file, `twitter:card:
  summary_large_image` and the same absolute `twitter:image`. The favicon, the apple-touch-icon
  and the canonical are untouched.
- **Two pins were widened on purpose, and both got stronger.** One required every anchor on the
  page to be an in-page `#` link; it now names the **three exact addresses** one at a time — not a
  host pattern — and additionally requires them in order with no repeats, so a second GitHub
  account, twitter.com, a fourth link or any other mailto still fails. The other banned every
  `@handle` in visible copy; it now removes the brand's **own two names** before the ban runs, so
  any other handle still fails, and it gained a refusal for a linkedin.com or twitter.com
  **address** anywhere in the source.
- **A new pin** holds this card's whole shape shut: the two original sentences, exactly three
  links in a labelled nav, each one's href *and* visible handle *and* `target` *and* `rel`, no
  marks, the underline cue, the wrap rule, and every og tag — including that `og:image` is
  absolute, that its declared width and height are read back out of the PNG's own header, and
  that the file and its source HTML are on disk. **All 20 ways this could break were proved to
  fail** by mutating a disposable copy one at a time and restoring it byte-verified.

- **And the name itself is now pinned, not just LinkedIn** (peer review, 2026-08-31). The
  identity pin above refused a linkedin.com *address*, because that is how his name used to
  reach a page — it never refused the **name**, so the reviewer put it straight into visible
  footer copy and all 18 tests stayed green. A new pin closes that: it holds the owner's name as
  **salted digests of its parts**, hashes every run of letters the page could spell a name with,
  and refuses a match. It reads visible copy *and* the whole source, because an HTML comment is
  served to every visitor too. Because this repo **is** the public site, a pin that spelled the
  name out would have been the leak it guards against — so nothing readable is stored, and the
  regeneration recipe takes the parts on the command line and keeps none of them. Proved by
  writing a stand-in name into a disposable copy **15 ways** — in copy, shouted, in a credit
  line, surname first, hyphenated, particle split into two words, accented, joined, run inside a
  longer word, in an HTML comment, in a `title` attribute — and requiring the suite to go red
  each time; it did, 15 of 15, and the copy restored byte-verified. Four near-misses must stay
  green, and do. The honest limit is written where it is read, in the test itself: a name carries
  too little entropy for any published check to survive a determined dictionary attack by someone
  who already suspects the exact name, so no slow hash pretends otherwise. What it does buy is
  complete — the name is not in the repo, not in a grep, not in GitHub search, not in a search
  engine, and an accidental re-introduction now fails the suite the moment it lands.

*(The number moved 1.2.0 → **1.3.0**, not to 1.2.0 as the plan predicted: 1.2.0 had already been
spent by the search-engine card that shipped earlier the same day. Rule 27 moves the number once
per card, so this card takes the next one.)*

## [1.2.0] - 2026-08-31

**The site tells search engines what it is.** It had no `robots.txt` and no sitemap, so there was
nothing to hand Google Search Console and nothing telling a crawler what to leave alone — and the
three archived drafts were live at their own URLs, with `archive/b-the-product.html` a near-copy of
the homepage that could surface beside it in a result.

- **Canonical** — `index.html` now declares `https://workspace-labs.net/` as the one real address.
  Measured after shipping, and worth writing down accurately: the other addresses — `www`, plain
  `http`, and the `itsmk91.github.io` backup — **already 301 to the domain**, which GitHub set up
  with the CNAME on 30 August, so the canonical is not what consolidates those. What it does do is
  collapse the URL variants a redirect never sees: a link shared with tracking parameters
  (`?utm_source=…`) is a separate URL to a crawler, and this points every one of them at the clean
  address. It is also the backstop if a redirect is ever lost.
- **`robots.txt`** — invites every crawler to the site, names the sitemap by its full address, and
  turns them away from `/archive/`, so a rejected draft cannot surface in a search result beside
  the page it was rejected for.
- **`sitemap.xml`** — one entry, the home page, with a real `lastmod`. `changefreq` and `priority`
  are left out on purpose: Google states it ignores both, and a file that claims what it cannot
  deliver is worse than a short one.
- **One test was widened, and it got stronger rather than weaker.** The head-resource pin required
  every `<link href>` to be a local asset, which a canonical is not — it is a declaration the
  browser never fetches. It now reads each link's `rel` and exempts only the exact single
  `canonical`, so an outbound stylesheet, an outbound font, and a network link wearing
  `rel="stylesheet canonical"` all still fail. All three were re-proved to fail before shipping.
- **A new pin** holds the whole thing shut: exactly one canonical (a second makes a crawler discard
  both), a `robots.txt` that cannot quietly become `Disallow: /`, a sitemap that agrees with the
  canonical, and a `lastmod` that is a real date. All six of its guards were proved to bite by
  breaking them in a disposable copy.

## [1.1.0] - 2026-08-30

**The brand mark is the real logo now, and the tab has an icon.** The header used to draw an
11-pixel CSS square, and the browser tab showed the letter *W* in a grey box because the site
carried no icon at all — every other tab in his window showed its own. Both were placeholders
standing in for artwork that already existed.

- **Header** — the CSS square is replaced by `assets/logo-mark.png`, his own four-piece mark. It
  is the 1024px original trimmed of its empty margin and exported at 96px into a 30px slot, so it
  is served at 3x and stays sharp on a retina screen. Shrinking the raw file straight down was
  measured first and rejected: at 26px it reads as a smudge.
- **Tab icon** — `assets/favicon-32.png` plus a 180px `apple-touch-icon.png` for an iOS home
  screen, both linked from the head.
- **Two tests were widened, and both got stronger rather than weaker.** One counted every `<img>`
  on the page and expected exactly nine; it now counts the nine window pictures by their
  `assets/screens/` path and checks that *every* image on the page resolves to a real file,
  the logo included. The other read every `href` in the file and required an in-page anchor,
  which a `<link rel="icon">` in the head is not; it now reads anchors only, and separately
  requires each head resource to be a local asset that exists on disk. Both were re-proved to
  still refuse a returning picker link.

## [1.0.0] - 2026-08-30

*(The number stays 1.0.0 through this card's fix rounds — Rule 27 moves it once per card. The
peer review of 30 August sent two things back; both are folded into this entry below, under
**Fixed after peer review**.)*

**Concept B became the site.** The picker is gone, so the old way of opening this repo is gone —
that is what makes this a major bump rather than a feature. Opening `index.html` used to mean
choosing between three shapes; it now means opening the product page.

### Added
- `archive/` — the three shapes the site was chosen from, kept as the record of the decision:
  `a-the-line.html`, `b-the-product.html` (the accepted demo, exactly as it was accepted) and
  `c-the-bay.html`. Nothing on the site links to them, and `DESIGN.md` does not govern them.

### Changed
- `index.html` **is Concept B.** Same sections, same order, same copy; the title is now
  `WorkSpace Labs` rather than a concept label, and every asset URL lost its `../` when the page
  moved up one folder.
- **The window row is FLEX, not grid** — his call, 2026-08-30. Notes is the lead tile at double
  width, so five tiles fill six cells and the desktop row has no hole, and no tile may
  `flex-grow`. That last part is the point: a sixth window added later wraps onto its own row and
  **centres** as one ordinary cell instead of stretching across it, which is what a 3-column grid
  would have done. Measured with a sixth tile inserted into the live page — 332 px at 768 and
  331 px at 1440, one cell wide, equal gaps either side — then removed.
- **`DESIGN.md` is locked to the daylight palette.** The dark alternative belonged to a rejected
  shape and was deleted with it: no `#030303` ground, no dark token table, no "if you accept C".
  The Concept A per-agent chip table and the Concept C motion notes went too. Contrast was
  re-measured on the one live page off the **rendered pixel** — 243 runs of text across 360, 768
  and 1440 px, **0 WCAG AA failures**, tightest pair 4.65:1 — and the file now carries that table
  instead of a four-page claim.
- **The Knowledge caption drops its rotating counts.** `210 notes, 32 skills` became `the notes,
  the skills`; `28 rules` stays, and so does the rail's "Twenty-eight rules".
- **The test suite was retargeted to the live site.** The pins that guarded the picker and Concept
  C went with them; what replaced them holds this card shut — index.html is B and not a chooser,
  the gallery is flex with a lead tile, asset paths are root-relative, the archive exists, the
  design law has no dark ground, the caption has no rotating counts, and the version and its
  changelog entry cannot drift apart. 13 cases became 14.
- `README.md` describes the site rather than a set of demos, and states this page's real
  sharpness: the hero is capped at 1100 CSS px at every viewport measured, so pictures render at
  **2.09×** and never thin out. The old 1152 / 1.70× figures described Concept C and were removed
  from both documents.
- `ASSETS.md` points at the live page and the archive instead of `concepts/`, records that the
  orbital artwork is now used by the archived shapes only, and states plainly that this build
  **re-captured nothing** — the nine windows are the same bytes as before.

### Removed
- `index.html`'s picker: three concept cards, the "Was recommended" / "Your pick" badges, the
  skeleton thumbnails, and the "you picked B" section.
- The `concepts/` folder. Keeping a second live copy of B beside the site is how the two drift
  apart.

### Fixed after peer review

- **The two rejected Agents Labs captures no longer sit inside the publishable folder.** They
  had been replaced on the page but left under `.backup-pipeline/round5-105558/`, inside the
  root — so uploading the whole folder would have served the owner's name, Mac host and home
  path by URL even though nothing links them. Both files moved to the catalog, at
  `~/Desktop/Workspace/workspace-labs-website/.backup-pipeline/leaked-captures-20260830/`.
  `README.md` now documents `.backup-pipeline/` in the tree and says plainly that no rejected
  capture is kept under this root; `ASSETS.md` no longer claims the pair was "kept out of the
  tree" while it was in it. A new pin hashes **every** file in the tree, dot-folders included,
  rather than only the two live asset paths.
- **In-page jumps no longer land under the sticky header, and they move keyboard focus.**
  `scroll-padding-top` on `<html>` reserves the bar for every fragment jump — 78px from 720px
  up, 144px below it, where the header wraps to two rows and peaks at 128px. Measured before:
  at 360px the `board`, `agents`, `rules` and `windows` headings sat 27.21, 26.78, 61.37 and
  60.54px *inside* the bar, and `top` — which no scan had measured — 32.00px inside. All five
  targets now carry `tabindex="-1"`, so a jump moves focus as well as scroll: the skip link
  used to leave focus on `<body>`, and the next Tab fell past the whole story to the footer.

## [0.0.1] - 2026-08-30

The first thing in this repo. Three concept demos for the WorkSpace Labs journey site, so one
**shape** can be chosen by eye before anything is built for real.

### Added
- `index.html` — the picker: three concepts side by side, with the reason. A carries the muted
  *Was recommended* badge and B the accent *Your pick* badge, because B is what was chosen.
- `concepts/a-the-line.html` — **A, The Line.** Light. One vertical journey; the orbital art fills
  the first screen, then a hairline runs down the page with a node at each stop.
- `concepts/b-the-product.html` — **B, The Product.** Light. The Cursor / VS Code shape: headline
  hero, big product shot, a strip of real numbers, alternating feature blocks. Every button leads
  further into the story; none lead to a file.
- `concepts/c-the-bay.html` — **C, The Bay.** Near-black. Nine stations stepped through with arrows,
  dots, or the keyboard, one full screen at a time.
- `assets/screens/` — nine windows captured from the running app (v2.8.1) on the day, at
  **4500 x 3000**, with 2304-wide WebP copies for the pages. Nine web copies come to 858 KB.
- `assets/orbit/` — the orbital artwork at 2048 px, a phone view re-rendered from its own source
  HTML, and that source HTML so any later size is a re-render rather than a recapture.
- `assets/fonts/` — Plus Jakarta Sans, two subsets, bundled locally under SIL OFL 1.1. No page
  fetches a font from the network.
- `ASSETS.md`, `DESIGN.md`, `README.md` — where every picture came from, the identity the pages are
  locked to with measured contrast, and how to open the demos.

### Changed
- **The window pictures are now the real app.** The first set came from
  `~/Desktop/workspace labs design/`; tracing their text through the repo showed `overview.PNG`
  was a mockup (`galaxy-overview.mockup.html`) and most of the rest were a demo shell
  (`demos/redesign-shell/index.html`). Their rail read `Backloop · V2.6.0` against a live
  `BackLoop` and 2.8.1, and they showed five board columns where the app has six. Replaced by a
  fresh sweep of the running app over a debugging port, calling the app's own navigation
  functions — no mock data, no fixture.
- **Resolution went up about 3x**, from 1536 x 1024 to 4500 x 3000 masters.
- **The board was being cut in half.** Captured at 1536 logical width, the column div ran 27 px
  past the viewport and the COMPLETE column simply was not in the picture — on the hero image of
  a page about a six-column board. Measured the first clean width (1760) and captured everything
  at 1800.
- **Concept B's picture order changed**: Overview leads as the hero, the board follows in the
  section that is actually about the board, and Notes moved down into the gallery.
- **The four-column stat slab was replaced by the rail.** A number on its own teaches a stranger
  nothing — "28" means nothing until you know what a rule is — and four figures in a bordered white
  box is the template shape the craft book bans. The rail draws the road instead: Idea, Plan, Exam,
  Commit, Build, Accept, with the two crossings no agent can press marked in the accent. Vertical
  on a phone, horizontal from 900px, and the numbers survive in one line underneath. Both dot sizes
  share one 22px box so the plain stops and the gate stops sit on a single centre line and a single
  baseline — measured, after the first build left them 3px and 5px apart.
- **Settings was removed from the site.** It prints the catalog folder as
  `/Users/<name>/Desktop/Workspace`, against the card's *"WorkSpace Labs only — no person"*. Cut
  rather than cropped. Concept C went from ten stations to nine and the catalog became its closer.

### Fixed
Four real defects, each found by driving a browser rather than by reading the code:
- Concept C's station indicator never initialised — `go(0)` returned early on its own
  "already there" guard, so the dots carried no current state and Previous was never disabled.
- Concept C transitioned `visibility`, which kept outgoing stations visible for the whole
  animation: up to three bays were focusable and screen-reader-readable at once.
- Walking into the last station disabled the button holding focus, and the browser dropped focus to
  `<body>` before the handler could move it.
- Concept C cropped its own content on a phone: a grid track defaulted to `min-width: auto` and
  widened past the viewport inside an `overflow: hidden` shell, so the heading, the body copy and
  the station dots were all silently cut. The overflow test reported 0 px and was wrong; it now
  measures painted boxes instead of `scrollWidth`.

Also raised: text on a 12 % wash of its own colour measured 2.46–4.29:1, under WCAG AA. Deepened
inks now measure 5.27–6.86:1, and the small-caption colour inherited from the app (2.80:1 on the
ground) is no longer used for text.

**Peer-review round 1 (2026-08-30).** Five findings, all in the same 0.0.1 delivery:
- Concept C hid *AI can act. Human decide.* below 960 px, so phone and tablet visitors never saw
  the thesis on the first screen. The rail wraps now and the line keeps its own row.
- Concept C's brand link changed the URL to `#bay-1` and left the station where it was: the hash
  was only ever read once, at load. The URL and the visible station stay synchronised now, so the
  brand link, the skip link, the back button and a pasted deep link all mean the same thing.
- Concept C was the only page with no `<main>`; its journey floor is a real landmark now and
  carries the page's `h1`, like A and B.
- The picker's *Was recommended* badge composited to rgb(124,128,140) — 3.94:1 under 11 px white
  text, below AA. The wash is deeper; measured again off the rendered pixel.
- The picker, the README and the changelog still called A the recommendation and C a ten-station
  concept. Both were true when they were written and neither was true at delivery.

**Peer-review round 2 (2026-08-30).** Two documentation-and-tooling findings on the same 0.0.1
delivery (the pages themselves were not touched):
- `npm test` was `node --test tests/` — a directory handed to the runner. Node 18 and 20 walk it;
  **Node 22.14.0, the default `node` on this Mac, resolves it as a module and exits 1**, so the one
  documented command in the repo was red for the reviewer while green for the builder. It names
  `tests/journey-site.test.js` explicitly now and is green on 18, 20, 22.14 and 22.23.
  Node's own discovery — the other option — was measured and rejected: on Node 18 and 20 it walks
  the hidden `.backup-pipeline/` folder, runs the Rule 7 backup copy of this suite against a root
  that has no pages, and reports **8 passing plus 6 failing, exit 1**. The backup was renamed to
  `.bak` so a safety copy can never again be mistaken for a suite.
- The README still said the web copies are *"2x sharp at the largest size any concept displays
  them"* after `ASSETS.md` had been corrected. It now carries the same measured limit as ASSETS.md:
  2x through 1152 CSS px, and 1.70x for Concept C on a 2560 px viewport.
- `tests/journey-site.test.js` grew from six cases to eight — one per finding, each titled with the
  reviewer's own sentence.

**Peer-review round 3 (2026-08-30).** Three findings on the same 0.0.1 delivery. The number does
not move — a fix round keeps the one the card first shipped with (Rule 27):
- **The reserved header slot was off the phone screen in A and B.** The narrow header nav was a
  single row set to scroll sideways, so the dashed `+` ended at 394.41 px (A) and 419.72 px (B) on
  a 360 px screen — reachable only by an un-signposted drag, which is not *visible*. The phone nav
  is an even three-column grid now: every link and the slot are on screen at 360 and 390 px, the
  nav has 0 px of sideways scroll, and the page still has no horizontal overflow.
- **Concept C could not grow a station.** Its script captured `.bay` once at load, so a station
  inserted afterwards reached the page but never the counter, the dots, the keyboard sequence or
  the active state — while the exam ticked that it could. The list is read out of the page every
  time it matters now (`readBays`), a `refresh()` rebuilds the navigation only when the set really
  changed, `go()` re-reads before it moves, and a `MutationObserver` catches an insertion nobody
  navigated after. Measured at 360, 768 and 1440 px: 9 → 10 stations, 10 dots, `End` reaches 10,
  and the inserted station goes active by dot with the hash following it.
- **The picker advertised what the page does not have.** Its visible copy named download, waitlist,
  email and *"not published anywhere"* — the exact words version one is supposed to stay quiet
  about, and the exam bans them. That copy now describes the demos and the story only. The three
  concept pages were already clean and stay clean; the README's *Not in here* section is the
  handoff document, not the page, and keeps saying what is out of scope.
- The README's two claims that this round proved untrue — a *visible* slot, and an insertion test
  every block survived — now carry the measurement instead of the intention.
- `tests/journey-site.test.js` grew from eight cases to eleven, one per finding, each still titled
  with the reviewer's own sentence. All three were run against the pre-fix files first and fail
  there, so they pin the repair rather than describing it.

**Round 4 (peer review, 2026-08-30).**

- `assets/screens/agents-labs.webp` and `assets/screens/4k/agents-labs.png` were **re-captured**.
  The first pair carried the owner's user name and his Mac's host name in the terminal panes,
  eight times, on a page answered *"Customers or the public"* — and `ASSETS.md` wrongly recorded
  that window as checked and clean. The cause was tmux **scrollback**: the launch lines sat behind
  each pane and the app replays that history when it attaches, so a pane that reads clean in the
  terminal still painted the old lines inside the app. Cleared the scrollback, re-attached the
  viewer, and shot the window again at the same 1800 × 1200 @ 2.5. No crop, no blur.
- `README.md` and `ASSETS.md` now tell that story straight, including how to take the window again
  without repeating the mistake.
- `concepts/c-the-bay.html` — the header control reading **The end** asked for station 9 by number,
  so an inserted station stole the name and the button opened the wrong bay. It asks for the LAST
  station now, resolved against the live list exactly as the End key already was.
- `tests/journey-site.test.js` grew from eleven cases to thirteen. Both leaked image files are
  pinned by SHA-256, so neither can return unnoticed.

### Not included, deliberately
No download, pricing, install instructions, waitlist, email capture, login, dashboard, live data,
CMS, analytics, embedded app, framework, or dependency. No copy claims the app is unavailable,
closed, or private.
