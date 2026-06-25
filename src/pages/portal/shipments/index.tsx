import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import type { GetServerSideProps } from "next";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";
import { useToast } from "@/hooks/use-toast";
import { Package, Search, Eye, Calendar, MapPin, Truck, LogOut, X, Menu } from "lucide-react";

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

export default function Shipments() {
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
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredShipments(
        shipments.filter(
          (s) =>
            s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredShipments(shipments);
    }
  }, [searchTerm, shipments]);

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
        .select("id, tracking_number, pickup_address, delivery_address, vehicle_type, status, estimated_delivery_date, created_at")
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
            <p className="text-muted-foreground">Track all your vehicle shipments</p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number, location, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {loading ? (
            <Card className="p-12 text-center border-border">
              <p className="text-muted-foreground">Loading shipments...</p>
            </Card>
          ) : filteredShipments.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {searchTerm ? "No matching shipments found" : "No shipments yet"}
              </p>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Try a different search term" : "Request a quote to get started"}
              </p>
              {!searchTerm && (
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
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                        <Truck className="h-8 w-8 text-primary" />
                      </div>
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
                        {shipment.estimated_delivery_date && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Est. Delivery</p>
                            <p className="text-sm font-medium">
                              {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      <Link href={`/portal/shipments/${shipment.id}`}>
                        <Button size="sm" variant="outline" className="font-mono">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
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