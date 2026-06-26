// API Route for sending email notifications
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      to,
      subject,
      trackingNumber,
      status,
      statusTitle,
      statusMessage,
      pickupAddress,
      deliveryAddress,
      estimatedDelivery,
    } = req.body;

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0F172A; color: white; padding: 30px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; }
            .status-badge { display: inline-block; padding: 8px 16px; background: #F59E0B; color: white; border-radius: 4px; font-weight: 600; text-transform: uppercase; font-size: 12px; }
            .tracking-number { font-family: monospace; font-size: 20px; font-weight: bold; color: #F59E0B; }
            .info-row { margin: 15px 0; padding: 15px; background: #f8fafc; border-left: 3px solid #F59E0B; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
            .button { display: inline-block; padding: 12px 24px; background: #F59E0B; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">GO CARGO LOGISTICS</h1>
            </div>
            
            <div class="content">
              <div class="status-badge">${status.replace(/_/g, " ")}</div>
              
              <h2 style="color: #0F172A; margin-top: 20px;">${statusTitle}</h2>
              <p style="font-size: 16px; color: #475569;">${statusMessage}</p>
              
              <div class="info-row">
                <strong>Tracking Number:</strong><br/>
                <span class="tracking-number">${trackingNumber}</span>
              </div>
              
              <div class="info-row">
                <strong>Pickup Location:</strong><br/>
                ${pickupAddress}
              </div>
              
              <div class="info-row">
                <strong>Delivery Location:</strong><br/>
                ${deliveryAddress}
              </div>
              
              ${
                estimatedDelivery
                  ? `<div class="info-row">
                <strong>Estimated Delivery:</strong><br/>
                ${new Date(estimatedDelivery).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>`
                  : ""
              }
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://gocargologistics.com"}/track?tracking=${trackingNumber}" class="button">
                Track Your Shipment
              </a>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing GO CARGO LOGISTICS</p>
              <p>For support, contact us at info@gocargologistics.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll log the email and return success
    console.log("Email Notification:", {
      to,
      subject,
      trackingNumber,
      status,
    });

    // TODO: Integrate with actual email service
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from: 'noreply@gocargologistics.com', subject, html: emailHtml });

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error: any) {
    console.error("Send notification error:", error);
    return res.status(500).json({
      error: "Failed to send notification",
      details: error.message,
    });
  }
}