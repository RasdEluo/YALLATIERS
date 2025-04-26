import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoLarge } from "@/components/ui/logo";

export function WelcomeOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-secondary flex items-center justify-center z-50"
        >
          <div className="text-center">
            <LogoLarge />
            <h1 className="text-4xl font-bold font-montserrat text-primary animate-pulse">
              Welcome to Yalla Tiers
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
