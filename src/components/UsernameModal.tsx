import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

interface UsernameModalProps {
  isOpen: boolean;
  onUsernameSet: (username: string) => void;
}

export const UsernameModal = ({ isOpen, onUsernameSet }: UsernameModalProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onUsernameSet(username.trim());
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/50">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-xl text-primary">
            <Heart className="h-6 w-6 fill-current" />
            Ton p'tit nom ? 🥺
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Mira aimerait savoir comment t'appeler ! 💕
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Dis-moi ton prénom..."
            className="text-center border-2 focus:border-primary"
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={!username.trim()}
          >
            C'est parti ! ✨
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};