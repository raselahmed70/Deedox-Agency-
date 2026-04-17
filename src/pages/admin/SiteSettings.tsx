import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { ImageSelector } from '@/components/admin/ImageSelector';
import { 
  Settings, Save, RefreshCw, 
  Globe, Shield, Search, 
  Palette, Smartphone, Type, 
  Upload, ImageIcon, CheckCircle2,
  FileCode, BrainCircuit, Share2,
  Play, Sparkles, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SiteSettings {
  id: string;
  site_title: string;
  meta_description: string;
  keywords: string[];
  og_image: string;
  favicon: string;
  primary_color: string;
  accent_color: string;
  analytics_id: string;
  admin_username?: string;
  admin_password?: string;
  maintenance_mode?: boolean;
}

const SiteSettings: React.FC = () => {
  const { 
    seoSettings: initialSettings, updateSeoSettings, isLoading,
    bgOpacity1, setBgOpacity1,
    bgOpacity2, setBgOpacity2,
    bgOpacity3, setBgOpacity3,
    bgOpacity4, setBgOpacity4,
    bgImage1, setBgImage1,
    bgImage2, setBgImage2,
    bgImage3, setBgImage3,
    bgImage4, setBgImage4,
    heroVideo, setHeroVideo
  } = useSettings();
  
  const [settings, setSettings] = useState<Partial<SiteSettings>>(initialSettings || {});
  const [saving, setSaving] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (initialSettings) setSettings(initialSettings);
  }, [initialSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSeoSettings(settings);
      toast.success("Cyber-environment synchronized");
    } catch (err) {
      toast.error("Synchronization failure");
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const current = settings.keywords || [];
    setSettings({ ...settings, keywords: [...current, keywordInput.trim()] });
    setKeywordInput('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Decoding matrix configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
       {/* 🚀 Header Area */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-[#00D4FF]/5 via-transparent to-[#7B5EA7]/5 pointer-events-none" />
         <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-[#111820] border border-white/10 rounded-3xl flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
               <Settings className="w-8 h-8 text-white/40 group-hover:text-[#00D4FF]" />
            </div>
            <div>
               <h2 className="text-3xl font-serif font-black text-white tracking-tighter">Site Core Config</h2>
               <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-[4px] mt-1">
                 Global Environment & SEO Matrix
               </p>
            </div>
         </div>
         <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-black h-14 px-10 rounded-2xl relative z-10 shadow-xl shadow-[#00D4FF]/10 transition-all active:scale-95 disabled:opacity-50"
         >
            {saving ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            Synchronize Core
         </Button>
       </div>

       <Tabs defaultValue="seo" className="space-y-8">
          <TabsList className="bg-[#111820] border border-white/5 p-1 h-14 rounded-2xl grid grid-cols-5 gap-2">
            <TabsTrigger value="seo" className="rounded-xl data-[state=active]:bg-[#1A2332] data-[state=active]:text-[#00D4FF] gap-2 font-bold uppercase text-[9px] tracking-widest px-2">
              <Search className="w-3 h-3" /> SEO
            </TabsTrigger>
            <TabsTrigger value="branding" className="rounded-xl data-[state=active]:bg-[#1A2332] data-[state=active]:text-[#00D4FF] gap-2 font-bold uppercase text-[9px] tracking-widest px-2">
              <Palette className="w-3 h-3" /> Identity
            </TabsTrigger>
            <TabsTrigger value="visuals" className="rounded-xl data-[state=active]:bg-[#1A2332] data-[state=active]:text-[#00D4FF] gap-2 font-bold uppercase text-[9px] tracking-widest px-2">
              <ImageIcon className="w-3 h-3" /> Visuals
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-[#1A2332] data-[state=active]:text-[#00D4FF] gap-2 font-bold uppercase text-[9px] tracking-widest px-2">
              <Shield className="w-3 h-3" /> Security
            </TabsTrigger>
            <TabsTrigger value="advanced" className="rounded-xl data-[state=active]:bg-[#1A2332] data-[state=active]:text-[#00D4FF] gap-2 font-bold uppercase text-[9px] tracking-widest px-2">
              <BrainCircuit className="w-3 h-3" /> Advanced
            </TabsTrigger>
          </TabsList>

          {/* 🔍 SEO Matrix */}
          <TabsContent value="seo" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1">Meta Title (Browser Tab)</Label>
                         <Input 
                           value={settings.site_title || ''} 
                           onChange={e => setSettings({ ...settings, site_title: e.target.value })}
                           className="bg-[#1A2332] border-white/10 h-14 rounded-2xl focus:border-[#00D4FF]/50 px-6 text-white font-serif"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1">Meta Description</Label>
                         <Textarea 
                           value={settings.meta_description || ''} 
                           onChange={e => setSettings({ ...settings, meta_description: e.target.value })}
                           rows={4}
                           className="bg-[#1A2332] border-white/10 rounded-[30px] focus:border-[#00D4FF]/50 px-6 py-4 text-white resize-none"
                         />
                      </div>
                   </div>
                </Card>

                <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-6">
                   <ImageSelector
                     label="Social Preview (OG Image)"
                     value={settings.og_image}
                     onChange={(url) => setSettings({ ...settings, og_image: url })}
                     folder="settings"
                     onClear={() => setSettings({ ...settings, og_image: '' })}
                   />
                </Card>
             </div>
          </TabsContent>

          {/* 🎨 Branding Identity */}
          <TabsContent value="branding" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-8">
                   <div className="space-y-6">
                      <ImageSelector
                         label="Site Favicon"
                         value={settings.favicon}
                         onChange={(url) => setSettings({ ...settings, favicon: url })}
                         folder="settings"
                         onClear={() => setSettings({ ...settings, favicon: '' })}
                      />

                      <div className="grid grid-cols-2 gap-6 pt-4">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1">Accent Primary</Label>
                            <div className="flex gap-3 items-center bg-[#1A2332] p-3 rounded-2xl border border-white/10 focus-within:border-[#00D4FF]/30 transition-all">
                               <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: settings.primary_color || '#00D4FF' }} />
                               <Input 
                                  value={settings.primary_color || '#00D4FF'} 
                                  onChange={e => setSettings({ ...settings, primary_color: e.target.value })}
                                  className="bg-transparent border-none text-xs font-bold uppercase font-mono p-0 h-auto focus-visible:ring-0"
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1">Accent Secondary</Label>
                            <div className="flex gap-3 items-center bg-[#1A2332] p-3 rounded-2xl border border-white/10 focus-within:border-[#00D4FF]/30 transition-all">
                               <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: settings.accent_color || '#7B5EA7' }} />
                               <Input 
                                  value={settings.accent_color || '#7B5EA7'} 
                                  onChange={e => setSettings({ ...settings, accent_color: e.target.value })}
                                  className="bg-transparent border-none text-xs font-bold uppercase font-mono p-0 h-auto focus-visible:ring-0"
                               />
                            </div>
                         </div>
                      </div>
                   </div>
                </Card>

                <Card className="bg-[#111820] border-white/5 p-10 rounded-[40px] relative overflow-hidden flex flex-col items-center justify-center text-center">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00D4FF]/5" />
                   <Type className="w-16 h-16 text-white/5 mb-6" />
                   <h4 className="text-xl font-serif font-black text-white mb-2">Universe Typography</h4>
                   <p className="text-xs text-[#6B7A8D] font-medium leading-relaxed max-w-[220px]">Syne (Headlines) & Inter (Interface) are hard-coded for maximum resonance.</p>
                </Card>
             </div>
          </TabsContent>

           {/* 🖼 Visuals Matrix */}
           <TabsContent value="visuals" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-8">
                    <div className="flex items-center gap-3">
                       <ImageIcon className="w-4 h-4 text-[#00D4FF]" />
                       <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[6px]">Background Layering</h3>
                    </div>

                    <div className="space-y-10 relative z-10">
                       {[ 
                         { id: 1, img: bgImage1, setImg: setBgImage1, opacity: bgOpacity1, setOpacity: setBgOpacity1 },
                         { id: 2, img: bgImage2, setImg: setBgImage2, opacity: bgOpacity2, setOpacity: setBgOpacity2 },
                         { id: 3, img: bgImage3, setImg: setBgImage3, opacity: bgOpacity3, setOpacity: setBgOpacity3 },
                         { id: 4, img: bgImage4, setImg: setBgImage4, opacity: bgOpacity4, setOpacity: setBgOpacity4 },
                       ].map((layer) => (
                         <div key={layer.id} className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                            <ImageSelector
                               label={`Background Image ${layer.id}`}
                               value={layer.img}
                               onChange={layer.setImg}
                               folder="backgrounds"
                               onClear={() => layer.setImg('')}
                            />
                            <div className="space-y-2">
                               <div className="flex justify-between items-center">
                                  <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest">Layer Opacity</Label>
                                  <span className="text-[10px] font-mono text-[#00D4FF] font-black">{Math.round(layer.opacity * 100)}%</span>
                               </div>
                               <input 
                                  type="range" 
                                  min="0" 
                                  max="1" 
                                  step="0.01" 
                                  value={layer.opacity} 
                                  onChange={(e) => layer.setOpacity(parseFloat(e.target.value))}
                                  className="w-full h-1.5 bg-[#1A2332] rounded-full appearance-none cursor-pointer accent-[#00D4FF]"
                               />
                            </div>
                         </div>
                       ))}
                    </div>
                 </Card>

                 <div className="space-y-8">
                    <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-6">
                       <div className="flex items-center gap-3">
                          <Play className="w-4 h-4 text-[#00D4FF]" />
                          <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[6px]">Cinematic Core</h3>
                       </div>
                       <ImageSelector
                          label="Hero Background Video"
                          value={heroVideo}
                          onChange={setHeroVideo}
                          folder="videos"
                          onClear={() => setHeroVideo('')}
                       />
                       <p className="text-[10px] text-[#6B7A8D] font-medium leading-relaxed italic">
                          Provide a high-quality MP4 or WebM URL or upload a cinematic fragment.
                       </p>
                    </Card>

                    <div className="bg-gradient-to-br from-[#111820] to-black border border-white/5 p-10 rounded-[50px] relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl">
                       <div className="absolute inset-0 bg-[#00D4FF]/5 blur-[60px] rounded-full pointer-events-none" />
                       <Sparkles className="w-12 h-12 text-[#00D4FF] mb-6 animate-pulse" />
                       <h4 className="text-xl font-serif font-black text-white mb-2 uppercase tracking-tighter">Real-Time Atmosphere</h4>
                       <p className="text-xs text-[#6B7A8D] font-medium leading-relaxed max-w-[240px]">
                          Atmospheric layers and video backgrounds are synthesized in real-time on the live interface.
                       </p>
                    </div>
                 </div>
              </div>
           </TabsContent>

           {/* 🛡️ Security & Access Control */}
           <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-8">
                    <div className="flex items-center gap-3">
                       <Shield className="w-4 h-4 text-[#00D4FF]" />
                       <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[6px]">Administrative Access</h3>
                    </div>

                    <p className="text-[11px] text-[#6B7A8D] font-medium leading-relaxed italic">
                       Configure the credentials required to enter the core management terminal.
                    </p>

                    <div className="space-y-6 pt-2">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1">Admin Username</Label>
                          <Input 
                            value={settings.admin_username || ''} 
                            onChange={e => setSettings({ ...settings, admin_username: e.target.value })}
                            placeholder="e.g. admin"
                            className="bg-[#1A2332] border-white/10 h-14 rounded-2xl px-6 text-white font-serif"
                          />
                       </div>

                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1">Secret Access Key (Password)</Label>
                          <Input 
                            type="text"
                            value={settings.admin_password || ''} 
                            onChange={e => setSettings({ ...settings, admin_password: e.target.value })}
                            placeholder="e.g. deedox2025"
                            className="bg-[#1A2332] border-white/10 h-14 rounded-2xl px-6 text-white font-mono"
                          />
                       </div>
                    </div>
                 </Card>

                 <div className="bg-[#00D4FF]/5 border border-[#00D4FF]/10 p-10 rounded-[50px] relative overflow-hidden flex flex-col items-center justify-center text-center">
                    <Lock className="w-12 h-12 text-[#00D4FF] mb-6 opacity-40" />
                    <h4 className="text-xl font-serif font-black text-white mb-3">Neural Security Protocol</h4>
                    <p className="text-xs text-[#6B7A8D] font-medium leading-relaxed max-w-[280px]">
                       Changes to these credentials will take effect immediately across all active session clusters. Keep your secret key protected.
                    </p>
                 </div>
              </div>
           </TabsContent>
           <TabsContent value="advanced" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-6">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1 flex items-center gap-2">
                             <FileCode className="w-3 h-3" /> Tracking / Analytics ID
                          </Label>
                          <Input 
                            value={settings.analytics_id || ''} 
                            onChange={e => setSettings({ ...settings, analytics_id: e.target.value })}
                            placeholder="G-XXXXXXXXXX"
                            className="bg-[#1A2332] border-white/10 h-14 rounded-2xl px-6 text-white font-mono uppercase"
                          />
                       </div>

                       <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-red-500/20 transition-all">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#FF5757]" />
                                <span className="text-sm font-bold text-white">Maintenance Portal</span>
                             </div>
                             <p className="text-[10px] text-[#6B7A8D] font-medium uppercase tracking-widest">Force site into standby mode</p>
                          </div>
                          <Switch 
                            checked={settings.maintenance_mode || false} 
                            onCheckedChange={val => setSettings({ ...settings, maintenance_mode: val })}
                            className="data-[state=checked]:bg-[#FF5757]"
                          />
                       </div>
                    </div>
                 </Card>

                 <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 p-8 rounded-[40px] flex flex-col justify-center gap-4">
                    <h4 className="text-2xl font-serif font-black text-[#00D4FF] leading-tight">Environmental Integrity Verified.</h4>
                    <p className="text-sm text-[#00D4FF]/60 font-medium max-w-sm">Global variables are served via a singleton provider to ensure consistent rendering across all node clusters.</p>
                    <div className="flex gap-3 mt-4">
                       {[1,2,3].map(i => <div key={i} className="w-12 h-1 bg-[#00D4FF]/20 rounded-full" />)}
                    </div>
                 </div>
              </div>
           </TabsContent>
         </Tabs>
    </div>
  );
};

export default SiteSettings;
