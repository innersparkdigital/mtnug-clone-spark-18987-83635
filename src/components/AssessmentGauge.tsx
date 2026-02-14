import { motion } from "framer-motion";

interface AssessmentGaugeProps {
  score: number;
  maxScore: number;
  severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
  title: string;
}

const severityConfig = {
  Minimal: { angle: -72, emoji: "😊", color: "#22c55e" },
  Mild: { angle: -36, emoji: "🙂", color: "#84cc16" },
  Moderate: { angle: 0, emoji: "😐", color: "#f59e0b" },
  "Moderately Severe": { angle: 36, emoji: "😟", color: "#f97316" },
  Severe: { angle: 72, emoji: "😢", color: "#ef4444" },
};

const AssessmentGauge = ({ score, maxScore, severity, title }: AssessmentGaugeProps) => {
  const config = severityConfig[severity];
  const percentage = Math.round((score / maxScore) * 100);

  // SVG arc gauge
  const cx = 150, cy = 140, r = 110;
  const startAngle = -180;
  const endAngle = 0;

  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const createArc = (start: number, end: number) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  // 5 segments
  const segments = [
    { start: -180, end: -144, color: "#22c55e", label: "Minimal" },
    { start: -144, end: -108, color: "#84cc16", label: "Mild" },
    { start: -108, end: -72, color: "#f59e0b", label: "Moderate" },
    { start: -72, end: -36, color: "#f97316", label: "Mod. Severe" },
    { start: -36, end: 0, color: "#ef4444", label: "Severe" },
  ];

  // Needle angle: map score to -180..0
  const needleAngle = -180 + (score / maxScore) * 180;
  const needleEnd = polarToCartesian(needleAngle);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-muted-foreground mb-1">Online {title} Test</h3>
      <div className="relative w-[300px] h-[180px]">
        <svg viewBox="0 0 300 180" className="w-full h-full">
          {/* Gauge segments */}
          {segments.map((seg, i) => (
            <path
              key={i}
              d={createArc(seg.start, seg.end)}
              fill="none"
              stroke={seg.color}
              strokeWidth="28"
              strokeLinecap="butt"
            />
          ))}

          {/* Segment labels */}
          {segments.map((seg, i) => {
            const midAngle = (seg.start + seg.end) / 2;
            const labelR = r - 38;
            const rad = (midAngle * Math.PI) / 180;
            const lx = cx + labelR * Math.cos(rad);
            const ly = cy + labelR * Math.sin(rad);
            return (
              <text
                key={`label-${i}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground"
                fontSize="9"
                fontWeight="600"
              >
                {seg.label}
              </text>
            );
          })}

          {/* Needle */}
          <motion.line
            x1={cx}
            y1={cy}
            initial={{ x2: cx - r + 10, y2: cy }}
            animate={{ x2: needleEnd.x, y2: needleEnd.y }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="6" fill="#1e293b" />
        </svg>

        {/* Emoji indicators at ends */}
        <span className="absolute left-2 bottom-0 text-2xl">😊</span>
        <span className="absolute right-2 bottom-0 text-2xl">😢</span>
      </div>

      {/* Score display */}
      <div className="flex flex-col items-center -mt-2">
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-5xl font-bold"
            style={{ color: config.color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xl text-muted-foreground font-medium">/ {maxScore}</span>
        </div>
        <motion.div
          className="mt-2 px-5 py-1.5 rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: config.color }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {severity} {config.emoji}
        </motion.div>
        <p className="text-xs text-muted-foreground mt-2">{percentage}% severity score</p>
      </div>
    </div>
  );
};

export default AssessmentGauge;
