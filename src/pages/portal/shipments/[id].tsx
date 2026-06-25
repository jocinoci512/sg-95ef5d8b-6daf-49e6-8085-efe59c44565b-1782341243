import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import type { GetServerSideProps } from "next";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  X,
  Menu,
  FileText,
  Download,
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

interface ShipmentDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
}

export default function ShipmentDetail() {
  return (
    <ProtectedRoute requiredRole="customer">
      <ShipmentDetailContent />
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const { data: shipment, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !shipment) {
    return {
      notFound: true,
    };
  }

  const { data: tracking } = await supabase
    .from("tracking_events")
    .select("*")
    .eq("shipment_id", id)
    .order("event_date", { ascending: false });

  return {
    props: {},
  };
};

function ShipmentDetailContent() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<ShipmentDocument[]>([]);

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchShipment(id);
    }
  }, [id]);

  const fetchShipment = async (shipmentId: string) => {
    setLoading(true);
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
        setShipment(shipmentData);
      }

      const { data: docsData } = await supabase
        .from("shipment_documents")
        .select("*")
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: false });

      setDocuments(docsData || []);
    } catch (error) {
      console.error("Error fetching shipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (doc: ShipmentDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("shipment-documents")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.document_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Document downloaded successfully" });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
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
                    .map((event) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              event.status === "completed"
                                ? "bg-primary"
                                : event.status === "in_transit"
                                  ? "bg-amber-500"
                                  : "bg-muted"
                            }`}
                          />
                          <div className="w-0.5 h-full bg-border" />
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

          {documents.length > 0 && (
            <Card className="p-6 border-border">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Shipping Documents
              </h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-background rounded border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.document_name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {doc.document_type.replace(/_/g, " ")} • {(doc.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                      className="font-mono"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
      </div>
    </>
  );
}