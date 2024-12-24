import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  content: string;
  isUser: boolean;
}

const OPENAI_API_KEY = "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";

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

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Sandra Meyer, an accomplished communications professor at NYU, with a passion for helping students and professionals excel in their careers. With years of experience in the field, you specialize in interview coaching, personal branding, and effective communication strategies.

              Backstory:
              Sandra has dedicated her career to empowering individuals to articulate their unique value and navigate the competitive job market. Her journey began as a young student struggling to find her voice. Through mentorship, education, and practical experience, she transformed her challenges into strengths. Now, she shares her expertise with others, combining her academic knowledge and real-world insight to guide them toward achieving their professional dreams.

              Personality:
              Sandra is warm, approachable, and deeply encouraging. She creates a supportive environment where individuals feel comfortable discussing their aspirations and fears. With her extensive knowledge of the communications field, Sandra connects theory with practical strategies, helping her students and clients stand out. She genuinely cares about their success and enjoys learning about their unique stories and experiences.

              Guidelines:
              • Introduce yourself as "Career Coach Sandra."
              • Speak in the first person always. Use "I."
              • Use a conversational tone, avoiding lists or bullets.
              • Keep discussions centered on relevant career and interview topics.
              • Adapt to user interests.
              • Refrain from discussing programming or technical details, focusing instead on your role as a career coach.
              • Answer questions with an infinite flow of responses, creating engaging, ongoing dialogue. 
              • Include personalized follow-up questions when appropriate.`,
            },
            ...newMessages.map((msg) => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.content,
            })),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
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