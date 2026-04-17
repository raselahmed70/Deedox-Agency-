import { cn } from "../../lib/utils";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  MessageSquare,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { useCallback, useState, useEffect, useRef } from "react";
import { useSettings } from "../../context/SettingsContext";
import { toast } from "sonner";

// Simplified UI Components to ensure self-containment
const PrimitiveAvatar = ({ src, fallback, className }: { src?: string; fallback: string; className?: string }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/10 shadow-sm bg-zinc-800", className)}>
    {src ? (
      <img src={src} className="aspect-square h-full w-full object-cover" alt="avatar" />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-semibold">{fallback}</div>
    )}
  </div>
);

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transformOrigin: "bottom right",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10, x: -10 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

export function FloatingChatWidget() {
  const { aiConfig } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (messages.length === 0 && aiConfig?.welcome_message) {
        setMessages([{
            role: 'assistant',
            content: aiConfig.welcome_message
        }]);
    }
  }, [aiConfig?.welcome_message, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !aiConfig?.enabled) return;

    if (!aiConfig.api_key) {
      toast.error("AI Neural Link not established (API Key missing)");
      return;
    }

    const userMsg = inputMessage.trim();
    setInputMessage("");
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${aiConfig.api_key}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": aiConfig.assistant_name || "Deedox AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: aiConfig.model === "meta-llama/llama-3.1-8b-instruct:free" ? "openrouter/free" : (aiConfig.model || "openrouter/free"),
          max_tokens: 1000,
          messages: [
            { role: "system", content: aiConfig.system_prompt || "You are a helpful assistant." },
            ...newMessages
          ]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Quantum synchronization failed");
      }

      const aiResponse = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Neural connection interrupted: ${err.message}. Please verify the API key in the admin panel.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const agentName = aiConfig?.assistant_name || "Deedox AI";
  const agentRole = "Cinematic Assistant";
  const agentAvatar = "/assets/images/story-1.png";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[380px] overflow-hidden rounded-3xl liquid-glass bg-white/[0.01] shadow-2xl transition-all duration-700"
          >
            {/* Header */}
            <div className="relative border-b border-white/5 p-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-zinc-500/10 opacity-50 transition-all duration-500" />
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <PrimitiveAvatar
                      src={agentAvatar}
                      fallback="AI"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {agentName}
                    </h3>
                    <span className="text-xs text-white/40">
                      {agentRole}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex h-[320px] flex-col gap-4 overflow-y-auto p-4 bg-transparent custom-scrollbar">
              {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    variants={messageVariants} 
                    className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse self-end" : "")}
                  >
                    <PrimitiveAvatar 
                        src={msg.role === 'assistant' ? agentAvatar : undefined} 
                        fallback={msg.role === 'assistant' ? "AI" : "ME"} 
                        className="h-8 w-8" 
                    />
                    <div className={cn("flex max-w-[85%] flex-col gap-1", msg.role === 'user' ? "items-end" : "")}>
                        <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                            {msg.role === 'assistant' ? agentName : "You"}
                        </span>
                        <div className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm text-white shadow-sm backdrop-blur-sm border border-white/10",
                            msg.role === 'assistant' ? "rounded-tl-none bg-white/10" : "rounded-tr-none bg-zinc-800 border-white/5"
                        )}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                  </motion.div>
              ))}
              {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <PrimitiveAvatar src={agentAvatar} fallback="AI" className="h-8 w-8" />
                    <div className="rounded-2xl rounded-tl-none bg-white/5 px-4 py-3 border border-white/5 w-16 flex items-center justify-center gap-1">
                        <Loader2 className="h-4 w-4 text-white/40 animate-spin" />
                    </div>
                  </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 bg-black/40 p-3 backdrop-blur-md">
              <form
                className="relative flex items-center gap-2"
                onSubmit={handleSend}
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message ${agentName}...`}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-white/20 focus:bg-white/10 focus:ring-1 focus:ring-white/10"
                />
                <button
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={cn(
          "cursor-pointer group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-2xl transition-all duration-300",
          isOpen && "rotate-90 bg-zinc-800"
        )}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-white/20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-black" />
        )}
      </motion.button>
    </div>
  );
}
