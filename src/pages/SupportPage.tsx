import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Wrench, CreditCard, HelpCircle, ChevronRight, Send, ArrowLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Footer from '../components/layout/Footer';

type IssueType = 'Technical' | 'Billing' | 'Project' | 'Other' | null;

const issueCategories = [
  { id: 'Technical', title: 'Technical Issue', icon: <Wrench className="w-6 h-6" />, desc: 'Report bugs, platform errors, or technical glitches.' },
  { id: 'Billing', title: 'Billing & Payments', icon: <CreditCard className="w-6 h-6" />, desc: 'Invoices, payment methods, or pricing queries.' },
  { id: 'Project', title: 'Project Update', icon: <MessageSquare className="w-6 h-6" />, desc: 'Updates, milestones, or questions about a current project.' },
  { id: 'Other', title: 'General Support', icon: <HelpCircle className="w-6 h-6" />, desc: 'Any other inquiries or assistance you might need.' }
];

const SupportPage = () => {
  const { contact: contactInfo } = useSettings();
  const [selectedIssue, setSelectedIssue] = useState<IssueType>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.details) return;

    const waNumber = contactInfo?.whatsapp_number || "01817296013";
    const cleanedNumber = waNumber.replace(/\D/g, ''); 
    
    const text = `*Deedox Support Request*
=====================
*Category:* ${selectedIssue}
*Name:* ${formData.name}
*Email:* ${formData.email || 'N/A'}
*Details:*
${formData.details}`;

    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <>
      <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto z-10 flex flex-col justify-center">
        <div className="liquid-glass p-8 md:p-16 rounded-[40px] border border-white/10 bg-white/[0.02] shadow-2xl relative overflow-hidden backdrop-blur-3xl min-h-[600px] flex flex-col">
          {/* Background element for aesthetic */}
          <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!selectedIssue ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex-1 flex flex-col"
              >
                <div className="mb-12">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/40 text-xs font-bold uppercase tracking-[4px] mb-4 block"
                  >
                    Help Center
                  </motion.span>
                  <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                    How can we <em className="not-italic text-white/50">assist you?</em>
                  </h1>
                  <p className="text-white/40 mt-4 text-sm max-w-lg leading-relaxed">
                    Select the category that best describes your issue. We will securely redirect you to our dedicated WhatsApp support line with all your details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {issueCategories.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedIssue(item.id as IssueType)}
                      className="group relative flex flex-col items-start p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 text-left overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        <ChevronRight className="w-6 h-6 text-white/30" />
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-serif text-white mb-2">{item.title}</h3>
                      <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex-1 flex flex-col"
              >
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-10 self-start group text-xs uppercase tracking-[2px] font-bold"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </button>

                <div className="mb-10">
                  <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Provide Details</h2>
                  <p className="text-white/40 text-sm max-w-lg">
                    Tell us more about your <span className="text-white font-bold">{selectedIssue}</span> issue so we can help you faster.
                  </p>
                </div>

                <form onSubmit={handleWhatsAppRedirect} className="space-y-8 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <label className="text-[10px] uppercase tracking-[3px] text-white/30 font-bold ml-1 transition-colors group-focus-within:text-white">
                        Full Name
                      </label>
                      <input 
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b border-white/10 py-4 px-1 text-white outline-none placeholder:text-white/10 focus:border-white transition-all duration-500"
                      />
                    </div>
                    <div className="relative group">
                      <label className="text-[10px] uppercase tracking-[3px] text-white/30 font-bold ml-1 transition-colors group-focus-within:text-white">
                        Email Address (Optional)
                      </label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-b border-white/10 py-4 px-1 text-white outline-none placeholder:text-white/10 focus:border-white transition-all duration-500"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-[3px] text-white/30 font-bold ml-1 transition-colors group-focus-within:text-white">
                      Describe the problem
                    </label>
                    <textarea 
                      name="details"
                      required
                      value={formData.details}
                      onChange={handleInputChange}
                      placeholder="Please provide as much information as possible..."
                      rows={5}
                      className="w-full bg-transparent border-b border-white/10 py-4 px-1 text-white outline-none placeholder:text-white/10 focus:border-white transition-all duration-500 resize-none mt-2"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="group relative w-full h-16 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] mt-8"
                  >
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 border border-white/10 transition-colors" />
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine z-0" />
                    <span className="relative z-10 text-white font-black uppercase tracking-[4px] text-xs flex items-center justify-center gap-3 h-full">
                      <Send className="w-5 h-5" />
                      Send via WhatsApp
                    </span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SupportPage;
