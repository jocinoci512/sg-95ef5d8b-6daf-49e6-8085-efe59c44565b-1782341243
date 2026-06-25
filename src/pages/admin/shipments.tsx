import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Edit,
  Copy,
  Archive,
  PauseCircle,
  PlayCircle,
  XCircle,
  Trash2,
  Download,
  Upload,
  Eye,
  Plane,
  Ship,
  Train,
  TruckIcon,
  FileText,
  Clock,
} from "lucide-react";

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  status: string;
  shipment_type: string;
  shipping_type: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  shipping_cost: number;
  created_at: string;
  estimated_delivery?: string;
}

export default function AdminShipmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // New shipment form state
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_address: "",
    sender_phone: "",
    sender_email: "",
    receiver_name: "",
    receiver_address: "",
    receiver_phone: "",
    receiver_email: "",
    package_description: "",
    package_weight: "",
    shipment_type: "road_freight",
    shipping_type: "standard_delivery",
    pickup_address: "",
    pickup_city: "",
    pickup_state: "",
    pickup_zip: "",
    delivery_address: "",
    delivery_city: "",
    delivery_state: "",
    delivery_zip: "",
    origin_city: "",
    origin_country: "",
    destination_city: "",
    destination_country: "",
    shipping_cost: "",
    carrier: "",
  });

  useEffect(() => {
    loadShipments();
    
    // Check for create action in URL
    if (router.query.action === "new") {
      setShowCreateDialog(true);
    }
  }, [router.query]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, typeFilter, shipments]);

  const loadShipments = async () => {
    try {
      const data = await ShipmentService.getAllShipments();
      setShipments(data as Shipment[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load shipments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...shipments];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.tracking_number.toLowerCase().includes(query) ||
          s.sender_name.toLowerCase().includes(query) ||
          s.receiver_name.toLowerCase().includes(query) ||
          s.origin_city.toLowerCase().includes(query) ||
          s.destination_city.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((s) => s.shipment_type === typeFilter);
    }

    setFilteredShipments(filtered);
  };

  const handleCreateShipment = async () => {
    setActionLoading(true);
    try {
      const trackingNumber = await ShipmentService.generateTrackingNumber();
      
      await supabase.from("shipments").insert({
        tracking_number: trackingNumber,
        sender_name: formData.sender_name,
        sender_address: formData.sender_address,
        sender_phone: formData.sender_phone,
        sender_email: formData.sender_email,
        receiver_name: formData.receiver_name,
        receiver_address: formData.receiver_address,
        receiver_phone: formData.receiver_phone,
        receiver_email: formData.receiver_email,
        package_description: formData.package_description,
        package_weight: parseFloat(formData.package_weight) || null,
        shipment_type: formData.shipment_type,
        shipping_type: formData.shipping_type,
        status: "pending",
        pickup_address: formData.pickup_address,
        pickup_city: formData.pickup_city,
        pickup_state: formData.pickup_state,
        pickup_zip: formData.pickup_zip,
        delivery_address: formData.delivery_address,
        delivery_city: formData.delivery_city,
        delivery_state: formData.delivery_state,
        delivery_zip: formData.delivery_zip,
        origin_city: formData.origin_city,
        origin_country: formData.origin_country,
        destination_city: formData.destination_city,
        destination_country: formData.destination_country,
        shipping_cost: parseFloat(formData.shipping_cost) || null,
        carrier: formData.carrier,
      });

      toast({
        title: "Success",
        description: `Shipment ${trackingNumber} created successfully`,
      });

      setShowCreateDialog(false);
      loadShipments();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shipment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicateShipment = async (id: string) => {
    setActionLoading(true);
    try {
      await ShipmentService.duplicateShipment(id);
      toast({
        title: "Success",
        description: "Shipment duplicated successfully",
      });
      loadShipments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate shipment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveShipment = async (id: string) => {
    setActionLoading(true);
    try {
      await ShipmentService.updateShipmentStatus(id, "archived");
      toast({
        title: "Success",
        description: "Shipment archived successfully",
      });
      loadShipments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive shipment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleHoldShipment = async (id: string) => {
    setActionLoading(true);
    try {
      await ShipmentService.updateShipmentStatus(id, "on_hold");
      toast({
        title: "Success",
        description: "Shipment put on hold",
      });
      loadShipments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to hold shipment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeShipment = async (id: string) => {
    setActionLoading(true);
    try {
      await ShipmentService.updateShipmentStatus(id, "processing");
      toast({
        title: "Success",
        description: "Shipment resumed",
      });
      loadShipments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resume shipment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelShipment = async (id: string) => {
    setActionLoading(true);
    try {
      await ShipmentService.updateShipmentStatus(id, "cancelled");
      toast({
        title: "Success",
        description: "Shipment cancelled",
      });
      loadShipments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel shipment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteShipment = async () => {
    if (!selectedShipment) return;
    
    setActionLoading(true);
    try {
      await ShipmentService.deleteShipment(selectedShipment.id);
      toast({
        title: "Success",
        description: "Shipment deleted permanently",
      });
      setShowDeleteDialog(false);
      setSelectedShipment(null);
      loadShipments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shipment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sender_name: "",
      sender_address: "",
      sender_phone: "",
      sender_email: "",
      receiver_name: "",
      receiver_address: "",
      receiver_phone: "",
      receiver_email: "",
      package_description: "",
      package_weight: "",
      shipment_type: "road_freight",
      shipping_type: "standard_delivery",
      pickup_address: "",
      pickup_city: "",
      pickup_state: "",
      pickup_zip: "",
      delivery_address: "",
      delivery_city: "",
      delivery_state: "",
      delivery_zip: "",
      origin_city: "",
      origin_country: "",
      destination_city: "",
      destination_country: "",
      shipping_cost: "",
      carrier: "",
    });
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
      archived: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };
    return colors[status] || colors.pending;
  };

  const getShipmentIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      air_freight: <Plane className="h-4 w-4" />,
      ocean_freight: <Ship className="h-4 w-4" />,
      rail_freight: <Train className="h-4 w-4" />,
      road_freight: <TruckIcon className="h-4 w-4" />,
    };
    return icons[type] || <Package className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/60 font-mono">Loading shipments...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 mt-20">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Shipment Management
              </h1>
              <p className="text-muted-foreground">
                {filteredShipments.length} of {shipments.length} shipments
              </p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Shipment
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by tracking number, sender, receiver..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="out_for_delivery">Out For Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="air_freight">Air Freight</SelectItem>
                    <SelectItem value="ocean_freight">Ocean Freight</SelectItem>
                    <SelectItem value="road_freight">Road Freight</SelectItem>
                    <SelectItem value="rail_freight">Rail Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shipments Table */}
          <Card>
            <CardContent className="p-0">
              {filteredShipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                      ? "No shipments match your filters"
                      : "No shipments yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mt-1">
                            {getShipmentIcon(shipment.shipment_type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-sm">
                                {shipment.tracking_number}
                              </span>
                              <Badge
                                variant="outline"
                                className={getStatusColor(shipment.status)}
                              >
                                {shipment.status.replace("_", " ")}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-foreground mb-1">
                              {shipment.sender_name} → {shipment.receiver_name}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {shipment.origin_city}, {shipment.origin_country} →{" "}
                                {shipment.destination_city}, {shipment.destination_country}
                              </span>
                              <span>•</span>
                              <span>{shipment.shipping_type.replace("_", " ")}</span>
                              {shipment.shipping_cost && (
                                <>
                                  <span>•</span>
                                  <span>${shipment.shipping_cost}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/shipments/${shipment.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/shipments/${shipment.id}`)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicateShipment(shipment.id)}
                                disabled={actionLoading}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {shipment.status !== "on_hold" && (
                                <DropdownMenuItem
                                  onClick={() => handleHoldShipment(shipment.id)}
                                  disabled={actionLoading}
                                >
                                  <PauseCircle className="h-4 w-4 mr-2" />
                                  Put on Hold
                                </DropdownMenuItem>
                              )}
                              {shipment.status === "on_hold" && (
                                <DropdownMenuItem
                                  onClick={() => handleResumeShipment(shipment.id)}
                                  disabled={actionLoading}
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Resume
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleCancelShipment(shipment.id)}
                                disabled={actionLoading}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleArchiveShipment(shipment.id)}
                                disabled={actionLoading}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedShipment(shipment);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>

      {/* Create Shipment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Shipment</DialogTitle>
            <DialogDescription>
              Enter shipment details below. Tracking number will be generated automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Sender Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sender Name *</Label>
                  <Input
                    value={formData.sender_name}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label>Sender Phone</Label>
                  <Input
                    value={formData.sender_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_phone: e.target.value })
                    }
                    placeholder="+1-555-0100"
                  />
                </div>
                <div>
                  <Label>Sender Email</Label>
                  <Input
                    type="email"
                    value={formData.sender_email}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_email: e.target.value })
                    }
                    placeholder="sender@example.com"
                  />
                </div>
                <div>
                  <Label>Sender Address</Label>
                  <Input
                    value={formData.sender_address}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_address: e.target.value })
                    }
                    placeholder="123 Main St"
                  />
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Receiver Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Receiver Name *</Label>
                  <Input
                    value={formData.receiver_name}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_name: e.target.value })
                    }
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <Label>Receiver Phone</Label>
                  <Input
                    value={formData.receiver_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_phone: e.target.value })
                    }
                    placeholder="+1-555-0200"
                  />
                </div>
                <div>
                  <Label>Receiver Email</Label>
                  <Input
                    type="email"
                    value={formData.receiver_email}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_email: e.target.value })
                    }
                    placeholder="receiver@example.com"
                  />
                </div>
                <div>
                  <Label>Receiver Address</Label>
                  <Input
                    value={formData.receiver_address}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_address: e.target.value })
                    }
                    placeholder="456 Oak Ave"
                  />
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Package Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Package Description *</Label>
                  <Textarea
                    value={formData.package_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        package_description: e.target.value,
                      })
                    }
                    placeholder="Electronics, fragile items, etc."
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.package_weight}
                    onChange={(e) =>
                      setFormData({ ...formData, package_weight: e.target.value })
                    }
                    placeholder="25.5"
                  />
                </div>
                <div>
                  <Label>Shipping Cost ($)</Label>
                  <Input
                    type="number"
                    value={formData.shipping_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, shipping_cost: e.target.value })
                    }
                    placeholder="150.00"
                  />
                </div>
              </div>
            </div>

            {/* Shipment Type */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Shipment Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Freight Type *</Label>
                  <Select
                    value={formData.shipment_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, shipment_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air_freight">Air Freight</SelectItem>
                      <SelectItem value="ocean_freight">Ocean Freight</SelectItem>
                      <SelectItem value="road_freight">Road Freight</SelectItem>
                      <SelectItem value="rail_freight">Rail Freight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shipping Type *</Label>
                  <Select
                    value={formData.shipping_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, shipping_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="express_delivery">Express Delivery</SelectItem>
                      <SelectItem value="standard_delivery">Standard Delivery</SelectItem>
                      <SelectItem value="overnight_shipping">Overnight Shipping</SelectItem>
                      <SelectItem value="same_day_delivery">Same-Day Delivery</SelectItem>
                      <SelectItem value="international_shipping">International Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Carrier</Label>
                  <Input
                    value={formData.carrier}
                    onChange={(e) =>
                      setFormData({ ...formData, carrier: e.target.value })
                    }
                    placeholder="FedEx, DHL, etc."
                  />
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Pickup & Delivery Locations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pickup Address *</Label>
                  <Input
                    value={formData.pickup_address}
                    onChange={(e) =>
                      setFormData({ ...formData, pickup_address: e.target.value })
                    }
                    placeholder="123 Warehouse Rd"
                  />
                </div>
                <div>
                  <Label>Delivery Address *</Label>
                  <Input
                    value={formData.delivery_address}
                    onChange={(e) =>
                      setFormData({ ...formData, delivery_address: e.target.value })
                    }
                    placeholder="456 Customer St"
                  />
                </div>
                <div>
                  <Label>Pickup City</Label>
                  <Input
                    value={formData.pickup_city}
                    onChange={(e) =>
                      setFormData({ ...formData, pickup_city: e.target.value })
                    }
                    placeholder="Los Angeles"
                  />
                </div>
                <div>
                  <Label>Delivery City</Label>
                  <Input
                    value={formData.delivery_city}
                    onChange={(e) =>
                      setFormData({ ...formData, delivery_city: e.target.value })
                    }
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label>Origin Country *</Label>
                  <Input
                    value={formData.origin_country}
                    onChange={(e) =>
                      setFormData({ ...formData, origin_country: e.target.value })
                    }
                    placeholder="USA"
                  />
                </div>
                <div>
                  <Label>Destination Country *</Label>
                  <Input
                    value={formData.destination_country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination_country: e.target.value,
                      })
                    }
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateShipment}
              disabled={
                actionLoading ||
                !formData.sender_name ||
                !formData.receiver_name ||
                !formData.package_description ||
                !formData.pickup_address ||
                !formData.delivery_address ||
                !formData.origin_country ||
                !formData.destination_country
              }
            >
              {actionLoading ? "Creating..." : "Create Shipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete shipment{" "}
              <span className="font-mono font-semibold">
                {selectedShipment?.tracking_number}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedShipment(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteShipment}
              className="bg-red-500 hover:bg-red-600"
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}