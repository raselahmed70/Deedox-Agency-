import React from 'react';
import { motion } from 'framer-motion';

interface CinematicImageSectionProps {
  src: string;
}

const CinematicImageSection: React.FC<CinematicImageSectionProps> = ({ src }) => {
  return (
    <section className="relative w-full overflow-hidden bg-black leading-[0]">
      {/* Cinematic Image */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-auto"
      >
        <img 
          src={src} 
          alt="Cinematic Story" 
          className="w-full h-auto object-cover"
        />
      </motion.div>

      {/* Subtle Overlay to match Liquid Glass theme */}
      <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[1px] pointer-events-none" />
    </section>
  );
};

export default CinematicImageSection;
