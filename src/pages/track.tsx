import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import type { GetServerSideProps } from "next";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Package, MapPin, Calendar, CheckCircle2, TrendingUp, Clock, Truck } from "lucide-react";

export default function Track() {
  const router = useRouter();
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [trackingEvents, setTrackingEvents] = useState<any[]>([]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    try {
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select(`
          *,
          profiles:customer_id(full_name, email)
        `)
        .eq("tracking_number", trackingNumber.trim())
        .single();

      if (shipmentError) throw new Error("Tracking number not found");

      setShipment(shipmentData);

      const { data: eventsData } = await supabase
        .from("tracking_events")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("event_date", { ascending: false });

      setTrackingEvents(eventsData || []);
    } catch (error: any) {
      toast({
        title: "Shipment not found",
        description: "Please check your tracking number and try again.",
        variant: "destructive",
      });
      setShipment(null);
      setTrackingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500";
      case "in_transit":
      case "out_for_delivery":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <>
      <SEO
        title="Track Your Shipment - Real-Time Updates"
        description="Track your shipment in real-time with GPS updates and delivery status notifications."
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "url('/control-center.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="container mx-auto px-4 relative z-10 py-20">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Track Your Shipment
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Enter your tracking number for real-time updates and delivery status
                </p>

                <Card className="p-8 border-border">
                  <form onSubmit={handleTrack} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Enter tracking number (e.g., GCL-12345)"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="pl-12 h-14 text-lg bg-background"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full font-mono" disabled={loading}>
                      {loading ? "Searching..." : "Track Shipment"}
                      <Search className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </section>

          {/* Tracking Features */}
          <section className="py-16 bg-card/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Real-Time GPS</h3>
                  <p className="text-sm text-muted-foreground">
                    Live location tracking
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Status Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant notifications
                  </p>
                </div>
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Delivery Estimates</h3>
                  <p className="text-sm text-muted-foreground">
                    Accurate ETA updates
                  </p>
                </div>
                <div className="text-center">
                  <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Full History</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete shipment timeline
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipment Results */}
          {shipment && (
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <Card className="p-8 border-border mb-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Tracking: {shipment.tracking_number}
                        </h2>
                        <p className="text-muted-foreground">
                          {shipment.profiles?.full_name}
                        </p>
                      </div>
                      <div className={`text-right ${getStatusColor(shipment.status)}`}>
                        <p className="text-sm font-medium mb-1">Current Status</p>
                        <p className="text-2xl font-bold capitalize">
                          {shipment.status.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm font-medium mb-1">Pickup Location</p>
                          <p className="text-muted-foreground">
                            {shipment.pickup_address}, {shipment.pickup_city}, {shipment.pickup_state} {shipment.pickup_zip}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-accent mt-1" />
                        <div>
                          <p className="text-sm font-medium mb-1">Delivery Location</p>
                          <p className="text-muted-foreground">
                            {shipment.delivery_address}, {shipment.delivery_city}, {shipment.delivery_state} {shipment.delivery_zip}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm font-medium mb-1">Vehicle Type</p>
                          <p className="text-muted-foreground capitalize">{shipment.vehicle_type}</p>
                        </div>
                      </div>

                      {shipment.estimated_delivery_date && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="text-sm font-medium mb-1">Estimated Delivery</p>
                            <p className="text-muted-foreground">
                              {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {trackingEvents.length > 0 && (
                    <Card className="p-8 border-border">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Shipment Timeline
                      </h3>
                      <div className="space-y-4">
                        {trackingEvents.map((event, index) => (
                          <div
                            key={event.id}
                            className="flex gap-4 pb-4 border-b border-border last:border-0"
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-medium capitalize">
                                  {event.status.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(event.event_date).toLocaleDateString()} {new Date(event.event_date).toLocaleTimeString()}
                                </p>
                              </div>
                              {event.location && (
                                <p className="text-sm text-muted-foreground">{event.location}</p>
                              )}
                              {event.notes && (
                                <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};