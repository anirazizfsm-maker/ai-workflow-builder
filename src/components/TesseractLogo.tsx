import { motion } from "framer-motion";

type Props = {
  className?: string;
  title?: string;
};

export default function TesseractLogo({
  className = "h-8 w-8",
  title = "LETHIMDO Tesseract",
}: Props) {
  const cyan = "#00e5ff";

  return (
    <motion.div
      className={className}
      aria-label={title}
      role="img"
      // Gentle oscillating rotation for life-like motion
      animate={{ rotate: [-7, 7, -7] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "50% 50%" }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Cyan outer glow */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="blur1" />
            <feGaussianBlur in="blur1" stdDeviation="1.6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wire" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={cyan} />
            <stop offset="100%" stopColor="#7ff9ff" />
          </linearGradient>
        </defs>

        {/* Wireframe tesseract: cyan stroke with glow */}
        {/* Outer cube */}
        <rect
          x="18"
          y="18"
          width="64"
          height="64"
          rx="1"
          stroke="url(#wire)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        {/* Inner cube */}
        <rect
          x="36"
          y="36"
          width="28"
          height="28"
          rx="1"
          stroke="url(#wire)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        {/* Connectors */}
        <path d="M18 18 L36 36" stroke={cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
        <path d="M82 18 L64 36" stroke={cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
        <path d="M18 82 L36 64" stroke={cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
        <path d="M82 82 L64 64" stroke={cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

        {/* Interior diagonals */}
        <path d="M36 36 L64 64" stroke={cyan} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
        <path d="M64 36 L36 64" stroke={cyan} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

        {/* Outer diagonals for depth */}
        <path d="M18 18 L82 82" stroke={cyan} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
        <path d="M82 18 L18 82" stroke={cyan} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
      </svg>
    </motion.div>
  );
}