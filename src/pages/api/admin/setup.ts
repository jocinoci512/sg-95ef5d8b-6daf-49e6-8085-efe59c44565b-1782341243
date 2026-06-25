// API endpoint to create admin account
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // This endpoint is for initial setup only
    // In production, this should be protected or removed after setup
    const { email, password } = req.body;

    if (email !== "info@gocargologistics.com") {
      return res.status(403).json({ error: "Invalid setup request" });
    }

    // Create admin user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Admin account created successfully",
      userId: data.user?.id 
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}