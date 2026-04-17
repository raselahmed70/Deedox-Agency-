import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';

const portfolioGlows = [
    "from-white/10",
    "from-zinc-500/10",
    "from-slate-500/10",
    "from-white/5",
    "from-zinc-400/10",
    "from-slate-400/10",
];

const formatExternalLink = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const glow = portfolioGlows[index % portfolioGlows.length];

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
            className="group relative liquid-glass rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 overflow-hidden flex flex-col"
        >
            {/* Spotlight Glow */}
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

            <div className="relative z-10 p-6 flex flex-col h-full">
                {/* Image */}
                <div className="w-full h-48 rounded-xl overflow-hidden mb-6 ring-1 ring-white/10 bg-black/40">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
                        }}
                    />
                </div>

                <div className="flex flex-col flex-1">
                    <div className="mb-2">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                            {project.category}
                        </span>
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2 group-hover:translate-x-1 transition-transform duration-500">
                        {project.title}
                    </h3>
                    <p className="text-white/40 text-sm font-sans mb-8 flex-1 leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                        {project.description}
                    </p>

                    {project.link && (
                        <a
                            href={formatExternalLink(project.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto w-full py-3 rounded-full liquid-glass border border-white/10 flex items-center justify-center gap-2 text-white font-medium hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Visit Website
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-1000" />
        </motion.div>
    );
};

const PortfolioGallery: React.FC = () => {
    const { bgOpacity2, projects } = useSettings();

    return (
        <section id="portfolio" className="relative w-full py-32 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/images/story-2.png"
                    alt="Background"
                    className="w-full h-full object-cover grayscale transition-opacity duration-700"
                    style={{ opacity: bgOpacity2 / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2 z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-white/30 text-xs font-bold uppercase tracking-[4px] mb-4 block"
                        >
                            Our Work
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-[0.95]"
                        >
                            Signature <br />
                            <em className="not-italic text-white/40 italic">Projects</em>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-white/40 max-w-sm text-lg font-sans leading-relaxed"
                    >
                        A showcase of high-performance digital environments crafted with precision and cinematic flair.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-white/20 italic font-serif text-xl tracking-widest">No signature projects yet...</p>
                        </div>
                    ) : (
                        projects.map((project, index) => (
                            <ProjectCard key={project.id || index} project={project} index={index} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioGallery;
