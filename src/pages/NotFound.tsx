import { motion } from "framer-motion";
import FixedBrand from "@/components/FixedBrand";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col dark bg-[#0b1120]"
    >
      <FixedBrand />
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto relative px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">404</h1>
              <p className="text-lg text-[#9bb1e9]">Page Not Found</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}