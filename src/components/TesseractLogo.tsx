import { motion } from "framer-motion";

type Props = {
  className?: string;
  title?: string;
};

export default function TesseractLogo({ className = "h-8 w-8", title = "LETHIMDO Tesseract" }: Props) {
  return (
    <div className={className} aria-label={title} role="img">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Cyan glow gradient */}
          <linearGradient id="cyanGrad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="oklch(0.79 0.18 210)" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 210)" />
          </linearGradient>
          {/* Outer glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Moving cyan streak */}
          <linearGradient id="streak" x1="0" y1="0" x2="100" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="35%" stopColor="oklch(0.82 0.2 210)" />
            <stop offset="65%" stopColor="oklch(0.82 0.2 210)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          {/* Subtle vignette for depth */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </radialGradient>
        </defs>

        {/* Background vignette circle (very subtle) */}
        <circle cx="50" cy="50" r="46" fill="url(#vignette)" opacity="0.25" />

        {/* Inner rotating cube (to hint at a tesseract) */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          filter="url(#glow)"
        >
          {/* Back square */}
          <rect x="18" y="18" width="40" height="40" rx="2"
            stroke="url(#cyanGrad)" strokeOpacity="0.5" strokeWidth="1.2" />
          {/* Front square (offset to create 4D-ish look) */}
          <rect x="42" y="42" width="40" height="40" rx="2"
            stroke="url(#cyanGrad)" strokeWidth="1.5" />

          {/* Connectors */}
          <path d="M18 18 L42 42" stroke="url(#cyanGrad)" strokeOpacity="0.7" strokeWidth="1.1" />
          <path d="M58 18 L82 42" stroke="url(#cyanGrad)" strokeOpacity="0.7" strokeWidth="1.1" />
          <path d="M18 58 L42 82" stroke="url(#cyanGrad)" strokeOpacity="0.7" strokeWidth="1.1" />
          <path d="M58 58 L82 82" stroke="url(#cyanGrad)" strokeOpacity="0.7" strokeWidth="1.1" />

          {/* Cyan light streak passing through */}
          <motion.rect
            x="-100"
            y="49"
            width="200"
            height="2"
            fill="url(#streak)"
            initial={{ x: -120 }}
            animate={{ x: 120 }}
            transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }}
          />

          {/* Diagonal streak for extra dynamics */}
          <motion.path
            d="M-20 20 L120 80"
            stroke="url(#streak)"
            strokeWidth="1.25"
            initial={{ pathLength: 0, opacity: 0.0 }}
            animate={{ pathLength: 1, opacity: [0.0, 0.9, 0.0] }}
            transition={{ duration: 3.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
          />
        </motion.g>

        {/* Static outline circle for crisp shape */}
        <circle cx="50" cy="50" r="47"
          stroke="url(#cyanGrad)" strokeOpacity="0.35" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
