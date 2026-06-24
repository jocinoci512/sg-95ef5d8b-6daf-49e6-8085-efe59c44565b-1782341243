import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ShipmentFilters } from "@/components/admin/ShipmentFilters";
import { ShipmentTable } from "@/components/admin/ShipmentTable";
import { ShipmentDialog } from "@/components/admin/ShipmentDialog";
import type { GetServerSideProps } from "next";

interface Shipment {
  id: string;
  tracking_number: string;
  customer_id: string;
  customer_name: string;
  origin: string;
  destination: string;
  vehicle_type: string;
  service_type: string;
  status: string;
  pickup_date: string;
  delivery_date: string | null;
  total_cost: number;
}

export default function AdminShipments() {
  const router = useRouter();
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [formData, setFormData] = useState({
    tracking_number: "",
    customer_name: "",
    origin: "",
    destination: "",
    vehicle_type: "",
    service_type: "open_transport",
    status: "pending",
    pickup_date: "",
    delivery_date: "",
    total_cost: 0,
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [shipments, searchQuery, statusFilter]);

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select(`
          *,
          profiles:customer_id (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = data?.map((shipment: any) => ({
        ...shipment,
        customer_name: shipment.profiles?.full_name || "Unknown",
      })) || [];

      setShipments(formattedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch shipments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = [...shipments];

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredShipments(filtered);
  };

  const handleCreate = () => {
    setEditingShipment(null);
    setFormData({
      tracking_number: `GCL${Date.now().toString().slice(-8)}`,
      customer_name: "",
      origin: "",
      destination: "",
      vehicle_type: "",
      service_type: "open_transport",
      status: "pending",
      pickup_date: "",
      delivery_date: "",
      total_cost: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setFormData({
      tracking_number: shipment.tracking_number,
      customer_name: shipment.customer_name,
      origin: shipment.origin,
      destination: shipment.destination,
      vehicle_type: shipment.vehicle_type,
      service_type: shipment.service_type,
      status: shipment.status,
      pickup_date: shipment.pickup_date.split("T")[0],
      delivery_date: shipment.delivery_date?.split("T")[0] || "",
      total_cost: shipment.total_cost,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingShipment) {
        const updateData: Partial<{
          tracking_number: string;
          origin: string;
          destination: string;
          vehicle_type: string;
          service_type: string;
          status: string;
          pickup_date: string;
          delivery_date: string | null;
          total_cost: number;
        }> = {
          tracking_number: formData.tracking_number,
          origin: formData.origin,
          destination: formData.destination,
          vehicle_type: formData.vehicle_type,
          service_type: formData.service_type,
          status: formData.status,
          pickup_date: formData.pickup_date,
          delivery_date: formData.delivery_date || null,
          total_cost: formData.total_cost,
        };

        const { error } = await supabase
          .from("shipments")
          .update(updateData)
          .eq("id", editingShipment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Shipment updated successfully",
        });
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("full_name", formData.customer_name)
          .single();

        if (!profile) {
          toast({
            title: "Error",
            description: "Customer not found",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase.from("shipments").insert({
          tracking_number: formData.tracking_number,
          customer_id: profile.id,
          origin: formData.origin,
          destination: formData.destination,
          vehicle_type: formData.vehicle_type,
          service_type: formData.service_type,
          status: formData.status,
          pickup_date: formData.pickup_date,
          delivery_date: formData.delivery_date || null,
          total_cost: formData.total_cost,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Shipment created successfully",
        });
      }

      setIsDialogOpen(false);
      fetchShipments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save shipment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;

    try {
      const { error } = await supabase.from("shipments").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shipment deleted successfully",
      });

      fetchShipments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete shipment",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ["Tracking Number", "Customer", "Origin", "Destination", "Status", "Pickup Date", "Delivery Date"],
      ...filteredShipments.map((s) => [
        s.tracking_number,
        s.customer_name,
        s.origin,
        s.destination,
        s.status,
        new Date(s.pickup_date).toLocaleDateString(),
        s.delivery_date ? new Date(s.delivery_date).toLocaleDateString() : "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shipments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl">Shipment Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Shipment
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ShipmentFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading shipments...</div>
              ) : (
                <ShipmentTable
                  shipments={filteredShipments}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />

        <ShipmentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          shipment={formData}
          onShipmentChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onSave={handleSave}
          mode={editingShipment ? "edit" : "create"}
        />
      </div>
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};