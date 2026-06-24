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
  Package,
  CheckCircle2,
  Clock,
  LogOut,
  User,
  FileText,
  Menu,
  X,
} from "lucide-react";

interface Shipment {
  id: string;
  tracking_number: string;
  pickup_address: string;
  delivery_address: string;
  vehicle_type: string;
  status: string;
  estimated_delivery_date: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  active: number;
  delivered: number;
}

export default function CustomerDashboard() {
  return (
    <ProtectedRoute requiredRole="customer">
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, delivered: 0 });
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel("customer-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shipments",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) setUserName(profile.full_name);

      const { data: shipments } = await supabase
        .from("shipments")
        .select("id, tracking_number, pickup_address, delivery_address, vehicle_type, status, estimated_delivery_date, created_at")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (shipments) {
        setStats({
          total: shipments.length,
          active: shipments.filter(s => s.status !== "delivered").length,
          delivered: shipments.filter(s => s.status === "delivered").length,
        });
        setRecentShipments(shipments.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
    });
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_pickup: "text-yellow-500",
      picked_up: "text-blue-500",
      in_transit: "text-primary",
      at_hub: "text-orange-500",
      out_for_delivery: "text-accent",
      delivered: "text-green-500",
    };
    return colors[status] || "text-muted-foreground";
  };

  return (
    <>
      <SEO
        title="Customer Dashboard"
        description="Track your shipments and manage your account."
      />
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold">
              <Truck className="h-6 w-6 text-primary" />
              <span>GO CARGO</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/portal/dashboard" className="text-sm font-medium text-primary">
                Dashboard
              </Link>
              <Link href="/portal/shipments" className="text-sm font-medium hover:text-primary transition-colors">
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
                <Link href="/portal/dashboard" className="py-2 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/portal/shipments" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track your shipments and manage your account</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Shipments</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-accent/10 border-2 border-accent flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active Shipments</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.delivered}</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Shipments</h2>
                <Link href="/portal/shipments">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </div>

            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading shipments...
                </div>
              ) : recentShipments.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No shipments yet</p>
                  <Link href="/quote">
                    <Button className="font-mono">Request Quote</Button>
                  </Link>
                </div>
              ) : (
                recentShipments.map((shipment) => (
                  <Link
                    key={shipment.id}
                    href={`/portal/shipments/${shipment.id}`}
                    className="p-6 hover:bg-muted/50 transition-colors block"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-mono font-bold">{shipment.tracking_number}</p>
                          <span className={`text-sm font-medium capitalize ${getStatusColor(shipment.status)}`}>
                            {shipment.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p>From: {shipment.pickup_address}</p>
                          <p>To: {shipment.delivery_address}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 capitalize">
                          Vehicle: {shipment.vehicle_type}
                        </p>
                      </div>
                      {shipment.estimated_delivery_date && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground mb-1">Est. Delivery</p>
                          <p className="text-sm font-medium font-data">
                            {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </main>
      </div>
    </>
  );
}