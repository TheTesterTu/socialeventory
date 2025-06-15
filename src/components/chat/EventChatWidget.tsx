
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Users, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEventChat } from "@/hooks/useEventChat";
import { useAuth } from "@/contexts/AuthContext";
import { Event } from "@/lib/types";

interface EventChatWidgetProps {
  event: Event;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
}

export const EventChatWidget = ({ 
  event, 
  isMinimized = false, 
  onMinimize, 
  onClose 
}: EventChatWidgetProps) => {
  const { user } = useAuth();
  const { participantCount, isActive, joinChat, leaveChat, canJoin } = useEventChat(event.id);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: { name: "Marco", avatar: "" },
      message: "Ciao a tutti! Chi altro viene a questo evento?",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: "2",
      user: { name: "Giulia", avatar: "" },
      message: "Io ci sarò! Non vedo l'ora 🎉",
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
    const newMessage = {
      id: Date.now().toString(),
      user: { name: user.email?.split('@')[0] || 'User', avatar: "" },
      message: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const handleJoinChat = () => {
    if (!isActive) {
      joinChat();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <Button
          onClick={onMinimize}
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
          {participantCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs flex items-center justify-center rounded-full"
            >
              {participantCount}
            </Badge>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed bottom-20 right-4 w-80 h-96 bg-background border rounded-lg shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-primary/5">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Event Chat</span>
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {participantCount}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onMinimize}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={msg.user.avatar} />
                <AvatarFallback className="text-xs">
                  {msg.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{msg.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString('it-IT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground">{msg.message}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        {!canJoin ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Accedi per partecipare alla chat
            </p>
            <Button variant="outline" size="sm">
              Accedi
            </Button>
          </div>
        ) : !isActive ? (
          <Button onClick={handleJoinChat} className="w-full">
            Partecipa alla Chat
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Scrivi un messaggio..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
