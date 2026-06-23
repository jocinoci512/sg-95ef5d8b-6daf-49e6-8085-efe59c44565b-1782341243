import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Truck,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface TrackingEvent {
  id: string;
  location: string | null;
  status: string;
  description: string | null;
  event_date: string | null;
}

interface Shipment {
  id: string;
  tracking_number: string;
  pickup_address: string;
  delivery_address: string;
  vehicle_type: string;
  status: string;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;
  notes: string | null;
  created_at: string;
  tracking_events: TrackingEvent[];
}

export default function ShipmentDetail() {
  return (
    <ProtectedRoute requiredRole="customer">
      <ShipmentDetailContent />
    </ProtectedRoute>
  );
}

function ShipmentDetailContent() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchShipment(id);
    }
  }, [id]);

  const fetchShipment = async (shipmentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) setUserName(profile.full_name);

      const { data: shipmentData } = await supabase
        .from("shipments")
        .select(`
          id,
          tracking_number,
          pickup_address,
          delivery_address,
          vehicle_type,
          status,
          estimated_delivery_date,
          actual_delivery_date,
          notes,
          created_at,
          tracking_events(id, location, status, description, event_date)
        `)
        .eq("id", shipmentId)
        .eq("customer_id", user.id)
        .single();

      if (shipmentData) {
        setShipment(shipmentData as Shipment);
      } else {
        toast({
          title: "Shipment not found",
          description: "You don't have permission to view this shipment.",
          variant: "destructive",
        });
        router.push("/portal/shipments");
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
      router.push("/portal/shipments");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_pickup: "bg-yellow-500",
      picked_up: "bg-blue-500",
      in_transit: "bg-primary",
      at_hub: "bg-orange-500",
      out_for_delivery: "bg-accent",
      delivered: "bg-green-500",
    };
    return colors[status] || "bg-muted";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading shipment details...</p>
      </div>
    );
  }

  if (!shipment) {
    return null;
  }

  return (
    <>
      <SEO
        title={`Shipment ${shipment.tracking_number}`}
        description="View detailed shipment tracking information."
      />
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold">
              <Truck className="h-6 w-6 text-primary" />
              <span>GO CARGO</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/portal/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/portal/shipments" className="text-sm font-medium text-primary">
                My Shipments
              </Link>
              <Link href="/portal/profile" className="text-sm font-medium hover:text-primary transition-colors">
                Profile
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Welcome, {userName || "User"}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card">
              <div className="container py-4 flex flex-col gap-3">
                <Link href="/portal/dashboard" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/portal/shipments" className="py-2 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
                  My Shipments
                </Link>
                <Link href="/portal/profile" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </nav>

        <main className="container py-8">
          <Link
            href="/portal/shipments"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shipments
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold font-mono">{shipment.tracking_number}</h1>
              <span className={`px-3 py-1 rounded-sm text-sm font-medium text-background capitalize ${getStatusColor(shipment.status)}`}>
                {shipment.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-muted-foreground capitalize">
              {shipment.vehicle_type} Transport
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-border lg:col-span-2">
              <h2 className="text-xl font-bold mb-6">Shipment Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pickup Location</p>
                      <p className="font-medium">{shipment.pickup_address}</p>
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
                      <p className="font-medium">{shipment.delivery_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {shipment.status === "delivered" ? "Delivered On" : "Estimated Delivery"}
                      </p>
                      <p className="font-medium">
                        {shipment.status === "delivered" && shipment.actual_delivery_date
                          ? new Date(shipment.actual_delivery_date).toLocaleDateString()
                          : shipment.estimated_delivery_date
                          ? new Date(shipment.estimated_delivery_date).toLocaleDateString()
                          : "TBD"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {shipment.notes && (
                <div className="pt-6 border-t border-border">
                  <h3 className="font-bold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{shipment.notes}</p>
                </div>
              )}
            </Card>

            <Card className="p-6 border-border">
              <h2 className="text-xl font-bold mb-6">Tracking Timeline</h2>
              
              <div className="space-y-6">
                {shipment.tracking_events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tracking events yet</p>
                ) : (
                  shipment.tracking_events
                    .sort((a, b) => new Date(b.event_date || 0).getTime() - new Date(a.event_date || 0).getTime())
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
                          <p className="font-mono font-bold capitalize mb-1">
                            {event.status.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            {event.location || "Location TBD"}
                          </p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground font-data">
                            {event.event_date ? new Date(event.event_date).toLocaleString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}