import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";

type PrismProps = {
  height?: number;
  baseWidth?: number;
  animationType?: "rotate" | "hover" | "3drotate" | "hoverRotate";
  glow?: number;
  offset?: { x?: number; y?: number };
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  suspendWhenOffscreen?: boolean;
  timeScale?: number;
  className?: string; // for positioning from parent
};

const Prism = ({
  height = 3.5,
  baseWidth = 5.5,
  animationType = "rotate",
  glow = 1,
  offset = { x: 0, y: 0 },
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.5,
  className = "",
}: PrismProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current as (HTMLDivElement & { __prismIO?: IntersectionObserver }) | null;
    if (!container) return;

    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const GLOW = Math.max(0.0, glow);
    const NOISE = Math.max(0.0, noise);
    const offX = offset?.x ?? 0;
    const offY = offset?.y ?? 0;
    const SAT = transparent ? 1.5 : 1;
    const SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0.0, colorFrequency || 1);
    const BLOOM = Math.max(0.0, bloom || 1);
    const RSX = 1;
    const RSY = 1;
    const RSZ = 1;
    const TS = Math.max(0, timeScale || 1);
    const HOVSTR = Math.max(0, hoverStrength || 1);
    const INERT = Math.max(0, Math.min(1, inertia || 0.12));

    const isMobile =
      typeof window !== "undefined" &&
      !!(window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
    // Force DPR to 1 across devices for smoother performance
    const dpr = 1;
    // Safely initialize WebGL renderer; bail out if context creation fails
    let renderer: Renderer | null = null;
    try {
      renderer = new Renderer({
        dpr,
        alpha: transparent,
        antialias: false,
      });
    } catch (e) {
      console.warn("[Prism] WebGL initialization failed (Renderer constructor). Skipping effect.", e);
      return;
    }
    const gl = (renderer as any)?.gl as any;
    if (!gl) {
      console.warn("[Prism] WebGL context unavailable. Skipping effect.");
      return;
    }
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    const canvasEl = (gl as any).canvas as any;
    // Apply styles only if it's a DOM canvas
    if (canvasEl && (canvasEl as any).style) {
      Object.assign((canvasEl as HTMLCanvasElement).style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
      } as any);
    }
    // Append only if it's an HTMLCanvasElement (OffscreenCanvas can't be appended)
    if (canvasEl && typeof (canvasEl as any).getContext === "function") {
      container.appendChild(canvasEl as HTMLCanvasElement);
    } else {
      // OffscreenCanvas or unknown canvas type — skip attaching to DOM
    }

    const vertex = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdCubeAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = max(max(q.x, q.y), q.z) - 1.0;
        return m * uMinAxis;
      }

      float sdCubeInv(vec3 p){
        return sdCubeAnisoInv(p);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;

        vec3 p;
        vec4 o = vec4(0.0);

        float centerShift = uCenterShift;
        float cf = uColorFreq;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 48;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdCubeInv(q));
          z -= d;
          // Early exit once the ray has sufficiently traversed the shape
          if (z < -3.0) { break; }
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        gl_FragColor = vec4(col, o.a);
      }
    `;

    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array(2);
    const offsetPxBuf = new Float32Array(2);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: 1 },
        uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
        uGlow: { value: GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: {
          value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE),
        },
        uTimeScale: { value: TS },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      offsetPxBuf[0] = offX * dpr;
      offsetPxBuf[1] = offY * dpr;
      program.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const rotBuf = new Float32Array(9);
    const setMat3FromEuler = (yawY: number, pitchX: number, rollZ: number, out: Float32Array) => {
      const cy = Math.cos(yawY), sy = Math.sin(yawY);
      const cx = Math.cos(pitchX), sx = Math.sin(pitchX);
      const cz = Math.cos(rollZ), sz = Math.sin(rollZ);
      const r00 = cy * cz + sy * sx * sz;
      const r01 = -cy * sz + sy * sx * cz;
      const r02 = sy * cx;

      const r10 = cx * sz;
      const r11 = cx * cz;
      const r12 = -sx;

      const r20 = -sy * cz + cy * sx * sz;
      const r21 = sy * sz + cy * sx * cz;
      const r22 = cy * cx;

      out[0] = r00;
      out[1] = r10;
      out[2] = r20;
      out[3] = r01;
      out[4] = r11;
      out[5] = r21;
      out[6] = r02;
      out[7] = r12;
      out[8] = r22;
      return out;
    };

    const applyRotation = (yawY: number, pitchX: number, rollZ: number) => {
      (program.uniforms.uRot as any).value = setMat3FromEuler(yawY, pitchX, rollZ, rotBuf);
    };

    const NOISE_IS_ZERO = NOISE < 1e-6;
    let raf = 0 as number;

    const t0 = performance.now();
    const startRAF = () => {
      if (raf) return;
      raf = requestAnimationFrame(render);
    };
    const stopRAF = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0 as unknown as number;
    };

    const rnd = () => Math.random();
    const wX = (0.2 + rnd() * 0.4) * RSX;
    const wY = (0.15 + rnd() * 0.3) * RSY;
    const wZ = (0.1 + rnd() * 0.2) * RSZ;
    const phX = rnd() * Math.PI * 2;
    const phZ = rnd() * Math.PI * 2;

    let yaw = 0, pitch = 0, roll = 0;
    let targetYaw = 0, targetPitch = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const pointer = { x: 0, y: 0, inside: true };
    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth);
      const wh = Math.max(1, window.innerHeight);
      const cx = ww * 0.5;
      const cy = wh * 0.5;
      const nx = (e.clientX - cx) / (ww * 0.5);
      const ny = (e.clientY - cy) / (wh * 0.5);
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onBlur = () => {
      pointer.inside = false;
    };

    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    (program.uniforms.uUseBaseWobble as any).value = animationType === "rotate" ? 1 : 0;
    let removePointerListeners: (() => void) | null = null;

    if (animationType === "hover" || animationType === "hoverRotate") {
      onPointerMove = (e: PointerEvent) => {
        onMove(e);
        startRAF();
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onBlur);

      removePointerListeners = () => {
        if (onPointerMove) window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onBlur);
      };
    } else if (animationType === "3drotate") {
      (program.uniforms.uUseBaseWobble as any).value = 0;
    } else {
      (program.uniforms.uUseBaseWobble as any).value = 1;
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopRAF();
      } else {
        startRAF();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const render = (t: number) => {
      const time = (t - t0) * 0.001;
      (program.uniforms.iTime as any).value = time;

      let continueRAF = true;

      if (animationType === "hover") {
        const maxPitch = 0.6 * HOVSTR;
        const maxYaw = 0.6 * HOVSTR;
        targetYaw = (pointer.inside ? -pointer.x : 0) * maxYaw;
        targetPitch = (pointer.inside ? pointer.y : 0) * maxPitch;
        const prevYaw = yaw;
        const prevPitch = pitch;
        const prevRoll = roll;
        yaw = lerp(prevYaw, targetYaw, INERT);
        pitch = lerp(prevPitch, targetPitch, INERT);
        roll = lerp(prevRoll, 0, 0.1);
        applyRotation(yaw, pitch, roll);

        if (NOISE_IS_ZERO) {
          const settled =
            Math.abs(yaw - targetYaw) < 1e-4 && Math.abs(pitch - targetPitch) < 1e-4 && Math.abs(roll) < 1e-4;
          if (settled) continueRAF = false;
        }
      } else if (animationType === "hoverRotate") {
        const tScaled = time * TS;
        const baseYaw = tScaled * wY + 0.3;        // gentle planetary spin
        const basePitch = Math.sin(tScaled * wX + phX) * 0.4 + 0.2; // subtle up/down
        const baseRoll = Math.sin(tScaled * wZ + phZ) * 0.3 - 0.15;   // slight tilt

        const maxPitch = 0.4 * HOVSTR;
        const maxYaw = 0.4 * HOVSTR;
        const targetDYaw = (pointer.inside ? -pointer.x * 0.7 : 0) * maxYaw;
        const targetDPitch = (pointer.inside ? pointer.y * 0.7 : 0) * maxPitch;

        const prevYaw = yaw;
        const prevPitch = pitch;
        const prevRoll = roll;

        yaw = lerp(prevYaw, targetDYaw, INERT * 0.8);
        pitch = lerp(prevPitch, targetDPitch, INERT * 0.8);
        roll = lerp(prevRoll, 0, 0.08);

        applyRotation(baseYaw + yaw, basePitch + pitch, baseRoll + roll);

        if (TS < 1e-6 && NOISE_IS_ZERO && !pointer.inside) continueRAF = false;
      } else if (animationType === "3drotate") {
        const tScaled = time * TS;
        yaw = tScaled * wY * 0.8;
        pitch = Math.sin(tScaled * wX + phX) * 0.5;
        roll = Math.sin(tScaled * wZ + phZ) * 0.4;
        applyRotation(yaw, pitch, roll);
        if (TS < 1e-6) continueRAF = false;
      } else {
        rotBuf[0] = 1; rotBuf[1] = 0; rotBuf[2] = 0;
        rotBuf[3] = 0; rotBuf[4] = 1; rotBuf[5] = 0;
        rotBuf[6] = 0; rotBuf[7] = 0; rotBuf[8] = 1;
        (program.uniforms.uRot as any).value = rotBuf;
        if (TS < 1e-6) continueRAF = false;
      }

      renderer.render({ scene: mesh });
      if (continueRAF) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0 as unknown as number;
      }
    };

    if (suspendWhenOffscreen) {
      const io = new IntersectionObserver((entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) startRAF();
        else stopRAF();
      });
      io.observe(container);
      startRAF();
      container.__prismIO = io;
    } else {
      startRAF();
    }

    return () => {
      stopRAF();
      ro.disconnect();
      removePointerListeners?.();
      if (suspendWhenOffscreen) {
        const io = container.__prismIO;
        if (io) io.disconnect();
        delete container.__prismIO;
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (gl && (gl as any).canvas && (gl as any).canvas.parentElement === container) {
        container.removeChild((gl as any).canvas);
      }
    };
  }, [
    height,
    baseWidth,
    animationType,
    glow,
    noise,
    offset?.x,
    offset?.y,
    scale,
    transparent,
    hueShift,
    colorFrequency,
    timeScale,
    hoverStrength,
    inertia,
    bloom,
    suspendWhenOffscreen,
  ]);

  return <div ref={containerRef} className={className} />;
};

export default Prism;