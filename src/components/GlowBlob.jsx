export default function GlowBlob({ size = 280, top = -80, right = -60, opacity = 0.35 }) {
  return (
    <div style={{
      position: 'absolute',
      top,
      right,
      width: size,
      height: size,
      borderRadius: '50%',
      pointerEvents: 'none',
      background: `radial-gradient(closest-side, rgba(74,222,128,${opacity}), transparent)`,
    }} />
  )
}
