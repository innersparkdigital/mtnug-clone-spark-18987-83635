interface Props {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}

/** Tiny inline SVG sparkline — no library. Values expected roughly 0..100 (or any range). */
const MiniSparkline = ({ values, width = 120, height = 32, color = "hsl(var(--primary))" }: Props) => {
  if (!values || values.length === 0) {
    return (
      <div className="text-[10px] text-muted-foreground italic">No trend yet</div>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(" ");
  const last = values[values.length - 1];
  const lastY = height - ((last - min) / range) * (height - 4) - 2;
  const lastX = (values.length - 1) * step;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r={2.5} fill={color} />
    </svg>
  );
};

export default MiniSparkline;