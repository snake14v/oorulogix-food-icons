// Regenerate catalog.json, CATALOG.md, gallery.html and README.md by scanning this folder.
// Run from the pack root:  node build-catalog.js
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

const NOUN = { cups:'Cup', milk:'Milk', syrups:'Syrup', powders:'Powder', creams:'Cream', breads:'Bread', cheeses:'Cheese' };
const BARE = new Set(['toppings','fry-toppings']);
const ACR = { bbq:'BBQ' };
const LABEL_OVERRIDE = {
  'espresso-medium-roast':'Medium Roast','espresso-dark-roast':'Dark Roast','espresso-light-roast':'Light Roast','espresso-decaf':'Decaf Roast',
  'ice-cubes':'Ice Cubes','ice-crushed':'Crushed Ice',
  'shell-chocolate':'Chocolate Shell','shell-classic':'Classic Shell','shell-pizzelle':'Pizzelle Shell','shell-checkerboard':'Checkerboard Shell','shell-caramel-apple':'Caramel Apple Shell','shell-pineapple':'Pineapple Shell',
  'pizza-dough':'Pizza Dough','pizza-sauce':'Pizza Sauce','pizza-cheese':'Pizza Cheese','pizza-baked':'Baked Pizza','pizza-slice':'Pizza Slice','pizza-whole':'Whole Pizza',
  'bun-top':'Top Bun','bun-bottom':'Bottom Bun','patty':'Patty','burger-full':'Full Burger','fries':'Fries','club-sandwich':'Club Sandwich',
  'cream-cookies-and-cream':'Cookies & Cream Swirl','cream-chocolate-mousse':'Chocolate Mousse','cream-lemon-chiffon':'Lemon Chiffon',
  'cheese-cheddar-shredded':'Shredded Cheddar','cheese-mozzarella-shredded':'Shredded Mozzarella',
  'sauce-special':'Special Sauce','sauce-onion':'Onion Sauce','sauce-bbq':'BBQ Sauce',
  'top-steak-strips':'Steak Strips','fry-bacon-bits':'Bacon Bits','fry-nacho-cheese':'Nacho Cheese','fry-chili':'Chili',
};
const tc = s => s.split(/[-\s]+/).map(w => ACR[w] || w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
const stripFirst = s => { const i = s.indexOf('-'); return i<0 ? s : s.slice(i+1); };
function labelFor(base, category){
  if (LABEL_OVERRIDE[base]) return LABEL_OVERRIDE[base];
  if (NOUN[category]) return tc(stripFirst(base)) + ' ' + NOUN[category];
  if (category === 'sauces') return tc(stripFirst(base)) + ' Sauce';
  if (BARE.has(category)) return tc(stripFirst(base));
  return tc(base);
}

const catalog = [];
function walk(dir){
  for (const e of fs.readdirSync(dir, { withFileTypes: true })){
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.svg')){
      const rel = path.relative(OUT, p).split(path.sep).join('/');
      const parts = rel.split('/');
      if (parts.length < 3) continue;
      const theme = parts[0], category = parts[1], base = e.name.replace(/\.svg$/, '');
      catalog.push({ id:`${theme}-${category}-${base}`, theme, category, file:rel, name:labelFor(base, category) });
    }
  }
}
walk(OUT);
catalog.sort((a,b)=> a.theme.localeCompare(b.theme) || a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

fs.writeFileSync(path.join(OUT,'catalog.json'), JSON.stringify({
  pack:'flat-food-icons', style:'flat-cartoon', viewBox:'0 0 256 256', license:'MIT', count:catalog.length, assets:catalog
}, null, 2));

const byTheme = {};
for (const a of catalog){ (byTheme[a.theme] ??= {}); (byTheme[a.theme][a.category] ??= []).push(a); }

let md = `# Asset Catalog\n\n${catalog.length} flat-cartoon food icons (SVG, 256×256). All names are generic.\n`;
for (const theme of Object.keys(byTheme).sort()){
  const tcount = Object.values(byTheme[theme]).reduce((n,a)=>n+a.length,0);
  md += `\n## ${tc(theme)} (${tcount})\n`;
  for (const cat of Object.keys(byTheme[theme]).sort()){
    md += `\n### ${tc(cat)}\n\n| Label | File |\n|---|---|\n`;
    for (const a of byTheme[theme][cat]) md += `| ${a.name} | \`${a.file}\` |\n`;
  }
}
fs.writeFileSync(path.join(OUT,'CATALOG.md'), md);

const gallery = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/><title>Flat Food Icons — Gallery</title>
<style>
:root{--ink:#33312c;--line:#e7e2d6;--accent:#c98a3a}
*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",system-ui,sans-serif;color:var(--ink);
background:radial-gradient(circle at 50% -10%,#fdf3df,#fbf7ee 60%);min-height:100vh}
header{text-align:center;padding:32px 16px 6px}header h1{margin:0;font-size:28px}
header p{margin:6px 0 0;opacity:.6;font-size:14px}.wrap{max-width:1150px;margin:0 auto;padding:0 16px 70px}
h2{font-size:14px;text-transform:uppercase;letter-spacing:1.6px;color:var(--accent);margin:34px 4px 6px;font-weight:700}
h3{font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:.5;margin:16px 4px 10px;font-weight:600}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(116px,1fr));gap:12px}
.tile{background:#fff;border:1px solid var(--line);border-radius:16px;padding:10px 6px;text-align:center}
.tile img{width:88px;height:88px;animation:bob 3.2s ease-in-out infinite}
.tile:nth-child(4n) img{animation-delay:-.8s}.tile:nth-child(4n+1) img{animation-delay:-1.6s}.tile:nth-child(4n+2) img{animation-delay:-2.4s}
.tile span{display:block;font-size:11px;margin-top:5px;line-height:1.25}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.pill{display:inline-block;background:var(--accent);color:#fff;border-radius:20px;font-size:12px;padding:2px 12px;margin-left:8px}
</style></head><body>
<header><h1>🍱 Flat Food Icons</h1><p id="sub"></p></header>
<div class="wrap" id="wrap"></div>
<script>
const ASSETS = ${JSON.stringify(catalog)};
const TC = s => s.replace(/-/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase());
document.getElementById('sub').textContent = ASSETS.length + ' generic flat-cartoon SVG icons · MIT licensed';
const byT={}; for(const a of ASSETS){(byT[a.theme]??={});(byT[a.theme][a.category]??=[]).push(a);}
const wrap=document.getElementById('wrap');
for(const t of Object.keys(byT).sort()){
  const n=Object.values(byT[t]).reduce((s,a)=>s+a.length,0);
  const h=document.createElement('h2');h.innerHTML=TC(t)+'<span class="pill">'+n+'</span>';wrap.appendChild(h);
  for(const c of Object.keys(byT[t]).sort()){
    const h3=document.createElement('h3');h3.textContent=TC(c);wrap.appendChild(h3);
    const g=document.createElement('div');g.className='grid';
    for(const a of byT[t][c]){const d=document.createElement('div');d.className='tile';
      d.innerHTML='<img loading="lazy" src="'+a.file+'" alt="'+a.name+'"/><span>'+a.name+'</span>';g.appendChild(d);}
    wrap.appendChild(g);
  }
}
</script></body></html>`;
fs.writeFileSync(path.join(OUT,'gallery.html'), gallery);

const themeCounts = Object.keys(byTheme).sort().map(t=>`- **${tc(t)}** — ${Object.values(byTheme[t]).reduce((n,a)=>n+a.length,0)} icons`).join('\n');
fs.writeFileSync(path.join(OUT,'README.md'),
`<p align="center"><img src="banner.svg" alt="Oorulogix — Flat Food Icons" width="760"></p>

# 🍱 Flat Food Icons

An open-source pack of **${catalog.length} original flat-cartoon food icons** for food-ordering apps, cooking games, menus, and prototypes. Hand-built SVG — scalable, tiny, and easy to animate.

All artwork is original and all names are generic. Licensed under the **MIT License** (see \`LICENSE\`).

## Contents
${themeCounts}

## Structure
\`\`\`
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
\`\`\`

## Usage
\`\`\`html
<img src="classics/drinks/coffee-cup.svg" width="96" alt="coffee cup"/>
\`\`\`
Inline the SVG to animate inner groups — e.g. drink cups expose \`<g id="steam">\` for a rising-steam loop. Every icon shares the same \`viewBox="0 0 256 256"\`, a soft contact shadow, a dark cartoon outline, and flat cel-shading, so they mix cleanly.

After adding or renaming files, run \`node build-catalog.js\` to refresh the catalog and gallery.

## Credits
Original artwork — no third-party assets included. Released under the MIT License (see \`LICENSE\`).
`);

console.log('catalog rebuilt:', catalog.length, 'assets');
const tally = {}; for (const a of catalog) tally[a.theme]=(tally[a.theme]||0)+1;
console.log(JSON.stringify(tally));
