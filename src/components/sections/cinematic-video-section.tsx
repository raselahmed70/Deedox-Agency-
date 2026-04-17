import React from 'react';
import { motion } from 'framer-motion';

interface CinematicVideoSectionProps {
  src: string;
}

const CinematicVideoSection: React.FC<CinematicVideoSectionProps> = ({ src }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Subtle Overlay to match Liquid Glass theme */}
      <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[2px]" />
      
      {/* Scroll indicator for visual continuity */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
};

export default CinematicVideoSection;
