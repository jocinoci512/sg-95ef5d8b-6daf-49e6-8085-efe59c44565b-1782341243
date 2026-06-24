import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import type { GetServerSideProps } from "next";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, HeadphonesIcon } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Error sending message",
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
        title="Contact Go Cargo Logistics - 24/7 Customer Support"
        description="Get in touch with our logistics experts. 24/7 support for quotes, tracking, and shipping inquiries."
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "url('/support-representative.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="container mx-auto px-4 relative z-10 py-20 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Our Team
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Available 24/7 to answer your questions and provide expert logistics support
              </p>
            </div>
          </section>

          {/* Support Features */}
          <section className="py-16 bg-card/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">24/7 Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock support for urgent shipping needs
                  </p>
                </div>
                <div className="text-center">
                  <HeadphonesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Expert Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Experienced logistics professionals ready to help
                  </p>
                </div>
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Average response time under 2 hours
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div>
                  <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
                  
                  <div className="space-y-6 mb-8">
                    <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-bold mb-2">Phone Support</h3>
                          <p className="text-muted-foreground mb-2">Available 24/7</p>
                          <a href="tel:+1-800-555-0123" className="text-primary hover:underline font-mono">
                            +1 (800) 555-0123
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-bold mb-2">Email Support</h3>
                          <p className="text-muted-foreground mb-2">Response within 24 hours</p>
                          <a href="mailto:info@gocargologistics.com" className="text-primary hover:underline">
                            info@gocargologistics.com
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-bold mb-2">Headquarters</h3>
                          <p className="text-muted-foreground">
                            123 Logistics Drive<br />
                            Commerce City, CA 90001<br />
                            United States
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-bold mb-2">Business Hours</h3>
                          <p className="text-muted-foreground">
                            Operations: 24/7<br />
                            Office: Monday - Friday, 8 AM - 6 PM PST<br />
                            Weekend Support: Saturday - Sunday, 9 AM - 5 PM PST
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div>
                    <img
                      src="/customer-service.jpg"
                      alt="Customer support team"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <Card className="p-8 border-border">
                    <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={6}
                          className="bg-background"
                        />
                      </div>

                      <Button type="submit" size="lg" disabled={loading} className="w-full font-mono">
                        {loading ? "Sending..." : "Send Message"}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Card>
                </div>
              </div>
            </div>
          </section>
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