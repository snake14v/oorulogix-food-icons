// Drop-in icon component for the Orbéan menu.
// Resolves a menu item id (e.g. "matcha-0") or a customisation name
// (e.g. "Hazelnut syrup") to its flat-cartoon asset and renders it.
//
// Assets are served straight from the public repo via jsDelivr CDN by default —
// no need to copy any files. To self-host instead, copy the pack's theme folders
// into /public/menu-assets and pass base="/menu-assets".

import map from "./menu-map.json";

const CDN = "https://cdn.jsdelivr.net/gh/snake14v/oorulogix-food-icons";

const items = map.items as Record<string, string>;
const customizations = map.customizations as Record<string, string>;

/** Returns the asset path (relative to pack root) for an item id or customisation name, or null. */
export function resolveOrbeanIcon(idOrName: string): string | null {
  return items[idOrName] ?? customizations[idOrName] ?? null;
}

export interface OrbeanMenuIconProps {
  /** menu item id ("pizza-2") or customisation name ("Rose syrup") */
  id: string;
  /** px size, default 96 */
  size?: number;
  /** asset base url; defaults to the repo CDN. Use "/menu-assets" if self-hosting. */
  base?: string;
  alt?: string;
  className?: string;
}

export function OrbeanMenuIcon({
  id,
  size = 96,
  base = CDN,
  alt,
  className,
}: OrbeanMenuIconProps) {
  const rel = resolveOrbeanIcon(id);
  if (!rel) return null;
  return (
    <img
      src={`${base}/${rel}`}
      width={size}
      height={size}
      alt={alt ?? id}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
