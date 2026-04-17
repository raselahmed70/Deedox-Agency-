import React, { useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, X, User, Building2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { useSettings, type PricingPlan } from '../../context/SettingsContext';
import { cn } from '../../lib/utils';

// --- Questionnaire Modal Component ---
const PricingFormModal = ({ 
    plan, 
    waNumber, 
    onClose 
}: { 
    plan: PricingPlan; 
    waNumber: string; 
    onClose: () => void 
}) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        business: '',
        goal: '',
        requirements: '',
        customQuestions: {} as Record<string, string>
    });

    const isCustom = plan.price === 'Custom' || plan.is_custom;
    
    // Default custom questions if none provided in DB
    const customQuestions = plan.questions?.length ? plan.questions : [
        "What is your estimated timeline?",
        "What is your target digital platform (Web/Mobile/Both)?",
        "Do you have a specific brand aesthetic in mind?"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Construct the WhatsApp message
        let message = `*NEW PROJECT INQUIRY*\n\n`;
        message += `*Selected Plan:* ${plan.name}\n`;
        message += `*Client Name:* ${formData.name}\n`;
        message += `*Business:* ${formData.business}\n`;
        message += `*Main Goal:* ${formData.goal}\n`;
        
        if (formData.requirements) {
            message += `*Requirements:* ${formData.requirements}\n`;
        }

        if (isCustom) {
            message += `\n*CUSTOM DETAILS:*\n`;
            Object.entries(formData.customQuestions).forEach(([q, a]) => {
                message += `Q: ${q}\nA: ${a}\n\n`;
            });
        }

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
        onClose();
    };

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
                 className="relative w-full max-w-4xl mx-auto p-8 md:p-14 rounded-[40px] liquid-glass border border-white/10 bg-white/[0.02] shadow-2xl z-20"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-white/50 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-10">
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-[4px] mb-2 block">Project Initiation</span>
                        <h2 className="text-4xl font-serif text-white tracking-tight">Configure {plan.name}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <Label icon={<User />} text="Full Name" />
                                            <input 
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 h-14 rounded-2xl px-6 text-white focus:border-white/20 focus:bg-white/[0.08] transition-all outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label icon={<Building2 />} text="Business Name" />
                                            <input 
                                                required
                                                value={formData.business}
                                                onChange={e => setFormData({...formData, business: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 h-14 rounded-2xl px-6 text-white focus:border-white/20 focus:bg-white/[0.08] transition-all outline-none"
                                                placeholder="Acme Corp"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label icon={<Sparkles />} text="Main Project Goal" />
                                        <input 
                                            required
                                            value={formData.goal}
                                            onChange={e => setFormData({...formData, goal: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 h-14 rounded-2xl px-6 text-white focus:border-white/20 focus:bg-white/[0.08] transition-all outline-none"
                                            placeholder="What do you want to achieve?"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => (formData.name && formData.business && formData.goal) && setStep(2)}
                                        className="w-full py-5 liquid-glass border border-white/10 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group text-xs uppercase tracking-widest"
                                    >
                                        Next Stage
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-6 max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
                                        {isCustom ? (
                                            <>
                                                {customQuestions.map((q: any, i: number) => (
                                                    <div key={i} className="space-y-2">
                                                        <label className="text-[10px] uppercase tracking-widest text-white/20 ml-1">{q}</label>
                                                        <textarea 
                                                            required
                                                            value={formData.customQuestions[q] || ''}
                                                            onChange={e => setFormData({
                                                                ...formData, 
                                                                customQuestions: { ...formData.customQuestions, [q]: e.target.value }
                                                            })}
                                                            className="w-full bg-white/5 border border-white/5 min-h-[80px] rounded-2xl p-4 text-white focus:border-white/20 focus:bg-white/[0.08] transition-all outline-none resize-none text-sm"
                                                            placeholder="Your answer..."
                                                        />
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="space-y-4">
                                                <Label icon={<MessageSquare />} text="Specific Requirements (Optional)" />
                                                <textarea 
                                                    value={formData.requirements}
                                                    onChange={e => setFormData({...formData, requirements: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/5 min-h-[160px] rounded-[32px] p-6 text-white focus:border-white/20 focus:bg-white/[0.08] transition-all outline-none resize-none"
                                                    placeholder="Tell us any specific features or technical needs..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-8 h-14 rounded-2xl border border-white/10 text-white/50 font-bold hover:bg-white/5 hover:text-white transition-all text-[10px] uppercase tracking-widest"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-1 h-14 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
                                        >
                                            <Send className="w-4 h-4" />
                                            Initiate Transmission
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Label = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <label className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[2px] ml-1">
        <span className="text-white/40">{icon}</span>
        {text}
    </label>
);

// --- Main Pricing Components ---

const PricingCard = ({ 
    plan, 
    index, 
    onSelect 
}: { 
    plan: PricingPlan; 
    index: number; 
    onSelect: (plan: PricingPlan) => void 
}) => {
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
            className={cn(
                "group relative liquid-glass p-8 rounded-[32px] border bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 overflow-hidden flex flex-col",
                plan.popular ? "border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.05)]" : "border-white/5"
            )}
        >
            {/* Spotlight Glow */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),rgba(255,255,255,0.03)_0%,transparent_40%)]"
                style={{
                    "--x": mouseX ? `${mouseX.get()}px` : '0px',
                    "--y": mouseY ? `${mouseY.get()}px` : '0px',
                } as React.CSSProperties}
            />

            {/* Popular badge */}
            {plan.popular && (
                <div className="absolute top-6 right-6 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase border border-white/10 rounded-full px-3 py-1 bg-white/5">
                    Most Popular
                </div>
            )}

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <h3 className="text-3xl font-serif text-white mb-1">{plan.name}</h3>
                    {plan.description && (
                        <p className="text-white/30 text-sm font-sans">{plan.description}</p>
                    )}
                </div>

                <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-serif text-white tracking-tighter">
                        {plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}
                    </span>
                    {plan.price !== 'Custom' && (
                        <span className="text-white/20 ml-2 font-sans text-xs uppercase tracking-widest">/ Project</span>
                    )}
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                    {(plan.features || []).map(feature => (
                        <li key={feature} className="flex items-start text-white/40 text-sm font-sans group-hover:text-white/60 transition-colors duration-500">
                            <CheckCircle className="h-4 w-4 text-white/20 mr-3 shrink-0 mt-0.5" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => onSelect(plan)}
                    className={cn(
                        "w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 mt-auto",
                        plan.popular
                            ? "bg-white text-black hover:bg-white/80 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            : "liquid-glass text-white border border-white/10 hover:bg-white/5"
                    )}
                >
                    {plan.cta_text || (plan.price === 'Custom' ? 'Start Inquiry' : 'Initiate Project')}
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:w-full transition-all duration-1000" />
        </motion.div>
    );
};

const AuroraPricing = () => {
    const { bgOpacity3, pricing: dbPricing, contact } = useSettings();
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    
    const waNumber = contact?.whatsapp_number || "01817296013";

    const pricingPlans = dbPricing?.length > 0
        ? dbPricing.filter(p => p.visible !== false)
        : [];

    return (
        <section id="pricing" className="relative w-full py-32 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/images/story-3.png"
                    alt="Background"
                    className="w-full h-full object-cover grayscale transition-opacity duration-700"
                    style={{ opacity: bgOpacity3 / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-[#050505]" />
            </div>

            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-white/30 text-xs font-bold uppercase tracking-[4px] mb-4 block"
                        >
                            Investment
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-[0.95]"
                        >
                            Pricing <br />
                            <em className="not-italic text-white/40 italic">Plans</em>
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, idx) => (
                        <PricingCard 
                            key={plan.id || plan.name} 
                            plan={plan} 
                            index={idx} 
                            onSelect={(p) => setSelectedPlan(p)} 
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedPlan && (
                    <PricingFormModal 
                        plan={selectedPlan} 
                        waNumber={waNumber} 
                        onClose={() => setSelectedPlan(null)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default AuroraPricing;
