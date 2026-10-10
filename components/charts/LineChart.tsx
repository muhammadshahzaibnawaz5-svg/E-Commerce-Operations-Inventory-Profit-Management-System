interface LineDatum {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineDatum[];
  height?: number;
  format?: (v: number) => string;
  ariaLabel?: string;
}

const W = 560;
const PAD_L = 48;
const PAD_B = 28;
const PAD_T = 12;
const R = 3;

export function LineChart({ data, height = 220, format, ariaLabel = "Line chart" }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const innerH = height - PAD_T - PAD_B;
  const plotW = W - PAD_L;

  const points = data.map((d, i) => ({
    x: data.length === 1 ? PAD_L + plotW / 2 : PAD_L + (plotW * i) / (data.length - 1),
    y: PAD_T + innerH - (d.value / max) * innerH,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: PAD_T + innerH - innerH * f,
    label: format ? format(Math.round(max * f)) : String(Math.round(max * f)),
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="w-full"
      role="img"
      aria-label={ariaLabel}
      focusable="false"
    >
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={g.y} x2={W - 4} y2={g.y} stroke="#E2E8F0" strokeDasharray="4 4" />
          <text x={PAD_L - 6} y={g.y + 3} fontSize="10" fill="#64748B" textAnchor="end" fontFamily="Fira Code, monospace">
            {g.label}
          </text>
        </g>
      ))}
      <polyline points={polyline} fill="none" stroke="#D97706" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={R} fill="#D97706" stroke="#fff" strokeWidth={1.5}>
          <title>{`${data[i].label}: ${format ? format(data[i].value) : data[i].value}`}</title>
        </circle>
      ))}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={PAD_T + innerH + 14}
          fontSize="9"
          fill="#64748B"
          textAnchor="middle"
          fontFamily="Fira Code, monospace"
        >
          {data[i].label}
        </text>
      ))}
    </svg>
  );
}