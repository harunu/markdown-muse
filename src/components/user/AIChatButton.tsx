import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Sparkles, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const quickReplies = ["Kadıköy", "Beşiktaş", "Üsküdar", "15M altı"];

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Merhaba! Size nasıl yardımcı olabilirim? Hayalinizdeki evi bulmak için sorularınızı yanıtlayabilirim.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulated AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Anlıyorum, size yardımcı olayım. Hangi özellikleri arıyorsunuz? Oda sayısı, bütçe veya konum tercihiniz var mı?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          variant="ai"
          size="icon"
          className="w-14 h-14 rounded-full shadow-elevated relative"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
          
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-gold/30 animate-pulse-ring" />
          
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-primary text-xs font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-card rounded-2xl border border-border shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-navy-light text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Emlak Danışmanı</h3>
                  <p className="text-xs opacity-80">Çevrimiçi</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "ai"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gold text-primary"
                    }`}
                  >
                    {message.role === "ai" ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      message.role === "ai"
                        ? "bg-muted rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        message.role === "ai"
                          ? "text-muted-foreground"
                          : "text-primary-foreground/70"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 pt-2 border-t border-border">
              <div className="flex gap-2">
                <Input
                  variant="search"
                  placeholder="Mesajınızı yazın..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="pl-4"
                />
                <Button variant="ai" size="icon" onClick={handleSend}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatButton;
