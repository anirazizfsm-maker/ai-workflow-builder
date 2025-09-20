import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function FixedBrand() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/")}
      className="fixed top-2 left-2 md:top-4 md:left-4 z-50 flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-2 py-1.5 md:px-3 md:py-1.5 backdrop-blur-md text-white hover:bg-black/40 hover:ring-2 hover:ring-cyan-400/50"
      whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,229,255,0.55))" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      aria-label="Go to home"
    >
      <img
        src="/assets/lethimdo-mark.svg"
        alt="LETHIMDO"
        className="h-5 w-5"
      />
      <span className="font-extrabold tracking-tight">LETHIMDO</span>
    </motion.button>
  );
}