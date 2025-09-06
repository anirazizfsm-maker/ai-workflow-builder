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
        {/* Wireframe tesseract: outer cube, inner cube, connecting edges */}
        {/* Outer cube (projected) */}
        <rect x="18" y="18" width="64" height="64" rx="1" stroke="#000" strokeWidth="2.25" strokeLinejoin="round" />
        {/* Inner cube */}
        <rect x="36" y="36" width="28" height="28" rx="1" stroke="#000" strokeWidth="2.25" strokeLinejoin="round" />
        {/* Connectors between corresponding corners */}
        <path d="M18 18 L36 36" stroke="#000" strokeWidth="2.25" strokeLinejoin="round" />
        <path d="M82 18 L64 36" stroke="#000" strokeWidth="2.25" strokeLinejoin="round" />
        <path d="M18 82 L36 64" stroke="#000" strokeWidth="2.25" strokeLinejoin="round" />
        <path d="M82 82 L64 64" stroke="#000" strokeWidth="2.25" strokeLinejoin="round" />
        {/* Optional interior diagonals to match the reference's wireframe feel */}
        <path d="M36 36 L64 64" stroke="#000" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M64 36 L36 64" stroke="#000" strokeWidth="1.75" strokeLinejoin="round" />
        {/* Outer cube diagonals for added depth (as in many tesseract illustrations) */}
        <path d="M18 18 L82 82" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M82 18 L18 82" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}