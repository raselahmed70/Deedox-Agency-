import { motion, useMotionValue } from 'framer-motion';
import { Sparkles, Zap, Shield, Rocket, Heart } from 'lucide-react';
import { cn } from "../../lib/utils";
import { useSettings } from '../../context/SettingsContext';

const features = [
    { 
        title: "Premium & Modern Design", 
        description: "World-class aesthetics that build instant trust with every visitor.",
        icon: Sparkles,
        glow: "from-blue-500/20"
    },
    { 
        title: "Fast & Responsive", 
        description: "Pixel-perfect rendering and lightning-speed loads across all devices.",
        icon: Zap,
        glow: "from-yellow-500/20"
    },
    { 
        title: "SEO-Friendly Core", 
        description: "Architected for maximum visibility and dominant search rankings.",
        icon: Shield,
        glow: "from-emerald-500/20"
    },
    { 
        title: "Conversion Focused", 
        description: "Strategic layouts designed to turn passive visitors into loyal customers.",
        icon: Rocket,
        glow: "from-purple-500/20"
    },
    { 
        title: "Elite Performance", 
        description: "Cutting-edge code for a smooth, lag-free cinematic experience.",
        icon: Shield,
        glow: "from-red-500/20"
    },
    { 
        title: "Dedicated Support", 
        description: "Human-centric partnership that extends far beyond the final launch.",
        icon: Heart,
        glow: "from-cyan-500/20"
    }
];

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={onMouseMove}
            className="group relative liquid-glass p-8 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 overflow-hidden"
        >
            {/* Spotlight Glow Effect */}
            <motion.div
                className={cn(
                    "pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),_var(--tw-gradient-from)_0%,_transparent_40%)]",
                    feature.glow
                )}
                style={{
                    "--x": mouseX ? `${mouseX.get()}px` : '0px',
                    "--y": mouseY ? `${mouseY.get()}px` : '0px',
                } as any}
            />

            <div className="relative z-10 flex flex-col gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                    <feature.icon className="h-6 w-6 text-white group-hover:text-white transition-colors" />
                </div>
                
                <div className="space-y-3">
                    <h3 className="text-xl font-medium text-white group-hover:translate-x-1 transition-transform duration-500">
                        {feature.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed font-sans group-hover:text-white/60 transition-colors duration-500">
                        {feature.description}
                    </p>
                </div>
            </div>

            {/* Subtle bottom accent line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-1000" />
        </motion.div>
    );
}

const WhyChooseUs: React.FC = () => {
    const { bgOpacity1, bgImage1 } = useSettings();
    
    return (
        <section className="relative w-full py-32 px-6 overflow-hidden">
            {/* Immersive Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={bgImage1} 
                    alt="Background" 
                    className="w-full h-full object-cover grayscale-[0.5] transition-opacity duration-700"
                    style={{ opacity: bgOpacity1 / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505]" />
            </div>

            {/* Ambient Background Light */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 z-0" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-white/30 text-xs font-bold uppercase tracking-[4px] mb-4 block"
                        >
                            Executive Advantage
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-[0.95]"
                        >
                            Why Choose <br/>
                            <em className="not-italic text-white/40 italic">Deedox Agency</em>
                        </motion.h2>
                    </div>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-white/40 max-w-sm text-lg font-sans leading-relaxed"
                    >
                        We merge cinematic vision with performance-driven architecture to deliver digital experiences that define industries.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <FeatureCard key={idx} feature={feature} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
