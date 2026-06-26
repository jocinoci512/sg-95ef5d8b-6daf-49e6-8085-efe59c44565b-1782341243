// Notification Service for Email Alerts
import { supabase } from "@/integrations/supabase/client";

export class NotificationService {
  /**
   * Send email notification when shipment status changes
   */
  static async sendStatusChangeEmail(
    shipmentId: string,
    newStatus: string,
    recipientEmail: string,
    trackingNumber: string
  ): Promise<void> {
    try {
      // Get shipment details
      const { data: shipment } = await supabase
        .from("shipments")
        .select("*")
        .eq("id", shipmentId)
        .single();

      if (!shipment) return;

      const statusMessages: Record<string, { title: string; message: string }> = {
        pending_pickup: {
          title: "Shipment Created",
          message: "Your shipment has been created and is awaiting pickup.",
        },
        picked_up: {
          title: "Shipment Picked Up",
          message: "Your shipment has been picked up and is being processed.",
        },
        in_transit: {
          title: "Shipment In Transit",
          message: "Your shipment is on its way to the destination.",
        },
        at_hub: {
          title: "Shipment at Distribution Hub",
          message: "Your shipment has arrived at our distribution facility.",
        },
        customs_clearance: {
          title: "Customs Clearance",
          message: "Your shipment is going through customs clearance.",
        },
        out_for_delivery: {
          title: "Out for Delivery",
          message: "Your shipment is out for delivery and will arrive soon!",
        },
        delivered: {
          title: "Shipment Delivered",
          message: "Your shipment has been successfully delivered.",
        },
        on_hold: {
          title: "Shipment On Hold",
          message: "Your shipment has been temporarily placed on hold.",
        },
        delayed: {
          title: "Shipment Delayed",
          message: "Your shipment has been delayed. We apologize for the inconvenience.",
        },
        cancelled: {
          title: "Shipment Cancelled",
          message: "Your shipment has been cancelled.",
        },
      };

      const statusInfo = statusMessages[newStatus] || {
        title: "Shipment Status Update",
        message: `Your shipment status has been updated to: ${newStatus.replace(/_/g, " ")}`,
      };

      // Create in-app notification
      await supabase.from("notifications").insert({
        user_id: shipment.customer_id,
        shipment_id: shipmentId,
        title: statusInfo.title,
        message: `${statusInfo.message} (Tracking: ${trackingNumber})`,
        notification_type: "status_update",
      });

      // Send email via Edge Function (if available)
      if (recipientEmail) {
        try {
          await fetch("/api/send-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: recipientEmail,
              subject: `${statusInfo.title} - ${trackingNumber}`,
              trackingNumber,
              status: newStatus,
              statusTitle: statusInfo.title,
              statusMessage: statusInfo.message,
              pickupAddress: shipment.pickup_address,
              deliveryAddress: shipment.delivery_address,
              estimatedDelivery: shipment.estimated_delivery_date,
            }),
          });
        } catch (emailError) {
          console.error("Email send error:", emailError);
          // Don't throw - in-app notification was created successfully
        }
      }
    } catch (error) {
      console.error("Notification error:", error);
      throw error;
    }
  }

  /**
   * Create in-app notification
   */
  static async createNotification(
    userId: string,
    shipmentId: string,
    title: string,
    message: string,
    type: string = "info"
  ): Promise<void> {
    try {
      await supabase.from("notifications").insert({
        user_id: userId,
        shipment_id: shipmentId,
        title,
        message,
        notification_type: type,
      });
    } catch (error) {
      console.error("Create notification error:", error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(userId: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Get notifications error:", error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  }
}