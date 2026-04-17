import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MessageSquare, Send, MapPin, Loader2, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const ContactSection: React.FC = () => {
    const { bgOpacity4, contact: contactInfo } = useSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showChoice, setShowChoice] = useState(false);
    const [lastSubmission, setLastSubmission] = useState<{name: string, email: string, message: string} | null>(null);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        if (!name || !email || !message) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('deedox_messages')
                .insert([{
                    name,
                    email,
                    message,
                    service: 'General Inquiry',
                    status: 'unread'
                }]);

            if (error) throw error;
            
            setLastSubmission({ name, email, message });
            setShowChoice(true);
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            console.error(err);
            toast.error("Transmission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsApp = () => {
        if (!lastSubmission) return;
        const waNumber = contactInfo?.whatsapp_number || "01817296013";
        const text = `Halo Deedox! Saya *${lastSubmission.name}* (${lastSubmission.email}).\n\n*Pesan:*\n${lastSubmission.message}`;
        window.open(`https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
        setShowChoice(false);
    };

    const handleEmail = () => {
        if (!lastSubmission) return;
        const subject = `New Inquiry from ${lastSubmission.name}`;
        const body = `Name: ${lastSubmission.name}\nEmail: ${lastSubmission.email}\n\nMessage:\n${lastSubmission.message}`;
        const emailToSend = (!contactInfo?.email || contactInfo?.email === 'hello@deedox.com') ? "deedoxteam@gmail.com" : contactInfo.email;
        window.location.href = `mailto:${emailToSend}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setShowChoice(false);
    };
    
    return (
        <section id="contact" className="relative w-full py-40 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/assets/images/story-4.png" 
                    alt="Background" 
                    className="w-full h-full object-cover grayscale-[0.2] transition-opacity duration-700"
                    style={{ opacity: bgOpacity4 / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-[#050505]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Left Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-white/30 text-xs font-bold uppercase tracking-[8px] mb-8 block"
                        >
                            Direct Connection
                        </motion.span>
                        <h2 className="text-6xl md:text-9xl font-serif text-white mb-10 leading-[0.8] tracking-tight">
                            Initiate <br/>
                            <em className="not-italic text-white/30 italic">Nexus</em>
                        </h2>
                        <p className="text-white/40 text-xl mb-16 max-w-md font-sans leading-relaxed">
                            Every industry-defining project begins with a deep conversation. Let's architect your future.
                        </p>

                        <div className="space-y-12">
                            <ContactItem 
                                icon={<Mail className="h-5 w-5" />}
                                label="Inquiries"
                                value={(!contactInfo?.email || contactInfo?.email === 'hello@deedox.com') ? "deedoxteam@gmail.com" : contactInfo.email}
                                href={`mailto:${(!contactInfo?.email || contactInfo?.email === 'hello@deedox.com') ? "deedoxteam@gmail.com" : contactInfo.email}`}
                            />
                            <ContactItem 
                                icon={<MessageSquare className="h-5 w-5" />}
                                label="Hotline"
                                value={contactInfo?.whatsapp_number || "01817296013"}
                                href={`https://wa.me/${(contactInfo?.whatsapp_number || "01817296013").replace(/\D/g, '')}`}
                            />
                            <ContactItem 
                                icon={<MapPin className="h-5 w-5" />}
                                label="Physical HQ"
                                value={contactInfo?.address || "Dhaka, Bangladesh"}
                            />
                        </div>
                    </motion.div>

                    {/* Right Side */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative liquid-glass bg-white/[0.01] p-10 md:p-16 rounded-[48px] border border-white/5 space-y-10 group"
                        >
                            <form className="space-y-10" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <PremiumInput label="Designation / Name" name="name" placeholder="Ex. Elon Musk" />
                                    <PremiumInput label="Registry / Email" name="email" placeholder="Ex. elon@spacex.com" required type="email" />
                                </div>
                                
                                <PremiumTextArea label="Vision Narrative" name="message" placeholder="Detail your project intelligence..." />

                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="group relative w-full h-[80px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 border border-white/10 transition-colors" />
                                    <span className="relative z-10 text-white font-black uppercase tracking-[4px] text-xs flex items-center justify-center gap-3">
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-white/50" /> : "Deploy Transmission"}
                                        {!isSubmitting && <ChevronRight className="h-4 w-4" />}
                                    </span>
                                </button>
                            </form>
                        </motion.div>

                        {/* Choice Overlay */}
                        <AnimatePresence>
                            {showChoice && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl rounded-[48px]"
                                >
                                    <div className="text-center space-y-8 w-full max-w-xs">
                                        <div className="flex justify-center">
                                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/30">
                                                <CheckCircle2 className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-serif text-white">Transmission Received</h3>
                                            <p className="text-white/40 text-[11px] uppercase tracking-[3px] font-bold">Choose your response channel</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <button 
                                                onClick={handleWhatsApp}
                                                className="w-full h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-3 font-bold hover:scale-[1.05] transition-transform"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                                WhatsApp Chat
                                            </button>
                                            <button 
                                                onClick={handleEmail}
                                                className="w-full h-16 bg-white/5 text-white/60 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                <Mail className="w-5 h-5" />
                                                Email Matrix
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => setShowChoice(false)}
                                            className="text-white/20 text-[10px] font-bold uppercase tracking-[2px] hover:text-white/40"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ContactItem = ({ icon, label, value, href }: { icon: any, label: string, value: string, href?: string }) => (
    <div className="flex items-start gap-8 group">
        <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center text-white/40 border border-white/5 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/30 transition-all duration-500">
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-white/20 uppercase tracking-[4px] font-bold mb-1">{label}</p>
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-xl text-white/80 hover:text-white transition-colors font-serif">{value}</a>
            ) : (
                <p className="text-xl text-white/80 font-serif">{value}</p>
            )}
        </div>
    </div>
);

const PremiumInput = ({ label, placeholder, name, required, type = "text" }: { label: string, placeholder: string, name: string, required?: boolean, type?: string }) => (
    <div className="relative group space-y-4">
        <label className="text-[10px] uppercase tracking-[3px] text-white/30 font-bold ml-1 transition-colors group-focus-within:text-white">
            {label}
        </label>
        <div className="relative">
            <input 
                type={type}
                name={name}
                required={required}
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-white/10 py-4 px-1 text-white outline-none placeholder:text-white/5 focus:border-white transition-all duration-700 font-sans" 
            />
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white group-focus-within:w-full transition-all duration-1000" />
        </div>
    </div>
);

const PremiumTextArea = ({ label, placeholder, name, required }: { label: string, placeholder: string, name: string, required?: boolean }) => (
    <div className="relative group space-y-4">
        <label className="text-[10px] uppercase tracking-[3px] text-white/30 font-bold ml-1 transition-colors group-focus-within:text-white">
            {label}
        </label>
        <div className="relative">
            <textarea 
                name={name}
                required={required}
                placeholder={placeholder}
                rows={4}
                className="w-full bg-transparent border-b border-white/10 py-4 px-1 text-white outline-none placeholder:text-white/5 focus:border-white transition-all duration-700 font-sans resize-none" 
            />
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white group-focus-within:w-full transition-all duration-1000" />
        </div>
    </div>
);

export default ContactSection;
