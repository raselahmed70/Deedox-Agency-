import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// --- Interfaces ---

export interface HeroData {
  id: string;
  badge: string;
  headline: string;
  highlight_word: string;
  subheading: string;
  cta1_text: string;
  cta1_url: string;
  cta2_text: string;
  cta2_url: string;
  video_url: string;
  stats: { number: string; label: string }[];
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  details?: string;
  visible: boolean;
  display_order: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta_text: string;
  cta_url: string;
  popular: boolean;
  visible: boolean;
  display_order: number;
  is_custom?: boolean;
  questions?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  stars: number;
  visible: boolean;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  display_order: number;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_title: string;
  tagline: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  og_image: string;
  favicon: string;
  primary_color: string;
  accent_color: string;
  analytics_id: string;
  maintenance_mode: boolean;
  admin_username?: string;
  admin_password?: string;
}

export interface AiConfig {
  id: string;
  assistant_name: string;
  system_prompt: string;
  welcome_message: string;
  model: string;
  api_key?: string;
  enabled: boolean;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  address: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp_link?: string;
  whatsapp_number?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

interface SettingsContextType {
  // Data
  hero: HeroData | null;
  services: Service[];
  projects: PortfolioProject[];
  pricing: PricingPlan[];
  testimonials: Testimonial[];
  process: ProcessStep[];
  seoSettings: SiteSettings | null;
  aiConfig: AiConfig | null;
  contact: ContactInfo | null;
  messages: Message[];
  
  // States
  isLoading: boolean;
  
  // Background/UI Settings (Preserved for compatibility)
  bgOpacity1: number;
  bgOpacity2: number;
  bgOpacity3: number;
  bgOpacity4: number;
  bgImage1: string;
  bgImage2: string;
  bgImage3: string;
  bgImage4: string;
  heroVideo: string;

  // Setters
  setBgOpacity1: (val: number) => void;
  setBgOpacity2: (val: number) => void;
  setBgOpacity3: (val: number) => void;
  setBgOpacity4: (val: number) => void;
  setBgImage1: (val: string) => void;
  setBgImage2: (val: string) => void;
  setBgImage3: (val: string) => void;
  setBgImage4: (val: string) => void;
  setHeroVideo: (val: string) => void;
  
  // New Update Functions
  updateHero: (data: Partial<Omit<HeroData, 'id'>>) => Promise<void>;
  updateServices: (data: Service[]) => Promise<void>;
  updateService: (id: string, data: Partial<Omit<Service, 'id'>>) => Promise<void>;
  addService: (data: Omit<Service, 'id'>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updatePricing: (data: PricingPlan[]) => Promise<void>;
  updatePricingPlan: (id: string, data: Partial<Omit<PricingPlan, 'id'>>) => Promise<void>;
  addPricingPlan: (data: Omit<PricingPlan, 'id'>) => Promise<void>;
  deletePricingPlan: (id: string) => Promise<void>;
  updateTestimonials: (data: Testimonial[]) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<Omit<Testimonial, 'id'>>) => Promise<void>;
  addTestimonial: (data: Omit<Testimonial, 'id'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  updateProcess: (data: ProcessStep[]) => Promise<void>;
  updateProcessStep: (id: string, data: Partial<Omit<ProcessStep, 'id'>>) => Promise<void>;
  addProcessStep: (data: Omit<ProcessStep, 'id'>) => Promise<void>;
  deleteProcessStep: (id: string) => Promise<void>;
  updateSeoSettings: (data: Partial<Omit<SiteSettings, 'id'>>) => Promise<void>;
  updateAiConfig: (data: Partial<Omit<AiConfig, 'id'>>) => Promise<void>;
  updateContact: (data: Partial<Omit<ContactInfo, 'id'>>) => Promise<void>;
  
  // Message Management
  updateMessageStatus: (id: string, status: Message['status']) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  
  addProject: (p: Omit<PortfolioProject, 'id'>) => Promise<void>;
  updateProject: (id: string, p: Omit<PortfolioProject, 'id'>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULTS = {
  bgOpacity1: 45,
  bgOpacity2: 40,
  bgOpacity3: 35,
  bgOpacity4: 30,
  bgImage1: "/assets/images/story-1.png",
  bgImage2: "/assets/images/story-2.png",
  bgImage3: "/assets/images/story-3.png",
  bgImage4: "/assets/images/story-4.png",
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [process, setProcess] = useState<ProcessStep[]>([]);
  const [seoSettings, setSeoSettings] = useState<SiteSettings | null>(null);
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // Background Settings (Fallback to old site_settings table for opacities)
  const [bgOpacity1, setBgOpacity1State] = useState(DEFAULTS.bgOpacity1);
  const [bgOpacity2, setBgOpacity2State] = useState(DEFAULTS.bgOpacity2);
  const [bgOpacity3, setBgOpacity3State] = useState(DEFAULTS.bgOpacity3);
  const [bgOpacity4, setBgOpacity4State] = useState(DEFAULTS.bgOpacity4);
  const [bgImage1, setBgImage1State] = useState(DEFAULTS.bgImage1);
  const [bgImage2, setBgImage2State] = useState(DEFAULTS.bgImage2);
  const [bgImage3, setBgImage3State] = useState(DEFAULTS.bgImage3);
  const [bgImage4, setBgImage4State] = useState(DEFAULTS.bgImage4);
  const [heroVideo, setHeroVideoState] = useState("");

  const updateLegacySetting = async (key: string, value: string) => {
    try {
      await supabase.from('site_settings').update({ value }).eq('key', key);
    } catch (e) {
      console.error(`Error updating ${key}:`, e);
    }
  };

  const setBgOpacity1 = (val: number) => { setBgOpacity1State(val); updateLegacySetting('bg_opacity_1', val.toString()); };
  const setBgOpacity2 = (val: number) => { setBgOpacity2State(val); updateLegacySetting('bg_opacity_2', val.toString()); };
  const setBgOpacity3 = (val: number) => { setBgOpacity3State(val); updateLegacySetting('bg_opacity_3', val.toString()); };
  const setBgOpacity4 = (val: number) => { setBgOpacity4State(val); updateLegacySetting('bg_opacity_4', val.toString()); };
  
  const setBgImage1 = (val: string) => { setBgImage1State(val); updateLegacySetting('bg_img_1', val); };
  const setBgImage2 = (val: string) => { setBgImage2State(val); updateLegacySetting('bg_img_2', val); };
  const setBgImage3 = (val: string) => { setBgImage3State(val); updateLegacySetting('bg_img_3', val); };
  const setBgImage4 = (val: string) => { setBgImage4State(val); updateLegacySetting('bg_img_4', val); };
  
  const setHeroVideo = async (val: string) => { 
    setHeroVideoState(val); 
    if (hero) {
        await supabase.from('deedox_hero').update({ video_url: val }).eq('id', hero.id);
    }
  };

  const updateHero = async (data: Partial<Omit<HeroData, 'id'>>) => {
    if (!hero) return;
    const { error } = await supabase.from('deedox_hero').update(data).eq('id', hero.id);
    if (!error) setHero({ ...hero, ...data });
    else console.error('Error updating hero:', error);
  };

  const updateServices = async (data: Service[]) => {
    const { error } = await supabase.from('deedox_services').upsert(data);
    if (!error) setServices(data);
    else console.error('Error updating services:', error);
  };

  const updateService = async (id: string, data: Partial<Omit<Service, 'id'>>) => {
    const { error } = await supabase.from('deedox_services').update(data).eq('id', id);
    if (!error) setServices(services.map(s => s.id === id ? { ...s, ...data } : s));
    else console.error('Error updating service:', error);
  };

  const addService = async (data: Omit<Service, 'id'>) => {
    const { data: res, error } = await supabase.from('deedox_services').insert([data]).select();
    if (res) setServices([...services, res[0]]);
    else console.error('Error adding service:', error);
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from('deedox_services').delete().eq('id', id);
    if (!error) setServices(services.filter(s => s.id !== id));
    else console.error('Error deleting service:', error);
  };

  const updatePricing = async (data: PricingPlan[]) => {
    const { error } = await supabase.from('deedox_pricing').upsert(data);
    if (!error) setPricing(data);
    else console.error('Error updating pricing:', error);
  };

  const updatePricingPlan = async (id: string, data: Partial<Omit<PricingPlan, 'id'>>) => {
    const { error } = await supabase.from('deedox_pricing').update(data).eq('id', id);
    if (!error) setPricing(pricing.map(p => p.id === id ? { ...p, ...data } : p));
    else console.error('Error updating pricing plan:', error);
  };

  const addPricingPlan = async (data: Omit<PricingPlan, 'id'>) => {
    const { data: res, error } = await supabase.from('deedox_pricing').insert([data]).select();
    if (res) setPricing([...pricing, res[0]]);
    else console.error('Error adding pricing plan:', error);
  };

  const deletePricingPlan = async (id: string) => {
    const { error } = await supabase.from('deedox_pricing').delete().eq('id', id);
    if (!error) setPricing(pricing.filter(p => p.id !== id));
    else console.error('Error deleting pricing plan:', error);
  };

  const updateTestimonials = async (data: Testimonial[]) => {
    const { error } = await supabase.from('deedox_testimonials').upsert(data);
    if (!error) setTestimonials(data);
    else console.error('Error updating testimonials:', error);
  };

  const updateTestimonial = async (id: string, data: Partial<Omit<Testimonial, 'id'>>) => {
    const { error } = await supabase.from('deedox_testimonials').update(data).eq('id', id);
    if (!error) setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...data } : t));
    else console.error('Error updating testimonial:', error);
  };

  const addTestimonial = async (data: Omit<Testimonial, 'id'>) => {
    const { data: res, error } = await supabase.from('deedox_testimonials').insert([data]).select();
    if (res) setTestimonials([...testimonials, res[0]]);
    else console.error('Error adding testimonial:', error);
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from('deedox_testimonials').delete().eq('id', id);
    if (!error) setTestimonials(testimonials.filter(t => t.id !== id));
    else console.error('Error deleting testimonial:', error);
  };

  const updateProcess = async (data: ProcessStep[]) => {
    const { error } = await supabase.from('deedox_process').upsert(data);
    if (!error) setProcess(data);
    else console.error('Error updating process:', error);
  };

  const updateProcessStep = async (id: string, data: Partial<Omit<ProcessStep, 'id'>>) => {
    const { error } = await supabase.from('deedox_process').update(data).eq('id', id);
    if (!error) setProcess(process.map(p => p.id === id ? { ...p, ...data } : p));
    else console.error('Error updating process step:', error);
  };

  const addProcessStep = async (data: Omit<ProcessStep, 'id'>) => {
    const { data: res, error } = await supabase.from('deedox_process').insert([data]).select();
    if (res) setProcess([...process, res[0]]);
    else console.error('Error adding process step:', error);
  };

  const deleteProcessStep = async (id: string) => {
    const { error } = await supabase.from('deedox_process').delete().eq('id', id);
    if (!error) setProcess(process.filter(p => p.id !== id));
    else console.error('Error deleting process step:', error);
  };

  const updateSeoSettings = async (data: Partial<Omit<SiteSettings, 'id'>>) => {
    if (!seoSettings) return;
    const { error } = await supabase.from('deedox_settings').update(data).eq('id', seoSettings.id);
    if (!error) setSeoSettings({ ...seoSettings, ...data });
    else console.error('Error updating SEO settings:', error);
  };

  const updateAiConfig = async (data: Partial<AiConfig>) => {
    const { data: updatedData, error } = await supabase
      .from('deedox_ai_config')
      .upsert({ ...data, id: aiConfig?.id || '00000000-0000-0000-0000-000000000001' })
      .select()
      .single();

    if (!error && updatedData) {
      setAiConfig(updatedData);
    } else {
      console.error('Error updating AI config:', error);
      throw error;
    }
  };

  const updateContact = async (data: Partial<Omit<ContactInfo, 'id'>>) => {
    if (!contact) return;
    const { error } = await supabase.from('deedox_contact').update(data).eq('id', contact.id);
    if (!error) setContact({ ...contact, ...data });
    else console.error('Error updating contact info:', error);
  };

  const addProject = async (p: Omit<PortfolioProject, 'id'>) => {
    const { data, error } = await supabase.from('deedox_portfolio').insert([p]).select();
    if (data) setProjects([data[0], ...projects]);
    if (error) console.error('Error adding project:', error);
  };

  const updateProject = async (id: string, p: Omit<PortfolioProject, 'id'>) => {
    const { error } = await supabase.from('deedox_portfolio').update(p).eq('id', id);
    if (!error) setProjects(projects.map(proj => proj.id === id ? { ...proj, ...p } : proj));
    else console.error('Error updating project:', error);
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('deedox_portfolio').delete().eq('id', id);
    if (!error) setProjects(projects.filter(proj => proj.id !== id));
    else console.error('Error deleting project:', error);
  };

  const updateMessageStatus = async (id: string, status: Message['status']) => {
    const { error } = await supabase.from('deedox_messages').update({ status }).eq('id', id);
    if (!error) setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    else console.error('Error updating message status:', error);
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from('deedox_messages').delete().eq('id', id);
    if (!error) setMessages(prev => prev.filter(m => m.id !== id));
    else console.error('Error deleting message:', error);
  };

  const resetSettings = () => {
    // Basic local reset
    setBgOpacity1State(DEFAULTS.bgOpacity1);
    setBgOpacity2State(DEFAULTS.bgOpacity2);
    setBgOpacity3State(DEFAULTS.bgOpacity3);
    setBgOpacity4State(DEFAULTS.bgOpacity4);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const results = await Promise.all([
          supabase.from('deedox_hero').select('*').single(),
          supabase.from('deedox_services').select('*').order('display_order', { ascending: true }),
          supabase.from('deedox_portfolio').select('*').order('created_at', { ascending: false }),
          supabase.from('deedox_pricing').select('*').order('display_order', { ascending: true }),
          supabase.from('deedox_testimonials').select('*').order('created_at', { ascending: false }),
          supabase.from('deedox_process').select('*').order('display_order', { ascending: true }),
          supabase.from('deedox_settings').select('*').single(),
          supabase.from('deedox_ai_config').select('*').single(),
          supabase.from('deedox_contact').select('*').single(),
          supabase.from('deedox_messages').select('*').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*')
        ]);

        const heroData = results[0].data;
        const servicesData = results[1].data;
        const projectsData = results[2].data;
        const pricingData = results[3].data;
        const testimonialsData = results[4].data;
        const processData = results[5].data;
        const settingsData = results[6].data;
        const aiData = results[7].data;
        const contactData = results[8].data;
        const messagesData = results[9].data;
        const legacySettings = results[10].data;

        if (heroData) {
            setHero(heroData);
            setHeroVideoState(heroData.video_url || "");
        }
        if (servicesData) setServices(servicesData);
        if (projectsData) setProjects(projectsData);
        if (pricingData) setPricing(pricingData);
        if (testimonialsData) setTestimonials(testimonialsData);
        if (processData) setProcess(processData);
        if (settingsData) setSeoSettings(settingsData);
        if (aiData) setAiConfig(aiData);
        if (contactData) setContact(contactData);
        if (messagesData) setMessages(messagesData);

        // Handle Legacy Settings (Opacities and BG Images)
        if (legacySettings) {
          legacySettings.forEach((item: any) => {
            switch (item.key) {
              case 'bg_opacity_1': setBgOpacity1State(Number(item.value)); break;
              case 'bg_opacity_2': setBgOpacity2State(Number(item.value)); break;
              case 'bg_opacity_3': setBgOpacity3State(Number(item.value)); break;
              case 'bg_opacity_4': setBgOpacity4State(Number(item.value)); break;
              case 'bg_img_1': setBgImage1State(item.value); break;
              case 'bg_img_2': setBgImage2State(item.value); break;
              case 'bg_img_3': setBgImage3State(item.value); break;
              case 'bg_img_4': setBgImage4State(item.value); break;
            }
          });
        }

      } catch (error) {
        console.error('Error fetching deedox data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    // 📡 Global Real-time Subscription for Messages
    const channel = supabase.channel('global_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deedox_messages' }, () => {
        // Simple refresh for now - could be optimized to update local state directly
        supabase.from('deedox_messages').select('*').order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setMessages(data); });
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      hero, services, projects, pricing, testimonials, process, seoSettings, aiConfig, contact, messages,
      isLoading,
      bgOpacity1, bgOpacity2, bgOpacity3, bgOpacity4,
      bgImage1, bgImage2, bgImage3, bgImage4,
      heroVideo,
      setBgOpacity1, setBgOpacity2, setBgOpacity3, setBgOpacity4,
      setBgImage1, setBgImage2, setBgImage3, setBgImage4,
      setHeroVideo, 
      updateHero, updateServices, updateService, addService, deleteService,
      updatePricing, updatePricingPlan, addPricingPlan, deletePricingPlan,
      updateTestimonials, updateTestimonial, addTestimonial, deleteTestimonial, 
      updateProcess, updateProcessStep, addProcessStep, deleteProcessStep,
      updateSeoSettings, updateAiConfig, updateContact,
      updateMessageStatus, deleteMessage,
      addProject, updateProject, deleteProject, resetSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
