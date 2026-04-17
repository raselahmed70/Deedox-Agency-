import React, { useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSettings, type Service } from '../../context/SettingsContext';
import { cn } from '../../lib/utils';
import {
    Globe, ShoppingCart, User, Zap, Settings, Smartphone, Camera, Code, Cpu, Database, 
    Layout, Layers, MessageSquare, Palette, Search, Shield, TrendingUp, Video
} from 'lucide-react';

const IconMapper: Record<string, React.ComponentType<{ className?: string }>> = {
    'Globe': Globe, 'ShoppingCart': ShoppingCart, 'User': User, 'Zap': Zap, 'Settings': Settings,
    'Smartphone': Smartphone, 'Camera': Camera, 'Code': Code, 'Cpu': Cpu, 'Database': Database,
    'Layout': Layout, 'Layers': Layers, 'MessageSquare': MessageSquare, 'Palette': Palette,
    'Search': Search, 'Shield': Shield, 'TrendingUp': TrendingUp, 'Video': Video
};

const glowColors = [
    "from-white/10", "from-zinc-500/10", "from-slate-500/10", 
    "from-white/5", "from-zinc-400/10", "from-slate-400/10",
];

// --- Detail Modal ---
const ServiceDetailModal = ({ service, onClose }: { service: Service; onClose: () => void }) => {
    const Icon = IconMapper[service.icon] || Globe;
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
            {/* Backdrop Blur Layer */}
            <motion.div
                initial={{ backdropFilter: "blur(0px)" }}
                animate={{ backdropFilter: "blur(40px)" }}
                exit={{ backdropFilter: "blur(0px)" }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 cursor-pointer"
            />

            {/* Liquid Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        x: [0, 100, -50, 0],
                        y: [0, -50, 100, 0],
                        rotate: [0, 90, 180, 360]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, -100, 50, 0],
                        y: [0, 100, -50, 0],
                        rotate: [360, 180, 90, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-zinc-500/5 blur-[100px] rounded-full" 
                />
            </div>

            {/* Content Modal */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-5xl mx-auto p-8 md:p-16 rounded-[40px] liquid-glass border border-white/10 bg-white/[0.02] shadow-2xl z-20"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-white/50 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col gap-12">
                    <div className="max-w-2xl">
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 text-sm font-bold uppercase tracking-[4px] mb-4 block"
                        >
                            Service Capability
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-7xl font-serif text-white leading-tight"
                        >
                            {service.title.includes(' ') ? (
                                <>
                                    {service.title.split(' ')[0]} <em className="not-italic text-white/40">{service.title.split(' ').slice(1).join(' ')}</em>
                                </>
                            ) : (
                                service.title
                            )}
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all duration-500">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-serif text-white mt-2">Strategic Overview</h3>
                            <p className="text-white/40 text-sm leading-relaxed font-sans italic">
                                "{service.description}"
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all duration-500">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-serif text-white mt-2">Capability Details</h3>
                            <div className="text-white/40 text-sm leading-relaxed font-sans">
                                {service.details ? (
                                    <p className="whitespace-pre-wrap">{service.details}</p>
                                ) : (
                                    <p>Experience the cinematic transformation of your brand with our premium digital environments. We combine technical precision with avant-garde aesthetics to ensure your service stands out in the global digital landscape.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex justify-end">
                        <a 
                            href="#contact" 
                            onClick={onClose}
                            className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-[2px]"
                        >
                            Discuss Project Architecture
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ServiceCard = ({ 
    service, 
    index, 
    onSelect 
}: { 
    service: any; 
    index: number; 
    onSelect: (s: Service) => void 
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const Icon = IconMapper[service.icon] || Globe;
    const glow = glowColors[index % glowColors.length];

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
            onClick={() => onSelect(service)}
            className="group relative liquid-glass p-8 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 overflow-hidden flex flex-col cursor-pointer"
        >
            <motion.div
                className={cn(
                    "pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),_var(--tw-gradient-from)_0%,_transparent_40%)]",
                    glow
                )}
                style={{
                    "--x": mouseX ? `${mouseX.get()}px` : '0px',
                    "--y": mouseY ? `${mouseY.get()}px` : '0px',
                } as React.CSSProperties}
            />

            <div className="relative z-10 flex flex-col gap-6 h-full">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                    <Icon className="h-6 w-6 text-white group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-medium text-white group-hover:translate-x-1 transition-transform duration-500 uppercase tracking-tight">
                        {service.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed font-sans group-hover:text-white/60 transition-colors duration-500">
                        {service.description}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 mt-auto pt-4 group-hover:translate-x-1 transition-transform group-hover:text-white/70">
                    Learn More
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-1000" />
        </motion.div>
    );
};

const OurServices: React.FC = () => {
    const { bgOpacity2, bgImage2, services: dbServices } = useSettings();
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const displayServices = dbServices?.length > 0
        ? dbServices.filter(s => s.visible !== false)
        : [];

    return (
        <section id="services" className="relative w-full py-32 px-6 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage2}
                    alt="Background"
                    className="w-full h-full object-cover grayscale transition-opacity duration-700"
                    style={{ opacity: bgOpacity2 / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505]" />
            </div>

            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-white/30 text-xs font-bold uppercase tracking-[4px] mb-4 block"
                        >
                            What We Do
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-[0.95]"
                        >
                            Our <br />
                            <em className="not-italic text-white/40 italic">Services</em>
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayServices.map((service, idx) => (
                        <ServiceCard 
                            key={service.id || idx} 
                            service={service} 
                            index={idx} 
                            onSelect={(s) => setSelectedService(s)}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedService && (
                    <ServiceDetailModal 
                        service={selectedService} 
                        onClose={() => setSelectedService(null)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default OurServices;
