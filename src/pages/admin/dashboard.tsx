import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ShipmentService } from "@/services/shipmentService";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  PauseCircle,
  DollarSign,
  TruckIcon,
  Users,
  FileText,
  Activity,
  Plus,
  ArrowRight,
  Plane,
  Ship,
  Train,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  total: number;
  active: number;
  delivered: number;
  delayed: number;
  cancelled: number;
  onHold: number;
  revenue: number;
}

interface RecentShipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  status: string;
  shipment_type: string;
  destination_city: string;
  destination_country: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    delivered: 0,
    delayed: 0,
    cancelled: 0,
    onHold: 0,
    revenue: 0,
  });
  const [recentShipments, setRecentShipments] = useState<RecentShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadDashboardData();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setUserName(profile.full_name || "Admin");
      }
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsData = await ShipmentService.getDashboardStats();
      setStats(statsData);

      // Load recent shipments
      const shipments = await ShipmentService.getAllShipments();
      setRecentShipments(shipments.slice(0, 8) as RecentShipment[]);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_transit: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      out_for_delivery: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      delayed: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      on_hold: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status] || colors.pending;
  };

  const getShipmentIcon = (type: string): ReactElement => {
    const icons: Record<string, ReactElement> = {
      air_freight: <Plane className="h-4 w-4" />,
      ocean_freight: <Ship className="h-4 w-4" />,
      rail_freight: <Train className="h-4 w-4" />,
      road_freight: <TruckIcon className="h-4 w-4" />,
    };
    return icons[type] || <Package className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/60 font-mono">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 mt-20">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {userName}
            </h1>
            <p className="text-muted-foreground">
              Enterprise Logistics Command Center
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Button
              onClick={() => router.push("/admin/shipments?action=new")}
              className="h-auto py-4 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">New Shipment</div>
                <div className="text-xs opacity-80">Create tracking</div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/admin/shipments")}
              variant="outline"
              className="h-auto py-4"
            >
              <Package className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">All Shipments</div>
                <div className="text-xs opacity-70">{stats.total} total</div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/admin/quotes")}
              variant="outline"
              className="h-auto py-4"
            >
              <FileText className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Quote Requests</div>
                <div className="text-xs opacity-70">Manage quotes</div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/track")}
              variant="outline"
              className="h-auto py-4"
            >
              <Activity className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Track Shipment</div>
                <div className="text-xs opacity-70">Live tracking</div>
              </div>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-primary/20 bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Shipments</CardDescription>
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Active Shipments</CardDescription>
                  <TruckIcon className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Delivered</CardDescription>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.delivered}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% success rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Revenue</CardDescription>
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  ${stats.revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total earnings</p>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <CardDescription>Delayed</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.delayed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <PauseCircle className="h-4 w-4 text-gray-500" />
                  <CardDescription>On Hold</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.onHold}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <CardDescription>Cancelled</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cancelled}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <CardDescription>Delivery Rate</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Shipments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Shipments</CardTitle>
                  <CardDescription>Latest shipment activities</CardDescription>
                </div>
                <Button
                  onClick={() => router.push("/admin/shipments")}
                  variant="outline"
                  size="sm"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentShipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No shipments yet</p>
                  <Button
                    onClick={() => router.push("/admin/shipments?action=new")}
                    className="mt-4"
                  >
                    Create First Shipment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/shipments/${shipment.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          {getShipmentIcon(shipment.shipment_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-sm">
                              {shipment.tracking_number}
                            </span>
                            <Badge
                              variant="outline"
                              className={getStatusColor(shipment.status)}
                            >
                              {shipment.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {shipment.sender_name} → {shipment.receiver_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shipment.destination_city}, {shipment.destination_country}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}