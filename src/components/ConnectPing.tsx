import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IcebreakerScreen } from "@/components/IcebreakerScreen";
import { toast } from "@/hooks/use-toast";

interface ConnectPingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onStartTalking?: (meetingData: {
    sessionId: string;
    userName: string;
    meetCode: string;
    startAt: Date;
    spaceName?: string;
  }) => void;
}


export const ConnectPing = ({ open, onOpenChange, userName, onStartTalking }: ConnectPingProps) => {
  const [status, setStatus] = useState<'sending' | 'sent' | 'icebreaker'>('sending');
  const [meetCode] = useState('🐢-27');
  const [showIcebreaker, setShowIcebreaker] = useState(false);

  const handleSend = () => {
    setStatus('sent');
    // Simulate response after 2 seconds
    setTimeout(() => {
      setStatus('icebreaker');
      setShowIcebreaker(true);
      onOpenChange(false); // Close the connect dialog
      toast({
        title: "🎉 Connection accepted!",
        description: `${userName} wants to meet. Opening icebreakers...`,
      });
    }, 2000);
  };

  const handleStartTalking = () => {
    onStartTalking?.({
      sessionId: `session_${Date.now()}`,
      userName: userName,
      meetCode: meetCode,
      startAt: new Date(),
      spaceName: "Peak Coffee Lab",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {status === 'sending' && `Connect with ${userName}?`}
              {status === 'sent' && 'Ping sent!'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {status === 'sending' && (
              <>
                <p className="text-sm text-muted-foreground">
                  Send a one-time ping to {userName}. They'll be notified and can choose to accept.
                </p>
                <Button onClick={handleSend} className="w-full gradient-warm shadow-soft rounded-full">
                  Send Connect Ping
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full rounded-full">
                  Cancel
                </Button>
              </>
            )}

            {status === 'sent' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Waiting for {userName} to respond...
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <IcebreakerScreen
        open={showIcebreaker}
        onClose={() => setShowIcebreaker(false)}
        userName={userName}
        meetCode={meetCode}
        onStartTalking={handleStartTalking}
      />
    </>
  );
};
