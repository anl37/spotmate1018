import { MeetPlanCard } from "@/components/MeetPlanCard";
import { TabNavigation } from "@/components/TabNavigation";
import { Calendar } from "lucide-react";

// Mock data
const mockPlans = [
  {
    id: "1",
    matchName: "Alex",
    place: {
      name: "Corner Bookshop",
      address: "Downtown • Manhattan",
      lat: 40.7590,
      lng: -73.9845,
    },
    startAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    meetCode: "🐢-42",
    distanceM: 320,
    status: "confirmed" as const,
  },
  {
    id: "2",
    matchName: "Jordan",
    place: {
      name: "Washington Square Park",
      address: "Greenwich Village • Manhattan",
      lat: 40.7308,
      lng: -73.9973,
    },
    startAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    meetCode: "🎨-15",
    distanceM: 450,
    status: "confirmed" as const,
  },
];

const Plans = () => {
  const upcomingPlans = mockPlans;
  const pastPlans: typeof mockPlans = [];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-base">Plans</h1>
              <p className="text-xs text-muted-foreground">
                Upcoming & past meetups
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Upcoming */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground px-1">Upcoming</h2>
          {upcomingPlans.length > 0 ? (
            upcomingPlans.map((plan) => (
              <MeetPlanCard key={plan.id} plan={plan} />
            ))
          ) : (
            <div className="gradient-card rounded-3xl p-10 text-center shadow-soft">
              <p className="text-sm text-muted-foreground">No upcoming plans</p>
              <p className="text-xs text-muted-foreground mt-1">Connect with someone to make plans</p>
            </div>
          )}
        </div>

        {/* Past */}
        {pastPlans.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-muted-foreground px-1">Past</h2>
            {pastPlans.map((plan) => (
              <MeetPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground pt-4">
          Meet in real life
        </p>
      </div>

      <TabNavigation />
    </div>
  );
};

export default Plans;
