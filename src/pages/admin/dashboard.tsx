import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Truck, LogOut, Menu, X, Users, Package, Clock, CheckCircle2, FileText, TrendingUp, LayoutDashboard } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

interface VolumeData {
  date: string;
  count: number;
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
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalShipments: 0,
    activeShipments: 0,
    deliveredShipments: 0,
    pendingQuotes: 0,
  });
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [volumeStats, setVolumeStats] = useState({
    totalThisMonth: 0,
    avgDaily: 0,
    highestDay: 0,
    lowestDay: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    const shipmentsChannel = supabase
      .channel("dashboard-shipments")
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

    const profilesChannel = supabase
      .channel("dashboard-profiles")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "profiles",
          filter: "role=eq.customer",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    const quotesChannel = supabase
      .channel("dashboard-quotes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quote_requests",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(shipmentsChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(quotesChannel);
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

      if (profile) setAdminName(profile.full_name);

      const { count: customersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "customer");

      const { count: shipmentsCount } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true });

      const { count: activeCount } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .neq("status", "delivered");

      const { count: deliveredCount } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .eq("status", "delivered");

      const { count: quotesCount } = await supabase
        .from("quote_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        totalCustomers: customersCount || 0,
        totalShipments: shipmentsCount || 0,
        activeShipments: activeCount || 0,
        deliveredShipments: deliveredCount || 0,
        pendingQuotes: quotesCount || 0,
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: shipmentsData } = await supabase
        .from("shipments")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at");

      const dateCounts: Record<string, number> = {};
      const last30Days: VolumeData[] = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        dateCounts[dateStr] = 0;
        last30Days.push({
          date: dateStr,
          count: 0,
        });
      }

      if (shipmentsData) {
        shipmentsData.forEach((shipment) => {
          const dateStr = shipment.created_at.split("T")[0];
          if (dateCounts[dateStr] !== undefined) {
            dateCounts[dateStr]++;
          }
        });

        last30Days.forEach((day) => {
          day.count = dateCounts[day.date];
        });
      }

      setVolumeData(last30Days);

      const counts = last30Days.map((d) => d.count);
      const nonZeroCounts = counts.filter((c) => c > 0);

      setVolumeStats({
        totalThisMonth: counts.reduce((a, b) => a + b, 0),
        avgDaily: counts.reduce((a, b) => a + b, 0) / 30,
        highestDay: counts.length > 0 ? Math.max(...counts) : 0,
        lowestDay: nonZeroCounts.length > 0 ? Math.min(...nonZeroCounts) : 0,
      });
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
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold font-mono">{stats.totalCustomers}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-2">
                <Package className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold font-mono">{stats.totalShipments}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Shipments</p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-accent" />
                <span className="text-3xl font-bold font-mono">{stats.activeShipments}</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Shipments</p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold font-mono">{stats.deliveredShipments}</span>
              </div>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-8 w-8 text-yellow-500" />
                <span className="text-3xl font-bold font-mono">{stats.pendingQuotes}</span>
              </div>
              <p className="text-sm text-muted-foreground">Pending Quotes</p>
            </Card>
          </div>

          <Card className="p-6 border-border mb-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Shipment Volume Trend (Last 30 Days)</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-background rounded border border-border">
                <p className="text-2xl font-bold font-mono text-primary">{volumeStats.totalThisMonth}</p>
                <p className="text-xs text-muted-foreground">Total This Month</p>
              </div>
              <div className="p-4 bg-background rounded border border-border">
                <p className="text-2xl font-bold font-mono text-accent">{volumeStats.avgDaily.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Average Daily</p>
              </div>
              <div className="p-4 bg-background rounded border border-border">
                <p className="text-2xl font-bold font-mono text-green-500">{volumeStats.highestDay}</p>
                <p className="text-xs text-muted-foreground">Highest Volume Day</p>
              </div>
              <div className="p-4 bg-background rounded border border-border">
                <p className="text-2xl font-bold font-mono text-muted-foreground">{volumeStats.lowestDay}</p>
                <p className="text-xs text-muted-foreground">Lowest Volume Day</p>
              </div>
            </div>

            {volumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                      color: "#E2E8F0",
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: "#F59E0B", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No shipment data available for the last 30 days</p>
              </div>
            )}
          </Card>

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