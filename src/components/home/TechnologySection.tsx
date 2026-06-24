import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp, Clock } from "lucide-react";

export function TechnologySection() {
  return (
    <section className="py-16 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">BUILT FOR THE MODERN AGE</p>
          <h2 className="text-4xl font-bold mb-4">
            Advanced <span className="text-primary">Technology</span> Behind Every Shipment
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            We invest heavily in technology so you get real-time visibility, accurate ETAs, and zero surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 border-border hover:border-primary/50 transition-all">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Live GPS Tracking</h3>
            <p className="text-muted-foreground mb-6">
              Real-time location updates every 5 minutes via satellite. See your vehicle on an interactive map from pickup to delivery.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary font-mono">5min</div>
                <div className="text-xs text-muted-foreground">Update Interval</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary font-mono">99.9%</div>
                <div className="text-xs text-muted-foreground">GPS Uptime</div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-border hover:border-primary/50 transition-all">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Route Optimization</h3>
            <p className="text-muted-foreground mb-6">
              AI-powered route planning selects the fastest, safest path accounting for weather, traffic, and road conditions.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary font-mono">18%</div>
                <div className="text-xs text-muted-foreground">Faster Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary font-mono">500+</div>
                <div className="text-xs text-muted-foreground">Routes Optimized Daily</div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-border hover:border-primary/50 transition-all">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Predictive ETA Engine</h3>
            <p className="text-muted-foreground mb-6">
              Machine learning models analyze historical data and real-time conditions to give you accurate delivery windows — not just guesses.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary font-mono">97%</div>
                <div className="text-xs text-muted-foreground">ETA Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary font-mono">±4hrs</div>
                <div className="text-xs text-muted-foreground">Delivery Window</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}