import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  MutableRefObject,
} from "react";
import "./LogoLoop.css";

type LogoImageItem = {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  href?: string;
  srcSet?: string;
  sizes?: string;
  ariaLabel?: string;
};

type LogoNodeItem = {
  node: React.ReactNode;
  href?: string;
  ariaLabel?: string;
  title?: string;
};

type LogoItem = LogoImageItem | LogoNodeItem;

type LogoLoopProps = {
  logos: Array<LogoItem>;
  speed?: number;
  direction?: "left" | "right";
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const toCssLength = (value: string | number | undefined) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

const useResizeObserver = (
  callback: () => void,
  elements: Array<MutableRefObject<HTMLElement | null>>,
  dependencies: React.DependencyList,
) => {
  useEffect(() => {
    if (!(window as any).ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new (window as any).ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach((observer) => (observer as any)?.disconnect?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const useImageLoader = (
  seqRef: MutableRefObject<HTMLElement | null>,
  onLoad: () => void,
  dependencies: React.DependencyList,
) => {
  useEffect(() => {
    const images = (seqRef.current?.querySelectorAll("img") as NodeListOf<
      HTMLImageElement
    >) ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach((htmlImg) => {
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener("load", handleImageLoad, { once: true });
        htmlImg.addEventListener("error", handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const useAnimationLoop = (
  trackRef: MutableRefObject<HTMLElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean,
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      (track as HTMLElement).style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - (lastTimestampRef.current as number)) / 1000;
      lastTimestampRef.current = timestamp;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        const translateX = -offsetRef.current;
        (track as HTMLElement).style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover, trackRef]);
};

export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover = true,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = "Partner logos",
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef<HTMLUListElement | null>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const directionMultiplier = direction === "left" ? 1 : -1;
    const speedMultiplier = speed < 0 ? -1 : 1;
    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded =
        Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, []);

  useResizeObserver(updateDimensions, [containerRef as any, seqRef as any], [logos, gap, logoHeight]);
  useImageLoader(seqRef as any, updateDimensions, [logos, gap, logoHeight]);

  useAnimationLoop(trackRef as any, targetVelocity, seqWidth, isHovered, pauseOnHover);

  const cssVariables = useMemo(
    () =>
      ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
      } as React.CSSProperties),
    [gap, logoHeight, fadeOutColor],
  );

  const rootClassName = useMemo(
    () =>
      [
        "logoloop",
        fadeOut && "logoloop--fade",
        scaleOnHover && "logoloop--scale-hover",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [fadeOut, scaleOnHover, className],
  );

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsHovered(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsHovered(false);
  }, [pauseOnHover]);

  const renderLogoItem = useCallback((item: LogoItem, key: React.Key) => {
    const isNodeItem = (item as LogoNodeItem).node !== undefined;

    const content = isNodeItem ? (
      <span className="logoloop__node" aria-hidden={!!(item as LogoNodeItem).href && !(item as LogoNodeItem).ariaLabel}>
        {(item as LogoNodeItem).node}
      </span>
    ) : (
      <img
        src={(item as LogoImageItem).src}
        srcSet={(item as LogoImageItem).srcSet}
        sizes={(item as LogoImageItem).sizes}
        width={(item as LogoImageItem).width}
        height={(item as LogoImageItem).height}
        alt={(item as LogoImageItem).alt ?? ""}
        title={(item as LogoImageItem).title}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );

    const itemAriaLabel = isNodeItem
      ? (item as LogoNodeItem).ariaLabel ?? (item as LogoNodeItem).title
      : (item as LogoImageItem).alt ?? (item as LogoImageItem).title;

    const href = (item as any).href as string | undefined;

    const itemContent = href ? (
      <a
        className="logoloop__link"
        href={href}
        aria-label={itemAriaLabel || "logo link"}
        target="_blank"
        rel="noreferrer noopener"
      >
        {content}
      </a>
    ) : (
      content
    );

    return (
      <li className="logoloop__item" key={key} role="listitem">
        {itemContent}
      </li>
    );
  }, []);

  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? (seqRef as any) : undefined}
        >
          {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
        </ul>
      )),
    [copyCount, logos, renderLogoItem],
  );

  const containerStyle = useMemo(
    () =>
      ({
        width: toCssLength(width) ?? "100%",
        ...cssVariables,
        ...style,
      } as React.CSSProperties),
    [width, cssVariables, style],
  );

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="logoloop__track" ref={trackRef as any}>
        {logoLists}
      </div>
    </div>
  );
});

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;
