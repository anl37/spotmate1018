import { useState, useEffect } from "react";
import { UserCard } from "@/components/UserCard";
import { ConnectToggle } from "@/components/ConnectToggle";
import { SurpriseMe } from "@/components/SurpriseMe";
import { MapPin, Users } from "lucide-react";
import { getCurrentTime } from "@/lib/time-utils";
import { TabNavigation } from "@/components/TabNavigation";
import { ActiveMeetingWindow } from "@/components/ActiveMeetingWindow";
import { toast } from "@/hooks/use-toast";
import { ConnectPing } from "@/components/ConnectPing";
import { LiveLocationPill } from "@/components/LiveLocationPill";
import { useLocation } from "@/services/location";

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "Alex",
    avatar: "👨‍💻",
    headline: "Coffee & code enthusiast",
    lastSeen: "Just now",
    activities: ["Running", "Coffee", "Tech"],
    score: 87,
    weeklyVisits: [0, 1, 2, 1, 3, 2, 1],
    bio: "Software developer who loves morning runs and quality coffee. Always down for a chat about startups or trail running.",
    typicalTimes: "Mornings 7-9 AM, Evenings 6-8 PM"
  },
  {
    id: "2",
    name: "Jordan",
    avatar: "🎨",
    headline: "Design & yoga",
    lastSeen: "2m ago",
    activities: ["Yoga", "Art", "Coffee"],
    score: 92,
    weeklyVisits: [2, 2, 1, 2, 2, 3, 1],
    bio: "Product designer balancing pixels and pranayama. Looking for creative conversations and post-workout smoothie buddies.",
    typicalTimes: "Mornings 8-10 AM, Lunch 12-1 PM"
  },
  {
    id: "3",
    name: "Sam",
    avatar: "📚",
    headline: "Books & morning walks",
    lastSeen: "5m ago",
    activities: ["Reading", "Walking", "Coffee"],
    score: 78,
    weeklyVisits: [1, 0, 2, 1, 1, 2, 2],
    bio: "Book lover and early bird. Always have a recommendation ready and enjoy philosophical morning conversations.",
    typicalTimes: "Early mornings 6-8 AM"
  }
];

const Space = () => {
  const { startTracking, stopTracking, startHighAccuracySession, stopHighAccuracySession, currentLocation } = useLocation();
  const [connectEnabled, setConnectEnabled] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [connectTargetUser, setConnectTargetUser] = useState<string>("");
  const [activeMeeting, setActiveMeeting] = useState<{
    sessionId: string;
    userName: string;
    meetCode: string;
    startAt: Date;
    spaceName?: string;
    venue?: string;
  } | null>(null);
  
  // Limit visible users to 5-8 for calm focus
  const visibleUsers = mockUsers.slice(0, 6);

  const handleConnect = (userName: string) => {
    setConnectTargetUser(userName);
    setShowConnectDialog(true);
  };

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync location tracking with Connect toggle
  useEffect(() => {
    if (connectEnabled) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [connectEnabled, startTracking, stopTracking]);

  // Handle high accuracy mode for active meetings
  useEffect(() => {
    if (activeMeeting) {
      startHighAccuracySession();
    } else {
      stopHighAccuracySession();
    }
  }, [activeMeeting, startHighAccuracySession, stopHighAccuracySession]);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">🌿</span>
              </div>
              <div>
                <h1 className="font-bold text-base">Peak Coffee Lab</h1>
                <p className="text-xs text-muted-foreground">
                  Now • {currentTime} • Downtown
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LiveLocationPill />
              <ConnectToggle enabled={connectEnabled} onToggle={setConnectEnabled} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Active Meeting Window */}
        {activeMeeting && (
          <ActiveMeetingWindow
            sessionId={activeMeeting.sessionId}
            userName={activeMeeting.userName}
            meetCode={activeMeeting.meetCode}
            startAt={activeMeeting.startAt}
            spaceName={activeMeeting.spaceName}
            venue={activeMeeting.venue}
            onEndMeeting={() => {
              setActiveMeeting(null);
              toast({
                title: "Rate your experience",
                description: "How was your meetup? (Feedback form would open here)",
              });
            }}
          />
        )}

        {/* Presence Glow */}
        {connectEnabled && currentLocation && (
          <div className="relative">
            <div className="absolute inset-0 bg-success/5 rounded-3xl animate-pulse shadow-glow" />
            <div className="relative bg-card/50 backdrop-blur border border-success/20 rounded-3xl p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse shadow-glow" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">You're here</p>
                  <p className="text-sm text-muted-foreground">
                    People within ~{Math.round(currentLocation.accuracy)} m can see you
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Surprise Me - Main CTA */}
        {connectEnabled && (
          <div className="flex flex-col items-center gap-3 py-4">
            <SurpriseMe 
              isInSpace={connectEnabled}
              onStartTalking={(meetingData) => setActiveMeeting(meetingData)}
            />
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Get randomly paired with someone spontaneous
            </p>
          </div>
        )}

        {/* People Grid - Limited to 6 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Nearby</h2>
            </div>
            <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted/50">
              {visibleUsers.length} people
            </span>
          </div>

          {!connectEnabled ? (
            <div className="gradient-card rounded-3xl p-10 text-center shadow-soft">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Turn on Connect</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                See who's here and let them see you
              </p>
              <button 
                onClick={() => setConnectEnabled(true)} 
                className="gradient-warm px-6 py-3 rounded-full font-medium shadow-soft hover:shadow-elegant transition-all"
              >
                Enable Connect
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {visibleUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSelect={() => setSelectedUserId(user.id)}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground pt-4">
          Less app, more friend
        </p>
      </div>

      <ConnectPing
        open={showConnectDialog}
        onOpenChange={setShowConnectDialog}
        userName={connectTargetUser}
        onStartTalking={(meetingData) => setActiveMeeting(meetingData)}
      />

      <TabNavigation />
    </div>
  );
};

export default Space;
