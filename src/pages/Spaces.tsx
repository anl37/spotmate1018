import { Map, Users, Clock } from "lucide-react";
import { TabNavigation } from "@/components/TabNavigation";

const mockSpaces = [
  {
    id: "1",
    name: "Peak Coffee Lab",
    category: "café",
    activeUsers: 3,
    isOpen: true,
    distance: "Here",
    lat: 40.7580,
    lng: -73.9855,
  },
  {
    id: "2",
    name: "Studio Gym Downtown",
    category: "gym",
    activeUsers: 7,
    isOpen: true,
    distance: "280 m",
    lat: 40.7590,
    lng: -73.9870,
  },
  {
    id: "3",
    name: "Washington Square Park",
    category: "park",
    activeUsers: 12,
    isOpen: true,
    distance: "450 m",
    lat: 40.7308,
    lng: -73.9973,
  },
  {
    id: "4",
    name: "Central Library",
    category: "library",
    activeUsers: 5,
    isOpen: true,
    distance: "520 m",
    lat: 40.7614,
    lng: -73.9776,
  },
];

const categoryColors: Record<string, string> = {
  café: "bg-accent/20 text-accent-foreground",
  gym: "bg-primary/20 text-primary-foreground",
  park: "bg-success/20 text-success-foreground",
  library: "bg-secondary text-secondary-foreground",
};

const Spaces = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Map className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-base">Nearby Spaces</h1>
              <p className="text-xs text-muted-foreground">
                Active places within 600 m
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Map Placeholder */}
        <div className="gradient-card rounded-3xl h-48 flex items-center justify-center shadow-soft border border-border overflow-hidden">
          <div className="text-center">
            <Map className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Map view coming soon</p>
          </div>
        </div>

        {/* Spaces List */}
        <div className="space-y-3">
          {mockSpaces.map((space) => (
            <button
              key={space.id}
              className="w-full gradient-card rounded-3xl p-4 text-left hover:shadow-elegant transition-all shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{space.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[space.category]}`}>
                      {space.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{space.activeUsers} connecting now</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-success">Open</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{space.distance}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground pt-4">
          Spaces show people only when you're within 10 m
        </p>
      </div>

      <TabNavigation />
    </div>
  );
};

export default Spaces;
