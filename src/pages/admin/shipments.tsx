import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Truck,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";

interface Shipment {
  id: string;
  tracking_number: string;
  customer_id: string;
  pickup_address: string;
  delivery_address: string;
  vehicle_type: string;
  status: string;
  estimated_delivery_date: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface Customer {
  id: string;
  full_name: string;
  email: string;
}

export default function AdminShipments() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminShipmentsContent />
    </ProtectedRoute>
  );
}

function AdminShipmentsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    pickupAddress: "",
    deliveryAddress: "",
    vehicleType: "",
    status: "pending_pickup",
    estimatedDeliveryDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredShipments(
        shipments.filter(
          (s) =>
            s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredShipments(shipments);
    }
  }, [searchTerm, shipments]);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) setAdminName(profile.full_name);

      const { data: customersData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "customer")
        .order("full_name");

      if (customersData) setCustomers(customersData);

      const { data: shipmentsData } = await supabase
        .from("shipments")
        .select(`
          id,
          tracking_number,
          customer_id,
          pickup_address,
          delivery_address,
          vehicle_type,
          status,
          estimated_delivery_date,
          created_at,
          profiles:customer_id(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (shipmentsData) {
        setShipments(shipmentsData as any);
        setFilteredShipments(shipmentsData as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingNumber = () => {
    const prefix = "GC";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const { error } = await supabase.from("shipments").insert({
        tracking_number: generateTrackingNumber(),
        customer_id: formData.customerId,
        pickup_address: formData.pickupAddress,
        delivery_address: formData.deliveryAddress,
        vehicle_type: formData.vehicleType,
        status: formData.status,
        estimated_delivery_date: formData.estimatedDeliveryDate || null,
      });

      if (error) throw error;

      toast({ title: "Shipment created successfully" });
      setCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error creating shipment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;
    setFormLoading(true);

    try {
      const { error } = await supabase
        .from("shipments")
        .update({
          customer_id: formData.customerId,
          pickup_address: formData.pickupAddress,
          delivery_address: formData.deliveryAddress,
          vehicle_type: formData.vehicleType,
          status: formData.status,
          estimated_delivery_date: formData.estimatedDeliveryDate || null,
        })
        .eq("id", editingShipment.id);

      if (error) throw error;

      toast({ title: "Shipment updated successfully" });
      setEditingShipment(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error updating shipment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;

    try {
      const { error } = await supabase.from("shipments").delete().eq("id", id);

      if (error) throw error;

      toast({ title: "Shipment deleted successfully" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error deleting shipment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setFormData({
      customerId: shipment.customer_id,
      pickupAddress: shipment.pickup_address,
      deliveryAddress: shipment.delivery_address,
      vehicleType: shipment.vehicle_type,
      status: shipment.status,
      estimatedDeliveryDate: shipment.estimated_delivery_date || "",
    });
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      pickupAddress: "",
      deliveryAddress: "",
      vehicleType: "",
      status: "pending_pickup",
      estimatedDeliveryDate: "",
    });
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

  return (
    <>
      <SEO title="Manage Shipments" description="Create and manage customer shipments." />
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
              <Link href="/admin/shipments" className="text-sm font-medium text-primary">
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
                <Link href="/admin/dashboard" className="py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/admin/shipments" className="py-2 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
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
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Shipment Management</h1>
              <p className="text-muted-foreground">Create and manage customer shipments</p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="font-mono">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Customer *</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                      required
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.full_name} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Pickup Address *</Label>
                    <Input
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Address *</Label>
                    <Input
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Type *</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                      required
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                      required
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending_pickup">Pending Pickup</SelectItem>
                        <SelectItem value="picked_up">Picked Up</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="at_hub">At Hub</SelectItem>
                        <SelectItem value="customs_clearance">Customs Clearance</SelectItem>
                        <SelectItem value="out_for_delivery">Out For Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Delivery Date</Label>
                    <Input
                      type="date"
                      value={formData.estimatedDeliveryDate}
                      onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                      className="bg-background"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 font-mono" disabled={formLoading}>
                      {formLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Shipment"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCreateDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number, customer, or address..."
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
              <p className="text-muted-foreground">
                {searchTerm ? "No matching shipments found" : "No shipments yet"}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="p-6 border-border">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-mono font-bold text-lg">{shipment.tracking_number}</p>
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium text-background capitalize ${getStatusColor(shipment.status)}`}>
                          {shipment.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Customer: {shipment.profiles?.full_name} ({shipment.profiles?.email})
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Vehicle: {shipment.vehicle_type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editingShipment?.id === shipment.id} onOpenChange={(open) => !open && setEditingShipment(null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(shipment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Shipment</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Customer *</Label>
                              <Select
                                value={formData.customerId}
                                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                                required
                              >
                                <SelectTrigger className="bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {customers.map((customer) => (
                                    <SelectItem key={customer.id} value={customer.id}>
                                      {customer.full_name} ({customer.email})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Pickup Address *</Label>
                              <Input
                                value={formData.pickupAddress}
                                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                                required
                                className="bg-background"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Delivery Address *</Label>
                              <Input
                                value={formData.deliveryAddress}
                                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                required
                                className="bg-background"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Vehicle Type *</Label>
                              <Select
                                value={formData.vehicleType}
                                onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                                required
                              >
                                <SelectTrigger className="bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sedan">Sedan</SelectItem>
                                  <SelectItem value="suv">SUV</SelectItem>
                                  <SelectItem value="truck">Truck</SelectItem>
                                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                  <SelectItem value="van">Van</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Status *</Label>
                              <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                required
                              >
                                <SelectTrigger className="bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending_pickup">Pending Pickup</SelectItem>
                                  <SelectItem value="picked_up">Picked Up</SelectItem>
                                  <SelectItem value="in_transit">In Transit</SelectItem>
                                  <SelectItem value="at_hub">At Hub</SelectItem>
                                  <SelectItem value="customs_clearance">Customs Clearance</SelectItem>
                                  <SelectItem value="out_for_delivery">Out For Delivery</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Estimated Delivery Date</Label>
                              <Input
                                type="date"
                                value={formData.estimatedDeliveryDate}
                                onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                                className="bg-background"
                              />
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button type="submit" className="flex-1 font-mono" disabled={formLoading}>
                                {formLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  "Update Shipment"
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingShipment(null);
                                  resetForm();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(shipment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Pickup</p>
                      <p>{shipment.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Delivery</p>
                      <p>{shipment.delivery_address}</p>
                    </div>
                  </div>

                  {shipment.estimated_delivery_date && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Est. Delivery: {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                    </p>
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