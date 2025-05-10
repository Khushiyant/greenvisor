import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function ChatBot() {
  // Track message indices instead of message content
  const [visibleMessageIndices, setVisibleMessageIndices] = useState<number[]>(
    []
  );
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();

  // Create the message keys (not the translated content)
  const messageKeys = [
    "chatbot.welcomeMessage.welcome1",
    "chatbot.welcomeMessage.welcome2",
    "chatbot.welcomeMessage.welcome3",
    "chatbot.welcomeMessage.welcome4",
  ];

  useEffect(() => {
    if (!open) return;
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
  }, [open]); // Only depend on open, not on translations

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
            <Card className="bg-white shadow-xl rounded-xl overflow-hidden gap-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
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

              <CardContent className="p-4 space-y-4">
                <ScrollArea className="h-[400px] pr-2">
                  <div className="space-y-3">
                    {/* Container with spacing for messages */}
                    {visibleMessageIndices.map((idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                      >
                        <div
                          className={cn(
                            "bg-gray-100 text-sm px-3 py-2 rounded-md",
                            idx === 0 && "font-medium"
                          )}
                          dangerouslySetInnerHTML={{
                            __html: t(messageKeys[idx]),
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t("chatbot.startNow", "Jetzt Starten")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full px-4 shadow-lg"
        >
          {t("chatbot.openChat", "Chat öffnen")}
        </Button>
      )}
    </div>
  );
}
