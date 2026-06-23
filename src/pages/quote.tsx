import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function Quote() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    deliveryLocation: "",
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    shippingType: "",
    additionalNotes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("quote_requests").insert({
        customer_name: formData.customerName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        pickup_location: formData.pickupLocation,
        delivery_location: formData.deliveryLocation,
        vehicle_type: formData.vehicleType,
        vehicle_make: formData.vehicleMake,
        vehicle_model: formData.vehicleModel,
        vehicle_year: formData.vehicleYear,
        shipping_type: formData.shippingType,
        additional_notes: formData.additionalNotes,
        status: "pending",
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Quote request submitted",
        description: "We'll contact you within 24 hours with a detailed quote.",
      });
    } catch (error: any) {
      toast({
        title: "Error submitting quote",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEO title="Quote Submitted - Thank You" />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-20">
            <Card className="max-w-2xl mx-auto p-12 text-center border-primary/20">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Quote Request Received</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your quote request. Our team will review your information 
                and contact you within 24 hours with a detailed quote and shipping options.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Submit Another Quote
                </Button>
                <Button onClick={() => window.location.href = "/"}>
                  Return Home
                </Button>
              </div>
            </Card>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Get Free Quote - Vehicle Transportation"
        description="Request a free, no-obligation quote for vehicle shipping. Fast response, transparent pricing, professional service."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20">
          <div className="container max-w-4xl">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Request Free Quote</h1>
              <p className="text-xl text-muted-foreground">
                Fill out the form below for an accurate quote. We'll respond within 24 hours 
                with competitive pricing and shipping options.
              </p>
            </div>

            <Card className="p-8 border-border">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
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
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-bold mb-6">Route Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location *</Label>
                      <Input
                        id="pickupLocation"
                        name="pickupLocation"
                        placeholder="City, State or ZIP"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryLocation">Delivery Location *</Label>
                      <Input
                        id="deliveryLocation"
                        name="deliveryLocation"
                        placeholder="City, State or ZIP"
                        value={formData.deliveryLocation}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-bold mb-6">Vehicle Details</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type *</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value) => handleSelectChange("vehicleType", value)}
                        required
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="luxury">Luxury Car</SelectItem>
                          <SelectItem value="classic">Classic Car</SelectItem>
                          <SelectItem value="heavy">Heavy Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vehicleYear">Year *</Label>
                      <Input
                        id="vehicleYear"
                        name="vehicleYear"
                        placeholder="e.g., 2020"
                        value={formData.vehicleYear}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Make *</Label>
                      <Input
                        id="vehicleMake"
                        name="vehicleMake"
                        placeholder="e.g., Toyota"
                        value={formData.vehicleMake}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vehicleModel">Model *</Label>
                      <Input
                        id="vehicleModel"
                        name="vehicleModel"
                        placeholder="e.g., Camry"
                        value={formData.vehicleModel}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-bold mb-6">Shipping Preferences</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="shippingType">Shipping Type *</Label>
                      <Select
                        value={formData.shippingType}
                        onValueChange={(value) => handleSelectChange("shippingType", value)}
                        required
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select shipping type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open Carrier (Standard)</SelectItem>
                          <SelectItem value="enclosed">Enclosed Carrier (Premium)</SelectItem>
                          <SelectItem value="expedited">Expedited Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        placeholder="Any special requirements or questions..."
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows={4}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <Button type="submit" size="lg" className="w-full md:w-auto font-mono" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Get Free Quote"
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    By submitting this form, you agree to be contacted regarding your quote request.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}