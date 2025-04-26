import { motion } from "framer-motion";
import { LogoLarge } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

export function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  return (
    <section 
      className="h-screen pt-16 bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" 
      }}
    >
      <div className="h-full w-full bg-black bg-opacity-70 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <LogoLarge className="mx-auto" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold font-montserrat text-primary mb-6"
          >
            FIND THE PERFECT PARTS
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto"
          >
            Intelligent auto part recommendations powered by AI technology
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              onClick={onGetStartedClick}
              className="bg-primary text-secondary hover:bg-primary/90 font-bold py-4 px-8 rounded-lg text-lg uppercase tracking-wider"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
