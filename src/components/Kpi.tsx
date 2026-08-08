export function Kpi({
  accent,
  label,
  value,
  sub,
}: {
  accent: string
  label: string
  value: string
  sub: string
}) {
  return (
    <article className="kpi" style={{ ['--accent' as string]: accent }}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="sub">{sub}</div>
    </article>
  )
}
