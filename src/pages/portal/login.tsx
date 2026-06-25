import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await authService.signIn({
        email: formData.email,
        password: formData.password,
      });

      const profile = await authService.getProfile(user.id);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      if (profile.role === "admin" || profile.role === "super_admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/portal/dashboard");
      }
    } catch (error: any) {
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Customer Login"
        description="Sign in to your Go Cargo Logistics account to track shipments and manage your profile."
      />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-20">
          <div className="container max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <Card className="p-8 border-border">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
                  <LogIn className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">
                  Sign in to access your customer portal
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/portal/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <Button type="submit" className="w-full font-mono" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/portal/signup" className="text-primary hover:underline font-medium">
                    Create Account
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};