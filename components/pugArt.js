// Code-drawn pug illustrations, as SVG markup rendered by <Pug /> (components/Pug.js).
// Kept as plain strings so the same art can be previewed outside the app.

const PALETTES = {
  fawn: {
    coat: '#E9C79A',
    stripe: null,
    wrinkle: '#C7955C',
    mask: '#2B211C',
    ear: '#2B211C',
  },
  brindle: {
    coat: '#6E5644',
    stripe: '#2A1F18',
    wrinkle: '#2A1F18',
    mask: '#1E1714',
    ear: '#1E1714',
  },
};

// variant: 'fawn' | 'brindle'. happy: tongue out.
export function pugSvg(variant = 'fawn', happy = false) {
  const p = PALETTES[variant] ?? PALETTES.fawn;
  const clipId = `pug-head-${variant}`;

  const stripes = p.stripe
    ? `
    <g clip-path="url(#${clipId})" stroke="${p.stripe}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.4">
      <path d="M18 40 q7 18 1 40" />
      <path d="M27 30 q8 22 2 52" />
      <path d="M93 30 q-8 22 -2 52" />
      <path d="M102 40 q-7 18 -1 40" />
      <path d="M38 24 q6 10 3 20" />
      <path d="M82 24 q-6 10 -3 20" />
      <path d="M33 88 q6 8 14 12" />
      <path d="M87 88 q-6 8 -14 12" />
    </g>`
    : '';

  const tongue = happy
    ? `<path d="M54.5 88 c0 10 11 10 11 0 z" fill="#F2879C" />
    <path d="M60 89 v5" stroke="#D96A82" stroke-width="1.2" stroke-linecap="round" />`
    : '';

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="${clipId}">
      <ellipse cx="60" cy="64" rx="44" ry="40" />
    </clipPath>
  </defs>

  <ellipse cx="60" cy="64" rx="44" ry="40" fill="${p.coat}" />
  ${stripes}

  <path d="M40 27 C24 20 10 30 13 48 C16 44 22 42 27 43 C30 37 35 31 40 27 Z" fill="${p.ear}" />
  <path d="M80 27 C96 20 110 30 107 48 C104 44 98 42 93 43 C90 37 85 31 80 27 Z" fill="${p.ear}" />

  <path d="M47 39 q13 -7 26 0" stroke="${p.wrinkle}" stroke-width="2.6" stroke-linecap="round" fill="none" />
  <path d="M51 46 q9 -5 18 0" stroke="${p.wrinkle}" stroke-width="2.4" stroke-linecap="round" fill="none" />

  <ellipse cx="42" cy="60" rx="12.5" ry="11.5" fill="${p.mask}" />
  <ellipse cx="78" cy="60" rx="12.5" ry="11.5" fill="${p.mask}" />
  <ellipse cx="60" cy="82" rx="25" ry="19" fill="${p.mask}" />

  <circle cx="42" cy="60" r="8" fill="#120D0B" />
  <circle cx="78" cy="60" r="8" fill="#120D0B" />
  <circle cx="44.6" cy="57.4" r="2.7" fill="#FFFFFF" />
  <circle cx="80.6" cy="57.4" r="2.7" fill="#FFFFFF" />

  <path d="M48 68 q12 -5 24 0" stroke="#4A3B33" stroke-width="2" stroke-linecap="round" fill="none" />

  <ellipse cx="60" cy="75" rx="9" ry="6" fill="#0B0807" />
  <ellipse cx="57" cy="73" rx="3" ry="1.6" fill="#FFFFFF" opacity="0.35" />

  ${tongue}
  <path d="M60 81 v5 M50 86 q5 5 10 0 q5 5 10 0" stroke="#5A4A41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>`;
}
