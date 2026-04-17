import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const stats = [
    { label: "Elite Projects Delivered", value: "100" },
    { label: "Industry Partners", value: "50" },
    { label: "Client Equity Growth", value: "99" },
];

const StatsSection: React.FC = () => {
    const { bgOpacity3, bgImage3 } = useSettings();
    const containerRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xPos = useTransform(scrollYProgress, [0, 1], [-100, 100]);

    return (
        <section ref={containerRef} className="relative w-full py-40 px-6 overflow-hidden">
            {/* Immersive Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={bgImage3} 
                    alt="Background" 
                    className="w-full h-full object-cover transition-opacity duration-700"
                    style={{ opacity: bgOpacity3 / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/40 to-[#050505]" />
            </div>
            {/* Background Parallax Text */}
            <motion.div 
                style={{ x: xPos }}
                className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none"
            >
                <h2 className="text-[40vw] font-serif font-bold whitespace-nowrap">DISTINCTION</h2>
            </motion.div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-4 flex-wrap">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="relative group flex flex-col items-center md:items-start">
                            {/* Animated Background Glow */}
                            <div className="absolute -inset-10 bg-blue-500/0 group-hover:bg-blue-500/5 blur-3xl rounded-full transition-colors duration-1000" />
                            
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative"
                            >
                                <div className="flex items-baseline gap-1 mb-2">
                                    <motion.span 
                                        initial={{ letterSpacing: "10px", opacity: 0 }}
                                        whileInView={{ letterSpacing: "-2px", opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2, duration: 1.5, ease: "easeOut" }}
                                        className="text-7xl md:text-9xl font-serif text-white leading-none tracking-[-4px]"
                                    >
                                        {stat.value}
                                    </motion.span>
                                    <span className="text-4xl md:text-5xl font-serif text-white/20 select-none">
                                        {stat.value === "99" ? "%" : "+"}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "40px" }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.3 + 0.5, duration: 1 }}
                                        className="h-[2px] bg-white/40"
                                    />
                                    <p className="text-xs md:text-sm uppercase tracking-[4px] text-white/40 font-bold font-sans">
                                        {stat.label}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Divider for desktop */}
                            {idx < stats.length - 1 && (
                                <div className="hidden md:block absolute right-[-40px] top-1/4 bottom-1/4 w-[1px] overflow-hidden">
                                    <motion.div 
                                        initial={{ y: "-100%" }}
                                        whileInView={{ y: "100%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="h-1/2 w-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
