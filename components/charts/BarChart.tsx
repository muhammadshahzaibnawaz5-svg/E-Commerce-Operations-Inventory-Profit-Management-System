interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  format?: (v: number) => string;
  ariaLabel?: string;
}

const W = 560;
const PAD_L = 48;
const PAD_B = 28;
const PAD_T = 12;

export function BarChart({ data, height = 220, format, ariaLabel = "Bar chart" }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const innerH = height - PAD_T - PAD_B;
  const plotW = W - PAD_L;
  const step = plotW / data.length;
  const barW = Math.max(step * 0.5, 10);

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
      {data.map((d, i) => {
        const h = (d.value / max) * innerH;
        const x = PAD_L + i * step + (step - barW) / 2;
        const y = PAD_T + innerH - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx={3} fill="#1E40AF">
              <title>{`${d.label}: ${format ? format(d.value) : d.value}`}</title>
            </rect>
            <text
              x={x + barW / 2}
              y={PAD_T + innerH + 14}
              fontSize="9"
              fill="#64748B"
              textAnchor="middle"
              fontFamily="Fira Sans, sans-serif"
            >
              {d.label.includes(" - ") ? d.label.split(" - ")[1] : d.label}
            </text>
            <text
              x={x + barW / 2}
              y={y - 5}
              fontSize="9"
              fill="#0F172A"
              textAnchor="middle"
              fontFamily="Fira Code, monospace"
            >
              {format ? format(d.value) : d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}