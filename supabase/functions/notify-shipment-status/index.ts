import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { shipmentId, oldStatus, newStatus } = await req.json();

    if (!shipmentId || !newStatus) {
      throw new Error("Missing required fields");
    }

    if (newStatus !== "in_transit" && newStatus !== "delivered") {
      return new Response(
        JSON.stringify({ success: true, message: "Status not monitored for emails" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (oldStatus === newStatus) {
      return new Response(
        JSON.stringify({ success: true, message: "No status change detected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select(`
        tracking_number,
        pickup_address,
        pickup_city,
        pickup_state,
        pickup_zip,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_zip,
        vehicle_type,
        estimated_delivery_date,
        actual_delivery_date,
        profiles:customer_id(full_name, email)
      `)
      .eq("id", shipmentId)
      .single();

    if (shipmentError || !shipment) {
      throw new Error("Shipment not found");
    }

    const customer = shipment.profiles as any;
    if (!customer?.email) {
      throw new Error("Customer email not found");
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Resend API key not configured");
    }

    let emailSubject = "";
    let emailHtml = "";

    if (newStatus === "in_transit") {
      emailSubject = `Your Shipment is In Transit - ${shipment.tracking_number}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #E2E8F0; background-color: #0F172A; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1E293B; padding: 30px; text-align: center; border-bottom: 3px solid #F59E0B; }
            .header h1 { color: #F59E0B; margin: 0; font-family: 'Space Mono', monospace; }
            .content { background-color: #1E293B; padding: 30px; margin-top: 20px; }
            .tracking { background-color: #0F172A; padding: 20px; margin: 20px 0; border-left: 4px solid #F59E0B; }
            .tracking-number { font-family: 'JetBrains Mono', monospace; font-size: 24px; color: #F59E0B; font-weight: bold; }
            .details { margin: 20px 0; }
            .detail-row { margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #334155; }
            .label { color: #94A3B8; font-size: 12px; text-transform: uppercase; }
            .value { color: #E2E8F0; font-size: 16px; margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 12px; }
            .button { display: inline-block; background-color: #F59E0B; color: #0F172A; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 GO CARGO LOGISTICS</h1>
            </div>
            <div class="content">
              <h2 style="color: #F59E0B;">Your Shipment is In Transit</h2>
              <p>Dear ${customer.full_name},</p>
              <p>Good news! Your vehicle shipment is now in transit and on its way to the destination.</p>
              
              <div class="tracking">
                <div class="label">Tracking Number</div>
                <div class="tracking-number">${shipment.tracking_number}</div>
              </div>

              <div class="details">
                <div class="detail-row">
                  <div class="label">Pickup Location</div>
                  <div class="value">${shipment.pickup_address}, ${shipment.pickup_city}, ${shipment.pickup_state} ${shipment.pickup_zip}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Delivery Location</div>
                  <div class="value">${shipment.delivery_address}, ${shipment.delivery_city}, ${shipment.delivery_state} ${shipment.delivery_zip}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Vehicle Type</div>
                  <div class="value" style="text-transform: capitalize;">${shipment.vehicle_type}</div>
                </div>
                ${shipment.estimated_delivery_date ? `
                <div class="detail-row">
                  <div class="label">Estimated Delivery</div>
                  <div class="value">${new Date(shipment.estimated_delivery_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                ` : ''}
              </div>

              <p><strong>Track Your Shipment:</strong></p>
              <p>You can track your shipment in real-time using your tracking number at our website or through your customer portal.</p>

              <a href="${Deno.env.get("SITE_URL") || "https://gocargologistics.com"}/track?number=${shipment.tracking_number}" class="button">Track Shipment</a>

              <p style="margin-top: 30px;">If you have any questions or concerns, please don't hesitate to contact our support team.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Go Cargo Logistics. All rights reserved.</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (newStatus === "delivered") {
      const deliveryDate = shipment.actual_delivery_date || new Date().toISOString();
      emailSubject = `Your Shipment Has Been Delivered - ${shipment.tracking_number}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #E2E8F0; background-color: #0F172A; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1E293B; padding: 30px; text-align: center; border-bottom: 3px solid #10B981; }
            .header h1 { color: #10B981; margin: 0; font-family: 'Space Mono', monospace; }
            .content { background-color: #1E293B; padding: 30px; margin-top: 20px; }
            .success-badge { background-color: #10B981; color: #0F172A; padding: 15px 30px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; border-radius: 4px; }
            .tracking { background-color: #0F172A; padding: 20px; margin: 20px 0; border-left: 4px solid #10B981; }
            .tracking-number { font-family: 'JetBrains Mono', monospace; font-size: 24px; color: #10B981; font-weight: bold; }
            .details { margin: 20px 0; }
            .detail-row { margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #334155; }
            .label { color: #94A3B8; font-size: 12px; text-transform: uppercase; }
            .value { color: #E2E8F0; font-size: 16px; margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 12px; }
            .support { background-color: #0F172A; padding: 20px; margin-top: 20px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 GO CARGO LOGISTICS</h1>
            </div>
            <div class="content">
              <div class="success-badge">✓ DELIVERY CONFIRMED</div>
              
              <p>Dear ${customer.full_name},</p>
              <p>Great news! Your vehicle shipment has been successfully delivered.</p>
              
              <div class="tracking">
                <div class="label">Tracking Number</div>
                <div class="tracking-number">${shipment.tracking_number}</div>
              </div>

              <div class="details">
                <div class="detail-row">
                  <div class="label">Delivery Date</div>
                  <div class="value">${new Date(deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Delivered To</div>
                  <div class="value">${shipment.delivery_address}, ${shipment.delivery_city}, ${shipment.delivery_state} ${shipment.delivery_zip}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Vehicle Type</div>
                  <div class="value" style="text-transform: capitalize;">${shipment.vehicle_type}</div>
                </div>
                <div class="detail-row">
                  <div class="label">From</div>
                  <div class="value">${shipment.pickup_address}, ${shipment.pickup_city}, ${shipment.pickup_state} ${shipment.pickup_zip}</div>
                </div>
              </div>

              <div class="support">
                <h3 style="color: #F59E0B; margin-top: 0;">Customer Support</h3>
                <p>Thank you for choosing Go Cargo Logistics. We hope you had a great experience with our service.</p>
                <p>If you have any questions or feedback about your delivery, please contact us:</p>
                <p>
                  📧 Email: support@gocargologistics.com<br>
                  📞 Phone: 1-800-GO-CARGO<br>
                  🕐 Hours: Monday-Friday 8AM-8PM EST
                </p>
              </div>

              <p style="margin-top: 30px;">We appreciate your business and look forward to serving you again!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Go Cargo Logistics. All rights reserved.</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Go Cargo Logistics <notifications@gocargologistics.com>",
        to: [customer.email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const emailResult = await emailResponse.json();

    console.log("Email sent successfully:", {
      shipmentId,
      status: newStatus,
      customer: customer.email,
      emailId: emailResult.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email notification sent",
        emailId: emailResult.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error sending email notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});