/**
 * A small line chart of scores (0 to 100) over a run of attempts, oldest on the left. Drawn as SVG so it needs no library.
 * The numbers are also in the list under it, so the chart itself is described to screen readers in one line.
 */
export default function ScoreTrend({ points, label }: { points: { pct: number; date: string }[]; label: string }) {
  if (points.length < 2) return <p className="text-xs text-muted">Take this one again to see a trend.</p>;
  const W = 300;
  const H = 90;
  const padX = 8;
  const padTop = 8;
  const padBottom = 14;
  const x = (i: number) => padX + (i * (W - 2 * padX)) / (points.length - 1);
  const y = (pct: number) => padTop + ((100 - pct) * (H - padTop - padBottom)) / 100;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.pct).toFixed(1)}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${label}: ${points.length} attempts, from ${first.pct}% on ${fmt(first.date)} to ${last.pct}% on ${fmt(last.date)}`}
      className="h-24 w-full max-w-sm"
    >
      {[0, 50, 100].map((g) => (
        <line key={g} x1={padX} x2={W - padX} y1={y(g)} y2={y(g)} stroke="currentColor" className="text-line" strokeWidth={g === 50 ? 0.6 : 1} strokeDasharray={g === 50 ? "3 3" : undefined} />
      ))}
      <path d={path} fill="none" stroke="currentColor" className="text-brand-600" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={`${p.date}-${i}`} cx={x(i)} cy={y(p.pct)} r={i === points.length - 1 ? 3.5 : 2.5} className="fill-brand-600" />
      ))}
      <text x={padX} y={H - 2} className="fill-muted" fontSize="9">
        {fmt(first.date)}
      </text>
      <text x={W - padX} y={H - 2} textAnchor="end" className="fill-muted" fontSize="9">
        {fmt(last.date)}
      </text>
    </svg>
  );
}
