import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  created_at: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { quoteId } = await req.json();

    if (!quoteId) {
      throw new Error("Quote ID is required");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: quote, error: quoteError } = await supabaseClient
      .from("quote_requests")
      .select("*")
      .eq("id", quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error("Quote not found");
    }

    const quoteData = quote as QuoteRequest;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@gocargologistics.com";

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email service not configured" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0F172A; color: #F59E0B; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 6px; border-left: 4px solid #F59E0B; }
            .label { font-weight: 600; color: #0F172A; margin-bottom: 5px; }
            .value { color: #555; margin-bottom: 15px; }
            .footer { text-align: center; margin-top: 30px; color: #888; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🚚 New Quote Request</h1>
              <p style="margin: 5px 0 0 0; color: #E2E8F0;">Go Cargo Logistics</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 style="margin-top: 0; color: #0F172A;">Customer Information</h2>
                <div class="label">Name:</div>
                <div class="value">${quoteData.customer_name}</div>
                
                <div class="label">Email:</div>
                <div class="value">${quoteData.customer_email}</div>
                
                <div class="label">Phone:</div>
                <div class="value">${quoteData.customer_phone}</div>
              </div>

              <div class="section">
                <h2 style="margin-top: 0; color: #0F172A;">Pickup Location</h2>
                <div class="value">
                  ${quoteData.pickup_address}<br>
                  ${quoteData.pickup_city}, ${quoteData.pickup_state} ${quoteData.pickup_zip}
                </div>
              </div>

              <div class="section">
                <h2 style="margin-top: 0; color: #0F172A;">Delivery Location</h2>
                <div class="value">
                  ${quoteData.delivery_address}<br>
                  ${quoteData.delivery_city}, ${quoteData.delivery_state} ${quoteData.delivery_zip}
                </div>
              </div>

              <div class="section">
                <h2 style="margin-top: 0; color: #0F172A;">Vehicle Information</h2>
                <div class="label">Type:</div>
                <div class="value">${quoteData.vehicle_type}</div>
                
                <div class="label">Make:</div>
                <div class="value">${quoteData.vehicle_make}</div>
                
                <div class="label">Model:</div>
                <div class="value">${quoteData.vehicle_model}</div>
                
                <div class="label">Year:</div>
                <div class="value">${quoteData.vehicle_year}</div>
              </div>

              <div class="section">
                <h2 style="margin-top: 0; color: #0F172A;">Shipping Details</h2>
                <div class="label">Shipping Type:</div>
                <div class="value">${quoteData.shipping_type}</div>
                
                ${quoteData.additional_notes ? `
                  <div class="label">Additional Notes:</div>
                  <div class="value">${quoteData.additional_notes}</div>
                ` : ''}
              </div>

              <div class="section">
                <div class="label">Submitted:</div>
                <div class="value">${new Date(quoteData.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated notification from Go Cargo Logistics.</p>
              <p>Quote ID: ${quoteData.id}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Go Cargo Logistics <notifications@gocargologistics.com>",
        to: [ADMIN_EMAIL],
        subject: `New Quote Request from ${quoteData.customer_name}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email send failed:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        emailId: emailData.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-quote-notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});