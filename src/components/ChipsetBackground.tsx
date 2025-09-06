import { useEffect, useRef } from "react";

// Neon microchip/circuit-style animated background
export default function ChipsetBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function setupCanvas() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    setupCanvas();

    const width = () => canvas.clientWidth;
    const height = () => canvas.clientHeight;

    // Colors / styles (neon cyan)
    const BG = "#000000";
    const TRACE = "rgba(0, 255, 220, 0.75)";
    const TRACE_FAINT = "rgba(0, 120, 110, 0.35)";
    const CHIP_FILL = "rgba(10, 20, 24, 0.9)";
    const CHIP_STROKE = "rgba(0, 255, 220, 0.5)";
    const VIA_FILL = "rgba(0, 255, 220, 0.9)";

    // Data
    let traces: Array<{ points: Array<{ x: number; y: number }>; width: number; faint?: boolean; pulses: Array<{ i: number; speed: number }> }> = [];
    let chips: Array<{ x: number; y: number; w: number; h: number; pins: Array<{ x: number; y: number }> }> = [];
    let vias: Array<{ x: number; y: number; r: number }> = [];

    // Utilities
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const randi = (a: number, b: number) => Math.floor(rand(a, b + 1));

    // Create Manhattan path between two points with optional jog
    function manhattanPath(a: { x: number; y: number }, b: { x: number; y: number }) {
      const pts: Array<{ x: number; y: number }> = [];
      const midType = Math.random() < 0.5 ? "hfirst" : "vfirst";
      const jog = Math.random() < 0.6 ? randi(30, 120) : 0;

      if (midType === "hfirst") {
        const y1 = a.y + (jog ? (Math.random() < 0.5 ? -jog : jog) : 0);
        pts.push({ x: a.x, y: a.y }, { x: b.x, y: y1 }, { x: b.x, y: b.y });
      } else {
        const x1 = a.x + (jog ? (Math.random() < 0.5 ? -jog : jog) : 0);
        pts.push({ x: a.x, y: a.y }, { x: x1, y: a.y }, { x: b.x, y: b.y });
      }

      const dense: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p = pts[i];
        const q = pts[i + 1];
        const dx = Math.sign(q.x - p.x);
        const dy = Math.sign(q.y - p.y);
        const steps = Math.max(Math.abs(q.x - p.x), Math.abs(q.y - p.y));
        for (let s = 0; s <= steps; s += 6) dense.push({ x: p.x + dx * s, y: p.y + dy * s });
      }
      return dense;
    }

    function genChipsAndTraces() {
      traces = [];
      chips = [];
      vias = [];

      const W = width();
      const H = height();

      // Subtle grid (less dense)
      for (let gx = 0; gx < W; gx += 80) {
        traces.push({ points: [{ x: gx, y: 0 }, { x: gx, y: H }], width: 0.6, faint: true, pulses: [] });
      }
      for (let gy = 0; gy < H; gy += 80) {
        traces.push({ points: [{ x: 0, y: gy }, { x: W, y: gy }], width: 0.6, faint: true, pulses: [] });
      }

      // Chips (fewer)
      const chipCount = Math.min(8, Math.max(4, Math.floor((W * H) / 300000)));
      for (let i = 0; i < chipCount; i++) {
        const cw = randi(140, 220);
        const ch = randi(90, 160);
        const cx = randi(60, W - cw - 60);
        const cy = randi(60, H - ch - 60);

        const pins: Array<{ x: number; y: number }> = [];
        const pinGap = 16;

        for (let x = cx + pinGap; x < cx + cw - pinGap; x += pinGap) {
          pins.push({ x, y: cy });
          pins.push({ x, y: cy + ch });
        }
        for (let y = cy + pinGap; y < cy + ch - pinGap; y += pinGap) {
          pins.push({ x: cx, y });
          pins.push({ x: cx + cw, y });
        }

        chips.push({ x: cx, y: cy, w: cw, h: ch, pins });
      }

      // Connections (less)
      const allPins = chips.flatMap((c) => c.pins);
      const connectionCount = Math.min(100, Math.max(30, Math.floor(allPins.length * 0.35)));
      for (let k = 0; k < connectionCount; k++) {
        const a = allPins[randi(0, allPins.length - 1)];
        const b = allPins[randi(0, allPins.length - 1)];
        if (a === b) continue;

        const pts = manhattanPath(a, b);
        traces.push({
          points: pts,
          width: Math.random() < 0.15 ? 3 : Math.random() < 0.45 ? 2 : 1,
          faint: false,
          pulses: [],
        });

        for (let i = 1; i < pts.length - 1; i++) {
          const p = pts[i - 1],
            q = pts[i],
            r = pts[i + 1];
          const turn = (p.x === q.x && q.x !== r.x) || (p.y === q.y && q.y !== r.y);
          if (turn && Math.random() < 0.25) vias.push({ x: q.x, y: q.y, r: rand(2.5, 4) });
        }
      }
    }

    genChipsAndTraces();

    // Pulses (slower, fewer concurrent)
    const pulseTimers: Array<ReturnType<typeof setInterval>> = [];
    function startPulseEmitter() {
      traces.forEach((tr) => {
        const timer = setInterval(() => {
          if ((tr as any).faint) return;
          tr.pulses.push({ i: 0, speed: rand(1.0, 2.4) });
          if (tr.pulses.length > 4) tr.pulses.shift();
        }, randi(1000, 1800));
        pulseTimers.push(timer);
      });
    }
    startPulseEmitter();

    function drawBackground() {
      const W = width(),
        H = height();
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);
    }

    function drawChips() {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      chips.forEach((c) => {
        ctx.fillStyle = CHIP_FILL;
        ctx.strokeStyle = CHIP_STROKE;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = CHIP_STROKE;
        ctx.beginPath();
        ctx.rect(c.x, c.y, c.w, c.h);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = VIA_FILL;
        c.pins.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      ctx.shadowBlur = 0;
    }

    function drawTracesAndPulses() {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      traces.forEach((tr) => {
        const pts = tr.points;
        if (pts.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.lineWidth = tr.width;
        ctx.strokeStyle = (tr as any).faint ? TRACE_FAINT : TRACE;
        ctx.shadowBlur = (tr as any).faint ? 0 : 14;
        ctx.shadowColor = TRACE;
        ctx.stroke();

        if (!(tr as any).faint && tr.pulses.length) {
          tr.pulses.forEach((p) => (p.i += p.speed));
          tr.pulses = tr.pulses.filter((p) => p.i < pts.length);

          tr.pulses.forEach((p) => {
            const idx = Math.floor(p.i);
            const pt = pts[Math.min(idx, pts.length - 1)];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(2, tr.width + 1.5), 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.shadowBlur = 22;
            ctx.shadowColor = "rgba(0, 255, 220, 1)";
            ctx.fill();
          });
        }
      });
      ctx.shadowBlur = 0;

      vias.forEach((v) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
        ctx.fillStyle = VIA_FILL;
        ctx.shadowBlur = 10;
        ctx.shadowColor = TRACE;
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    }

    function tick() {
      drawBackground();
      drawChips();
      drawTracesAndPulses();
      requestAnimationFrame(tick);
    }
    tick();

    const handleResize = () => {
      setupCanvas();
      genChipsAndTraces();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      pulseTimers.forEach(clearInterval);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full pointer-events-none chipset-vignette" />;
}