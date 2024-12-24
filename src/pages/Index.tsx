import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  content: string;
  isUser: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const newMessages = [...messages, { content, isUser: true }];
      setMessages(newMessages);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: newMessages.map(msg => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.content,
          })),
        },
      });

      if (error) throw error;

      const aiResponse = data.choices[0].message.content;
      setMessages([...newMessages, { content: aiResponse, isUser: false }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
      });
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <header className="p-4 border-b bg-background">
        <h1 className="text-2xl font-bold text-primary">Interview Guru</h1>
        <p className="text-muted-foreground">Your personal career coach</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 messages-container">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            Start chatting with Career Coach Sandra!
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={message.isUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;