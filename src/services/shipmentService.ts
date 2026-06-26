// Enterprise Shipment Service
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/database.types";

type Shipment = Database["public"]["Tables"]["shipments"]["Row"];
type ShipmentInsert = Database["public"]["Tables"]["shipments"]["Insert"];
type ShipmentUpdate = Database["public"]["Tables"]["shipments"]["Update"];

export interface ShipmentFilters {
  status?: string;
  shipmentType?: string;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  originCountry?: string;
  destinationCountry?: string;
}

export class ShipmentService {
  /**
   * Get all shipments with optional filters
   */
  static async getAllShipments(filters?: ShipmentFilters) {
    let query = supabase
      .from("shipments")
      .select("*, customer:profiles(full_name, email)")
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.shipmentType) {
      query = query.eq("shipment_type", filters.shipmentType);
    }

    if (filters?.searchQuery) {
      query = query.or(
        `tracking_number.ilike.%${filters.searchQuery}%,sender_name.ilike.%${filters.searchQuery}%,receiver_name.ilike.%${filters.searchQuery}%`
      );
    }

    if (filters?.dateFrom) {
      query = query.gte("created_at", filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte("created_at", filters.dateTo);
    }

    if (filters?.originCountry) {
      query = query.eq("origin_country", filters.originCountry);
    }

    if (filters?.destinationCountry) {
      query = query.eq("destination_country", filters.destinationCountry);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  /**
   * Get shipment by tracking number
   */
  static async getShipmentByTracking(trackingNumber: string) {
    const { data, error } = await supabase
      .from("shipments")
      .select("*, customer:profiles(full_name, email, phone)")
      .eq("tracking_number", trackingNumber)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get shipment by ID
   */
  static async getShipmentById(id: string) {
    const { data, error } = await supabase
      .from("shipments")
      .select("*, customer:profiles(full_name, email, phone)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create new shipment
   */
  static async createShipment(shipment: ShipmentInsert) {
    const { data, error } = await supabase
      .from("shipments")
      .insert(shipment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update shipment
   */
  static async updateShipment(id: string, updates: ShipmentUpdate) {
    // Get current shipment data
    const { data: currentShipment } = await supabase
      .from("shipments")
      .select("status, tracking_number, receiver_email, customer_id")
      .eq("id", id)
      .single();

    const { data, error } = await supabase
      .from("shipments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Send notification if status changed
    if (updates.status && currentShipment && updates.status !== currentShipment.status) {
      try {
        const { NotificationService } = await import("./notificationService");
        await NotificationService.sendStatusChangeEmail(
          id,
          updates.status,
          currentShipment.receiver_email || "",
          currentShipment.tracking_number
        );
      } catch (notifError) {
        console.error("Notification error:", notifError);
        // Don't fail the update if notification fails
      }
    }

    return data;
  }

  /**
   * Delete shipment
   */
  static async deleteShipment(id: string) {
    const { error } = await supabase.from("shipments").delete().eq("id", id);

    if (error) throw error;
  }

  /**
   * Generate unique tracking number
   */
  static async generateTrackingNumber(): Promise<string> {
    // Call database function to generate tracking number
    const { data, error } = await supabase.rpc("generate_tracking_number");

    if (error) throw error;
    return data;
  }

  /**
   * Get shipment timeline events
   */
  static async getShipmentTimeline(shipmentId: string) {
    const { data, error } = await supabase
      .from("shipment_timeline")
      .select("*")
      .eq("shipment_id", shipmentId)
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  /**
   * Add timeline event
   */
  static async addTimelineEvent(
    shipmentId: string,
    event: {
      event_type: string;
      event_title: string;
      location: string;
      event_description?: string;
      event_timestamp: string;
    }
  ) {
    const { data, error } = await supabase
      .from("shipment_timeline")
      .insert({
        shipment_id: shipmentId,
        event_type: event.event_type,
        event_title: event.event_title,
        location: event.location,
        event_description: event.event_description,
        event_timestamp: event.event_timestamp,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get shipment documents
   */
  static async getShipmentDocuments(shipmentId: string) {
    const { data, error } = await supabase
      .from("shipment_documents")
      .select("*")
      .eq("shipment_id", shipmentId)
      .order("uploaded_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  /**
   * Upload shipment document
   */
  static async uploadDocument(
    shipmentId: string,
    file: File,
    documentType: string
  ) {
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${shipmentId}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("shipment-documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("shipment-documents").getPublicUrl(fileName);

    // Save document record
    const { data, error } = await supabase
      .from("shipment_documents")
      .insert({
        shipment_id: shipmentId,
        document_type: documentType,
        document_name: file.name,
        file_path: publicUrl,
        file_size: file.size,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get shipment notes
   */
  static async getShipmentNotes(shipmentId: string) {
    const { data, error } = await supabase
      .from("shipment_notes")
      .select("*, author:profiles(full_name)")
      .eq("shipment_id", shipmentId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  /**
   * Add shipment note
   */
  static async addShipmentNote(
    shipmentId: string,
    note: string,
    isInternal: boolean = false
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("shipment_notes")
      .insert({
        shipment_id: shipmentId,
        note: note,
        is_internal: isInternal,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const { data: shipments, error } = await supabase
      .from("shipments")
      .select("status, shipping_cost");

    if (error) throw error;

    const stats = {
      total: shipments?.length || 0,
      active: shipments?.filter((s) => ["pending", "processing", "in_transit", "out_for_delivery"].includes(s.status)).length || 0,
      delivered: shipments?.filter((s) => s.status === "delivered").length || 0,
      delayed: shipments?.filter((s) => s.status === "delayed").length || 0,
      cancelled: shipments?.filter((s) => s.status === "cancelled").length || 0,
      onHold: shipments?.filter((s) => s.status === "on_hold").length || 0,
      revenue: shipments?.reduce((sum, s) => sum + (s.shipping_cost || 0), 0) || 0,
    };

    return stats;
  }

  /**
   * Duplicate shipment
   */
  static async duplicateShipment(id: string) {
    const original = await this.getShipmentById(id);
    
    const trackingNumber = await this.generateTrackingNumber();

    const duplicate: ShipmentInsert = {
      tracking_number: trackingNumber,
      customer_id: original.customer_id,
      sender_name: original.sender_name,
      sender_address: original.sender_address,
      sender_phone: original.sender_phone,
      sender_email: original.sender_email,
      receiver_name: original.receiver_name,
      receiver_address: original.receiver_address,
      receiver_phone: original.receiver_phone,
      receiver_email: original.receiver_email,
      package_description: original.package_description,
      package_weight: original.package_weight,
      package_dimensions: original.package_dimensions,
      shipment_type: original.shipment_type,
      shipping_type: original.shipping_type,
      status: "pending",
      origin_city: original.origin_city,
      origin_country: original.origin_country,
      destination_city: original.destination_city,
      destination_country: original.destination_country,
      shipping_cost: original.shipping_cost,
      pickup_address: original.pickup_address,
      pickup_city: original.pickup_city,
      pickup_state: original.pickup_state,
      pickup_zip: original.pickup_zip,
      delivery_address: original.delivery_address,
      delivery_city: original.delivery_city,
      delivery_state: original.delivery_state,
      delivery_zip: original.delivery_zip,
      vehicle_type: original.vehicle_type,
      carrier: original.carrier,
    };

    return await this.createShipment(duplicate);
  }
}