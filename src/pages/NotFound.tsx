import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import FixedBrand from "@/components/FixedBrand";

export default function NotFound() {
  const navigate = useNavigate();

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
              <p className="text-lg text-[#9bb1e9] mb-6">Page Not Found</p>
              <Button
                onClick={() => navigate("/")}
                className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Go back home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}