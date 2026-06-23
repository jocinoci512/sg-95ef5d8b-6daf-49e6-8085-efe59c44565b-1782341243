import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrackingForm } from "@/components/TrackingForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, Truck, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

interface TrackingEvent {
  id: string;
  location: string;
  status: string;
  description: string | null;
  timestamp: string;
}

interface Shipment {
  id: string;
  tracking_number: string;
  pickup_location: string;
  delivery_location: string;
  vehicle_type: string;
  status: string;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  notes: string | null;
  created_at: string;
  tracking_events: TrackingEvent[];
}

export default function Track() {
  const router = useRouter();
  const { number } = router.query;
  
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (number) {
      trackShipment(number as string);
    }
  }, [number]);

  const trackShipment = async (trackingNumber: string) => {
    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("shipments")
        .select(`
          *,
          tracking_events (*)
        `)
        .eq("tracking_number", trackingNumber)
        .single();

      if (fetchError) throw new Error("Shipment not found. Please check your tracking number.");
      
      setShipment(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-muted text-muted-foreground",
      picked_up: "bg-primary/20 text-primary",
      in_transit: "bg-primary/20 text-primary",
      at_hub: "bg-accent/20 text-accent",
      out_for_delivery: "bg-primary/20 text-primary",
      delivered: "bg-primary/20 text-primary",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-5 w-5" />;
      case "in_transit":
      case "out_for_delivery":
        return <Truck className="h-5 w-5" />;
      case "pending":
        return <Clock className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <>
      <SEO
        title="Track Your Shipment"
        description="Real-time vehicle shipment tracking. Enter your tracking number to see current location and delivery status."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20">
          <div className="container max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Shipment</h1>
              <p className="text-xl text-muted-foreground">
                Enter your tracking number to view real-time shipment status
              </p>
            </div>

            <div className="mb-12">
              <TrackingForm />
            </div>

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading shipment details...</p>
              </div>
            )}

            {error && (
              <Card className="p-8 border-destructive/50 bg-destructive/5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-destructive mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Shipment Not Found</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {shipment && (
              <div className="space-y-6">
                <Card className="p-8 border-border">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Tracking Details</h2>
                      <p className="font-data text-lg text-primary">{shipment.tracking_number}</p>
                    </div>
                    <Badge className={`${getStatusColor(shipment.status)} font-mono px-4 py-2`}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        {shipment.status.replace(/_/g, " ").toUpperCase()}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Pickup Location</p>
                          <p className="font-medium">{shipment.pickup_location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Vehicle Type</p>
                          <p className="font-medium capitalize">{shipment.vehicle_type}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Delivery Location</p>
                          <p className="font-medium">{shipment.delivery_location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {shipment.status === "delivered" ? "Delivered On" : "Estimated Delivery"}
                          </p>
                          <p className="font-medium">
                            {shipment.status === "delivered" && shipment.actual_delivery
                              ? new Date(shipment.actual_delivery).toLocaleDateString()
                              : shipment.estimated_delivery
                              ? new Date(shipment.estimated_delivery).toLocaleDateString()
                              : "TBD"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {shipment.notes && (
                    <div className="border-t border-border pt-6">
                      <p className="text-sm text-muted-foreground mb-2">Notes</p>
                      <p className="text-sm">{shipment.notes}</p>
                    </div>
                  )}
                </Card>

                <Card className="p-8 border-border">
                  <h3 className="text-xl font-bold mb-6">Shipment Timeline</h3>
                  
                  {shipment.tracking_events && shipment.tracking_events.length > 0 ? (
                    <div className="space-y-6">
                      {shipment.tracking_events
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((event, index) => (
                          <div key={event.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                index === 0 ? "bg-primary" : "bg-muted"
                              }`}>
                                {index === 0 ? (
                                  <Truck className="h-5 w-5 text-background" />
                                ) : (
                                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              {index < shipment.tracking_events.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-2" />
                              )}
                            </div>
                            
                            <div className="flex-1 pb-6">
                              <div className="flex items-start justify-between gap-4 mb-1">
                                <p className="font-mono font-bold capitalize">
                                  {event.status.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm text-muted-foreground font-data">
                                  {new Date(event.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{event.location}</p>
                              {event.description && (
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No tracking events yet</p>
                  )}
                </Card>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}