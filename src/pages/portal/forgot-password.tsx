import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/portal/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      });
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
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-20">
          <div className="container max-w-md">
            <Link href="/portal/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>

            <Card className="p-8 border-border">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
                <p className="text-muted-foreground">
                  {submitted
                    ? "We've sent you a password reset link"
                    : "Enter your email to receive a password reset link"}
                </p>
              </div>

              {submitted ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-sm">
                    <p className="text-sm">
                      Check your email <strong className="font-mono">{email}</strong> for a password reset link. 
                      The link will expire in 1 hour.
                    </p>
                  </div>
                  <Link href="/portal/login">
                    <Button className="w-full font-mono">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>

                  <Button type="submit" className="w-full font-mono" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              )}
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