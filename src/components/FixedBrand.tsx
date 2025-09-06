import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import TesseractLogo from "@/components/TesseractLogo";

export default function FixedBrand() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/")}
      className="fixed top-3 left-3 md:top-6 md:left-6 z-50 flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-2.5 py-1.5 md:px-4 md:py-2 backdrop-blur-md text-white hover:bg-black/40 hover:ring-2 hover:ring-cyan-400/50"
      whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,229,255,0.55))" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      aria-label="Go to home"
    >
      <TesseractLogo className="h-8 w-8 md:h-10 md:w-10" size={64} color="#00e5ff" />
      <span className="font-extrabold tracking-tight">LETHIMDO</span>
    </motion.button>
  );
}