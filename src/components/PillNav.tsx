import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import "./PillNav.css";

type Item = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type Props = {
  logo: string;
  logoAlt?: string;
  items: Item[];
  activeHref?: string;
  className?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function PillNav({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  baseColor = "#fff",
  pillColor = "#ffffff",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  ctaLabel = "Pricing",
  ctaHref = "/pricing",
}: Props) {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const loc = useLocation();
  const currentPath = activeHref ?? loc.pathname;

  useEffect(() => {
    // Close mobile menu on route change
    setIsOpen(false);
  }, [loc.pathname]);

  const cssVars: Record<string, string> = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
  };

  const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const NavLink = ({ item, isActive }: { item: Item; isActive: boolean }) => {
    const cls = `pill${isActive ? " is-active" : ""}`;
    if (isExternalLink(item.href)) {
      return (
        <a className={cls} href={item.href} aria-label={item.ariaLabel || item.label}>
          <span className="label-stack">
            <span className="pill-label">{item.label}</span>
            <span className="pill-label-hover" aria-hidden="true">
              {item.label}
            </span>
          </span>
        </a>
      );
    }
    return (
      <Link className={cls} to={item.href} aria-label={item.ariaLabel || item.label}>
        <span className="label-stack">
          <span className="pill-label">{item.label}</span>
          <span className="pill-label-hover" aria-hidden={true}>
            {item.label}
          </span>
        </span>
      </Link>
    );
  };

  return (
    <div className="pill-nav-container" style={cssVars}>
      <nav className={`pill-nav ${className}`} aria-label="Primary">
        {/* Logo */}
        {isExternalLink(items?.[0]?.href || "/") ? (
          <a className="pill-logo" href={items?.[0]?.href || "#"} aria-label="Home">
            <img src={logo} alt={logoAlt} />
          </a>
        ) : (
          <Link className="pill-logo" to={items?.[0]?.href || "/"} aria-label="Home">
            <img src={logo} alt={logoAlt} />
          </Link>
        )}

        {/* Desktop nav */}
        <div className="pill-nav-items desktop-only">
          <ul className="pill-list" role="menubar">
            {items.map((item) => (
              <li key={item.href} role="none">
                <NavLink item={item} isActive={currentPath === item.href} />
              </li>
            ))}
          </ul>
        </div>

        {/* Right actions */}
        <div className="pill-actions desktop-only">
          {isExternalLink(ctaHref) ? (
            <a className="pill-cta" href={ctaHref}>
              {ctaLabel}
            </a>
          ) : (
            <Link className="pill-cta" to={ctaHref}>
              {ctaLabel}
            </Link>
          )}
        </div>

        {/* Mobile button */}
        <button
          className="mobile-menu-button mobile-only"
          onClick={() => setIsOpen((s) => !s)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef}>
          <ul className="mobile-menu-list">
            {items.map((item) => {
              const cls = `mobile-menu-link${currentPath === item.href ? " is-active" : ""}`;
              return (
                <li key={item.href}>
                  {isExternalLink(item.href) ? (
                    <a className={cls} href={item.href} onClick={() => setIsOpen(false)}>
                      {item.label}
                    </a>
                  ) : (
                    <Link className={cls} to={item.href} onClick={() => setIsOpen(false)}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
            <li>
              {isExternalLink(ctaHref) ? (
                <a className="mobile-menu-link" href={ctaHref} onClick={() => setIsOpen(false)}>
                  {ctaLabel}
                </a>
              ) : (
                <Link className="mobile-menu-link" to={ctaHref} onClick={() => setIsOpen(false)}>
                  {ctaLabel}
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
