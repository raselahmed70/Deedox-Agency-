import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettings } from '@/context/SettingsContext';
import { ImageSelector } from '@/components/admin/ImageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, RefreshCw, Sparkles, Play, 
  Plus, Trash2, GripVertical, Video,
  Clock, CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, DialogContent, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const heroSchema = z.object({
  badge: z.string().min(1, 'Badge is required'),
  headline: z.string().min(1, 'Headline is required'),
  highlight_word: z.string().min(1, 'Highlight word is required'),
  subheading: z.string().min(1, 'Subheading is required'),
  cta1_text: z.string().min(1, 'CTA 1 Text is required'),
  cta1_url: z.string().min(1, 'CTA 1 URL is required'),
  cta2_text: z.string().min(1, 'CTA 2 Text is required'),
  cta2_url: z.string().min(1, 'CTA 2 URL is required'),
  video_url: z.string().url('Must be a valid URL'),
  stats: z.array(z.object({
    number: z.string(),
    label: z.string()
  })).max(6)
});

type HeroFormValues = z.infer<typeof heroSchema>;

const HeroEditor: React.FC = () => {
  const { hero, updateHero, isLoading: contextLoading } = useSettings();
  const [saving, setSaving] = useState(false);

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      badge: '',
      headline: '',
      highlight_word: '',
      subheading: '',
      cta1_text: '',
      cta1_url: '',
      cta2_text: '',
      cta2_url: '',
      video_url: '',
      stats: []
    }
  });

  useEffect(() => {
    if (hero) {
      form.reset({
        badge: hero.badge || '',
        headline: hero.headline || '',
        highlight_word: hero.highlight_word || '',
        subheading: hero.subheading || '',
        cta1_text: hero.cta1_text || '',
        cta1_url: hero.cta1_url || '',
        cta2_text: hero.cta2_text || '',
        cta2_url: hero.cta2_url || '',
        video_url: hero.video_url || '',
        stats: hero.stats || []
      });
    }
  }, [hero, form]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "stats"
  });

  const watchedValues = form.watch();



  const onSubmit = async (values: HeroFormValues) => {
    setSaving(true);
    try {
      await updateHero(values);
      toast.success("Hero section updated successfully!");
      form.reset(values); // Reset dirty state
    } catch (err) {
      toast.error("Failed to save changes");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form]);

  if (contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="text-[#6B7A8D] font-serif italic">Accessing hero archives...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start relative">
      {/* 📝 Left Side: Form */}
      <div className="flex-1 space-y-8 w-full">
        <div className="flex items-center justify-between bg-[#111820] p-6 rounded-2xl border border-white/5 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00D4FF]/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">Hero Command</h2>
              <p className="text-[11px] text-[#6B7A8D] uppercase tracking-widest mt-0.5">Edit main presence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {form.formState.isDirty && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFB830] uppercase tracking-widest mr-2 animate-pulse">
                <Clock className="w-3 h-3" />
                Unsaved Changes
              </span>
            )}
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={saving}
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold h-10 px-6 rounded-xl"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Syncing...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <form className="space-y-8 pb-32">
          {/* Badge & Headline */}
          <section className="bg-[#111820] border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[4px] mb-4">Badge & Headline</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#6B7A8D] ml-1">Badge Text</Label>
                <Input {...form.register('badge')} className="bg-[#1A2332] border-white/5 h-12 rounded-xl focus:border-[#00D4FF]/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#6B7A8D] ml-1">Main Headline</Label>
                <Textarea {...form.register('headline')} rows={3} className="bg-[#1A2332] border-white/5 rounded-xl focus:border-[#00D4FF]/50 resize-none font-serif text-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#6B7A8D] ml-1">Gradient Word</Label>
                <Input {...form.register('highlight_word')} placeholder="Which word gets the glow?" className="bg-[#1A2332] border-white/5 h-12 rounded-xl focus:border-[#00D4FF]/50 text-[#00D4FF]" />
              </div>
            </div>
          </section>

          {/* Subheading */}
          <section className="bg-[#111820] border border-white/5 rounded-3xl p-8 space-y-4">
            <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[4px] mb-4">Subheading</h3>
            <div className="space-y-2">
              <Textarea {...form.register('subheading')} rows={4} className="bg-[#1A2332] border-white/5 rounded-xl focus:border-[#00D4FF]/50 resize-none" />
            </div>
          </section>

          {/* CTA Buttons */}
          <section className="bg-[#111820] border border-white/5 rounded-3xl p-8">
            <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[4px] mb-6">Call to Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 inline-block text-[10px] font-bold tracking-widest text-[#00D4FF]">PRIMARY BUTTON</div>
                <div className="space-y-2">
                  <Label className="text-[#6B7A8D]">Label</Label>
                  <Input {...form.register('cta1_text')} className="bg-[#1A2332] border-white/5 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#6B7A8D]">Target URL</Label>
                  <Input {...form.register('cta1_url')} className="bg-[#1A2332] border-white/5 h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 inline-block text-[10px] font-bold tracking-widest text-white/40">SECONDARY BUTTON</div>
                <div className="space-y-2">
                  <Label className="text-[#6B7A8D]">Label</Label>
                  <Input {...form.register('cta2_text')} className="bg-[#1A2332] border-white/5 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#6B7A8D]">Target URL</Label>
                  <Input {...form.register('cta2_url')} className="bg-[#1A2332] border-white/5 h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </section>

          {/* Video URL */}
          <section className="bg-[#111820] border border-white/5 rounded-3xl p-8">
            <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[4px] mb-6">Cinematic Backdrop</h3>
            <div className="space-y-4">
               <ImageSelector
                  label="Backdrop Video (URL or Upload)"
                  value={watchedValues.video_url}
                  onChange={(url) => form.setValue('video_url', url, { shouldDirty: true })}
                  folder="hero"
                  onClear={() => form.setValue('video_url', '', { shouldDirty: true })}
               />
               <p className="text-[10px] text-[#6B7A8D] font-medium leading-relaxed italic">
                  Upload a high-impact video fragment or provide a direct MP4/WebM URL.
               </p>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-[#111820] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[4px]">Performance Stats</h3>
              <Button 
                type="button" 
                onClick={() => append({ number: '', label: '' })}
                disabled={fields.length >= 6}
                variant="outline" 
                size="sm" 
                className="h-9 border-white/5 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                <Plus className="w-3 h-3 mr-1.5" />
                Add Stat
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 p-4 bg-[#1A2332]/50 border border-white/5 rounded-2xl animate-in fade-in slide-in-from-right-2">
                  <GripVertical className="w-4 h-4 text-[#6B7A8D] cursor-grab active:cursor-grabbing" />
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <Input 
                      {...form.register(`stats.${index}.number`)} 
                      placeholder="e.g. 99%" 
                      className="bg-[#1A2332] border-none h-10 rounded-lg text-white font-bold"
                    />
                    <Input 
                      {...form.register(`stats.${index}.label`)} 
                      placeholder="e.g. Success Rate" 
                      className="bg-[#1A2332] border-none h-10 rounded-lg text-white/60"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-2 text-[#FF5757]/40 hover:text-[#FF5757] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="py-8 text-center text-[#6B7A8D] font-serif italic text-sm">No performance indicators established...</div>
              )}
            </div>
          </section>
        </form>
      </div>

      {/* 🖼️ Right Side: Live Mockup Preview */}
      <div className="hidden xl:block w-[400px] sticky top-8 z-10">
        <h3 className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[4px] mb-4 text-center">Neural Proxy Preview</h3>
        <Card className="bg-black border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative">
          <CardContent className="p-0 aspect-[9/16] relative flex flex-col pt-20 px-8 text-center">
             {/* Virtual Video Background */}
             <div className="absolute inset-0 opacity-40 grayscale pointer-events-none">
                <video 
                  src={watchedValues.video_url} 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
             </div>

             <div className="relative z-10 space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/30 text-[#00D4FF] text-[8px] font-bold uppercase tracking-widest mb-4">
                  {watchedValues.badge || 'BADGE TEXT'}
                </div>
                
                <h1 className="text-3xl font-serif font-black text-white leading-none">
                  {watchedValues.headline.split(' ').map((word, i) => (
                    <span key={i} className={cn(
                      word.toLowerCase().includes(watchedValues.highlight_word.toLowerCase()) && watchedValues.highlight_word.length > 2
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B5EA7]" 
                        : "text-white"
                    )}>
                      {word}{' '}
                    </span>
                  )) || 'Your Agency Headline'}
                </h1>

                <p className="text-[10px] text-white/40 leading-relaxed px-4">
                  {watchedValues.subheading || 'Provide a compelling description of your agency value proposition...'}
                </p>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="px-6 py-2.5 bg-[#00D4FF] text-black text-[10px] font-bold rounded-full">
                    {watchedValues.cta1_text || 'Start Project'}
                  </div>
                  <div className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-[10px] font-bold rounded-full">
                    {watchedValues.cta2_text || 'Our Work'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-12">
                   {watchedValues.stats.slice(0, 4).map((stat, i) => (
                     <div key={i} className="text-left">
                        <div className="text-xl font-serif font-black text-white">{stat.number || '0+'}</div>
                        <div className="text-[8px] font-bold text-[#6B7A8D] uppercase tracking-widest">{stat.label || 'Label'}</div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20">
                <CheckCircle2 className="w-3 h-3 text-[#00D4FF]" />
                <span className="text-[8px] font-bold text-white tracking-[4px] uppercase">Synced with Universe</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroEditor;
