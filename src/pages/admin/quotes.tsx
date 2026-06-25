import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";
import { Eye, CheckCircle2, XCircle, Clock, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  LogOut,
  Menu,
  X,
  Search,
  Mail,
  Phone,
  MapPin,
  Package,
} from "lucide-react";

interface QuoteRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zip: string;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  shipping_type: string;
  additional_notes: string | null;
  status: string;
  created_at: string;
}

export default function AdminQuotes() {
  return (
    <ProtectedRoute>
      <AdminQuotesContent />
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

function AdminQuotesContent() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();

    const channel = supabase
      .channel("admin-quotes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quote_requests",
        },
        () => {
          fetchQuotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = quotes;

    if (statusFilter !== "all") {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.customer_phone.includes(searchTerm) ||
          q.pickup_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.delivery_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.vehicle_make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.vehicle_model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
  }, [searchTerm, statusFilter, quotes]);

  const fetchQuotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) setAdminName(profile.full_name);

      const { data } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setQuotes(data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Quote status updated" });
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error updating quote",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve quote",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Quote approved successfully",
    });

    fetchQuotes();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject quote",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Quote rejected successfully",
    });

    fetchQuotes();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      });
      return;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      contacted: "bg-blue-500",
      approved: "bg-green-500",
      closed: "bg-gray-500",
    };
    return colors[status] || "bg-muted";
  };

  return (
    <>
      <SEO title="Quote Requests" description="Manage customer quote requests." />
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold">
              <Truck className="h-6 w-6 text-primary" />
              <span>GO CARGO ADMIN</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/shipments" className="text-sm font-medium hover:text-primary transition-colors">
                Shipments
              </Link>
              <Link href="/admin/quotes" className="text-sm font-medium text-primary">
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
                <Link href="/admin/dashboard" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/admin/shipments" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Shipments
                </Link>
                <Link href="/admin/quotes" className="py-2 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
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
            <h1 className="text-3xl font-bold mb-2">Quote Request Management</h1>
            <p className="text-muted-foreground">Review and manage customer quote requests</p>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, location, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <Card className="p-12 text-center border-border">
              <p className="text-muted-foreground">Loading quote requests...</p>
            </Card>
          ) : filteredQuotes.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" ? "No matching quote requests found" : "No quote requests yet"}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredQuotes.map((quote) => (
                <Card key={quote.id} className="p-6 border-border">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{quote.customer_name}</h3>
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium text-background capitalize ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted {new Date(quote.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Select
                      value={quote.status}
                      onValueChange={(value) => updateQuoteStatus(quote.id, value)}
                    >
                      <SelectTrigger className="w-40 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-primary" />
                        <a href={`mailto:${quote.customer_email}`} className="hover:text-primary">
                          {quote.customer_email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <a href={`tel:${quote.customer_phone}`} className="hover:text-primary">
                          {quote.customer_phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Pickup</p>
                          <p>
                            {quote.pickup_address}, {quote.pickup_city}, {quote.pickup_state} {quote.pickup_zip}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-accent mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Delivery</p>
                          <p>
                            {quote.delivery_address}, {quote.delivery_city}, {quote.delivery_state} {quote.delivery_zip}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Package className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Vehicle</p>
                          <p>
                            {quote.vehicle_year} {quote.vehicle_make} {quote.vehicle_model}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            Type: {quote.vehicle_type} | Shipping: {quote.shipping_type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {quote.additional_notes && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Additional Notes</p>
                      <p className="text-sm">{quote.additional_notes}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}