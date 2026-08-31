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
const path   = require('node:path');

const ROOT  = path.join(__dirname, '..');
const read  = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const LIVE  = 'index.html';

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

  // one page: no ANCHOR on it leads away. (<link> in the head is a resource, not navigation.)
  const hrefs = [...src.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(m => m[1]);
  assert.ok(hrefs.length > 0, 'the page must have links');
  for (const h of hrefs) {
    assert.ok(h.startsWith('#'), `the live page links out to a file: ${h}`);
  }
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
  // WorkSpace Labs only — no person, no handle
  assert.doesNotMatch(text, /@[a-z0-9_]{3,}/i, 'a handle appeared in visible copy');
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

  // 3. The sitemap has to exist, be reachable from robots.txt, and agree with the canonical.
  //    A sitemap naming one address while the canonical names another is the silent version
  //    of the very split this whole case exists to close.
  assert.ok(lines.some(l => l.toLowerCase() === `sitemap: ${HOME}sitemap.xml`),
    'robots.txt must point at the sitemap by its full address');

  const sitemap = read('sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  assert.deepStrictEqual(locs, [HOME], `the sitemap must list the home page and nothing else: ${locs}`);
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
    'the sitemap must declare the sitemaps.org namespace or Google rejects the file');

  // A lastmod must be a real calendar date, not a placeholder that says "never touched".
  const [, mod] = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/) || [];
  assert.ok(mod, 'the sitemap entry must carry a lastmod');
  assert.match(mod, /^\d{4}-\d{2}-\d{2}$/, `lastmod must be a plain YYYY-MM-DD date: ${mod}`);
  assert.ok(!Number.isNaN(Date.parse(mod)), `lastmod is not a real date: ${mod}`);

  // 4. Nothing the sitemap invites in may be a page robots.txt turns away.
  for (const l of locs) {
    assert.ok(!l.includes('/archive/'), `the sitemap invites a crawler to a page robots.txt blocks: ${l}`);
  }
});
