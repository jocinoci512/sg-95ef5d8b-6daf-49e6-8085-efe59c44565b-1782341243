import { Card } from "@/components/ui/card";
import { Shield, MapPin, Truck, Clock, TrendingUp } from "lucide-react";

export function ExcellenceSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <img
              src="/hero-driver.jpg"
              alt="Professional driver"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">WHY GO CARGO</p>
            <h2 className="text-4xl font-bold mb-4">
              Excellence in <span className="text-primary">Every Delivery</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We set the standard for premium auto transport with unmatched service quality, cutting-edge technology, and a network of 500+ vetted carriers across North America.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Premium Enclosed & Open Transport</h3>
            <p className="text-sm text-muted-foreground">
              Choose the perfect protection level for your vehicle with our open and enclosed transportation options.
            </p>
          </Card>

          <Card className="p-6 border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Live GPS Tracking Map</h3>
            <p className="text-sm text-muted-foreground">
              Real-time shipment visibility with live location updates and ETA tracking on our interactive map.
            </p>
          </Card>

          <Card className="p-6 border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Licensed, Bonded & Fully Insured</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive insurance protection and secure transportation coverage on every shipment.
            </p>
          </Card>

          <Card className="p-6 border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Door-to-Door Pickup & Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Convenient vehicle pickup from your location and delivery directly to your destination.
            </p>
          </Card>

          <Card className="p-6 border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Fast Turnaround & Transparent Pricing</h3>
            <p className="text-sm text-muted-foreground">
              No hidden fees, quick scheduling, and clear pricing. Get instant quotes and lock in the best rates.
            </p>
          </Card>

          <Card className="p-6 border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">24/7 Customer Support</h3>
            <p className="text-sm text-muted-foreground">
              Around-the-clock customer assistance ready to answer questions and provide updates.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}