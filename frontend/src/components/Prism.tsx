import React, { useEffect, useRef } from 'react';
import './Prism.css';

interface PrismProps {
  animationType?: 'hover' | 'idle';
  transparent?: boolean;
  suspendWhenOffscreen?: boolean;
  className?: string;
  height?: number;
  baseWidth?: number;
  scale?: number;
  glow?: number;
  noise?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  timeScale?: number;
}

const Prism: React.FC<PrismProps> = ({
  animationType = 'idle',
  transparent = false,
  suspendWhenOffscreen = false,
  className = '',
  height = 3.2,
  baseWidth = 5.0,
  scale = 3.0,
  glow = 1.2,
  noise = 0.12,
  hueShift = 0.2,
  colorFrequency = 1.0,
  hoverStrength = 2.2,
  inertia = 0.06,
  bloom = 1.1,
  timeScale = 0.8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (container) {
        const rect = container.getBoundingClientRect();
        mousePositionRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Visibility tracking
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation loop
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (suspendWhenOffscreen && !isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Update velocity with inertia
      const dx = mousePositionRef.current.x - lastMousePositionRef.current.x;
      const dy = mousePositionRef.current.y - lastMousePositionRef.current.y;
      velocityRef.current.x = velocityRef.current.x * (1 - inertia) + dx * inertia;
      velocityRef.current.y = velocityRef.current.y * (1 - inertia) + dy * inertia;
      lastMousePositionRef.current = { ...mousePositionRef.current };

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set composite operation for glow effect
      ctx.globalCompositeOperation = 'lighter';

      // Draw prisms
      drawPrisms(ctx, canvas.width, canvas.height, deltaTime);

      animationRef.current = requestAnimationFrame(animate);
    };

    const drawPrisms = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      deltaTime: number
    ) => {
      const time = performance.now() * 0.001 * timeScale;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Calculate mouse influence
      let mouseInfluence = 0;
      if (animationType === 'hover') {
        const dx = mousePositionRef.current.x - centerX;
        const dy = mousePositionRef.current.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        mouseInfluence = Math.max(0, 1 - distance / Math.max(width, height));
        mouseInfluence = Math.pow(mouseInfluence, 2) * hoverStrength;
      }

      // Draw multiple prisms
      const prismCount = 3;
      for (let i = 0; i < prismCount; i++) {
        const angleOffset = (i / prismCount) * Math.PI * 2;
        const sizeFactor = 0.7 + (i / prismCount) * 0.6;
        
        // Animate position
        const angle = time * 0.2 + angleOffset;
        const radius = Math.min(width, height) * 0.1 * sizeFactor;
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;
        
        // Apply mouse influence
        if (animationType === 'hover') {
          const mouseDx = mousePositionRef.current.x - x;
          const mouseDy = mousePositionRef.current.y - y;
          x += mouseDx * mouseInfluence * 0.05;
          y += mouseDy * mouseInfluence * 0.05;
        }
        
        drawPrism(ctx, x, y, time, sizeFactor, mouseInfluence, deltaTime);
      }
    };

    const drawPrism = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      time: number,
      sizeFactor: number,
      mouseInfluence: number,
      deltaTime: number
    ) => {
      const h = height * sizeFactor;
      const w = baseWidth * sizeFactor;
      
      // Calculate colors
      const hue = (time * hueShift * 10 + mouseInfluence * 20) % 360;
      const saturation = 70 + Math.sin(time * colorFrequency) * 20;
      const lightness = 60 + Math.cos(time * colorFrequency * 0.7) * 20;
      
      // Apply glow and bloom
      const glowAmount = glow + mouseInfluence * 0.5;
      const bloomAmount = bloom + mouseInfluence * 0.3;
      
      ctx.save();
      ctx.translate(x, y);
      
      // Draw prism shape
      ctx.beginPath();
      ctx.moveTo(0, -h/2);
      ctx.lineTo(w/2, h/4);
      ctx.lineTo(0, h/2);
      ctx.lineTo(-w/2, h/4);
      ctx.closePath();
      
      // Create gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${transparent ? 0.3 : 0.7})`);
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add glow
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
      ctx.shadowBlur = 20 * glowAmount * bloomAmount;
      ctx.fill();
      
      // Add noise
      if (noise > 0) {
        ctx.globalAlpha = noise;
        ctx.fillStyle = `hsla(${(hue + 180) % 360}, ${saturation}%, ${lightness}%, 0.3)`;
        for (let i = 0; i < 20; i++) {
          const nx = (Math.random() - 0.5) * w;
          const ny = (Math.random() - 0.5) * h;
          const nw = Math.random() * w * 0.1;
          const nh = Math.random() * h * 0.1;
          ctx.fillRect(nx, ny, nw, nh);
        }
      }
      
      ctx.restore();
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    animationType,
    transparent,
    suspendWhenOffscreen,
    height,
    baseWidth,
    scale,
    glow,
    noise,
    hueShift,
    colorFrequency,
    hoverStrength,
    inertia,
    bloom,
    timeScale,
  ]);

  return (
    <div ref={containerRef} className={`prism-container ${className}`}>
      <canvas ref={canvasRef} className="prism-canvas" />
    </div>
  );
};

export default Prism;