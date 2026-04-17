import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Settings2, Plus, Trash2, Edit3, 
  GripVertical, Eye, EyeOff, Save, X,
  RefreshCw, CheckCircle2, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings, type Service } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';

interface SortableServiceProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (service: Service) => void;
}

const SortableServiceRow: React.FC<SortableServiceProps> = ({ 
  service, onEdit, onDelete, onToggleVisibility 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "group flex items-center gap-6 p-6 md:p-8 bg-[#111820] border border-white/5 rounded-[32px] hover:border-white/10 transition-all duration-300",
        !service.visible && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded-xl transition-colors">
        <GripVertical className="w-5 h-5 text-[#6B7A8D]" />
      </div>
      
      <div className="w-14 h-14 bg-[#00D4FF]/10 rounded-2xl flex items-center justify-center border border-[#00D4FF]/20 shrink-0">
        <span className="text-2xl">{service.icon || '🛠️'}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
          {service.title}
          <Badge variant="outline" className={cn(
            "text-[9px] font-bold",
            service.visible ? "text-[#00D4FF] border-[#00D4FF]/20 bg-[#00D4FF]/5" : "text-[#FF5757] border-[#FF5757]/20 bg-[#FF5757]/5"
          )}>
            {service.visible ? 'ACTIVE' : 'HIDDEN'}
          </Badge>
        </h4>
        <p className="text-sm text-[#6B7A8D] line-clamp-1 mt-1 font-sans">{service.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onToggleVisibility(service)}
          className="w-10 h-10 text-[#6B7A8D] hover:text-white"
        >
          {service.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(service)}
          className="w-10 h-10 text-[#6B7A8D] hover:text-white"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(service.id)}
          className="w-10 h-10 text-[#6B7A8D] hover:text-[#FF5757]"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const ServicesEditor: React.FC = () => {
  const { services, updateServices, updateService, addService, deleteService, isLoading } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s.id === active.id);
      const newIndex = services.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(services, oldIndex, newIndex).map((s, idx) => ({
        ...s,
        display_order: idx
      }));
      await updateServices(reordered);
    }
  };

  const handleSave = async () => {
    if (!currentService.title || !currentService.icon || !currentService.description) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        title: currentService.title,
        icon: currentService.icon,
        description: currentService.description,
        details: currentService.details || '',
        visible: currentService.visible ?? true,
        display_order: currentService.display_order ?? services.length
      };

      if (currentService.id) {
        await updateService(currentService.id, data);
        toast.success("Service updated");
      } else {
        await addService(data);
        toast.success("New service added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Orchestrating capabilities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      {/* 🔮 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-10 rounded-3xl border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/5 blur-3xl rounded-full" />
         <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#00D4FF]/10 rounded-2xl flex items-center justify-center border border-[#00D4FF]/20">
              <Settings2 className="w-8 h-8 text-[#00D4FF]" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Service Ecosystem</h2>
              <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-widest mt-1">Manage Agency Capabilities & Value Props</p>
            </div>
         </div>
         <Button 
           onClick={() => { setCurrentService({ icon: '✨', visible: true }); setModalOpen(true); }}
           className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold h-12 px-8 rounded-2xl relative z-10"
         >
           <Plus className="w-5 h-5 mr-2" />
           Add Service
         </Button>
      </div>

      {/* 🏗️ Drag & Drop List */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={services.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {services.map((service) => (
              <SortableServiceRow 
                key={service.id} 
                service={service} 
                onEdit={(s) => { setCurrentService(s); setModalOpen(true); }}
                onDelete={(id) => deleteService(id)}
                onToggleVisibility={(s) => updateService(s.id, { visible: !s.visible })}
              />
            ))}
            
            {services.length === 0 && (
              <div className="py-24 text-center bg-[#111820] rounded-[48px] border border-white/5 border-dashed">
                <Settings2 className="w-16 h-16 text-white/5 mb-6 mx-auto" />
                <h3 className="text-xl font-serif font-bold text-white mb-2">Void State Detected</h3>
                <p className="text-[#6B7A8D] font-sans text-sm">No services have been defined in this reality yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* 🛠️ Service Editor Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#111820] border-white/10 text-white max-w-2xl rounded-[40px] p-10 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold tracking-tight">
              {currentService.id ? 'Refine Service Model' : 'Deploy New Service'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Icon (Emoji)</Label>
                <Input 
                  value={currentService.icon || ''} 
                  onChange={e => setCurrentService({ ...currentService, icon: e.target.value })}
                  className="bg-[#1A2332] border-white/5 h-14 rounded-2xl text-center text-2xl"
                  placeholder="✨"
                />
              </div>
              <div className="md:col-span-3 space-y-3">
                <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Service Title</Label>
                <Input 
                  value={currentService.title || ''} 
                  onChange={e => setCurrentService({ ...currentService, title: e.target.value })}
                  className="bg-[#1A2332] border-white/5 h-14 rounded-2xl"
                  placeholder="e.g., Cinematic Branding"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Brief Description</Label>
              <Input 
                value={currentService.description || ''} 
                onChange={e => setCurrentService({ ...currentService, description: e.target.value })}
                className="bg-[#1A2332] border-white/5 h-14 rounded-2xl"
                placeholder="Core value proposition in one sentence"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Detailed Breakdown</Label>
              <Textarea 
                value={currentService.details || ''} 
                onChange={e => setCurrentService({ ...currentService, details: e.target.value })}
                placeholder="Full technical details or methodology..."
                rows={4}
                className="bg-[#1A2332] border-white/5 rounded-3xl resize-none font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00D4FF]/10 rounded-lg"><Eye className="w-4 h-4 text-[#00D4FF]" /></div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">Live Visibility</p>
                    <p className="text-[10px] text-[#6B7A8D]">Control if this service is shown on the site</p>
                  </div>
               </div>
               <Switch 
                 checked={currentService.visible ?? true} 
                 onCheckedChange={val => setCurrentService({ ...currentService, visible: val })}
                 className="data-[state=checked]:bg-[#00D4FF]"
               />
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="text-[#6B7A8D] hover:text-white font-bold uppercase text-[10px] tracking-widest">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold h-12 px-10 rounded-2xl"
            >
              {isSaving ? 'Deploying...' : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesEditor;
