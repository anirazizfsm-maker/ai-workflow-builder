import React, { useEffect, useRef, useState, useMemo } from 'react';
import './GradualBlur.css';

type Config = {
  position?: 'top' | 'bottom' | 'left' | 'right';
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | 'scroll';
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';
  responsive?: boolean;
  target?: 'parent' | 'page';
  className?: string;
  style?: React.CSSProperties;
  hoverIntensity?: number;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
  onAnimationComplete?: () => void;
};

const DEFAULT_CONFIG: Required<Pick<
  Config,
  | 'position' | 'strength' | 'height' | 'divCount' | 'exponential' | 'zIndex'
  | 'animated' | 'duration' | 'easing' | 'opacity' | 'curve' | 'responsive'
  | 'target' | 'className'
>> = {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear',
  responsive: false,
  target: 'parent',
  className: '',
};

const PRESETS = {
  top: { position: 'top', height: '6rem' },
  bottom: { position: 'bottom', height: '6rem' },
  left: { position: 'left', height: '6rem' },
  right: { position: 'right', height: '6rem' },
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier' as const, divCount: 10 },
  sharp: { height: '5rem', curve: 'linear' as const, divCount: 4 },
  header: { position: 'top', height: '8rem', curve: 'ease-out' as const },
  footer: { position: 'bottom', height: '8rem', curve: 'ease-out' as const },
  sidebar: { position: 'left', height: '6rem', strength: 2.5 },
  'page-header': { position: 'top', height: '10rem', target: 'page' as const, strength: 3 },
  'page-footer': { position: 'bottom', height: '10rem', target: 'page' as const, strength: 3 },
} as const;

const CURVE_FUNCTIONS: Record<NonNullable<Config['curve']>, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

type Props = Config & {
  preset?: keyof typeof PRESETS;
};

const mergeConfigs = (...configs: Array<Record<string, any>>) =>
  configs.reduce((acc, c) => ({ ...acc, ...c }), {});

const getGradientDirection = (position?: string) =>
  ({
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
  } as const)[(position ?? 'bottom') as 'top' | 'bottom' | 'left' | 'right'] ?? 'to bottom';

const debounce = <T extends (...a: any[]) => void>(fn: T, wait: number) => {
  let t: any;
  return (...a: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};

const useResponsiveDimension = (
  responsive: boolean,
  config: Config,
  key: 'height' | 'width'
) => {
  const [value, setValue] = useState<string | undefined>(config[key]);

  useEffect(() => {
    if (!responsive) return;
    const calc = () => {
      const w = window.innerWidth;
      let v = config[key];
      const cap = key[0].toUpperCase() + key.slice(1);
      if (w <= 480 && (config as any)[`mobile${cap}`]) v = (config as any)[`mobile${cap}`];
      else if (w <= 768 && (config as any)[`tablet${cap}`]) v = (config as any)[`tablet${cap}`];
      else if (w <= 1024 && (config as any)[`desktop${cap}`]) v = (config as any)[`desktop${cap}`];
      setValue(v);
    };
    const debounced = debounce(calc, 100);
    calc();
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, [responsive, config, key]);

  return responsive ? value : config[key];
};

const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement | null>,
  shouldObserve: boolean
) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);
  useEffect(() => {
    if (!shouldObserve || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);
  return isVisible;
};

function GradualBlur(props: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  const config = useMemo<Config>(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props) as Config;
  }, [props]);

  const responsiveHeight = useResponsiveDimension(!!config.responsive, config, 'height');
  const responsiveWidth = useResponsiveDimension(!!config.responsive, config, 'width');

  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === 'scroll'
  );

  const blurDivs = useMemo(() => {
    const divs: Array<React.ReactNode> = [];
    const divCount = Math.max(1, config.divCount ?? 5);
    const increment = 100 / divCount;
    const currentStrength =
      isHovered && config.hoverIntensity ? (config.strength ?? 2) * config.hoverIntensity : (config.strength ?? 2);
    const curveFunc = CURVE_FUNCTIONS[config.curve ?? 'linear'];

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);
      let blurValue: number;
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);
      const divStyle: React.CSSProperties = {
        position: 'absolute',
        inset: '0',
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity ?? 1,
        transition:
          config.animated && config.animated !== 'scroll'
            ? `backdrop-filter ${config.duration ?? '0.3s'} ${config.easing ?? 'ease-out'}`
            : undefined,
      };

      divs.push(<div key={i} style={divStyle} />);
    }
    return divs;
  }, [config, isHovered]);

  const containerStyle = useMemo<React.CSSProperties>(() => {
    const isVertical = ['top', 'bottom'].includes(config.position ?? 'bottom');
    const isHorizontal = ['left', 'right'].includes(config.position ?? '');
    const isPageTarget = config.target === 'page';

    const baseStyle: React.CSSProperties = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: config.hoverIntensity ? 'auto' : 'none',
      opacity: isVisible && !atBottom ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration ?? '0.3s'} ${config.easing ?? 'ease-out'}` : undefined,
      zIndex: isPageTarget ? (config.zIndex ?? 1000) + 100 : (config.zIndex ?? 1000),
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight ?? config.height ?? '6rem';
      baseStyle.width = responsiveWidth || '100%';
      (baseStyle as any)[config.position ?? 'bottom'] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight || config.height || '6rem';
      baseStyle.height = '100%';
      (baseStyle as any)[config.position ?? 'left'] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible, atBottom]);

  const { hoverIntensity, animated, onAnimationComplete, duration } = config;

  useEffect(() => {
    if (isVisible && animated === 'scroll' && onAnimationComplete) {
      const ms = parseFloat(duration || '0.3') * 1000;
      const t = setTimeout(() => onAnimationComplete(), ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  useEffect(() => {
    if (config.target !== 'page' || (config.position ?? 'bottom') !== 'bottom') return;

    const checkBottom = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || doc.scrollTop;
      const viewport = window.innerHeight || doc.clientHeight;
      const fullHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        doc.clientHeight,
        doc.scrollHeight,
        doc.offsetHeight
      );
      // Small threshold to account for sub-pixel rounding
      const threshold = 2;
      setAtBottom(scrollTop + viewport >= fullHeight - threshold);
    };

    checkBottom();
    window.addEventListener('scroll', checkBottom, { passive: true });
    window.addEventListener('resize', checkBottom);
    return () => {
      window.removeEventListener('scroll', checkBottom);
      window.removeEventListener('resize', checkBottom);
    };
  }, [config.target, config.position]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${config.className ?? ''}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div
        className="gradual-blur-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {blurDivs}
      </div>
    </div>
  );
}

const GradualBlurMemo = React.memo(GradualBlur) as React.MemoExoticComponent<typeof GradualBlur> & {
  PRESETS: typeof PRESETS;
  CURVE_FUNCTIONS: typeof CURVE_FUNCTIONS;
};

GradualBlurMemo.displayName = 'GradualBlur';
(GradualBlurMemo as any).PRESETS = PRESETS;
(GradualBlurMemo as any).CURVE_FUNCTIONS = CURVE_FUNCTIONS;

export default GradualBlurMemo;

// Inject minimal base styles once (safe on client)
const injectStyles = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'gradual-blur-styles';
  if (document.getElementById(styleId)) return;
  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = `
  .gradual-blur { pointer-events: none; transition: opacity 0.3s ease-out; }
  .gradual-blur-parent { overflow: hidden; }
  .gradual-blur-inner { pointer-events: none; }
  `;
  document.head.appendChild(styleElement);
};
if (typeof document !== 'undefined') {
  injectStyles();
}