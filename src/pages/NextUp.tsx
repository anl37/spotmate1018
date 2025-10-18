import { useState } from "react";
import { Book, Coffee, Palette, Gamepad2, ShoppingBag, MapPin, Sparkles } from "lucide-react";
import { TabNavigation } from "@/components/TabNavigation";
import { formatDistance } from "@/lib/location-utils";
import { formatOpeningTime } from "@/lib/time-utils";
import { RecentMatchCard } from "@/components/RecentMatchCard";
import { NextUpPanel } from "@/components/NextUpPanel";
import { ScheduleLater } from "@/components/ScheduleLater";
import { MeetPlanCard } from "@/components/MeetPlanCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Venue {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distanceM: number;
  openNow: boolean;
  opensAt?: { hour: number; minute: number };
  rating?: number;
  description?: string;
}

const categoryIcons: Record<string, any> = {
  bookstore: Book,
  coffee: Coffee,
  gallery: Palette,
  arcade: Gamepad2,
  thrift: ShoppingBag,
  park: MapPin,
};

const mockSuggestions: Venue[] = [
  {
    id: "1",
    name: "Corner Bookshop",
    category: "bookstore",
    lat: 40.7590,
    lng: -73.9845,
    distanceM: 320,
    openNow: true,
    rating: 4.6,
    description: "Cozy independent bookstore with café"
  },
  {
    id: "2",
    name: "Washington Square Park",
    category: "park",
    lat: 40.7308,
    lng: -73.9973,
    distanceM: 450,
    openNow: true,
    rating: 4.8,
    description: "Iconic park perfect for a walk"
  },
  {
    id: "3",
    name: "Modern Art Gallery",
    category: "gallery",
    lat: 40.7614,
    lng: -73.9776,
    distanceM: 580,
    openNow: true,
    rating: 4.4,
    description: "Contemporary art exhibitions"
  },
  {
    id: "4",
    name: "Retro Arcade Bar",
    category: "arcade",
    lat: 40.7298,
    lng: -73.9900,
    distanceM: 720,
    openNow: false,
    opensAt: { hour: 17, minute: 0 },
    rating: 4.5,
    description: "Classic arcade games & craft beer"
  },
  {
    id: "5",
    name: "Sweet Spot Desserts",
    category: "coffee",
    lat: 40.7565,
    lng: -73.9920,
    distanceM: 280,
    openNow: true,
    rating: 4.7,
    description: "Artisan ice cream & pastries"
  },
  {
    id: "6",
    name: "Vintage Finds",
    category: "thrift",
    lat: 40.7345,
    lng: -73.9912,
    distanceM: 650,
    openNow: true,
    rating: 4.3,
    description: "Curated vintage clothing & records"
  }
];

const NextUp = () => {
  const [showRecentMatch, setShowRecentMatch] = useState(true);
  const [showPlanning, setShowPlanning] = useState(false);
  const [showScheduleLater, setShowScheduleLater] = useState(false);
  const [confirmedPlan, setConfirmedPlan] = useState<any>(null);
  const [meetCode] = useState('🐢-27');

  // Mock recent match data (would come from Firestore in production)
  const recentMatch = showRecentMatch ? {
    userName: "Alex",
    spaceName: "Studio Café",
    connectedAt: "5 minutes ago",
  } : null;

  const handleGetDirections = (venue: Venue) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}`;
    window.open(url, '_blank');
  };

  const handleContinueWithMatch = () => {
    setShowPlanning(true);
  };

  const handleVenueConfirm = (venue: any) => {
    const plan = {
      id: Math.random().toString(36).substr(2, 9),
      matchName: recentMatch?.userName || "Your match",
      place: {
        name: venue.name,
        address: "Downtown • Manhattan",
        lat: venue.lat,
        lng: venue.lng,
      },
      startAt: new Date(Date.now() + 15 * 60 * 1000),
      meetCode: meetCode,
      distanceM: venue.distanceM,
      status: "confirmed" as const,
    };
    setConfirmedPlan(plan);
    setShowPlanning(false);
    toast({
      title: "✨ Plan confirmed!",
      description: `Meeting at ${venue.name}`,
    });
  };

  const handleScheduleLaterConfirm = (details: any) => {
    const plan = {
      id: Math.random().toString(36).substr(2, 9),
      matchName: recentMatch?.userName || "Your match",
      place: {
        name: details.place,
        address: "Downtown • Manhattan",
        lat: 40.7590,
        lng: -73.9845,
      },
      startAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      meetCode: meetCode,
      distanceM: 320,
      status: "confirmed" as const,
    };
    setConfirmedPlan(plan);
    setShowScheduleLater(false);
    setShowPlanning(false);
    toast({
      title: "✨ Plan scheduled!",
      description: `Meeting ${details.when} at ${details.place}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-base">Next Up</h1>
              <p className="text-xs text-muted-foreground">
                Nearby ideas to keep the conversation going
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Recent Match Card */}
        {recentMatch && (
          <div className="mb-6">
            <RecentMatchCard
              userName={recentMatch.userName}
              spaceName={recentMatch.spaceName}
              connectedAt={recentMatch.connectedAt}
              onContinue={handleContinueWithMatch}
            />
          </div>
        )}

        {/* Category Sections */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              📚 Bookshops & Libraries
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mockSuggestions.filter(v => v.category === "bookstore").map((venue) => {
                const Icon = categoryIcons[venue.category];
                return (
                  <button
                    key={venue.id}
                    onClick={() => handleGetDirections(venue)}
                    className="gradient-card rounded-3xl p-4 text-left hover:shadow-elegant transition-all shadow-soft"
                  >
                    <Icon className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-sm mb-1 text-foreground">{venue.name}</h3>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{formatDistance(venue.distanceM)}</span>
                      {venue.openNow ? (
                        <span className="text-success">Open now</span>
                      ) : venue.opensAt ? (
                        <span>Opens {formatOpeningTime(venue.opensAt.hour, venue.opensAt.minute)}</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              🌳 Parks & Walks
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mockSuggestions.filter(v => v.category === "park").map((venue) => {
                const Icon = categoryIcons[venue.category];
                return (
                  <button
                    key={venue.id}
                    onClick={() => handleGetDirections(venue)}
                    className="gradient-card rounded-3xl p-4 text-left hover:shadow-elegant transition-all shadow-soft"
                  >
                    <Icon className="w-6 h-6 text-success mb-2" />
                    <h3 className="font-semibold text-sm mb-1 text-foreground">{venue.name}</h3>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{formatDistance(venue.distanceM)}</span>
                      {venue.rating && <span>⭐ {venue.rating}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              🍨 Dessert & Tea
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mockSuggestions.filter(v => v.category === "coffee").map((venue) => {
                const Icon = categoryIcons[venue.category];
                return (
                  <button
                    key={venue.id}
                    onClick={() => handleGetDirections(venue)}
                    className="gradient-card rounded-3xl p-4 text-left hover:shadow-elegant transition-all shadow-soft"
                  >
                    <Icon className="w-6 h-6 text-accent mb-2" />
                    <h3 className="font-semibold text-sm mb-1 text-foreground">{venue.name}</h3>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{formatDistance(venue.distanceM)}</span>
                      <span className="text-success">Open now</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              🎮 Fun Spots
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mockSuggestions.filter(v => ["arcade", "thrift", "gallery"].includes(v.category)).map((venue) => {
                const Icon = categoryIcons[venue.category];
                return (
                  <button
                    key={venue.id}
                    onClick={() => handleGetDirections(venue)}
                    className="gradient-card rounded-3xl p-4 text-left hover:shadow-elegant transition-all shadow-soft"
                  >
                    <Icon className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-sm mb-1 text-foreground">{venue.name}</h3>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{formatDistance(venue.distanceM)}</span>
                      {venue.openNow ? (
                        <span className="text-success">Open now</span>
                      ) : venue.opensAt ? (
                        <span>Opens {formatOpeningTime(venue.opensAt.hour, venue.opensAt.minute)}</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-4">
          Keep the conversation going
        </p>
      </div>

      <TabNavigation />

      {/* Planning Dialog */}
      <Dialog open={showPlanning} onOpenChange={setShowPlanning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Where to next with {recentMatch?.userName}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            We found ideas that fit both your interests
          </p>
          <NextUpPanel
            sessionId={meetCode}
            onConfirm={handleVenueConfirm}
            onScheduleLater={() => {
              setShowPlanning(false);
              setShowScheduleLater(true);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmed Plan Dialog */}
      <Dialog open={!!confirmedPlan} onOpenChange={() => setConfirmedPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🎉 All set!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              You and {recentMatch?.userName} confirmed this plan
            </p>
            {confirmedPlan && <MeetPlanCard plan={confirmedPlan} />}
          </div>
        </DialogContent>
      </Dialog>

      <ScheduleLater
        open={showScheduleLater}
        onClose={() => setShowScheduleLater(false)}
        onConfirm={handleScheduleLaterConfirm}
      />
    </div>
  );
};

export default NextUp;
