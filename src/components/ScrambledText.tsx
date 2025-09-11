import React, { useEffect, useRef } from "react";
import "./ScrambledText.css";

type ScrambledTextProps = {
  radius?: number;         // px influence radius from cursor
  duration?: number;       // seconds for each char to resolve
  speed?: number;          // scramble speed factor (higher = faster changes)
  scrambleChars?: string;  // characters used during scrambling
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

type AnimState = {
  timer: number | null;
  endAt: number;
  interval: number | null;
};

export default function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:|/\\_-+=*#@%!$&?",
  className = "",
  style = {},
  children,
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pRef = useRef<HTMLParagraphElement | null>(null);
  const running = useRef<WeakMap<HTMLSpanElement, AnimState>>(new WeakMap());

  // Split the text into spans
  useEffect(() => {
    if (!rootRef.current) return;
    const p = rootRef.current.querySelector("p");
    if (!p) return;
    pRef.current = p as HTMLParagraphElement;

    const original = Array.from(p.childNodes)
      .map((n) => n.textContent ?? "")
      .join("");

    // Clear and rebuild
    p.textContent = "";
    for (const ch of original) {
      const span = document.createElement("span");
      span.className = "char";
      // Preserve spaces
      span.textContent = ch;
      (span as any).dataset = (span as any).dataset || {};
      (span as any).dataset.original = ch;
      p.appendChild(span);
    }

    return () => {
      // On unmount, no special revert needed as React will clean up
    };
  }, [children]);

  // Helper to compute distance
  const charCenterDistance = (el: HTMLSpanElement, x: number, y: number) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    return Math.hypot(dx, dy);
  };

  // Start a scramble animation for a specific char
  const triggerScramble = (el: HTMLSpanElement, strength: number) => {
    // strength in [0..1], 1 means close, 0 means far
    const totalMs = Math.max(120, duration * 1000 * strength);
    const minInterval = 16; // ~60fps
    const baseInterval = 50; // default tick
    const intervalMs = Math.max(minInterval, baseInterval / Math.max(0.1, speed));

    // Cancel previous
    const state = running.current.get(el);
    if (state?.interval) window.clearInterval(state.interval);
    if (state?.timer) window.clearTimeout(state.timer);

    const orig = (el as any).dataset?.original ?? el.textContent ?? "";
    const chars = scrambleChars;
    const pick = () => chars[Math.floor(Math.random() * chars.length)] ?? "*";

    // If space, do nothing
    if (orig === " ") {
      el.textContent = " ";
      return;
    }

    // Scramble at interval, then resolve at the end
    const interval = window.setInterval(() => {
      el.textContent = pick();
    }, intervalMs);

    const timer = window.setTimeout(() => {
      window.clearInterval(interval);
      el.textContent = orig;
      running.current.delete(el);
    }, totalMs);

    running.current.set(el, { timer, endAt: performance.now() + totalMs, interval });
  };

  // Pointer move effect
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleMove = (e: PointerEvent) => {
      const p = pRef.current;
      if (!p) return;
      const spans = Array.from(p.querySelectorAll<HTMLSpanElement>("span.char"));
      for (const s of spans) {
        const dist = charCenterDistance(s, e.clientX, e.clientY);
        if (dist < radius) {
          const strength = 1 - dist / radius; // closer -> stronger
          triggerScramble(s, strength);
        }
      }
    };

    root.addEventListener("pointermove", handleMove, { passive: true });
    return () => root.removeEventListener("pointermove", handleMove);
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{typeof children === "string" ? children : String(children ?? "")}</p>
    </div>
  );
}
