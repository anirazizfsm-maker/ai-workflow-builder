import { motion } from "framer-motion";

type Props = {
  className?: string;
  title?: string;
};

// Replace previous tesseract with a cyan-glow animated decagon + internal starframe
export default function TesseractLogo({
  className = "h-8 w-8",
  title = "LETHIMDO Logo",
}: Props) {
  const cyan = "#00e5ff";

  // Generate regular polygon points
  const polyPoints = (sides: number, r: number, cx: number, cy: number, rotation = -Math.PI / 2) => {
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < sides; i++) {
      const a = rotation + (i * 2 * Math.PI) / sides;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
  };

  const outer = polyPoints(10, 40, 50, 50);
  const inner = polyPoints(10, 22, 50, 50);

  const toStr = (pts: Array<[number, number]>) => pts.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <motion.div
      className={className}
      aria-label={title}
      role="img"
      animate={{
        rotate: [-12, 12, -12],
        rotateX: [18, -16, 18],
        rotateY: [-16, 18, -16],
      }}
      whileHover={{ scale: 1.1, rotate: 10, rotateX: -18, rotateY: 18 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 8.0, repeat: Infinity, ease: "easeInOut" }}
      style={{
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        perspective: 700,
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b1" />
            <feGaussianBlur in="b1" stdDeviation="1.6" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wire" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={cyan} />
            <stop offset="100%" stopColor="#7ff9ff" />
          </linearGradient>
        </defs>

        {/* Back edges (faint dashed for depth) */}
        <g opacity="0.28" stroke={cyan} strokeWidth="1.4" strokeDasharray="3 3">
          <polygon points={toStr(outer)} />
          <polygon points={toStr(inner)} />
          {outer.map(([x, y], i) => {
            const [ix, iy] = inner[i];
            return <line key={`b-oi-${i}`} x1={x} y1={y} x2={ix} y2={iy} />;
          })}
          {outer.map(([x, y], i) => {
            const [tx, ty] = outer[(i + 2) % outer.length];
            return <line key={`b-star-${i}`} x1={x} y1={y} x2={tx} y2={ty} />;
          })}
        </g>

        {/* Foreground frame with cyan glow */}
        <polygon
          points={toStr(outer)}
          stroke="url(#wire)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        <polygon
          points={toStr(inner)}
          stroke="url(#wire)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Spokes: outer->inner */}
        {outer.map(([x, y], i) => {
          const [ix, iy] = inner[i];
          return (
            <line
              key={`f-oi-${i}`}
              x1={x}
              y1={y}
              x2={ix}
              y2={iy}
              stroke={cyan}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          );
        })}

        {/* Star connections (every second vertex) */}
        {outer.map(([x, y], i) => {
          const [tx, ty] = outer[(i + 2) % outer.length];
          return (
            <line
              key={`f-star-${i}`}
              x1={x}
              y1={y}
              x2={tx}
              y2={ty}
              stroke={cyan}
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          );
        })}

        {/* Subtle 4D hint: pulsating inner polygon */}
        <motion.g
          initial={{ scale: 1 }}
          animate={{
            scale: [1.0, 0.94, 1.0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <polygon
            points={toStr(inner)}
            stroke="url(#wire)"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
            filter="url(#glow)"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}