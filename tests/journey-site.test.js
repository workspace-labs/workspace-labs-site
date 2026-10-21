// Regression pins for the WorkSpace Labs site. Each case title names the defect it holds shut,
// so a later edit that reopens one fails by the defect's own words rather than quietly.
//
// These read the delivered files. The browser walk that proves the page RENDERS lives in the
// delivery note; what a test can hold is that the repair is still IN the file a month from now.
//
// Retargeted 2026-08-30 when Concept B became the site: the picker and the two rejected shapes
// are gone from the live page, so the pins that guarded them went with them.

const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('node:fs');
const crypto = require('node:crypto');
const path   = require('node:path');

const ROOT  = path.join(__dirname, '..');
const read  = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const LIVE  = 'index.html';
const PRIVACY = 'privacy/index.html';

// The only three addresses this page may point at, in the order he answered them on
// t-1788110064810 (2026-08-30): GitHub, X, the brand inbox. Written out in full on purpose - a
// host pattern would quietly admit a second account or a different repo. Since v1.4.0 the inbox
// is the domain's own hello@ address; the Gmail behind it is never shown.
const OUTBOUND = [
  'https://github.com/workspace-labs',
  'https://x.com/workspacelabs91',
  'mailto:hello@workspace-labs.net',
];

// visible copy = what a reader sees: no comments, no stylesheet, no tag names
const visible = src => src
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ');

// WCAG 2.x relative luminance and contrast
const chan = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum  = ([r, g, b]) => 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
const contrast = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

// ── the site is the product page, not the chooser ────────────────────────────

test('the site still opens on a picker instead of the product page', () => {
  const src = read(LIVE);

  // B's own structure has to be what index.html serves
  assert.match(src, /<title>WorkSpace Labs<\/title>/, 'the title must be the product, not a concept label');
  for (const id of ['board', 'agents', 'rules', 'windows']) {
    assert.match(src, new RegExp(`id="${id}"`), `the live page must carry the #${id} section`);
  }
  assert.match(src, /<section class="hero wrap"/, 'the hero must be the first thing on the page');
  assert.match(src, /<ol class="rail__row">/, 'the six-stage rail must be under the hero');

  // and the chooser must be gone, in every form it took
  assert.doesNotMatch(src, /class="pick/, 'a picker card is back on the live page');
  assert.doesNotMatch(src, /badge--was|badge--pick/, 'the picker badges are back on the live page');
  assert.doesNotMatch(src, /Three shapes|pick one by eye|Was recommended|Your pick/i,
    'picker copy is back on the live page');
  assert.doesNotMatch(visible(src), /\bconcept\b|\bdemo\b|\bpicker\b/i,
    'the live page describes itself as a concept or a demo');

  // one page: no ANCHOR on it leads to another FILE, except the privacy policy (v1.4.0). (<link>
  // in the head is a resource, not navigation.) Since v1.3.0 the footer carries exactly three
  // outbound handles - the ones he answered on the card - and they are named here one address at
  // a time rather than by a host pattern, so a fourth link, a different account, or twitter.com
  // still fails this pin.
  const hrefs = [...src.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(m => m[1]);
  assert.ok(hrefs.length > 0, 'the page must have links');
  for (const h of hrefs) {
    assert.ok(h.startsWith('#') || h === 'privacy/' || OUTBOUND.includes(h),
      `the live page links out to a file: ${h}`);
  }
  // and no outbound address may appear twice or go missing - three links, three destinations
  const out = hrefs.filter(h => !h.startsWith('#') && h !== 'privacy/');
  assert.deepStrictEqual(out, OUTBOUND, 'the footer must carry exactly the three approved links, in order');
  // and every head resource the BROWSER FETCHES must be a local asset that really exists.
  // rel="canonical" is the one link that is never fetched: it declares which of the page's two
  // addresses is the real one, so a crawler credits one page instead of splitting it. It has to
  // be absolute to say anything at all, so it is read as a declaration and not as a resource.
  // Every OTHER rel keeps the local-asset rule that stops this page ever reaching the network -
  // an outbound stylesheet, font or script still fails here, and so does rel="stylesheet
  // canonical", because only the exact single rel is a declaration.
  for (const m of src.matchAll(/<link\b([^>]*)>/g)) {
    const attrs = m[1];
    const href = (attrs.match(/\bhref="([^"]+)"/) || [])[1];
    const rel = ((attrs.match(/\brel="([^"]+)"/) || [])[1] || '').trim().toLowerCase();
    if (!href) continue;
    if (rel === 'canonical') continue;
    assert.ok(href.startsWith('assets/'), `a head resource is not a local asset: ${href}`);
    assert.ok(fs.existsSync(path.join(ROOT, href)), `${href} is referenced but not on disk`);
  }
  assert.doesNotMatch(src, /(archive|concepts)\//, 'the live page points at the archive');
});

test('the site has no main-content landmark', () => {
  const src = read(LIVE);
  assert.strictEqual((src.match(/<main[\s>]/g) || []).length, 1, 'exactly one <main> landmark');
  assert.strictEqual((src.match(/<\/main>/g) || []).length, 1, 'the <main> landmark must close');
});

// ── the window row: his 2026-08-30 call ──────────────────────────────────────

test('the window row goes back to a grid and reopens the sixth-window hole', () => {
  const src = read(LIVE);
  const gal = /\.gal\{([^}]*)\}/.exec(src);
  assert.ok(gal, 'the .gal rule must be findable');

  assert.match(gal[1], /display:\s*flex/, '.gal must be flex — a grid is the defect this pins');
  assert.match(gal[1], /flex-wrap:\s*wrap/, '.gal must wrap');
  assert.match(gal[1], /justify-content:\s*center/,
    '.gal must centre its rows, or a lone sixth tile sits left instead of centred');
  assert.doesNotMatch(gal[1], /grid-template-columns/, '.gal is a grid again');

  // no breakpoint may quietly put the grid back
  for (const rule of src.match(/\.gal\s*\{[^}]*\}/g) || []) {
    assert.doesNotMatch(rule, /display:\s*grid/, `a rule sets .gal back to grid: ${rule}`);
  }

  // Notes is the lead tile, and it is the FIRST one
  const figs = [...read(LIVE).matchAll(/<figure( class="lead")?><img src="assets\/screens\/([a-z-]+)\.webp"/g)];
  assert.strictEqual(figs.length, 5, 'the gallery holds five window tiles');
  assert.strictEqual(figs[0][2], 'notes', 'Notes must be the first gallery tile');
  assert.ok(figs[0][1], 'Notes must carry the lead class');
  assert.ok(figs.slice(1).every(f => !f[1]), 'only Notes may be the lead tile');

  // tiles must never grow into leftover space — that is what stretches a lone sixth window
  const fig = /\.gal>figure\{([^}]*)\}/.exec(src);
  assert.ok(fig, 'the .gal>figure rule must be findable');
  assert.match(fig[1], /flex-grow:\s*0/, 'gallery tiles must not grow into leftover space');

  // and the lead really is double width on the desktop row: 2 cells + 1 gap
  const desktop = /@media\(min-width:1100px\)\{([\s\S]*?)\n\}/.exec(src);
  assert.ok(desktop, 'the 1100px breakpoint must lay the gallery out');
  assert.match(desktop[1], /\.gal>figure\{flex-basis:calc\(\(100% - var\(--gal-gap\) \* 2\) \/ 3\)\}/,
    'a desktop cell must be one third minus the gaps');
  assert.match(desktop[1], /\.gal>figure\.lead\{flex-basis:calc\(\(100% \* 2 - var\(--gal-gap\)\) \/ 3\)\}/,
    'the lead tile must be exactly two cells plus the gap between them');
});

// ── the move up one folder ───────────────────────────────────────────────────

test('the page loads its pictures from the concepts folder it no longer lives in', () => {
  const src = read(LIVE);
  const srcs = [...src.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  const screens = srcs.filter(s => s.startsWith('assets/screens/'));
  assert.strictEqual(screens.length, 9, 'nine window pictures on the page');
  for (const s of srcs) {
    assert.ok(s.startsWith('assets/'), `${s} is not a root-relative site path`);
    assert.ok(fs.existsSync(path.join(ROOT, s)), `${s} is referenced but not on disk`);
  }
  for (const url of [...src.matchAll(/url\('([^']+)'\)/g)].map(m => m[1])) {
    assert.ok(url.startsWith('assets/fonts/'), `${url} is not a root-relative font path`);
    assert.ok(fs.existsSync(path.join(ROOT, url)), `${url} is referenced but not on disk`);
  }
  assert.doesNotMatch(src, /\.\.\//, 'a parent-folder path survived the move to the site root');
});

test('the rejected shapes are lost instead of archived', () => {
  for (const f of ['archive/a-the-line.html', 'archive/b-the-product.html', 'archive/c-the-bay.html']) {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${f} must be kept as the record of the choice`);
  }
  assert.ok(!fs.existsSync(path.join(ROOT, 'concepts')),
    'the concepts folder must be gone — a second live copy of B is how the two drift apart');
});

// ── the design law ───────────────────────────────────────────────────────────

test('the design law still offers the dark ground the site never uses', () => {
  const d = read('DESIGN.md');
  assert.doesNotMatch(d, /#030303/, 'the dark page ground is back in the design law');
  assert.doesNotMatch(d, /If you accept C|Concept C only|Concept A/i,
    'the design law still reads as a comparison between shapes');
  assert.match(d, /Plus Jakarta Sans/, 'the locked face must still be named');
  // DESIGN.md NAMES Urbanist in order to forbid it, so the pin belongs on the page, not the law:
  // what must never happen is the rejected face being set on something.
  assert.doesNotMatch(read(LIVE), /font-family:[^;}]*Urbanist/i,
    'the face this project rejected is set on the live page');
  assert.match(read(LIVE), /font-family:'Plus Jakarta Sans'/, 'the locked face must be the one declared');

  // the tightest measured pair must still be the pair the page declares
  const src = read(LIVE);
  const tok = n => (new RegExp('--' + n + ':(#[0-9A-Fa-f]{6})').exec(src) || [])[1];
  const [ink, space] = [tok('accent-ink'), tok('space')];
  assert.ok(ink && space, 'the page must declare --accent-ink and --space as hex tokens');
  const ratio = contrast(hex(ink), hex(space));
  assert.ok(ratio >= 4.5,
    `the tightest measured pair (${ink} on ${space}) is ${ratio.toFixed(2)}:1 — under AA; re-measure before changing a colour`);
  assert.match(d, new RegExp(ratio.toFixed(2).replace('.', '\\.')),
    `DESIGN.md must state the measured ${ratio.toFixed(2)}:1 for that pair`);
});

// ── the copy decisions ───────────────────────────────────────────────────────

test('the Knowledge caption still names counts that rotate', () => {
  const src = read(LIVE);
  const cap = /<figcaption>Everything that governs the AI[^<]*<\/figcaption>/.exec(src);
  assert.ok(cap, 'the Knowledge caption must be findable');
  assert.doesNotMatch(cap[0], /\b210\b/, 'the rotating note count is back in the caption');
  assert.doesNotMatch(cap[0], /\b32\b/, 'the rotating skill count is back in the caption');
  assert.match(cap[0], /28 rules/, 'the caption must keep 28 rules');
  assert.match(src, /Twenty-eight rules/, 'the rail must keep its twenty-eight rules line');
});

test("the visible copy breaks the human's version-one content decision", () => {
  // Version one explains; it says nothing about getting the app, and it never implies the app is
  // unavailable, closed or private.
  const text = visible(read(LIVE));
  for (const word of ['download', 'waitlist', 'pricing', 'install', 'email',
                      'published', 'unavailable', 'closed', 'private']) {
    assert.doesNotMatch(text, new RegExp('\\b' + word, 'i'), `the site says "${word}" in visible copy`);
  }
  // WorkSpace Labs only — no person. The brand's OWN two handles are the only ones allowed
  // (his answer on t-1788110064810: handle-only, never the real name), so they are removed
  // before the ban runs and every OTHER @handle still fails exactly as it did.
  const stripped = text
    .split('@workspacelabs91').join('')
    .split('hello@workspace-labs.net').join('');
  assert.doesNotMatch(stripped, /@[a-z0-9_]{3,}/i, 'a handle appeared in visible copy');
  assert.doesNotMatch(text, /linkedin/i, 'LinkedIn appeared in visible copy');
  // A URL, not the word: naming LinkedIn in a comment about who reads the og tags is honest
  // documentation; an ADDRESS on either host is the thing that must never appear.
  assert.doesNotMatch(read(LIVE), /(?:https?:)?\/\/(?:[a-z0-9-]+\.)*(?:linkedin\.com|twitter\.com)/i,
    'a linkedin.com or twitter.com address is in the page source');
  assert.doesNotMatch(read(LIVE), /\/Users\//, 'a home path appeared in the page source');
});

test('the required reserved future header slot is hidden off the initial phone viewport', () => {
  const src = read(LIVE);
  assert.match(src, /<span class="nav__slot"/, 'the site must still reserve the future header slot');

  const phone = /@media \(max-width:719px\)\{([\s\S]*?)\n\}/.exec(src);
  assert.ok(phone, 'the 719px phone block must survive');
  const nav = /\.nav\{[^}]*\}/.exec(phone[1]);
  assert.ok(nav, 'the phone block must lay the nav out');

  // The slot sat at 419.72px on a 360px screen because the phone nav was a one-row scroller.
  assert.match(nav[0], /display\s*:\s*grid|flex-wrap\s*:\s*wrap/,
    'the phone nav must lay all its items out, not queue them in one row');
  assert.doesNotMatch(nav[0], /flex-wrap\s*:\s*nowrap/, 'a nowrap row pushes the slot off screen');
  assert.doesNotMatch(nav[0], /overflow-x\s*:\s*(auto|scroll)/,
    'a sideways scroller hides the slot behind an un-signposted drag');
  for (const rule of phone[1].match(/\.nav__slot\{[^}]*\}/g) || []) {
    assert.doesNotMatch(rule, /display\s*:\s*none|visibility\s*:\s*hidden/,
      `a phone rule hides the reserved slot: ${rule}`);
  }
});

// ── the pictures ─────────────────────────────────────────────────────────────

test('an image exposes the person the card explicitly says not to name', () => {
  // The Agents Labs capture carried the owner's name and machine name in its terminal panes,
  // on a page answered "Customers or the public". These are the exact bytes that leaked; if
  // either file ever comes back, this fails rather than shipping his name to strangers again.
  const LEAKED = {
    'assets/screens/agents-labs.webp':    '47e6c76bb11a6458bc05ccaee690621abbc7a7e5117ae879b45bb802b44b4318',
    'assets/screens/4k/agents-labs.png':  '4505e85a6b6caa82203356b3bab6e512bfdb2f9988a69d6fe2926afa87c847e7',
  };
  const crypto = require('node:crypto');
  for (const [f, bad] of Object.entries(LEAKED)) {
    const p = path.join(ROOT, f);
    assert.ok(fs.existsSync(p), `${f} is missing — the site references it`);
    const sha = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
    assert.notStrictEqual(sha, bad, `${f} is the capture that showed the owner's name and host`);
  }
  assert.doesNotMatch(read('ASSETS.md'), /Agents Labs was checked for the same problem and is clean/,
    'ASSETS.md still repeats the claim that was false');
});

test('the handoff documents are not true to the final state', () => {
  // Every size a document states must be a size that is really on disk.
  const dir = path.join(ROOT, 'assets/screens/4k');
  const masters = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  assert.strictEqual(masters.length, 9, 'nine masters, one per window on the site');

  // PNG carries its size at a fixed offset in the IHDR chunk.
  const size = f => {
    const b = fs.readFileSync(path.join(dir, f));
    return [b.readUInt32BE(16), b.readUInt32BE(20)];
  };
  const claimed = /the same nine at (\d+) x (\d+)/.exec(read('README.md'));
  assert.ok(claimed, 'the README must state the master size');
  for (const f of masters) {
    const [w, h] = size(f);
    assert.deepStrictEqual([w, h], [+claimed[1], +claimed[2]],
      `${f} is ${w} x ${h} on disk; the README says ${claimed[1]} x ${claimed[2]}`);
  }
  // nine web copies too, one per master
  const web = fs.readdirSync(path.join(ROOT, 'assets/screens')).filter(f => f.endsWith('.webp'));
  assert.strictEqual(web.length, 9, 'nine web-sized copies, one per master');
});

test("the README overstates this page's screen-image sharpness", () => {
  const readme = read('README.md');
  const assets = read('ASSETS.md');

  // The old figures belonged to the picker era: 2x stopped at 1152 CSS px and Concept C thinned
  // to 1.70x on a wide screen. Neither describes THIS page, whose hero is capped at 1100px, so
  // the widest any picture paints is 1100 from a 2304-wide file at every viewport measured.
  assert.doesNotMatch(readme, /2x sharp at the largest size/i, 'the old blanket sharpness claim is back');
  for (const [name, src] of [['README.md', readme], ['ASSETS.md', assets]]) {
    assert.doesNotMatch(src, /\b1\.70\b/, `${name} still states the archived Concept C figure as the site's`);
    assert.match(src, /1100/, `${name} must state the hero cap that decides the real figure`);
    assert.match(src, /2\.09/, `${name} must state the measured sharpness of the live page`);
  }
  // and the page must really cap the hero, or that figure is fiction
  assert.match(read(LIVE), /\.hero__shot\{[^}]*max-width:1100px/, 'the hero must stay capped at 1100px');
});

// ── the tools around it ──────────────────────────────────────────────────────

test('the one documented test command is red on this Mac current default Node', () => {
  const pkg = JSON.parse(read('package.json'));
  const script = pkg.scripts && pkg.scripts.test;
  assert.ok(script, 'package.json must document a test command');

  // The defect: `node --test tests/` hands the runner a DIRECTORY. Node 18 and 20 walk it;
  // Node 22 — the default node in his login shell — resolves it as a module and exits 1. So
  // every positional the command passes has to be a file that really exists.
  //
  // Discovery (a bare `node --test`) was measured and rejected: Node 18 and 20 walk the hidden
  // .backup-pipeline/ folder and run a safety copy of this suite against a root with no pages.
  const parts = script.split(/\s+/);
  assert.strictEqual(parts[0], 'node', 'the runner must be node itself');
  assert.ok(parts.includes('--test'), 'the runner must carry --test');

  const positionals = parts.slice(parts.indexOf('--test') + 1).filter(p => !p.startsWith('-'));
  assert.ok(positionals.length > 0, 'the command must name what it runs, not rely on discovery');
  for (const p of positionals) {
    const target = path.join(ROOT, p);
    assert.ok(fs.existsSync(target), `${p} is named by npm test but is not on disk`);
    assert.ok(fs.statSync(target).isFile(),
      `${p} is a directory — Node 22 resolves a directory positional as a module and exits 1`);
  }
  assert.ok(positionals.some(p => p.replace(/^\.\//, '') === 'tests/journey-site.test.js'),
    'npm test must run this suite');
});

test('the shipped version and its changelog entry drift apart', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/, 'the version must be an honest major.minor.patch');
  assert.strictEqual(pkg.private, true, 'this repo stays private');
  assert.ok(!pkg.dependencies && !pkg.devDependencies, 'the site takes no dependency');

  const changelog = read('CHANGELOG.md');
  assert.match(changelog, new RegExp('## \\[' + pkg.version.replace(/\./g, '\\.') + '\\] - \\d{4}-\\d{2}-\\d{2}'),
    `CHANGELOG.md has no dated entry for the shipped version ${pkg.version}`);
});

// ── the two the peer review of 30 August 2026 sent back ──────────────────────

test('Phone in-page navigation lands behind the two-row sticky header', () => {
  const live = read(LIVE);

  // Measured in a real browser on this page: the sticky bar is 62px from 720px up, and wraps
  // to two rows below that, peaking at 128px between 584 and 719. A #hash jump reserving less
  // than the bar lands the heading UNDER it - at 360 the four section headings sat 27.21,
  // 26.78, 61.37 and 60.54px inside the bar, and #top, which nothing had measured, 32.00px in.
  const base = /html\{scroll-padding-top:(\d+)px\}/.exec(live);
  assert.ok(base, 'every fragment jump must reserve the sticky header');
  assert.ok(+base[1] >= 62, `a jump reserves ${base[1]}px; the one-row bar is 62px tall`);

  const phone = /@media \(max-width:719px\)\{[\s\S]*?html\{scroll-padding-top:(\d+)px\}/.exec(live);
  assert.ok(phone, 'the wrapped phone header needs its own taller reserve below 720px');
  assert.ok(+phone[1] >= 128, `the phone jump reserves ${phone[1]}px; the wrapped bar is 128px`);

  // and a jump has to move FOCUS, not only the scroll: the skip link left focus on <body>,
  // so the next Tab fell past the entire story to "Back to the top" in the footer.
  const targets = [...new Set([...live.matchAll(/href="#([\w-]+)"/g)].map(m => m[1]))];
  assert.ok(targets.length >= 5, 'the page must still carry its five in-page jump targets');
  for (const id of targets) {
    const tag = new RegExp(`<[a-z]+[^>]*\\bid="${id}"[^>]*>`).exec(live);
    assert.ok(tag, `#${id} is linked from the page but no element carries that id`);
    assert.match(tag[0], /tabindex="-1"/,
      `#${id} is a jump target but is not focusable - the jump leaves focus on <body>`);
  }
});

test('The folder described as publishable still contains the exact two known-bad Agents Labs captures', () => {
  // The bytes that showed the owner's name, Mac host and home path were replaced ON THE PAGE
  // but left under .backup-pipeline/round5-105558/ INSIDE the publishable root, where a
  // whole-folder upload serves them by URL though no page links them. The earlier pin only
  // watched the two live asset paths; this one watches the whole tree, dot-folders included.
  const crypto = require('node:crypto');
  const LEAKED = new Set([
    '47e6c76bb11a6458bc05ccaee690621abbc7a7e5117ae879b45bb802b44b4318',
    '4505e85a6b6caa82203356b3bab6e512bfdb2f9988a69d6fe2926afa87c847e7',
  ]);
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : (e.isFile() ? [p] : []);
  });
  for (const f of walk(ROOT)) {
    const sha = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
    assert.ok(!LEAKED.has(sha),
      `${path.relative(ROOT, f)} is a capture that showed the owner's name and Mac host`);
  }
  assert.doesNotMatch(read('ASSETS.md'), /kept out of\s+the tree in `\.backup-pipeline\/`/,
    'ASSETS.md still says the pair is out of the tree while it sits inside the root');
});

// ── found by search, and found ONCE ──────────────────────────────────────────

test('the site is invisible to search engines and its two addresses compete for the same credit', () => {
  const live = read(LIVE);
  const HOME = 'https://workspace-labs.net/';

  // 1. The canonical. The other addresses already 301 here, so this is not what consolidates
  //    them - it collapses the variants a redirect never sees (a shared link carrying
  //    ?utm_source=... is a separate URL to a crawler). Exactly one: a second canonical is not
  //    twice as strong, it makes a crawler discard both.
  const canon = [...live.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/gi)];
  assert.strictEqual(canon.length, 1, `the page must carry exactly one canonical, found ${canon.length}`);
  assert.match(canon[0][0], new RegExp(`href="${HOME}"`),
    `the canonical must name the live domain: ${canon[0][0]}`);

  // 2. robots.txt — it must INVITE crawlers, not shut them out. A stray blanket "Disallow: /"
  //    is the one line that would quietly delist the whole site.
  const robots = read('robots.txt');
  const lines = robots.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  assert.ok(lines.some(l => /^user-agent:\s*\*$/i.test(l)), 'robots.txt must address every crawler');
  assert.ok(!lines.some(l => /^disallow:\s*\/$/i.test(l)),
    'robots.txt shuts every crawler out of the whole site');
  assert.ok(lines.some(l => /^allow:\s*\/$/i.test(l)), 'robots.txt must allow the site itself');

  // The rejected drafts are live at their own URLs and one is a near-copy of this page.
  assert.ok(lines.some(l => /^disallow:\s*\/archive\/$/i.test(l)),
    'the archived drafts are crawlable and compete with the homepage');

  // ...and the rule has to TAKE EFFECT, not merely be present. Two structural facts decide
  // that, and the first version of this file got both wrong while this test still passed:
  //   (a) the group must be CONTIGUOUS. A blank line after "User-agent: *" ends the group for
  //       a strict first-match parser (python's own urllib.robotparser is one), orphaning
  //       every rule beneath it - measured: the archive read as crawlable.
  //   (b) Disallow must stand BEFORE Allow. Google picks the longest matching path whatever
  //       the order, but a first-match parser takes whichever it reads first, and "Allow: /"
  //       matches everything.
  const orig = robots.split('\n').map(l => l.trim());
  const rule = orig.map(l => l.replace(/#.*$/, '').trim());
  const ua = rule.findIndex(l => /^user-agent:\s*\*$/i.test(l));
  assert.ok(ua >= 0, 'robots.txt must open a group for every crawler');
  const dis = rule.findIndex((l, i) => i > ua && /^disallow:\s*\/archive\/$/i.test(l));
  const alw = rule.findIndex((l, i) => i > ua && /^allow:\s*\/$/i.test(l));
  assert.ok(dis > ua && alw > ua, 'both rules must sit under the user-agent line');
  for (let i = ua + 1; i < Math.max(dis, alw); i++) {
    assert.notStrictEqual(orig[i], '',
      `a blank line at robots.txt line ${i + 1} ends the group and orphans the rules below it`);
  }
  assert.ok(dis < alw,
    'Disallow: /archive/ must precede Allow: / or a first-match crawler reads the archive');

  // 3. The sitemap has to exist, be reachable from robots.txt, and agree with the canonical.
  //    A sitemap naming one address while the canonical names another is the silent version
  //    of the very split this whole case exists to close.
  assert.ok(lines.some(l => l.toLowerCase() === `sitemap: ${HOME}sitemap.xml`),
    'robots.txt must point at the sitemap by its full address');

  const sitemap = read('sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  assert.deepStrictEqual(locs, [HOME, `${HOME}privacy/`],
    `the sitemap must list the home page and its privacy policy, and nothing else: ${locs}`);
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
    'the sitemap must declare the sitemaps.org namespace or Google rejects the file');

  // A lastmod must be a real calendar date, not a placeholder that says "never touched" - on
  // every entry, not only the first.
  const mods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
  assert.strictEqual(mods.length, locs.length, 'every sitemap entry must carry a lastmod');
  for (const mod of mods) {
    assert.match(mod, /^\d{4}-\d{2}-\d{2}$/, `lastmod must be a plain YYYY-MM-DD date: ${mod}`);
    assert.ok(!Number.isNaN(Date.parse(mod)), `lastmod is not a real date: ${mod}`);
  }
  // and the privacy page must name the same address the sitemap does, or the two split again
  assert.match(read(PRIVACY), new RegExp(`<link rel="canonical" href="${HOME}privacy/">`),
    'the privacy page must declare the address the sitemap lists');

  // 4. Nothing the sitemap invites in may be a page robots.txt turns away.
  for (const l of locs) {
    assert.ok(!l.includes('/archive/'), `the sitemap invites a crawler to a page robots.txt blocks: ${l}`);
  }
});

// ── the footer's three handles, and the picture a shared link paints ──────────

test('the footer loses a handle, points somewhere else, or hands the tab to the site it opens', () => {
  const src = read(LIVE);
  const HOME = 'https://workspace-labs.net/';

  // The two sentences that were already there must survive untouched. He asked for links UNDER
  // the existing line, not instead of it.
  assert.match(src, /<span>WorkSpace Labs<\/span>/, 'the footer lost its brand line');
  assert.match(src, /<span>AI can act\. Human decide\.<\/span>/, 'the footer lost the tagline');

  // Exactly three anchors, in a labelled nav, in his order, each with its visible handle.
  const nav = /<nav class="foot__links"([\s\S]*?)<\/nav>/.exec(src);
  assert.ok(nav, 'the footer must carry the handle nav');
  assert.match(nav[0], /aria-label="[^"]+"/, 'the footer nav needs a label, or a screen reader hears two unnamed navs');

  const links = [...nav[1].matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)]
    .map(m => ({ attrs: m[1], text: m[2].trim() }));
  assert.strictEqual(links.length, 3, `the footer must carry exactly three links, found ${links.length}`);

  const want = [
    ['https://github.com/workspace-labs', 'github.com/workspace-labs'],
    ['https://x.com/workspacelabs91',     '@workspacelabs91'],
    ['mailto:hello@workspace-labs.net',   'hello@workspace-labs.net'],
  ];
  links.forEach((a, i) => {
    const [href, text] = want[i];
    assert.match(a.attrs, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
      `footer link ${i + 1} must point at ${href}`);
    assert.strictEqual(a.text, text, `footer link ${i + 1} must read as its handle, not a label`);
    // A new tab, and the opened page must not get a handle back on this one.
    assert.match(a.attrs, /target="_blank"/, `footer link ${i + 1} must open in a new tab`);
    assert.match(a.attrs, /rel="noopener noreferrer"/,
      `footer link ${i + 1} must carry rel="noopener noreferrer"`);
  });
  // The handles are the whole point: no icon, no word-label standing in for them.
  // No marks. (No word-LABEL is already proved above: each link's text must equal its handle
  // exactly, so "GitHub" cannot stand in for github.com/workspace-labs.)
  assert.doesNotMatch(nav[0], /<svg|<img|<picture|<i\b/i,
    'the footer links must be quiet handle text - no GitHub or X marks');

  // Identity: the brand, never the person. A LinkedIn ADDRESS is what must never appear -
  // he asked for handle-only, and his LinkedIn carries his real name. (The visible-copy pin
  // separately refuses the word itself anywhere a reader can see it.)
  assert.doesNotMatch(src, /(?:https?:)?\/\/(?:[a-z0-9-]+\.)*linkedin\.com/i,
    'a LinkedIn address is back on the page');

  // The reader must be able to SEE the link, not only its colour: hover and keyboard focus
  // both underline. Colour alone would leave #3E5BFF and #4A5478 telling nobody apart.
  assert.match(src, /\.foot__links a:hover,\.foot__links a:focus-visible\{[^}]*text-decoration:underline/,
    'the footer links must underline on hover and focus, not rely on colour alone');
  // They wrap. A single row queued the third address past a 360px screen edge.
  assert.match(src, /\.foot__links\{[^}]*flex-wrap:wrap/, 'the footer links must wrap on a phone');

  // The picture a shared link paints. og:image must be ABSOLUTE - a crawler has no page to
  // resolve a relative path against - and the file it names must really be on disk.
  const meta = (prop, kind = 'property') =>
    (src.match(new RegExp(`<meta ${kind}="${prop}" content="([^"]*)"`)) || [])[1];
  assert.strictEqual(meta('og:title'), 'WorkSpace Labs', 'og:title must be the product');
  assert.strictEqual(meta('og:type'), 'website', 'og:type must be website');
  assert.strictEqual(meta('og:url'), HOME, 'og:url must be the canonical address');
  assert.strictEqual(meta('og:description'),
    (src.match(/<meta name="description" content="([^"]*)"/) || [])[1],
    'og:description must be the page\'s own description, not a second story');
  assert.strictEqual(meta('twitter:card', 'name'), 'summary_large_image',
    'twitter:card must be summary_large_image or X paints a thumbnail');

  const img = meta('og:image');
  assert.strictEqual(img, `${HOME}assets/og-card.png`, 'og:image must be the absolute card URL');
  assert.strictEqual(meta('twitter:image', 'name'), img, 'twitter:image must be the same picture');
  const rel = img.slice(HOME.length);
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `${rel} is declared to crawlers but not on disk`);
  assert.ok(fs.existsSync(path.join(ROOT, 'assets/og-card.source.html')),
    'the card must keep the source HTML it is remade from');

  // The declared size has to be the file's real size, or a timeline reserves the wrong box.
  const png = fs.readFileSync(path.join(ROOT, rel));
  assert.strictEqual(png.toString('hex', 12, 16), '49484452', 'og-card.png must be a real PNG');
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
  assert.strictEqual(Number(meta('og:image:width')), w, `og:image:width must be the file's ${w}`);
  assert.strictEqual(Number(meta('og:image:height')), h, `og:image:height must be the file's ${h}`);
  assert.strictEqual(w / h > 1.9 && w / h < 1.92, true,
    `the card must stay at the 1.91:1 every timeline crops to, measured ${(w / h).toFixed(3)}`);
});

// ── the person behind the brand stays off the page ───────────────────────────
//
// The footer pin above refuses a LinkedIn ADDRESS, which is how his name used to reach a page.
// It never refused the name itself, so v1.3.0 shipped with the name insertable into visible
// copy and the suite still green (peer review, 2026-08-31).
//
// This repo IS the public site, so a pin that spells the name out would BE the leak it guards
// against. The name is held here as salted digests of its parts; the page's own letter runs are
// hashed the same way and compared. Nothing below can be read back into a name.
//
// Regenerate after a name change - the parts are typed once on the command line and stored
// nowhere:  printf '%s' "<the salt> <part>" | shasum -a 256 | cut -c1-32
//
// Honest limit, so nobody trusts this further than it goes: a name carries too little entropy
// for ANY published check to survive a determined dictionary attack by someone who already
// suspects the exact name - no slow hash fixes that, so none is pretended here. What it does
// buy is complete: the name is not in the repo, not in a grep, not in GitHub search, and not in
// a search engine, and an accidental re-introduction fails the suite the moment it lands.
const NAME_SALT = 'workspace-labs-site/no-real-name/2026-08-31';
const NAME_LENS = [6, 8, 16];
const NAME_DIGESTS = new Set([
  '80edcd1fabe75bb66af318dfff4b9f7f',
  '812d9f84e24ed70e4758ac08c028c0a8',
  '66d10c4ffdbb0fbbe621d8270cc93b47',
  'c6da7251d728b48d5ba0398e11b47063',
]);
const nameHash = s =>
  crypto.createHash('sha256').update(NAME_SALT + ' ' + s).digest('hex').slice(0, 32);

// Every run of letters the page could spell a name with, at the guarded lengths: whole words,
// windows inside a longer word ("postedbySomeone"), and a short particle rejoined to what
// follows, because "Al Moonwhistle" and "Van Doren" arrive as two words and are one name.
function letterRuns(text) {
  const words = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const runs = new Set();
  const take = w => {
    for (const k of NAME_LENS) for (let i = 0; i + k <= w.length; i++) runs.add(w.slice(i, i + k));
  };
  words.forEach((w, i) => {
    take(w);
    if (w.length <= 3 && i + 1 < words.length) {
      take(w + words[i + 1]);
      if (words[i + 1].length <= 3 && i + 2 < words.length) take(w + words[i + 1] + words[i + 2]);
    }
  });
  return runs;
}

test('a future edit could expose the name while the privacy test stays green', () => {
  // The recommendation names visible copy; the whole source is walked with it because an HTML
  // comment is served to every visitor too, and a name in one is just as published. Both pages.
  for (const page of [LIVE, PRIVACY]) {
    const src = read(page);
    for (const [where, text] of [['visible copy', visible(src)], ['the page source', src]]) {
      for (const run of letterRuns(text)) {
        assert.ok(!NAME_DIGESTS.has(nameHash(run)),
          `the owner's real name is in ${where} of ${page} - this site is handle-only`);
      }
    }
  }

  // The machinery has to be able to FAIL, or a broken tokenizer would wave through a page that
  // names him and this case would prove only that it agrees with itself. Stand-in names with
  // known digests carry the fixtures instead - one per length the table guards - so the reach
  // of the check is proved WITHOUT this file spelling the real one, and the fixtures cannot
  // quietly be built out of whatever the tokenizer already happens to do.
  const C6 = 'zzcnry', C8 = 'zzcanary', C16 = 'zzcanaryqqfamily';
  const hits = (text, canary) =>
    [...letterRuns(text)].some(r => nameHash(r) === nameHash(canary));

  // every way a name actually reaches a page, rehearsed on the stand-in
  for (const [shape, written, canary] of [
    ['a name in ordinary copy',        'A site by Zzcanary.',              C8],
    ['a name shouted',                 'BUILT BY ZZCANARY',                C8],
    ['a name in a credit line',        '(c) 2026 Zzcanary Qqfamily',       C8],
    ['a surname listed first',         'Qqfamily, Zzcanary',               C8],
    ['a particle split off the name',  'Zz Canary',                        C8],
    ['a hyphen between the parts',     'Zzcanary-Qqfamily',                C8],
    ['a name run into a longer word',  'postedbyzzcanaryx',                C8],
    ['a name spelled with an accent',  'Zzćanary',                   C8],
    ['a name inside an address',       'e-mail zzcanary@example.com',      C8],
    ['a name inside markup',           '<span>Zzcanary</span>',            C8],
    ['a name in an attribute',         '<span title="Zzcanary">x</span>',  C8],
    ['both parts joined up',           'posted by zzcanaryqqfamily today', C16],
    ['a short form of the name',       'the zzcnry byline',                C6],
  ]) {
    assert.ok(hits(written, canary), `the name check misses ${shape}: "${written}"`);
  }

  // and it must not fire on what merely looks close, or it is noise nobody will keep
  for (const clean of ['zzcanar', 'azcanary', 'xzcanaryqqfamily',
                       'The board hands every decision back to you.']) {
    for (const canary of [C6, C8, C16]) {
      assert.ok(!hits(clean, canary), `the name check fires on "${clean}", which carries no name`);
    }
  }
});

// ── what Apple checks before it lets the company publish an app ───────────────
//
// Apple Developer enrollment looks for a real site on the company's own domain, a way to contact
// the company, and a privacy policy address for every app. v1.4.0 put all three in the footer.

test('Apple finds no contact address, no copyright line, or no privacy policy on the site', () => {
  const live = read(LIVE);
  const foot = /<footer>[\s\S]*<\/footer>/.exec(live);
  assert.ok(foot, 'the home page must have a footer');

  // 1. The three things in the footer, each one a reader can see.
  assert.match(foot[0], /<a href="mailto:hello@workspace-labs\.net"[^>]*>hello@workspace-labs\.net<\/a>/,
    'the footer must show hello@workspace-labs.net as a mailto link');
  assert.match(foot[0], /<span>© 2026 WorkSpace Labs<\/span>/, 'the footer must carry © 2026 WorkSpace Labs');
  assert.match(foot[0], /<a href="privacy\/">Privacy<\/a>/, 'the footer must link to the privacy policy as "Privacy"');

  // 2. The inbox behind hello@ is a Gmail account, and it is never shown - on either page.
  for (const page of [LIVE, PRIVACY]) {
    assert.ok(fs.existsSync(path.join(ROOT, page)), `${page} must exist - /privacy/ is the address Apple is given`);
    assert.doesNotMatch(read(page), /gmail/i, `${page} shows the Gmail inbox behind hello@`);
  }

  // 3. The policy covers what the task listed, and says when it was last changed.
  const pol = read(PRIVACY);
  const text = visible(pol);
  for (const heading of ['Who we are', 'What this website collects', 'Who else sees anything', 'Deleting your data']) {
    assert.match(pol, new RegExp(`<h2>${heading}</h2>`), `the privacy policy lost its "${heading}" section`);
  }
  assert.match(pol, /<a href="mailto:hello@workspace-labs\.net">/, 'the policy must give the contact address');
  const [, updated] = pol.match(/Last updated: <time datetime="(\d{4}-\d{2}-\d{2})">/) || [];
  assert.ok(updated && !Number.isNaN(Date.parse(updated)), 'the policy must carry a real "Last updated" date');
  assert.doesNotMatch(pol, /\bTODO\b/, 'an unanswered TODO would be published on the privacy policy');
  // No AI model or vendor is named in the new text (the task's rule).
  assert.doesNotMatch(text + foot[0],
    /\b(Claude|Anthropic|Codex|OpenAI|ChatGPT|GPT|Grok|Gemini|Kimi|Devin|Llama|Opus|Sonnet)\b/,
    'the privacy policy or the footer names an AI model');

  // 4. Same look as the home page: the same tokens, the same header, the same footer - only the
  //    paths differ, because the policy lives one folder down.
  const block = (src, re) => (re.exec(src) || [])[0];
  assert.strictEqual(block(pol, /:root\{[^}]*\}/), block(live, /:root\{[^}]*\}/),
    'the privacy page tokens drifted from the home page');
  const hdr = src => block(src, /<header class="hdr">[\s\S]*?<\/header>/);
  assert.strictEqual(hdr(pol), hdr(live)
    .replace('href="#top"', 'href="../"').split('href="#').join('href="../#').split('src="assets/').join('src="../assets/'),
    'the privacy page header is not the home page header');
  assert.strictEqual(block(pol, /<footer>[\s\S]*<\/footer>/).replace('<a href="./" aria-current="page">', '<a href="privacy/">'),
    foot[0], 'the privacy page footer is not the home page footer');

  // 5. Every local file the policy loads is really there, one folder up.
  const refs = [...pol.matchAll(/(?:src|href)="(\.\.\/[^"#]+)"|url\('(\.\.\/[^']+)'\)/g)].map(m => m[1] || m[2]);
  assert.ok(refs.some(r => r.includes('fonts/')) && refs.some(r => r.includes('logo-mark')),
    'the privacy page must load the bundled font and the mark');
  for (const r of refs) {
    assert.ok(fs.existsSync(path.join(ROOT, 'privacy', r)), `${r} is referenced by the privacy page but not on disk`);
  }
});
