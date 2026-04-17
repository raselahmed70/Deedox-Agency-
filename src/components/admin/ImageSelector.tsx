import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, Link as LinkIcon, RefreshCw, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/supabase';
import { toast } from 'sonner';

interface ImageSelectorProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  className?: string;
  onClear?: () => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange,
  label,
  folder = 'general',
  className,
  onClear
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>(value?.startsWith('http') && !value.includes('supabase.co') ? 'url' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImage(file, folder);
      onChange(publicUrl);
      setUrlInput(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      toast.success("Image URL updated");
    }
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {label && (
        <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[3px] ml-1">
          {label}
        </Label>
      )}

      <div className="flex items-center gap-2 p-1 bg-[#1A2332] rounded-xl border border-white/5 w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            mode === 'upload' ? "bg-[#00D4FF] text-black shadow-lg shadow-[#00D4FF]/20" : "text-[#6B7A8D] hover:text-white"
          )}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            mode === 'url' ? "bg-[#00D4FF] text-black shadow-lg shadow-[#00D4FF]/20" : "text-[#6B7A8D] hover:text-white"
          )}
        >
          URL
        </button>
      </div>

      <div className="relative group aspect-video bg-[#1A2332] border-2 border-dashed border-white/10 rounded-[28px] overflow-hidden">
        {value ? (
          <>
            <img src={value} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              {mode === 'upload' ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-white/20 text-white hover:bg-white/10 rounded-xl"
                >
                  {isUploading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  Change File
                </Button>
              ) : null}
              {onClear && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </>
        ) : (
          <div 
            className="flex flex-col items-center justify-center h-full gap-3 cursor-pointer p-6"
            onClick={() => mode === 'upload' && fileInputRef.current?.click()}
          >
            <div className="p-4 bg-white/5 rounded-full text-[#6B7A8D]">
              {mode === 'upload' ? <Upload className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-bold">
                {mode === 'upload' ? 'Upload Asset' : 'Select from Universe'}
              </p>
              <p className="text-[10px] text-[#6B7A8D] uppercase mt-1">
                {mode === 'upload' ? 'Drag & drop or click to browse' : 'Use a direct image link below'}
              </p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
        />
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#00D4FF]" />
          </div>
        )}
      </div>

      {mode === 'url' && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative flex-1 group">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A8D] group-focus-within:text-[#00D4FF]" />
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://image-url.com/asset.jpg"
              className="pl-12 bg-[#111820] border-white/5 h-12 rounded-xl focus:border-[#00D4FF]/30"
            />
          </div>
          <Button 
            type="button"
            onClick={handleUrlSubmit}
            className="bg-[#1A2332] hover:bg-[#252D3D] text-white border border-white/5 h-12 px-6 rounded-xl"
          >
            <Check className="w-4 h-4 mr-2 text-[#00E5A0]" />
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
