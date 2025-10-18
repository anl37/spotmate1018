import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { mockIcebreakers } from "@/types/session";

interface IcebreakerScreenProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  meetCode: string;
  onStartTalking?: () => void;
}

export const IcebreakerScreen = ({ open, onClose, userName, meetCode, onStartTalking }: IcebreakerScreenProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions] = useState(() => {
    // Pick 5 random questions
    const shuffled = [...mockIcebreakers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const handleShuffle = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Start your conversation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Pick a question you both like — then go talk!
          </p>

          <div className="gradient-card rounded-3xl p-6 min-h-[160px] flex items-center justify-center">
            <p className="text-lg font-medium text-center leading-relaxed">
              {questions[currentQuestionIndex]}
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentQuestionIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleShuffle}
              variant="outline"
              className="w-full rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Shuffle Question
            </Button>

            <Button
              onClick={() => {
                onStartTalking?.();
                onClose();
              }}
              className="w-full rounded-full gradient-warm shadow-soft"
            >
              We're good ✓
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Meet Code: <span className="font-semibold">{meetCode}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
