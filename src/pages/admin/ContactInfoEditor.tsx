import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettings } from '@/context/SettingsContext';
import { 
  Phone, Mail, MapPin, 
  Globe, Send, Camera, 
  Link, Play, Save, 
  RefreshCw, Link as LinkIcon,
  Globe as GlobeIcon, Clock, Sparkles, MessageSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  facebook: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  instagram: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  youtube: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  whatsapp_number: z.string().optional().or(z.literal('')),
  whatsapp_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactInfoEditor: React.FC = () => {
  const { contact: initialContact, updateContact, isLoading } = useSettings();
  const [saving, setSaving] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: '',
      phone: '',
      address: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      whatsapp_number: '',
      whatsapp_link: '',
    }
  });

  useEffect(() => {
    if (initialContact) {
      form.reset({
        email: initialContact.email || '',
        phone: initialContact.phone || '',
        address: initialContact.address || '',
        facebook: initialContact.facebook || '',
        twitter: initialContact.twitter || '',
        instagram: initialContact.instagram || '',
        linkedin: initialContact.linkedin || '',
        youtube: initialContact.youtube || '',
        whatsapp_number: initialContact.whatsapp_number || '',
        whatsapp_link: initialContact.whatsapp_link || '',
      });
    }
  }, [initialContact, form]);

  const onSubmit = async (values: ContactFormValues) => {
    setSaving(true);
    try {
      await updateContact(values);
      toast.success("Contact nexus updated successfully");
      form.reset(values);
    } catch (err) {
      toast.error("Nexus update failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Syncing contact nexus...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
       {/* 🚀 Header Area */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-[#7B5EA7]/5 to-transparent pointer-events-none" />
         <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-[#7B5EA7]/10 rounded-3xl flex items-center justify-center border border-[#7B5EA7]/20 transition-all duration-500 group-hover:bg-[#7B5EA7]/20">
              <Phone className="w-8 h-8 text-[#7B5EA7]" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-white tracking-tighter">Contact Nexus</h2>
              <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-[4px] mt-1">
                Establish Your Physical & Digital Presence
              </p>
            </div>
         </div>
         <Button 
           onClick={form.handleSubmit(onSubmit)}
           disabled={saving}
           className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-black h-14 px-10 rounded-2xl relative z-10 shadow-xl shadow-[#00D4FF]/10 transition-all active:scale-95"
         >
           {saving ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
           Save Nexus
         </Button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* 📬 Core Direct Contact */}
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-8 h-full relative overflow-hidden">
               <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-[#00D4FF]/5 blur-3xl rounded-full" />
               
               <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                  <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[6px]">Direct Channels</h3>
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="space-y-2 group">
                     <Label className="text-[10px] font-bold text-[#6B7A8D] tracking-[3px] uppercase ml-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email Address
                     </Label>
                     <Input 
                        {...form.register('email')}
                        placeholder="agency@deedox.com"
                        className="bg-[#1A2332] border-white/10 h-14 rounded-2xl focus:border-[#00D4FF]/50 transition-all px-6 text-white"
                     />
                     {form.formState.errors.email && <p className="text-[#FF5757] text-[10px] font-bold mt-1 px-1">{form.formState.errors.email.message}</p>}
                  </div>

                  <div className="space-y-2 group">
                     <Label className="text-[10px] font-bold text-[#6B7A8D] tracking-[3px] uppercase ml-1 flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Hotline
                     </Label>
                     <Input 
                        {...form.register('phone')}
                        placeholder="+880 1XXX-XXXXXX"
                        className="bg-[#1A2332] border-white/10 h-14 rounded-2xl focus:border-[#00D4FF]/50 transition-all px-6 text-white"
                     />
                  </div>

                  <div className="space-y-2 group">
                     <Label className="text-[10px] font-bold text-[#00D4FF] tracking-[3px] uppercase ml-1 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> WhatsApp Hotline
                     </Label>
                     <Input 
                        {...form.register('whatsapp_number' as any)}
                        placeholder="01817296013"
                        className="bg-[#1A2332] border-[#00D4FF]/20 h-14 rounded-2xl focus:border-[#00D4FF]/50 transition-all px-6 text-white"
                     />
                  </div>

                  <div className="space-y-2 group">
                     <Label className="text-[10px] font-bold text-[#6B7A8D] tracking-[3px] uppercase ml-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Physical Base
                     </Label>
                     <Textarea 
                        {...form.register('address')}
                        placeholder="Your studio address..."
                        rows={3}
                        className="bg-[#1A2332] border-white/10 rounded-[30px] focus:border-[#00D4FF]/50 transition-all px-6 py-4 text-white resize-none"
                     />
                  </div>
               </div>
            </Card>
         </motion.div>

         {/* 🌐 Social Frequency */}
         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-8 h-full relative overflow-hidden">
               <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-[#7B5EA7]/5 blur-3xl rounded-full" />
               
               <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#7B5EA7]" />
                  <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[6px]">Social Spectrum</h3>
               </div>

               <div className="space-y-5 relative z-10">
                  {[
                    { key: 'facebook', icon: Globe, color: '#1877F2' },
                    { key: 'instagram', icon: Camera, color: '#E4405F' },
                    { key: 'twitter', icon: Send, color: '#1DA1F2' },
                    { key: 'linkedin', icon: Link, color: '#0A66C2' },
                    { key: 'youtube', icon: Play, color: '#FF0000' }
                  ].map((social) => (
                    <div key={social.key} className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-white/20 group-focus-within:text-white transition-colors">
                          <social.icon className="w-5 h-5" style={{ color: form.watch(social.key as any) ? social.color : undefined }} />
                       </div>
                       <Input 
                          {...form.register(social.key as any)}
                          placeholder={`${social.key.charAt(0).toUpperCase() + social.key.slice(1)} URL`}
                          className="bg-[#1A2332] border-white/10 h-12 rounded-xl pl-12 focus:border-white/30 transition-all text-xs text-white/60 focus:text-white"
                       />
                    </div>
                  ))}
               </div>
            </Card>
         </motion.div>
      </form>

      {/* 🔮 Visual Preview Card */}
      <Card className="bg-gradient-to-br from-[#111820] to-black border border-white/5 p-10 rounded-[50px] relative overflow-hidden shadow-2xl">
         <div className="absolute right-0 top-0 w-1/2 h-full bg-[#00D4FF]/5 blur-[120px] rounded-full" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 flex-1">
               <h3 className="text-3xl font-serif font-black text-white leading-tight">Syncing Live <br/>with the Universe.</h3>
               <p className="text-sm text-[#6B7A8D] max-w-sm">Changes made here propagate through the neural network to the live site immediately.</p>
               <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                     <Clock className="w-3 h-3 text-[#00D4FF]" />
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest">Realtime Active</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                     <Globe className="w-3 h-3 text-[#00E5A0]" />
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest">CDN Purge Enabled</span>
                  </div>
               </div>
            </div>
            
            <div className="w-full md:w-80 h-48 bg-[#1A2332] rounded-3xl border border-white/10 p-6 flex flex-col justify-center gap-4 relative">
               <div className="absolute top-4 right-4 animate-ping">
                  <div className="w-2 h-2 bg-[#00D4FF] rounded-full" />
               </div>
               <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-xs text-white truncate">{form.watch('email') || 'Email Placeholder'}</span>
               </div>
               <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-xs text-white">{form.watch('phone') || 'Phone Placeholder'}</span>
               </div>
               <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-xs text-white/60 line-clamp-1">{form.watch('address') || 'Address Placeholder'}</span>
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
};

export default ContactInfoEditor;
