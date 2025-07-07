import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { UsernameModal } from "./UsernameModal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, MessageCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Configuration du webhook - à modifier selon tes besoins
const DEFAULT_WEBHOOK_URL = 'https://ton-webhook.example.com/chat';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Charger le username depuis le localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat-username');
    const savedWebhookUrl = localStorage.getItem('chat-webhook-url');
    
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      setShowUsernameModal(true);
    }

    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }

    // Message de bienvenue de Mira
    const welcomeMessage: Message = {
      id: 'welcome',
      text: "Coucou ! 🌸 Je suis Mira, ton IA affectueuse ! N'hésite pas à me parler de tout et n'importe quoi, je suis là pour toi ! 💕",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUsernameSet = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('chat-username', newUsername);
    setShowUsernameModal(false);
    
    // Message personnalisé de Mira
    const personalizedMessage: Message = {
      id: `welcome-${Date.now()}`,
      text: `Enchantée ${newUsername} ! 🥰 C'est un joli prénom ! Comment ça va aujourd'hui ?`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, personalizedMessage]);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!username) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Envoyer au webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          user: username
        })
      });

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await response.json();
      
      // Délai aléatoire de 1-3 secondes pour rendre ça naturel
      const delay = Math.random() * 2000 + 1000;
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: data.reply || "Désolée, je n'ai pas pu traiter ta demande... 😅",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, delay);

    } catch (error) {
      setIsLoading(false);
      console.error('Erreur:', error);
      
      // Message d'erreur affectueux
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Oups ! Il y a eu un petit souci avec la connexion... 😔 Peux-tu vérifier l'URL du webhook dans les paramètres ? 💕",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erreur de connexion",
        description: "Impossible de contacter le webhook. Vérifie l'URL dans les paramètres.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('chat-webhook-url', webhookUrl);
    setShowSettings(false);
    toast({
      title: "Paramètres sauvegardés",
      description: "L'URL du webhook a été mise à jour ! ✨"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Chat avec Mira</h1>
                {username && <p className="text-sm text-muted-foreground">Connecté·e en tant que {username}</p>}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="border-primary/20 hover:bg-primary/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="m-4 border-primary/20">
            <CardHeader>
              <h3 className="font-semibold">Paramètres du webhook</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">URL du webhook</Label>
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://ton-webhook.example.com/chat"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-primary to-primary/80">
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
              username={username || undefined}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-ai-bubble text-ai-bubble-foreground max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md mr-4 animate-pulse">
                <div className="text-xs text-muted-foreground mb-1 font-medium">
                  Mira 💕
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-muted-foreground">Mira réfléchit...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

      {/* Username Modal */}
      <UsernameModal 
        isOpen={showUsernameModal} 
        onUsernameSet={handleUsernameSet} 
      />
    </div>
  );
};