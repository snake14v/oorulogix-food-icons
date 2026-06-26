# Orbéan menu integration

Wire the flat-cartoon assets into the Orbéan ordering app. The menu's item ids
(from the `/order?add=<id>` links) and the "Customise your cup" ingredient names
are pre-mapped to assets.

## Files
- `menu-map.json` — `{ items: { "matcha-0": "orbean/signatures/…svg", … }, customizations: { "Hazelnut syrup": "orbean/syrups/…svg", … } }`
- `OrbeanMenuIcon.tsx` — drop-in React/Next component + `resolveOrbeanIcon(id)` helper

## Quick start (zero-copy, CDN)
Assets load from the public repo via jsDelivr — nothing to copy.

```tsx
import { OrbeanMenuIcon } from "@/integrations/orbean/OrbeanMenuIcon";

// on a menu card:
<OrbeanMenuIcon id="matcha-0" size={120} alt="Emerald Hazelnut Reserve" />

// a customisation chip:
<OrbeanMenuIcon id="Hazelnut syrup" size={28} />
```

Just resolve a path yourself:
```ts
import { resolveOrbeanIcon } from "@/integrations/orbean/OrbeanMenuIcon";
const rel = resolveOrbeanIcon("pizza-2");            // "orbean/pizzas/makhani-paneer.svg"
const url = `https://cdn.jsdelivr.net/gh/snake14v/oorulogix-food-icons/${rel}`;
```

## Self-host instead of CDN (optional)
1. Copy the asset folders into your app, e.g. `cp -r orbean public/menu-assets/orbean`
2. Render with a local base: `<OrbeanMenuIcon id="sig-1" base="/menu-assets" />`

## Coverage
- **41 menu items** — every orderable drink + kitchen dish.
- **~30 customisation names** — syrups, foams, milks, garnishes, bases. A few share an
  asset where they're visually the same (e.g. "Golden caramel"/"Buttery caramel" → caramel drizzle).
  Edit `menu-map.json` to retarget any of them.

## Animate (optional)
For the layered drinks, inline the SVG (fetch the file) instead of `<img>` and animate the
clipped fill layers / the `id="steam"` group with CSS — see the pack's `CLAUDE.md` for hooks.

## Versioning
Pin a release in the CDN url for stability: `…/gh/snake14v/oorulogix-food-icons@<tag>/…`.
The default (no tag) tracks `main`.
