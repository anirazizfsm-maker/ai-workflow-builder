import { forwardRef, useMemo, useRef, useEffect, MutableRefObject } from "react";
import { motion } from "framer-motion";
import "./VariableProximity.css";

type Falloff = "linear" | "exponential" | "gaussian";

type Props = {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  radius?: number;
  falloff?: Falloff;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLSpanElement>;

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId = 0 as number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef: MutableRefObject<HTMLElement | null>) {
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef<HTMLSpanElement, Props>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = "linear",
    className = "",
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const smoothedPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const [name, value] = s.split(" ");
            return [name.replace(/['"]/g, ""), parseFloat(value)] as const;
          }),
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x2 - x1, y2 - y1);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case "exponential":
        return norm ** 2;
      case "gaussian":
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case "linear":
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    // Smooth the pointer: gently approach the actual pointer each frame
    const targetX = mousePositionRef.current.x;
    const targetY = mousePositionRef.current.y;

    // Initialize smoothing on first run to avoid jump
    if (lastPositionRef.current.x === null || lastPositionRef.current.y === null) {
      smoothedPositionRef.current.x = targetX;
      smoothedPositionRef.current.y = targetY;
    } else {
      // Low-pass filter (tweak alpha for more/less smoothing)
      const alpha = 0.18;
      smoothedPositionRef.current.x += (targetX - smoothedPositionRef.current.x) * alpha;
      smoothedPositionRef.current.y += (targetY - smoothedPositionRef.current.y) * alpha;
    }

    const sx = smoothedPositionRef.current.x;
    const sy = smoothedPositionRef.current.y;

    // Short-circuit if movement is negligible to reduce layout thrash
    if (
      lastPositionRef.current.x !== null &&
      lastPositionRef.current.y !== null &&
      Math.abs((lastPositionRef.current.x as number) - sx) < 0.25 &&
      Math.abs((lastPositionRef.current.y as number) - sy) < 0.25
    ) {
      return;
    }
    lastPositionRef.current = { x: sx, y: sy };

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        sx,
        sy,
        letterCenterX,
        letterCenterY,
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(", ");

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  });

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: "inline", ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: "inline-block",
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex],
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: "inline-block" }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = "VariableProximity";
export default VariableProximity;