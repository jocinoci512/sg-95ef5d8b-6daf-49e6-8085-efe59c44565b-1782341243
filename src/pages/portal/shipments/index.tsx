import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GetServerSideProps } from "next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package, Search, Eye, Truck, LogOut, X, Menu, Filter } from "lucide-react";

interface Shipment {
  id: string;
  tracking_number: string;
  pickup_address: string;
  delivery_address: string;
  vehicle_type: string;
  status: string;
  estimated_delivery_date: string | null;
  created_at: string;
  package_description: string;
}

export default function MyShipments() {
  return (
    <ProtectedRoute requiredRole="customer">
      <ShipmentsContent />
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

function ShipmentsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();

    const channel = supabase
      .channel("customer-shipments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shipments",
        },
        () => {
          fetchShipments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, shipments]);

  const applyFilters = () => {
    let filtered = [...shipments];

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.tracking_number.toLowerCase().includes(query) ||
          s.pickup_address.toLowerCase().includes(query) ||
          s.delivery_address.toLowerCase().includes(query) ||
          s.vehicle_type.toLowerCase().includes(query) ||
          s.package_description?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredShipments(filtered);
  };

  const fetchShipments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) setUserName(profile.full_name);

      const { data } = await supabase
        .from("shipments")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setShipments(data);
        setFilteredShipments(data);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
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
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      pending_pickup: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      picked_up: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_transit: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      at_hub: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      out_for_delivery: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      delayed: "bg-red-500/10 text-red-500 border-red-500/20",
      on_hold: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pending",
      processing: "Processing",
      pending_pickup: "Awaiting Pickup",
      picked_up: "Picked Up",
      in_transit: "In Transit",
      at_hub: "At Distribution Hub",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      delayed: "Delayed",
      on_hold: "On Hold",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  const getShipmentCounts = () => {
    return {
      all: shipments.length,
      active: shipments.filter((s) => 
        ["pending", "processing", "pending_pickup", "picked_up", "in_transit", "at_hub", "out_for_delivery"].includes(s.status)
      ).length,
      delivered: shipments.filter((s) => s.status === "delivered").length,
      cancelled: shipments.filter((s) => s.status === "cancelled").length,
    };
  };

  const counts = getShipmentCounts();

  return (
    <>
      <SEO title="My Shipments" description="View all your shipments and tracking information." />
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Shipments</h1>
            <p className="text-muted-foreground">Track all your vehicle shipments and deliveries</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-border">
              <p className="text-2xl font-bold font-mono">{counts.all}</p>
              <p className="text-sm text-muted-foreground">Total Shipments</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-2xl font-bold font-mono text-primary">{counts.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-2xl font-bold font-mono text-green-500">{counts.delivered}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-2xl font-bold font-mono text-red-500">{counts.cancelled}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking number, location, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses ({counts.all})</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending_pickup">Awaiting Pickup</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="at_hub">At Hub</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {loading ? (
            <Card className="p-12 text-center border-border">
              <p className="text-muted-foreground">Loading shipments...</p>
            </Card>
          ) : filteredShipments.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {searchTerm || statusFilter !== "all" ? "No matching shipments found" : "No shipments yet"}
              </p>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all" ? "Try adjusting your filters" : "Request a quote to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/quote">
                  <Button className="font-mono">Request Quote</Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredShipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className="p-6 border-border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/portal/shipments/${shipment.id}`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative w-12 h-12 rounded-lg flex-shrink-0 bg-primary/10 flex items-center justify-center border-2 border-primary">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-mono font-bold">{shipment.tracking_number}</p>
                          <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(shipment.status)}`}>
                            {getStatusLabel(shipment.status)}
                          </span>
                        </div>
                        {shipment.package_description && (
                          <p className="text-sm text-foreground mb-2">{shipment.package_description}</p>
                        )}
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p className="truncate">From: {shipment.pickup_address}</p>
                          <p className="truncate">To: {shipment.delivery_address}</p>
                        </div>
                        {shipment.vehicle_type && (
                          <p className="text-sm text-muted-foreground mt-2 capitalize">
                            Vehicle: {shipment.vehicle_type}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {shipment.estimated_delivery_date && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Est. Delivery</p>
                          <p className="text-sm font-medium font-mono">
                            {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <Button size="sm" variant="outline" className="font-mono" onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/portal/shipments/${shipment.id}`);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}