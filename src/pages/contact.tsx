import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        status: "new",
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 24 hours.",
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
        title="Contact Us - Go Cargo Logistics"
        description="Get in touch with Go Cargo Logistics. Phone, email, or visit our office. We're here to help with all your vehicle transportation needs."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions? We're here to help. Reach out through any of the channels below.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 border-border text-center">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-mono font-bold mb-2">Phone</h3>
                <p className="text-muted-foreground mb-2">(555) 123-4567</p>
                <p className="text-sm text-muted-foreground">Mon-Fri 8am-6pm EST</p>
              </Card>

              <Card className="p-6 border-border text-center">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-mono font-bold mb-2">Email</h3>
                <p className="text-muted-foreground mb-2">contact@gocargo.com</p>
                <p className="text-sm text-muted-foreground">24-hour response time</p>
              </Card>

              <Card className="p-6 border-border text-center">
                <div className="w-12 h-12 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-mono font-bold mb-2">Office</h3>
                <p className="text-muted-foreground mb-2">123 Logistics Avenue</p>
                <p className="text-sm text-muted-foreground">Transport City, TC 12345</p>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="p-8 border-border">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                {submitted && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-sm flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Message sent successfully!</p>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
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
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
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
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Card>

              <div className="space-y-6">
                <Card className="p-8 border-border">
                  <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
                  <div className="space-y-4">
                    {businessHours.map((item) => (
                      <div key={item.days} className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-mono font-bold">{item.days}</p>
                          <p className="text-sm text-muted-foreground">{item.hours}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8 border-border">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-mono font-bold mb-2">How long does shipping take?</h3>
                      <p className="text-sm text-muted-foreground">
                        Transit times vary by distance, typically 3-7 business days for cross-country shipments.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-mono font-bold mb-2">Do you offer insurance?</h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, all shipments include comprehensive cargo insurance coverage.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-mono font-bold mb-2">Can I track my shipment?</h3>
                      <p className="text-sm text-muted-foreground">
                        Absolutely! You'll receive a tracking number with real-time GPS updates.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

const businessHours = [
  { days: "Monday - Friday", hours: "8:00 AM - 6:00 PM EST" },
  { days: "Saturday", hours: "9:00 AM - 3:00 PM EST" },
  { days: "Sunday", hours: "Closed" },
];