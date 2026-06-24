import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { GetServerSideProps } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, ArrowLeft } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      });

      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
      });

      router.push("/portal/login");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Customer Signup"
        description="Create your Go Cargo Logistics customer account to track shipments and manage your transportation needs."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20">
          <div className="container max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <Card className="p-8 border-border">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-muted-foreground">
                  Sign up to track your shipments and manage your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <Button type="submit" className="w-full font-mono" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/portal/login" className="text-primary hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};