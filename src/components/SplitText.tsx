import { useEffect, useMemo, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

type VectorStyle = Partial<{
  opacity: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}>;

type SplitMode = "chars" | "words";

type Props = {
  text: string;
  className?: string;
  delay?: number; // ms between letter animations
  duration?: number; // seconds per letter animation
  ease?: string; // e.g., "power3.out" (mapped to easeOut)
  splitType?: SplitMode;
  from?: VectorStyle;
  to?: VectorStyle;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
};

function mapEase(ease?: string) {
  if (!ease) return "easeOut";
  const lower = ease.toLowerCase();
  if (lower.includes("power") || lower.includes("expo") || lower.includes("quad") || lower.includes("quart")) {
    return "easeOut";
  }
  if (lower.includes("linear")) return "linear";
  if (lower.includes("back")) return "backOut";
  if (lower.includes("elastic")) return "easeOut";
  return "easeOut";
}

export default function SplitText({
  text,
  className = "",
  delay = 0.1 * 1000,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete,
}: Props) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) setInView(true);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  const units = useMemo(() => {
    if (splitType === "words") {
      // Preserve spaces between words by including them in render
      const words = text.split(" ");
      const arr: Array<{ value: string; key: string }> = [];
      words.forEach((w, i) => {
        arr.push({ value: w, key: `w-${i}` });
        if (i < words.length - 1) arr.push({ value: " ", key: `s-${i}` });
      });
      return arr;
    }
    // chars mode (preserve spaces as separate entries)
    return Array.from(text).map((ch, i) => ({ value: ch, key: `c-${i}` }));
  }, [text, splitType]);

  const letterVariants: Variants = {
    hidden: { ...from },
    show: { ...to },
  };

  const groupVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        when: "beforeChildren",
        staggerChildren: Math.max(0, delay / 1000),
      },
    },
  };

  const mappedEase = mapEase(ease);

  return (
    <motion.span
      ref={containerRef}
      className={className}
      style={{ display: "inline-block", textAlign }}
      variants={groupVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      onAnimationComplete={(def) => {
        // def is the completed variant name; fire once when parent completes
        if (def === "show") onLetterAnimationComplete?.();
      }}
    >
      {units.map(({ value, key }) =>
        value === " " ? (
          <span key={key} style={{ display: "inline-block", whiteSpace: "pre" }}>
            {" "}
          </span>
        ) : (
          <motion.span
            key={key}
            variants={letterVariants}
            transition={{ duration: Math.max(0, duration), ease: mappedEase }}
            style={{ display: "inline-block", willChange: "transform, opacity" }}
          >
            {value}
          </motion.span>
        ),
      )}
    </motion.span>
  );
}
