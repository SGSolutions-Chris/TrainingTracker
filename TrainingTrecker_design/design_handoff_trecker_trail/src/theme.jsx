// theme.jsx — Token sets for 3 directions × light/dark.
// Each theme exports CSS custom properties that ui.jsx primitives consume.

const FOREST = '#0f5132';
const FOREST_BRIGHT = '#1a7a4d';

// ─────────────────────────────────────────────────────────────
// GARDEN — Apple Fitness premium soft. Generous radii, warm whites.
// ─────────────────────────────────────────────────────────────
const garden = {
  name: 'Garden',
  tagline: 'Soft · Premium · Apple-flavored',
  font: "'Plus Jakarta Sans', -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
  radius: { lg: 24, md: 16, sm: 10, pill: 999 },
  light: {
    bg: '#fafaf7',
    surface: '#ffffff',
    surfaceAlt: '#f4f4f1',
    surfaceDeep: '#ebebe6',
    ink: '#0c1410',
    inkSoft: '#3d4a44',
    inkMuted: '#8b9690',
    border: 'rgba(12,20,16,0.06)',
    borderStrong: 'rgba(12,20,16,0.12)',
    accent: FOREST,
    accentInk: '#ffffff',
    accentSoft: '#e6f2eb',
    accentSoftInk: '#0c3a23',
    danger: '#c2410c',
    shadow: '0 1px 2px rgba(12,20,16,0.04), 0 6px 24px rgba(12,20,16,0.05)',
    shadowLg: '0 4px 12px rgba(12,20,16,0.06), 0 24px 48px rgba(12,20,16,0.08)',
  },
  dark: {
    bg: '#0b0e0c',
    surface: '#161a18',
    surfaceAlt: '#1f2421',
    surfaceDeep: '#0f1311',
    ink: '#f5f7f5',
    inkSoft: '#b8c2bd',
    inkMuted: '#6b7570',
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.12)',
    accent: '#22c55e',
    accentInk: '#062012',
    accentSoft: 'rgba(34,197,94,0.14)',
    accentSoftInk: '#86efac',
    danger: '#fb923c',
    shadow: '0 1px 2px rgba(0,0,0,0.4), 0 6px 24px rgba(0,0,0,0.3)',
    shadowLg: '0 8px 32px rgba(0,0,0,0.5)',
  },
};

// ─────────────────────────────────────────────────────────────
// FIELD — Editorial, data-forward. Sharper edges, mono numerics.
// ─────────────────────────────────────────────────────────────
const field = {
  name: 'Field',
  tagline: 'Editorial · Numeric · Linear-flavored',
  font: "'Inter', -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
  radius: { lg: 14, md: 10, sm: 6, pill: 999 },
  light: {
    bg: '#f5f5f3',
    surface: '#ffffff',
    surfaceAlt: '#ededea',
    surfaceDeep: '#e3e3df',
    ink: '#0a0a0a',
    inkSoft: '#404040',
    inkMuted: '#737373',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.18)',
    accent: FOREST,
    accentInk: '#ffffff',
    accentSoft: '#dceee2',
    accentSoftInk: '#0a3a22',
    danger: '#b91c1c',
    shadow: '0 1px 0 rgba(0,0,0,0.04)',
    shadowLg: '0 2px 0 rgba(0,0,0,0.04)',
  },
  dark: {
    bg: '#0a0a0a',
    surface: '#141414',
    surfaceAlt: '#1e1e1e',
    surfaceDeep: '#080808',
    ink: '#fafafa',
    inkSoft: '#a3a3a3',
    inkMuted: '#737373',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.18)',
    accent: '#34d399',
    accentInk: '#052e1f',
    accentSoft: 'rgba(52,211,153,0.12)',
    accentSoftInk: '#6ee7b7',
    danger: '#f87171',
    shadow: '0 1px 0 rgba(255,255,255,0.04)',
    shadowLg: 'none',
  },
};

// ─────────────────────────────────────────────────────────────
// TRAIL — Experimental. Dark hero per screen, glow, asymmetry.
// ─────────────────────────────────────────────────────────────
const trail = {
  name: 'Trail',
  tagline: 'Bold · Asymmetric · Hero-led',
  font: "'Plus Jakarta Sans', -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
  radius: { lg: 28, md: 18, sm: 12, pill: 999 },
  light: {
    bg: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#f3f4f1',
    surfaceDeep: '#e9ebe6',
    ink: '#0b1610',
    inkSoft: '#3b4a43',
    inkMuted: '#8a948f',
    border: 'rgba(11,22,16,0.07)',
    borderStrong: 'rgba(11,22,16,0.14)',
    accent: FOREST,
    accentInk: '#ffffff',
    accentSoft: '#d8efde',
    accentSoftInk: '#0a3a22',
    danger: '#dc2626',
    // Trail uses a "hero" surface — always dark green
    hero: '#0a1f15',
    heroInk: '#ecfdf5',
    heroAccent: '#4ade80',
    heroBorder: 'rgba(74,222,128,0.18)',
    shadow: '0 1px 2px rgba(11,22,16,0.04), 0 8px 28px rgba(11,22,16,0.06)',
    shadowLg: '0 24px 56px rgba(11,22,16,0.10)',
    glow: '0 0 0 1px rgba(74,222,128,0.12), 0 12px 36px rgba(15,81,50,0.22)',
  },
  dark: {
    bg: '#070a08',
    surface: '#101512',
    surfaceAlt: '#181d1a',
    surfaceDeep: '#0a0d0b',
    ink: '#f0f5f1',
    inkSoft: '#b0bcb4',
    inkMuted: '#6a746e',
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.14)',
    accent: '#4ade80',
    accentInk: '#062014',
    accentSoft: 'rgba(74,222,128,0.14)',
    accentSoftInk: '#a7f3c8',
    danger: '#fb923c',
    hero: '#0e2a1c',
    heroInk: '#ecfdf5',
    heroAccent: '#4ade80',
    heroBorder: 'rgba(74,222,128,0.22)',
    shadow: '0 1px 2px rgba(0,0,0,0.5), 0 8px 28px rgba(0,0,0,0.4)',
    shadowLg: '0 24px 56px rgba(0,0,0,0.5)',
    glow: '0 0 0 1px rgba(74,222,128,0.16), 0 12px 36px rgba(74,222,128,0.18)',
  },
};

const THEMES = { garden, field, trail };

// Convert a theme + mode to a flat object usable in styles.
function resolveTheme(variant, mode) {
  const t = THEMES[variant];
  const m = t[mode];
  return {
    variant,
    mode,
    name: t.name,
    tagline: t.tagline,
    font: t.font,
    fontMono: t.fontMono,
    radius: t.radius,
    ...m,
  };
}

// CSS-var string for embedding in the prototype root
function themeVars(t) {
  return {
    fontFamily: t.font,
    color: t.ink,
    background: t.bg,
    '--bg': t.bg,
    '--surface': t.surface,
    '--surface-alt': t.surfaceAlt,
    '--surface-deep': t.surfaceDeep,
    '--ink': t.ink,
    '--ink-soft': t.inkSoft,
    '--ink-muted': t.inkMuted,
    '--border': t.border,
    '--border-strong': t.borderStrong,
    '--accent': t.accent,
    '--accent-ink': t.accentInk,
    '--accent-soft': t.accentSoft,
    '--accent-soft-ink': t.accentSoftInk,
    '--danger': t.danger,
    '--font': t.font,
    '--font-mono': t.fontMono,
    '--r-lg': t.radius.lg + 'px',
    '--r-md': t.radius.md + 'px',
    '--r-sm': t.radius.sm + 'px',
    '--shadow': t.shadow,
    '--shadow-lg': t.shadowLg,
  };
}

Object.assign(window, { THEMES, resolveTheme, themeVars });
