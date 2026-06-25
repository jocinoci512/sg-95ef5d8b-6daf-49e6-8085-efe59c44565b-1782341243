// Shipment Timeline Management Component
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  event_type: string;
  event_title: string;
  location: string;
  event_description?: string;
  event_timestamp: string;
  created_at: string;
}

interface ShipmentTimelineProps {
  shipmentId: string;
}

const EVENT_TYPES = [
  { value: "created", label: "Shipment Created" },
  { value: "received", label: "Package Received" },
  { value: "processing", label: "Processing" },
  { value: "dispatched", label: "Dispatched" },
  { value: "in_transit", label: "In Transit" },
  { value: "arrived_hub", label: "Arrived at Hub" },
  { value: "customs", label: "Customs Clearance" },
  { value: "out_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "exception", label: "Exception/Delay" },
];

export function ShipmentTimeline({ shipmentId }: ShipmentTimelineProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_type: "",
    event_title: "",
    location: "",
    event_description: "",
    event_timestamp: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    loadTimeline();
  }, [shipmentId]);

  const loadTimeline = async () => {
    try {
      const { data, error } = await supabase
        .from("shipment_timeline")
        .select("*")
        .eq("shipment_id", shipmentId)
        .order("event_timestamp", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error loading timeline:", error);
      toast({
        title: "Error",
        description: "Failed to load timeline",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    setActionLoading(true);
    try {
      const { error } = await supabase.from("shipment_timeline").insert({
        shipment_id: shipmentId,
        ...formData,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline event added",
      });

      setShowAddDialog(false);
      resetForm();
      loadTimeline();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("shipment_timeline")
        .update(formData)
        .eq("id", selectedEvent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline event updated",
      });

      setShowEditDialog(false);
      setSelectedEvent(null);
      resetForm();
      loadTimeline();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this timeline event?")) return;

    try {
      const { error } = await supabase
        .from("shipment_timeline")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline event deleted",
      });

      loadTimeline();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setFormData({
      event_type: event.event_type,
      event_title: event.event_title,
      location: event.location,
      event_description: event.event_description || "",
      event_timestamp: new Date(event.event_timestamp).toISOString().slice(0, 16),
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      event_type: "",
      event_title: "",
      location: "",
      event_description: "",
      event_timestamp: new Date().toISOString().slice(0, 16),
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading timeline...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Shipment Timeline
            </CardTitle>
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No timeline events yet</p>
              <Button onClick={() => setShowAddDialog(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Event
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="flex gap-4 pb-4 border-b border-border last:border-0"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{event.event_title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(event)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {event.event_description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.event_description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.event_timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Timeline Event</DialogTitle>
            <DialogDescription>
              Add a new event to the shipment timeline
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, event_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                value={formData.event_title}
                onChange={(e) =>
                  setFormData({ ...formData, event_title: e.target.value })
                }
                placeholder="e.g., Package arrived at hub"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Los Angeles Distribution Center"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={formData.event_description}
                onChange={(e) =>
                  setFormData({ ...formData, event_description: e.target.value })
                }
                placeholder="Additional details..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Event Timestamp</Label>
              <Input
                type="datetime-local"
                value={formData.event_timestamp}
                onChange={(e) =>
                  setFormData({ ...formData, event_timestamp: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Timeline Event</DialogTitle>
            <DialogDescription>
              Update the timeline event details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, event_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                value={formData.event_title}
                onChange={(e) =>
                  setFormData({ ...formData, event_title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.event_description}
                onChange={(e) =>
                  setFormData({ ...formData, event_description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Event Timestamp</Label>
              <Input
                type="datetime-local"
                value={formData.event_timestamp}
                onChange={(e) =>
                  setFormData({ ...formData, event_timestamp: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedEvent(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditEvent} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}