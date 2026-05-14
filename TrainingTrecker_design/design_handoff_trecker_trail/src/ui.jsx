// ui.jsx — Themed primitives shared across screens.
// Heavily inline-styled to keep theming per-instance (each prototype mounts
// in its own subtree with its own CSS vars).

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// Phone "status bar" — minimal mock of an iOS top strip.
// ─────────────────────────────────────────────────────────────
function StatusBar({ t, dark }) {
  const ink = t.ink;
  return (
    <div style={{
      height: 38, padding: '0 22px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      fontSize: 13, fontWeight: 600, color: ink, fontFamily: t.font,
      flexShrink: 0,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: 0.8 }}>
        {/* signal */}
        <svg width="16" height="10" viewBox="0 0 18 10"><g fill={ink}>
          <rect x="0" y="6" width="3" height="4" rx="0.5"/>
          <rect x="5" y="4" width="3" height="6" rx="0.5"/>
          <rect x="10" y="2" width="3" height="8" rx="0.5"/>
          <rect x="15" y="0" width="3" height="10" rx="0.5"/>
        </g></svg>
        {/* battery */}
        <svg width="24" height="11" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={ink} strokeOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill={ink}/>
          <rect x="23" y="3.5" width="2" height="5" rx="1" fill={ink} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TopBar — title + optional back + trailing
// ─────────────────────────────────────────────────────────────
function TopBar({ t, title, subtitle, onBack, trailing, large = false }) {
  return (
    <div style={{
      padding: large ? '6px 20px 0' : '0 12px',
      height: large ? 'auto' : 52,
      display: 'flex', alignItems: 'center',
      flexShrink: 0,
    }}>
      <div style={{ minWidth: 40 }}>
        {onBack && (
          <button onClick={onBack} style={{
            ...btnReset, width: 38, height: 38, borderRadius: t.radius.sm,
            display: 'grid', placeItems: 'center', color: t.ink,
          }}>
            <Icon name="chevL" size={22}/>
          </button>
        )}
      </div>
      <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
        {!large && (
          <>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.ink,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11, color: t.inkMuted }}>{subtitle}</div>}
          </>
        )}
      </div>
      <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>
        {trailing}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BottomNav — variant-aware
// ─────────────────────────────────────────────────────────────
function BottomNav({ t, route, setRoute, role }) {
  const items = role === 'trainer'
    ? [
        { id: 'trainer',  icon: 'home', label: 'Athletes' },
        { id: 'plans',    icon: 'plans', label: 'Library' },
        { id: 'weight',   icon: 'trend', label: 'Trends' },
        { id: 'profile',  icon: 'user',  label: 'Profile' },
      ]
    : [
        { id: 'home',     icon: 'home',  label: 'Today' },
        { id: 'plans',    icon: 'plans', label: 'Plans' },
        { id: 'weight',   icon: 'trend', label: 'Body' },
        { id: 'profile',  icon: 'user',  label: 'You' },
      ];

  // Trail uses a floating dark pill nav; Garden/Field stay flat at bottom.
  if (t.variant === 'trail') {
    return (
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: 14,
        height: 60, borderRadius: 999, background: t.hero,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        boxShadow: t.glow, color: t.heroInk, paddingInline: 6,
        border: '1px solid ' + t.heroBorder, zIndex: 10,
      }}>
        {items.map(it => {
          const active = (it.id === 'home' && route.name === 'home')
            || route.name === it.id;
          return (
            <button key={it.id}
              onClick={() => setRoute({ name: it.id })}
              style={{
                ...btnReset, flex: 1, height: 48, borderRadius: 999,
                display: 'grid', placeItems: 'center',
                background: active ? t.heroAccent : 'transparent',
                color: active ? '#06120b' : t.heroInk,
                transition: 'all 0.18s',
              }} aria-label={it.label}>
              <Icon name={it.icon} size={22} stroke={active ? 2 : 1.75}/>
            </button>
          );
        })}
      </div>
    );
  }

  const sharp = t.variant === 'field';
  return (
    <div style={{
      height: sharp ? 60 : 68,
      borderTop: '1px solid ' + t.border,
      background: t.surface,
      display: 'flex', alignItems: 'stretch',
      flexShrink: 0, paddingBottom: 6,
    }}>
      {items.map(it => {
        const active = (it.id === 'home' && route.name === 'home')
          || route.name === it.id;
        return (
          <button key={it.id}
            onClick={() => setRoute({ name: it.id })}
            style={{
              ...btnReset, flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              color: active ? t.accent : t.inkMuted,
              fontSize: 10.5, fontWeight: 600, letterSpacing: sharp ? '0.04em' : 0,
              textTransform: sharp ? 'uppercase' : 'none',
              fontFamily: t.font,
            }}>
            <Icon name={it.icon} size={22} stroke={active ? 2 : 1.6}/>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card — variant-aware
// ─────────────────────────────────────────────────────────────
function Card({ t, children, style = {}, onClick, padded = true, raised = false, surface }) {
  const bg = surface || t.surface;
  const radius = t.variant === 'field' ? t.radius.md : t.radius.lg;
  return (
    <div onClick={onClick} style={{
      background: bg,
      border: '1px solid ' + t.border,
      borderRadius: radius,
      padding: padded ? (t.variant === 'field' ? '14px 16px' : '18px 20px') : 0,
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: raised ? t.shadow : 'none',
      transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────
const btnReset = {
  border: 'none', background: 'transparent', padding: 0, margin: 0,
  cursor: 'pointer', font: 'inherit', color: 'inherit',
};

function Button({ t, children, kind = 'primary', size = 'md', icon, onClick, full, style = {} }) {
  const h = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const sharp = t.variant === 'field';
  const r = kind === 'primary' && t.variant === 'garden' ? 999 :
    sharp ? t.radius.sm : t.radius.md;
  const base = {
    height: h, paddingInline: size === 'lg' ? 22 : 18,
    borderRadius: r,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontSize: size === 'lg' ? 15 : 14, fontWeight: 600,
    fontFamily: t.font, cursor: 'pointer', border: 'none',
    transition: 'transform 0.12s, opacity 0.15s, background 0.15s',
    width: full ? '100%' : undefined, letterSpacing: sharp ? '0.01em' : 0,
  };
  const styles = {
    primary: { background: t.accent, color: t.accentInk },
    ghost: { background: 'transparent', color: t.ink, border: '1px solid ' + t.borderStrong },
    soft: { background: t.accentSoft, color: t.accentSoftInk },
    plain: { background: t.surfaceAlt, color: t.ink },
    danger: { background: 'transparent', color: t.danger, border: '1px solid ' + t.danger },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...styles[kind], ...style }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18}/>}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────────────────────
function Avatar({ t, initials, size = 36, accent = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: accent ? t.accent : t.surfaceAlt,
      color: accent ? t.accentInk : t.ink,
      display: 'grid', placeItems: 'center',
      fontSize: size * 0.36, fontWeight: 700, letterSpacing: '-0.01em',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pill
// ─────────────────────────────────────────────────────────────
function Pill({ t, children, kind = 'soft', icon, style = {} }) {
  const s = {
    soft: { background: t.accentSoft, color: t.accentSoftInk },
    ghost: { background: 'transparent', color: t.inkMuted, border: '1px solid ' + t.border },
    solid: { background: t.accent, color: t.accentInk },
    deep: { background: t.surfaceAlt, color: t.inkSoft },
  }[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      paddingInline: 10, height: 22, borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      ...s, ...style,
    }}>
      {icon && <Icon name={icon} size={11} stroke={2}/>}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// ProgressBar (linear)
// ─────────────────────────────────────────────────────────────
function ProgressBar({ t, value, height = 6, track = null }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div style={{
      height, width: '100%', borderRadius: 999,
      background: track || t.surfaceAlt, overflow: 'hidden',
    }}>
      <div style={{
        width: (v * 100) + '%', height: '100%',
        background: t.accent, transition: 'width 0.4s',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Progress ring (SVG, conic-like)
// ─────────────────────────────────────────────────────────────
function ProgressRing({ value, size = 80, stroke = 8, color, track, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - v * c}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s' }}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', placeItems: 'center', fontFeatureSettings: '"tnum"',
      }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sparkline
// ─────────────────────────────────────────────────────────────
function Sparkline({ data, w = 200, h = 50, color = 'currentColor', fill = null, dots = false, goal = null }) {
  if (!data.length) return null;
  const ys = data.map(d => typeof d === 'number' ? d : d.y);
  const min = Math.min(...ys, goal ?? Infinity);
  const max = Math.max(...ys, goal ?? -Infinity);
  const pad = 4;
  const scaleX = (i) => pad + (i / (ys.length - 1)) * (w - 2*pad);
  const scaleY = (v) => h - pad - ((v - min) / Math.max(0.001, max - min)) * (h - 2*pad);
  const pts = ys.map((y, i) => [scaleX(i), scaleY(y)]);
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = path + ` L ${pts[pts.length-1][0]} ${h} L ${pts[0][0]} ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {goal != null && (
        <line x1={pad} y1={scaleY(goal)} x2={w-pad} y2={scaleY(goal)}
          stroke={color} strokeOpacity="0.25" strokeDasharray="3 3" strokeWidth="1"/>
      )}
      {fill && <path d={area} fill={fill}/>}
      <path d={path} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"/>
      {dots && pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length-1 ? 3 : 1.6} fill={color}/>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Big number — variant-aware
// ─────────────────────────────────────────────────────────────
function BigNum({ t, value, unit, size = 40, weight = 600, mono = true, color, align = 'baseline' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: align, gap: 4, color: color || t.ink,
      fontFamily: mono ? t.fontMono : t.font,
      fontVariantNumeric: 'tabular-nums', lineHeight: 1,
    }}>
      <span style={{ fontSize: size, fontWeight: weight, letterSpacing: '-0.02em' }}>{value}</span>
      {unit && <span style={{ fontSize: size * 0.32, fontWeight: 500, color: t.inkMuted, marginBottom: size * 0.12 }}>{unit}</span>}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Section label
// ─────────────────────────────────────────────────────────────
function SectionLabel({ t, children, right, style = {} }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      fontSize: 11, fontWeight: 600, color: t.inkMuted,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      padding: '14px 4px 8px', ...style,
    }}>
      <span>{children}</span>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Number stepper (small)
// ─────────────────────────────────────────────────────────────
function NumberInput({ t, value, onChange, suffix, width = 80 }) {
  return (
    <input type="text" inputMode="decimal" value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width, height: 38, borderRadius: t.radius.sm,
        background: t.surfaceAlt, border: '1px solid ' + t.border,
        color: t.ink, fontFamily: t.fontMono, fontSize: 15, fontWeight: 600,
        textAlign: 'center', outline: 'none',
        fontVariantNumeric: 'tabular-nums',
      }}/>
  );
}

// ─────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────
function Toast({ t, show, children }) {
  return (
    <div style={{
      position: 'absolute', bottom: 96, left: '50%',
      transform: `translateX(-50%) translateY(${show ? '0' : '20px'})`,
      opacity: show ? 1 : 0, transition: 'all 0.25s',
      background: t.ink, color: t.bg,
      paddingInline: 18, height: 38, display: 'flex', alignItems: 'center',
      borderRadius: 999, fontSize: 13, fontWeight: 600,
      pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 20,
    }}>{children}</div>
  );
}

Object.assign(window, {
  StatusBar, TopBar, BottomNav, Card, Button, Avatar, Pill,
  ProgressBar, ProgressRing, Sparkline, BigNum, SectionLabel,
  NumberInput, Toast, btnReset,
});
