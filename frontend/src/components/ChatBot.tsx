import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MoreVertical, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useAuth } from "@/context/AuthContext";

// Define the message type for the conversation history
type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

export default function ChatBot() {
  const [visibleMessageIndices, setVisibleMessageIndices] = useState<number[]>(
    []
  );
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { t } = useTranslation();
  const { authState } = useAuth();
  const isDark = useDarkMode();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messageBgClass = isDark ? "bg-green-900" : "bg-gray-100";
  // Use magenta/pink as the complement of green
  const userMessageBgClass = isDark ? "bg-slate-800" : "bg-slate-600";

  const messageKeys = [
    "chatbot.welcomeMessage.welcome1",
    "chatbot.welcomeMessage.welcome2",
    "chatbot.welcomeMessage.welcome3",
    "chatbot.welcomeMessage.welcome4",
  ];

  // Effect to show welcome messages for unauthenticated users
  useEffect(() => {
    if (authState !== "unauthenticated" || !open) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index < messageKeys.length) {
        setVisibleMessageIndices((prev) => {
          if (!prev.includes(index)) {
            return [...prev, index];
          }
          return prev;
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [authState, open, messageKeys.length]);

  // Effect to initialize conversation for authenticated users
  useEffect(() => {
    if (authState === "authenticated" && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: t("chatbot.authenticatedPrompt", "How can I assist you today?"),
          sender: "bot",
        },
      ]);
    }
  }, [authState, messages.length, t]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, visibleMessageIndices]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: t(
          "chatbot.botResponse",
          "I’m here to help! What else would you like to know?"
        ),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="absolute bottom-8 right-8 z-20">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-[360px]"
          >
            <Card className="shadow-xl rounded-xl overflow-hidden gap-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 mb-4 border-b">
                <h2 className="text-sm font-medium">
                  {t("chatbot.title", "Grün.Zuhause")}
                </h2>
                <div className="flex gap-2 items-center">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  <button onClick={() => setOpen(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <CardContent className="px-4 space-y-4">
                <ScrollArea className="h-[400px] pr-2" ref={scrollAreaRef}>
                  <div className="space-y-3">
                    {authState === "unauthenticated"
                      ? // Unauthenticated: Show welcome messages
                        visibleMessageIndices.map((idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                          >
                            <div
                              className={cn(
                                `${messageBgClass} text-foreground text-sm px-3 py-2 rounded-md`,
                                idx === 0 && "font-medium"
                              )}
                              dangerouslySetInnerHTML={{
                                __html: t(messageKeys[idx]),
                              }}
                            />
                          </motion.div>
                        ))
                      : // Authenticated: Show conversation history
                        messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.4 }}
                            className={cn(
                              "text-sm px-3 py-2 rounded-md",
                              message.sender === "user"
                                ? `ml-auto ${userMessageBgClass} text-white max-w-[80%]`
                                : `${messageBgClass} text-foreground max-w-[80%]`
                            )}
                          >
                            {message.text}
                          </motion.div>
                        ))}
                  </div>
                </ScrollArea>

                {authState === "unauthenticated" ? (
                  <Link to="/auth">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      {t("chatbot.startNow", "Jetzt Starten")}
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t(
                        "chatbot.inputPlaceholder",
                        "Type your message..."
                      )}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-sm px-4 shadow-lg bg-white text-green-700 hover:bg-green-50"
        >
          {t("chatbot.openChat", "Chat öffnen")}
        </Button>
      )}
    </div>
  );
}
