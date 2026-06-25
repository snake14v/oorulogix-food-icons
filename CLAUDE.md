# CLAUDE.md — working with this asset pack

A guide for an AI/Claude session that needs to **use** or **extend** this pack. Read this first.

## What this is
An open-source pack of original **flat-cartoon SVG food + restaurant-POS icons** (`oorulogix-food-icons`, MIT). One coherent visual language across drinks, food, kitchen dishes, POS UI, and the Orbéan coffee menu. ~380+ icons and growing.

## Layout
```
food-assets/
├── <theme>/<category>/<name>.svg      every asset is exactly theme/category/file (3 levels)
├── catalog.json     machine index — [{id, theme, category, file, name}]  ← START HERE
├── CATALOG.md       same, human-readable, grouped
├── gallery.html     open in a browser to see everything labelled
├── build-catalog.js regenerates catalog.json / CATALOG.md / gallery.html / README.md
├── banner.svg  README.md  LICENSE  .gitattributes
```
Themes: `coffee` `seasonal` `sandwich` `pos` `freezer` `orbean` `bakery` `burger` `pizza`.

## Finding / selecting an asset (the fast path)
**Don't grep the SVGs.** Use `catalog.json`:
```js
const cat = require('./catalog.json');
cat.assets.find(a => a.name === 'Whole Pizza');         // by label
cat.assets.filter(a => a.theme === 'orbean');           // by theme
cat.assets.filter(a => a.category === 'syrups');        // by category
```
Each entry has `file` (path relative to pack root) and `name` (display label).

## Using an asset
- **Static:** `<img src="food-assets/burger/base/bun-top.svg" width="96">`
- **Animate / recolor:** inline the SVG (don't use `<img>`) so you can target inner elements.
- Every file shares `viewBox="0 0 256 256"`, a soft contact shadow, a dark cartoon outline, and flat cel-shading — they mix cleanly at any size.
- **Animation hooks** baked in: coffee cups/mugs expose `<g id="steam">`; layered drinks (orbean, freezer, matcha) use a `clipPath` you can animate fills inside; fries/sprinkle items are individual shapes. CSS keyframes (steam rising, layer fill, bob) drop straight on.

## Orbéan brand colors (for menu-matched work)
matcha `#6F9E55` · espresso `#5C3A23` · steamed milk `#F4ECDD` · hazelnut `#C68B4E` · caramel `#D9913B` · rose `#D87093` · sakura foam `#F2B5C4` · butterfly-pea `#7D8FD0` · makhani `#D9913B` · san-marzano tomato `#C0392B` · paneer `#F2E3C9`. Full scrape in `../_scrape/menu.json`.

## Adding new assets — DO IT THIS WAY

### 1. House style (every SVG must follow)
- `viewBox="0 0 256 256"`, subject centered, fills ~70%, transparent bg.
- Contact shadow: `<ellipse cx="128" cy="~222" rx=".." ry="11" fill="#000" opacity="0.12"/>`.
- Bold outline, dark family (`#43291a`/`#3c2a1a`/`#5a4a35`/`#9a5f25`), `stroke-width="6"`, round joins/caps.
- Flat fill + one highlight; subtle `<linearGradient>` ok. **No** `<text>`, raster, filters, or blur.
- **Prefix every gradient/clipPath id with the filename** (e.g. `id="bun-top_dome"`). This is load-bearing: many assets get inlined together and bare ids (`g1`) collide.

### 2. Naming = labels (don't fight the label generator)
`build-catalog.js` derives the display name from the filename. The rules:
- Categories `cups, milk, syrups, powders, creams, breads, cheeses` → it strips the **first** token and appends the noun. So name them **noun-first**: `cup-large` → "Large Cup", `syrup-rose` → "Rose Syrup".
- Categories `toppings, fry-toppings` → it strips the first token (expects a `top-`/`topping-`/`fry-` prefix): `top-onion-ring` → "Onion Ring".
- Category `sauces` → strips first token, appends " Sauce": `sauce-bbq` → "BBQ Sauce".
- **Everything else** → title-cases the whole filename: `gingerbread-shell` → "Gingerbread Shell", `caramel-macchiato` → "Caramel Macchiato".
- Edge cases (acronyms, awkward swaps) live in `LABEL_OVERRIDE` in `build-catalog.js` — add to it rather than fighting the rule.

### 3. After writing files, ALWAYS run
```
node build-catalog.js     # regenerates catalog.json, CATALOG.md, gallery.html, README.md
```

### 4. ⚠️ Gotcha: duplicate `<folder> (2)` dirs
This tree is OneDrive-synced. When **many agents write concurrently** into sibling folders here, the sync can spawn a duplicate `cheeseria (2)`-style folder and the real files land there. Mitigations:
- Generate into a **temp staging dir** (e.g. `%TEMP%/oorul-stage/...`), then `cp` into the repo in one shot.
- After any big concurrent write, scan: `find . -name "* (2)*"` and merge/clean before committing.
- Small writes (≤3 concurrent) are fine.

### 5. Scale-up pattern (how this pack was built)
For a batch, run a background **Workflow**: one designer agent per category writing its SVGs to staging, each followed by an adversarial verifier (checks valid single-root SVG, 256 viewBox, outline, prefixed ids, no text/raster). Then consolidate staging → repo, `node build-catalog.js`, commit, push. Agents occasionally error out mid-run — diff staging vs expected and hand-fill the gaps.

## Commit & publish
Repo root is `food-assets/`. Default branch `main`. After changes: `node build-catalog.js && git add -A && git commit && git push`. Public remote already set (`gh`-authed as snake14v).
