import React, { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { 
  ListOrdered, Plus, Trash2, Edit3, 
  GripVertical, Save, RefreshCw,
  Hash, ArrowRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, closestCenter, 
  KeyboardSensor, PointerSensor, 
  useSensor, useSensors, type DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  display_order: number;
}

const SortableStep = ({ 
  step, 
  index,
  onEdit, 
  onDelete 
}: { 
  step: ProcessStep; 
  index: number;
  onEdit: (s: ProcessStep) => void;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "flex flex-col md:flex-row md:items-center gap-6 p-6 bg-[#111820] border rounded-3xl transition-all duration-500 group relative overflow-hidden",
        isDragging ? "border-[#00D4FF] shadow-[0_0_40px_rgba(0,212,255,0.15)] opacity-50" : "border-white/5 hover:border-white/10"
      )}
    >
      <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-[#6B7A8D] hover:text-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex items-center gap-6 flex-1 pl-4">
         <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-serif text-2xl font-black text-[#00D4FF] group-hover:scale-110 group-hover:bg-[#00D4FF]/10 transition-all duration-500">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="absolute -top-1 -right-1">
               <Zap className="w-4 h-4 text-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
         </div>

         <div className="flex-1 space-y-1">
            <h4 className="text-xl font-serif font-bold text-white tracking-tight group-hover:text-[#00D4FF] transition-colors">{step.title}</h4>
            <p className="text-xs text-[#6B7A8D] leading-relaxed line-clamp-2 pr-12">{step.description}</p>
         </div>
      </div>

      <div className="flex items-center gap-3 md:border-l border-white/5 md:pl-6">
         <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => onEdit(step)}
           className="w-10 h-10 rounded-xl hover:bg-white/5 text-[#6B7A8D] hover:text-white transition-all"
         >
           <Edit3 className="w-5 h-5" />
         </Button>
         <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => onDelete(step.id)}
           className="w-10 h-10 rounded-xl hover:bg-[#FF5757]/10 text-[#6B7A8D] hover:text-[#FF5757] transition-all"
         >
           <Trash2 className="w-5 h-5" />
         </Button>
      </div>
    </div>
  );
};

const ProcessEditor: React.FC = () => {
  const { process: steps, updateProcess, updateProcessStep, addProcessStep, deleteProcessStep, isLoading } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Partial<ProcessStep>>({});
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex(s => s.id === active.id);
      const newIndex = steps.findIndex(s => s.id === over.id);
      const newArray = arrayMove(steps, oldIndex, newIndex);
      
      try {
        const updates = newArray.map((s, idx) => ({ ...s, display_order: idx }));
        await updateProcess(updates);
        toast.info("Chronological order synced");
      } catch (err) {
        toast.error("Synchronization failed");
      }
    }
  };

  const handleSave = async () => {
    if (!currentStep.title || !currentStep.description) {
      toast.error("Please provide both title and description");
      return;
    }

    setIsSaving(true);
    try {
      if (currentStep.id) {
        await updateProcessStep(currentStep.id, { 
          title: currentStep.title, 
          description: currentStep.description 
        });
        toast.success("Operational step refined");
      } else {
        await addProcessStep({ 
          title: currentStep.title, 
          description: currentStep.description,
          display_order: steps.length 
        });
        toast.success("New phase integrated into flux");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Flux transition failure");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProcessStep(id);
      toast.success("Step purged from reality");
    } catch (err) {
      toast.error("Purge aborted");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">mapping procedural flow...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
       {/* 🚀 Header Area */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-64 h-64 bg-[#00D4FF]/5 blur-[100px] rounded-full" />
         <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-[#00D4FF]/10 rounded-3xl flex items-center justify-center border border-[#00D4FF]/20 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] transition-all">
              <ListOrdered className="w-8 h-8 text-[#00D4FF]" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-white tracking-tighter">Workflow Flux</h2>
              <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-[4px] mt-1">
                {steps.length} Phases Of Creation
              </p>
            </div>
         </div>
         <Button 
           onClick={() => { setCurrentStep({}); setModalOpen(true); }}
           className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-black h-14 px-10 rounded-2xl relative z-10 shadow-xl shadow-[#00D4FF]/10"
         >
           <Plus className="w-5 h-5 mr-2" />
           Integrate New Phase
         </Button>
      </div>

       {/* 📋 Steps List */}
       <div className="space-y-6">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={steps.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-[#111820] rounded-[40px] border border-white/5 border-dashed">
                <Hash className="w-16 h-16 text-white/5 mb-6 mx-auto" />
                <h3 className="text-xl font-serif font-bold text-white mb-2">Algorithm Undefined</h3>
                <p className="text-[#6B7A8D] font-sans text-sm max-w-xs mx-auto mb-8">
                  No procedural steps established. Design your roadmap to success.
                </p>
                <Button onClick={() => setModalOpen(true)} className="bg-white/5 text-white/40 hover:text-white border border-white/10 rounded-xl px-10 h-12">
                  Initialize Step 01
                </Button>
              </div>
            ) : (
              steps.map((step, idx) => (
                <SortableStep 
                  key={step.id} 
                  step={step} 
                  index={idx}
                  onEdit={(s) => { setCurrentStep(s); setModalOpen(true); }}
                  onDelete={handleDelete}
                />
              ))
            )}
          </SortableContext>
        </DndContext>
      </div>

      {/* 🛠 Step Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#111820] border-white/10 text-white max-w-lg rounded-[40px] p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF]/5 blur-3xl rounded-full" />
          
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-black tracking-tighter">
              {currentStep.id ? 'Refine Algorithm' : 'Establish Protocol'}
            </DialogTitle>
            <DialogDescription className="text-[#6B7A8D] font-sans">
              Describe a phase in your creation methodology.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-8 relative z-10">
            <div className="space-y-2">
              <Label className="text-[#6B7A8D] text-[10px] font-bold uppercase tracking-[4px] ml-1">Phase Title</Label>
              <Input 
                value={currentStep.title || ''} 
                onChange={e => setCurrentStep({ ...currentStep, title: e.target.value })}
                placeholder="e.g. Discovery & Resonance"
                className="bg-[#1A2332] border-white/10 h-14 rounded-2xl text-lg font-serif font-bold focus:border-[#00D4FF]/50 transition-all px-6"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#6B7A8D] text-[10px] font-bold uppercase tracking-[4px] ml-1">Phase Logic</Label>
              <Textarea 
                value={currentStep.description || ''} 
                onChange={e => setCurrentStep({ ...currentStep, description: e.target.value })}
                placeholder="Explain the technical and creative flow of this step..."
                rows={5}
                className="bg-[#1A2332] border-white/10 rounded-[30px] resize-none px-6 py-4 focus:border-[#00D4FF]/50 transition-all font-sans"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:justify-start">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-black h-14 rounded-2xl shadow-xl shadow-[#00D4FF]/20"
            >
              {isSaving ? 'Encrypting Flux...' : (currentStep.id ? 'Authorize Refinement' : 'Integrate Protocol')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="px-6 h-14 text-[#6B7A8D] hover:text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl border border-transparent hover:border-white/5">
              Abort
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessEditor;
