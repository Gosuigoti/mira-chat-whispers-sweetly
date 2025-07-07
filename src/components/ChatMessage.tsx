import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  username?: string;
}

export const ChatMessage = ({ message, isUser, timestamp, username }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4 animate-in slide-in-from-bottom-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm",
        isUser 
          ? "bg-user-bubble text-user-bubble-foreground rounded-br-md ml-4" 
          : "bg-ai-bubble text-ai-bubble-foreground rounded-bl-md mr-4"
      )}>
        {!isUser && (
          <div className="text-xs text-muted-foreground mb-1 font-medium">
            Mira 💕
          </div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message}
        </div>
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isUser && username && ` • ${username}`}
        </div>
      </div>
    </div>
  );
};