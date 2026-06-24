import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Shipment {
  id: string;
  tracking_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  status: string;
  pickup_date: string;
  delivery_date: string | null;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
}

export function ShipmentTable({ shipments, onEdit, onDelete }: ShipmentTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      in_transit: "default",
      delivered: "outline",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status.replace("_", " ")}</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pickup Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No shipments found
              </TableCell>
            </TableRow>
          ) : (
            shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-mono font-medium">{shipment.tracking_number}</TableCell>
                <TableCell>{shipment.customer_name}</TableCell>
                <TableCell className="text-sm">
                  {shipment.origin} → {shipment.destination}
                </TableCell>
                <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                <TableCell>{new Date(shipment.pickup_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {shipment.delivery_date ? new Date(shipment.delivery_date).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/shipments/${shipment.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(shipment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(shipment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}