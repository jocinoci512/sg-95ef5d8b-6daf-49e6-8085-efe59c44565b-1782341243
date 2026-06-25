import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lock, ArrowLeft, KeyRound, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Reset link verified",
          description: "Please enter your new password.",
        });
      }
    });
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully reset.",
      });

      router.push("/portal/login");
    } catch (error: any) {
      toast({
        title: "Error",
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
        title="Reset Password"
        description="Create a new password for your Go Cargo Logistics account."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20">
          <div className="container max-w-md">
            <Card className="p-8 border-border">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                <p className="text-muted-foreground">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>

                <Button type="submit" className="w-full font-mono" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <Link href="/portal/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
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