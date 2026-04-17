import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const DEFAULT_TESTIMONIALS = [
    {
        content: "Deedox Agency built an amazing website for my business. Their attention to detail and cinematic vision is unmatched in the industry. Highly recommended!",
        name: "Alex Rivers",
        role: "CEO, Streamline Tech",
        avatar: "https://avatar.vercel.sh/alex"
    },
    {
        content: "Professional, fast, and incredibly supportive. They didn't just build a site; they built a revenue-generating asset that transformed our brand identity.",
        name: "Sarah Chen",
        role: "Founder, Zenith Design",
        avatar: "https://avatar.vercel.sh/sarah"
    }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: any, index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = event.clientX - rect.left;
        const mouseYPos = event.clientY - rect.top;
        x.set(mouseXPos / width - 0.5);
        y.set(mouseYPos / height - 0.5);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-1000 group relative liquid-glass p-12 md:p-16 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-700"
        >
            <Quote className="h-16 w-16 text-white/5 absolute top-10 right-10 group-hover:text-white/10 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col gap-10">
                <p className="text-2xl md:text-3xl text-white/80 font-serif italic leading-snug tracking-tight">
                    “{testimonial.content}”
                </p>
                
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-zinc-800">
                        <img 
                            src={testimonial.avatar || `https://avatar.vercel.sh/${testimonial.name}`} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                    </div>
                    <div>
                        <h4 className="text-white font-medium tracking-tight">{testimonial.name}</h4>
                        <p className="text-white/30 text-xs uppercase tracking-widest font-bold">{testimonial.role}</p>
                    </div>
                </div>
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    );
}

const Testimonials: React.FC = () => {
    const { bgOpacity3, testimonials: dbTestimonials } = useSettings();

    const displayTestimonials = dbTestimonials?.length > 0 
        ? dbTestimonials.filter(t => t.visible !== false)
        : DEFAULT_TESTIMONIALS;

    return (
        <section className="relative w-full py-32 px-6 overflow-hidden">
            {/* Immersive Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/assets/images/story-3.png" 
                    alt="Background" 
                    className="w-full h-full object-cover grayscale transition-opacity duration-700"
                    style={{ opacity: bgOpacity3 / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-transparent" />
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-white/30 text-xs font-bold uppercase tracking-[8px] mb-4 block"
                    >
                        Client Narratives
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-5xl md:text-7xl font-serif text-white tracking-tight"
                    >
                        The Word on <em className="not-italic text-white/30 italic">Street</em>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {displayTestimonials.map((testimonial, idx) => (
                        <TestimonialCard key={(testimonial as any).id || idx} testimonial={testimonial} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
