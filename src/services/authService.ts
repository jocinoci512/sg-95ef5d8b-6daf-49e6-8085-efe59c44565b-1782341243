import { supabase } from "@/integrations/supabase/client";

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      full_name: data.fullName,
      phone: data.phone || null,
      address: data.address || null,
      role: "customer",
      account_status: "active",
    });

    if (profileError) throw profileError;

    return authData;
  },

  async signIn(data: SignInData) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return authData;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<{
    full_name: string;
    phone: string;
    address: string;
  }>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  async isAdmin() {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const profile = await this.getProfile(user.id);
    return profile.role === "admin" || profile.role === "super_admin";
  },
};