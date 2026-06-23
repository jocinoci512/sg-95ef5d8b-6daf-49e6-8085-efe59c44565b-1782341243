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
  Users,
  FileText,
  CheckCircle2,
  Clock,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

interface Stats {
  totalCustomers: number;
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  pendingQuotes: number;
}

interface RecentActivity {
  id: string;
  type: "shipment" | "quote" | "customer";
  title: string;
  description: string;
  time: string;
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalShipments: 0,
    activeShipments: 0,
    deliveredShipments: 0,
    pendingQuotes: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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

      if (profile) setAdminName(profile.full_name);

      const { data: customers } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "customer");

      const { data: shipments } = await supabase
        .from("shipments")
        .select("id, status, created_at");

      const { data: quotes } = await supabase
        .from("quote_requests")
        .select("id, status")
        .eq("status", "pending");

      setStats({
        totalCustomers: customers?.length || 0,
        totalShipments: shipments?.length || 0,
        activeShipments: shipments?.filter(s => s.status !== "delivered").length || 0,
        deliveredShipments: shipments?.filter(s => s.status === "delivered").length || 0,
        pendingQuotes: quotes?.length || 0,
      });

      const activity: RecentActivity[] = [];
      if (shipments) {
        shipments.slice(0, 3).forEach(s => {
          activity.push({
            id: s.id,
            type: "shipment",
            title: "New Shipment Created",
            description: `Shipment created`,
            time: new Date(s.created_at).toLocaleDateString(),
          });
        });
      }

      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    router.push("/");
  };

  return (
    <>
      <SEO title="Admin Dashboard" description="Manage shipments, customers, and quotes." />
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold">
              <Truck className="h-6 w-6 text-primary" />
              <span>GO CARGO ADMIN</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/admin/dashboard" className="text-sm font-medium text-primary">
                Dashboard
              </Link>
              <Link href="/admin/shipments" className="text-sm font-medium hover:text-primary transition-colors">
                Shipments
              </Link>
              <Link href="/admin/quotes" className="text-sm font-medium hover:text-primary transition-colors">
                Quotes
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Admin: {adminName || "User"}</span>
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
                <Link href="/admin/dashboard" className="py-2 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/admin/shipments" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Shipments
                </Link>
                <Link href="/admin/quotes" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Quotes
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
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your logistics operations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-sm bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.totalCustomers}</p>
                  <p className="text-xs text-muted-foreground">Customers</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.totalShipments}</p>
                  <p className="text-xs text-muted-foreground">Total Shipments</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-sm bg-accent/10 border-2 border-accent flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.activeShipments}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-sm bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.deliveredShipments}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-sm bg-yellow-500/10 border-2 border-yellow-500 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stats.pendingQuotes}</p>
                  <p className="text-xs text-muted-foreground">Pending Quotes</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link href="/admin/shipments?action=create">
                  <Button className="w-full justify-start font-mono">
                    <Package className="h-4 w-4 mr-2" />
                    Create New Shipment
                  </Button>
                </Link>
                <Link href="/admin/quotes">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Quote Requests
                  </Button>
                </Link>
                <Link href="/admin/shipments">
                  <Button variant="outline" className="w-full justify-start">
                    <Truck className="h-4 w-4 mr-2" />
                    Manage Shipments
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>
              <div className="divide-y divide-border">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Loading activity...
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No recent activity
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="p-6">
                      <div className="flex items-start gap-3">
                        <LayoutDashboard className="h-4 w-4 text-primary mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
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