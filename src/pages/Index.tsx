import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Sparkles, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // In a real app, this would handle authentication
    navigate("/space");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 mx-auto rounded-3xl gradient-warm flex items-center justify-center text-4xl shadow-glow">
              👋
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-warm">
            Spotmate
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            See who's here right now. Connect in person. Skip the small talk.
          </p>
          
          {/* CTA */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 shadow-soft"
              />
              <Button
                onClick={handleGetStarted}
                className="h-12 px-8 gradient-warm shadow-soft hover:shadow-glow transition-all whitespace-nowrap"
              >
                Get Started
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              No chat. Just real connections.
            </p>
          </div>

          {/* Quick Demo Button */}
          <Button
            onClick={handleGetStarted}
            variant="outline"
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Try Demo
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<MapPin className="w-6 h-6" />}
            title="Hyper-Local"
            description="Only see people within ~10m. Your exact location stays private."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Connect Ping"
            description="One-tap notification. No endless chatting. Meet in person."
          />
          <FeatureCard
            icon={<Heart className="w-6 h-6" />}
            title="Weekly Presence"
            description="See who's a regular. Build familiarity before meeting."
          />
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="space-y-6">
            <Step
              number="1"
              title="Enter a Space"
              description="Toggle Connect when you're in the gym, coffee shop, or park."
            />
            <Step
              number="2"
              title="See Who's Here"
              description="Browse profiles with shared interests and weekly presence patterns."
            />
            <Step
              number="3"
              title="Send Connect Ping"
              description="They accept. You both get a meet code + icebreakers."
            />
            <Step
              number="4"
              title="Meet IRL"
              description="Find each other using the code. Start talking. Maybe grab coffee nearby."
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="gradient-card rounded-3xl p-8 max-w-2xl mx-auto text-center shadow-medium">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Privacy First</h3>
          <p className="text-muted-foreground">
            Visibility limited to same-space only. No exact coordinates shared. 
            Block/report tools built in. You're in control.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Spotmate • Real connections, real time</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="gradient-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all">
      <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center text-primary-foreground mb-4 shadow-soft">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

const Step = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 shadow-soft">
        {number}
      </div>
      <div>
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Index;
