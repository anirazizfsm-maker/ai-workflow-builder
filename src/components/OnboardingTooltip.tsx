import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingTooltipProps {
  show: boolean;
  onClose: () => void;
  targetSelector?: string;
  message: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function OnboardingTooltip({
  show,
  onClose,
  message,
  position = "bottom",
}: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  if (!isVisible) return null;

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: position === "bottom" ? -10 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`absolute ${positionClasses[position]} z-50 max-w-xs`}
        >
          <div className="relative rounded-xl border border-[#1a2a55] bg-gradient-to-br from-[#1e40af] to-[#2563eb] p-4 shadow-[0_0_24px_rgba(37,99,235,0.45)]">
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="absolute top-2 right-2 h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
            <p className="text-white text-sm pr-6">{message}</p>
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                Got it!
              </Button>
            </div>
            {/* Arrow pointer */}
            <div
              className={`absolute ${
                position === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 border-b-[#1e40af]"
                  : position === "top"
                  ? "top-full left-1/2 -translate-x-1/2 border-t-[#1e40af]"
                  : position === "left"
                  ? "left-full top-1/2 -translate-y-1/2 border-l-[#1e40af]"
                  : "right-full top-1/2 -translate-y-1/2 border-r-[#1e40af]"
              } w-0 h-0 border-8 border-transparent`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
