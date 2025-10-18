import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { IcebreakerScreen } from "@/components/IcebreakerScreen";
import { toast as toastHook } from "@/hooks/use-toast";

interface SurpriseMeProps {
  isInSpace: boolean;
  onStartTalking?: (meetingData: {
    sessionId: string;
    userName: string;
    meetCode: string;
    startAt: Date;
    spaceName?: string;
  }) => void;
}

const ICEBREAKERS = [
  "What brought you here today — routine or trying something new?",
  "Morning person or night owl for this?",
  "Two truths and a tiny lie?",
  "If we have 15 mins later: coffee or short walk?",
  "Best thing that happened to you this week?",
  "What's your go-to order here?",
  "Spontaneous adventure or planned hangout?",
  "Book, podcast, or neither to unwind?",
];

const MEET_CODES = [
  "🐢-27", "🦊-42", "🐙-15", "🦋-88", "🐨-33",
  "🦁-56", "🐬-91", "🦉-44", "🐝-77", "🦄-12"
];

const MAX_TRIES_PER_HOUR = 3;
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export const SurpriseMe = ({ isInSpace, onStartTalking }: SurpriseMeProps) => {
  const [showResult, setShowResult] = useState(false);
  const [hasMatch, setHasMatch] = useState(false);
  const [meetCode, setMeetCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [matchedUserName] = useState("Your surprise match");


  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const tries = JSON.parse(localStorage.getItem('surpriseMeTries') || '[]') as number[];
    
    // Filter out tries older than 1 hour
    const recentTries = tries.filter(time => now - time < COOLDOWN_MS);
    
    if (recentTries.length >= MAX_TRIES_PER_HOUR) {
      const oldestTry = Math.min(...recentTries);
      const minutesLeft = Math.ceil((COOLDOWN_MS - (now - oldestTry)) / 60000);
      toast.error(`Rate limit reached. Try again in ${minutesLeft} minutes.`);
      return false;
    }
    
    // Add current try
    recentTries.push(now);
    localStorage.setItem('surpriseMeTries', JSON.stringify(recentTries));
    return true;
  };

  const handleSurpriseMe = async () => {
    if (!checkRateLimit()) return;

    setIsSearching(true);
    
    // Simulate searching for a match (50% chance)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const foundMatch = Math.random() > 0.5;
    
    setHasMatch(foundMatch);
    
    if (foundMatch) {
      const code = MEET_CODES[Math.floor(Math.random() * MEET_CODES.length)];
      setMeetCode(code);
      setShowIcebreaker(true);
      toastHook({
        title: "✨ Surprise match!",
        description: "Opening icebreakers to start your conversation...",
      });
    } else {
      setShowResult(true);
    }
    
    setIsSearching(false);
  };

  const handleStartTalking = () => {
    onStartTalking?.({
      sessionId: `session_${Date.now()}`,
      userName: matchedUserName,
      meetCode: meetCode,
      startAt: new Date(),
      spaceName: "Peak Coffee Lab",
    });
  };

  return (
    <>
      <Button
        onClick={handleSurpriseMe}
        disabled={!isInSpace || isSearching}
        className="gradient-warm shadow-soft hover:shadow-glow transition-all gap-2"
        size="lg"
      >
        <Sparkles className="w-5 h-5" />
        {isSearching ? "Finding magic..." : "Surprise Me 🎲"}
      </Button>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
              No Surprises Yet
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold mb-2">No one else is feeling spontaneous right now</p>
            <p className="text-sm text-muted-foreground mb-6">
              Try again soon — surprises happen when you least expect them!
            </p>
            <Button
              onClick={() => setShowResult(false)}
              variant="outline"
              className="rounded-full"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <IcebreakerScreen
        open={showIcebreaker}
        onClose={() => setShowIcebreaker(false)}
        userName={matchedUserName}
        meetCode={meetCode}
        onStartTalking={handleStartTalking}
      />
    </>
  );
};
