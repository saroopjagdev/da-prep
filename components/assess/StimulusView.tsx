import type { Stimulus } from "@/lib/assess/types";

const COLOURS = ["#2563eb", "#0f766e", "#c2410c", "#7c3aed"];
const W = 560;
const H = 260;
const M = { top: 16, right: 16, bottom: 44, left: 52 };

function niceMax(v: number) {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  const n = v / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag;
}

function Chart({ s }: { s: Extract<Stimulus, { type: "chart" }> }) {
  const max = niceMax(Math.max(...s.series.flatMap((x) => x.values)));
  const iw = W - M.left - M.right;
  const ih = H - M.top - M.bottom;
  const y = (v: number) => M.top + ih - (v / max) * ih;
  const band = iw / s.labels.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const barW = (band * 0.7) / s.series.length;
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl" aria-hidden="true" role="presentation">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="#cbd5e1" strokeWidth="1" />
            <text x={M.left - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#475569">
              {t}
            </text>
          </g>
        ))}
        {s.labels.map((l, i) => (
          <text key={l} x={M.left + band * i + band / 2} y={H - M.bottom + 16} textAnchor="middle" fontSize="11" fill="#475569">
            {l}
          </text>
        ))}
        {s.kind === "bar" &&
          s.series.map((ser, si) =>
            ser.values.map((v, i) => (
              <rect
                key={`${ser.name}-${i}`}
                x={M.left + band * i + band * 0.15 + barW * si}
                y={y(v)}
                width={barW}
                height={M.top + ih - y(v)}
                fill={COLOURS[si % COLOURS.length]}
              />
            )),
          )}
        {s.kind === "line" &&
          s.series.map((ser, si) => (
            <g key={ser.name}>
              <polyline
                fill="none"
                stroke={COLOURS[si % COLOURS.length]}
                strokeWidth="2.5"
                points={ser.values.map((v, i) => `${M.left + band * i + band / 2},${y(v)}`).join(" ")}
              />
              {ser.values.map((v, i) => (
                <circle key={i} cx={M.left + band * i + band / 2} cy={y(v)} r="3.5" fill={COLOURS[si % COLOURS.length]} />
              ))}
            </g>
          ))}
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {s.series.map((ser, si) => (
          <span key={ser.name} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLOURS[si % COLOURS.length] }} />
            {ser.name}
          </span>
        ))}
        {s.unit && <span>Values in {s.unit}</span>}
      </figcaption>
      {/* Screen readers get the same data as a table. */}
      <table className="sr-only">
        <caption>{s.title ?? "Chart data"}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            {s.series.map((ser) => (
              <th key={ser.name} scope="col">
                {ser.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {s.labels.map((l, i) => (
            <tr key={l}>
              <th scope="row">{l}</th>
              {s.series.map((ser) => (
                <td key={ser.name}>{ser.values[i]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Email({ s }: { s: Extract<Stimulus, { type: "email" }> }) {
  return (
    <div className="space-y-3">
      <dl className="grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-0.5 border-b border-line pb-2 text-xs">
        <dt className="text-muted">From</dt>
        <dd className="font-semibold">{s.from}</dd>
        <dt className="text-muted">Subject</dt>
        <dd className="font-semibold">{s.subject}</dd>
        {s.time && (
          <>
            <dt className="text-muted">Received</dt>
            <dd>{s.time}</dd>
          </>
        )}
      </dl>
      <p className="whitespace-pre-line leading-relaxed">{s.body}</p>
      {s.table && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {s.table.columns.map((c) => (
                  <th key={c} scope="col" className="py-1.5 pr-4 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  {r.map((cell, j) => (
                    <td key={j} className="py-1.5 pr-4 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function StimulusView({ stimulus }: { stimulus: Stimulus }) {
  return (
    <div className="space-y-2 rounded-lg border border-line bg-white p-4 text-sm">
      {stimulus.title && <p className="font-semibold">{stimulus.title}</p>}
      {stimulus.type === "text" && <p className="whitespace-pre-line leading-relaxed">{stimulus.body}</p>}
      {stimulus.type === "email" && <Email s={stimulus} />}
      {stimulus.type === "table" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {stimulus.columns.map((c) => (
                  <th key={c} scope="col" className="py-1.5 pr-4 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stimulus.rows.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  {r.map((cell, j) => (
                    <td key={j} className="py-1.5 pr-4 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {stimulus.type === "table" && stimulus.note && <p className="text-xs text-muted">{stimulus.note}</p>}
      {stimulus.type === "chart" && <Chart s={stimulus} />}
    </div>
  );
}
