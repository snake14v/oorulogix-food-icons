<p align="center"><img src="banner.svg" alt="Oorulogix — Flat Food Icons" width="760"></p>

# 🍱 Flat Food Icons

An open-source pack of **156 original flat-cartoon food icons** for food-ordering apps, cooking games, menus, and prototypes. Hand-built SVG — scalable, tiny, and easy to animate.

All artwork is original and all names are generic. Licensed under the **MIT License** (see `LICENSE`).

## Contents
- **Burger** — 12 icons
- **Classics** — 15 icons
- **Coffee** — 52 icons
- **Pizza** — 12 icons
- **Sandwich** — 65 icons

## Structure
```
food-assets/
├── coffee/      cups, espresso, milk, syrups, ice, powders, creams, toppings, pastry-shells
├── sandwich/    breads, cheeses, toppings, sauces, fries, fry-toppings
├── pizza/       base, toppings
├── burger/      base, toppings, sauces
├── classics/    burger, drinks, pizza, sandwich, fries  (composed / finished items)
├── catalog.json   machine-readable index (id, label, path) of every asset
├── CATALOG.md      human-readable catalog
├── gallery.html    open in a browser to see every icon labelled
├── build-catalog.js  regenerates catalog.json / CATALOG.md / gallery.html / README.md
├── LICENSE         MIT
└── README.md
```

## Usage
```html
<img src="classics/drinks/coffee-cup.svg" width="96" alt="coffee cup"/>
```
Inline the SVG to animate inner groups — e.g. drink cups expose `<g id="steam">` for a rising-steam loop. Every icon shares the same `viewBox="0 0 256 256"`, a soft contact shadow, a dark cartoon outline, and flat cel-shading, so they mix cleanly.

After adding or renaming files, run `node build-catalog.js` to refresh the catalog and gallery.

## Credits
Original artwork — no third-party assets included. Released under the MIT License (see `LICENSE`).
