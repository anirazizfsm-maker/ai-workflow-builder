import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import TesseractLogo from "@/components/TesseractLogo";

export default function FixedBrand() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/")}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-3 py-2 backdrop-blur-md text-white hover:bg-black/40"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Go to home"
    >
      <TesseractLogo className="h-7 w-7" size={48} color="#00e5ff" />
      <span className="font-extrabold tracking-tight">LETHIMDO</span>
    </motion.button>
  );
}
