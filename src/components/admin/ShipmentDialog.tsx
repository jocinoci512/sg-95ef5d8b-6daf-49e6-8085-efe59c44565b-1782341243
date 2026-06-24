import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShipmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
  onShipmentChange: (field: string, value: string) => void;
  onSave: () => void;
  mode: "create" | "edit";
}

export function ShipmentDialog({ 
  isOpen, 
  onClose, 
  shipment, 
  onShipmentChange, 
  onSave, 
  mode 
}: ShipmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Shipment" : "Edit Shipment"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                value={shipment.customer_name}
                onChange={(e) => onShipmentChange("customer_name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tracking_number">Tracking Number</Label>
              <Input
                id="tracking_number"
                value={shipment.tracking_number}
                onChange={(e) => onShipmentChange("tracking_number", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={shipment.origin}
                onChange={(e) => onShipmentChange("origin", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={shipment.destination}
                onChange={(e) => onShipmentChange("destination", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              <Input
                id="vehicle_type"
                value={shipment.vehicle_type}
                onChange={(e) => onShipmentChange("vehicle_type", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={shipment.status} onValueChange={(value) => onShipmentChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup_date">Pickup Date</Label>
              <Input
                id="pickup_date"
                type="date"
                value={shipment.pickup_date}
                onChange={(e) => onShipmentChange("pickup_date", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <Input
                id="delivery_date"
                type="date"
                value={shipment.delivery_date}
                onChange={(e) => onShipmentChange("delivery_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_type">Service Type</Label>
            <Select value={shipment.service_type} onValueChange={(value) => onShipmentChange("service_type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open_transport">Open Transport</SelectItem>
                <SelectItem value="enclosed_transport">Enclosed Transport</SelectItem>
                <SelectItem value="expedited">Expedited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save Shipment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}