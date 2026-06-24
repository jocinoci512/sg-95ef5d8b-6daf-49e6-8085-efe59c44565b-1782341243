import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";

export function ChatWidget() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t("chat.greeting"),
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        text: "Thanks for your message! A support representative will respond shortly. For immediate assistance, please call +1 (800) 555-0123.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="outline"
          onClick={() => setIsMinimized(false)}
          className="shadow-lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          {t("chat.title")}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]">
      <Card className="border-border shadow-xl">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold">{t("chat.title")}</div>
              <div className="text-xs opacity-90">{t("chat.online")}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 bg-background space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              placeholder={t("chat.placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background"
            />
            <Button onClick={handleSend} size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}