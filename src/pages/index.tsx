import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrackingForm } from "@/components/TrackingForm";
import { StatsDisplay } from "@/components/StatsDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { 
  Truck, 
  Shield, 
  Clock, 
  DollarSign, 
  MapPin, 
  Package, 
  Plane,
  Star,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  return (
    <>
      <SEO
        title="Enterprise Vehicle Transportation & Logistics"
        description="Professional nationwide vehicle shipping and logistics solutions. Real-time tracking, secure transport, competitive rates."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background pointer-events-none" />
            <div className="container relative">
              <div className="max-w-3xl">
                <Badge className="mb-6 font-mono">OPERATIONAL EXCELLENCE</Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  Enterprise Vehicle Transportation
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Professional logistics platform with real-time tracking, nationwide coverage, 
                  and operational precision. Your vehicles, our command center.
                </p>
                <div className="mb-12">
                  <TrackingForm />
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/quote">
                    <Button size="lg" className="font-mono">
                      Request Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="font-mono">
                      View Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-card/30">
            <div className="container">
              <StatsDisplay />
            </div>
          </section>

          <section className="py-20">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Go Cargo</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Professional logistics infrastructure built for reliability and transparency
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-mono font-bold mb-2">Fully Insured</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete cargo insurance coverage on every shipment
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-mono font-bold mb-2">Real-Time Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Live shipment updates from pickup to delivery
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                  <DollarSign className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-mono font-bold mb-2">Competitive Rates</h3>
                  <p className="text-sm text-muted-foreground">
                    Transparent pricing with no hidden fees
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                  <MapPin className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-mono font-bold mb-2">Nationwide Network</h3>
                  <p className="text-sm text-muted-foreground">
                    Coverage across all 50 states and territories
                  </p>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-20 bg-card/30">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive vehicle transportation solutions for every need
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                  <Card key={service.title} className="p-6 border-border hover:border-primary/50 transition-all group">
                    <service.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-mono font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <Link href="/services" className="text-sm text-primary hover:text-accent font-medium inline-flex items-center">
                      Learn More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Testimonials</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Trusted by thousands of customers nationwide
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.name} className="p-6 border-border">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      "{testimonial.review}"
                    </p>
                    <div className="font-mono font-bold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-card/30">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Simple process from quote to delivery
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {steps.map((step, index) => (
                  <div key={step.title} className="text-center">
                    <div className="w-16 h-16 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                      <span className="font-mono text-2xl font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-mono font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container">
              <Card className="p-12 border-primary/20 bg-card/50 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ship?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Get an instant quote for your vehicle transportation needs. 
                  Professional service, competitive rates, nationwide coverage.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/quote">
                    <Button size="lg" className="font-mono">
                      Get Free Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="font-mono">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

const services = [
  {
    icon: Truck,
    title: "Auto Transport",
    description: "Door-to-door vehicle shipping for cars, trucks, and SUVs",
  },
  {
    icon: Package,
    title: "Open Carrier",
    description: "Cost-effective transport on open carriers",
  },
  {
    icon: Shield,
    title: "Enclosed Carrier",
    description: "Premium protection for luxury and classic vehicles",
  },
  {
    icon: Plane,
    title: "Expedited Shipping",
    description: "Priority delivery for time-sensitive shipments",
  },
  {
    icon: Truck,
    title: "Motorcycle Shipping",
    description: "Specialized transport for motorcycles and bikes",
  },
  {
    icon: Package,
    title: "Heavy Equipment",
    description: "Transport for construction and farm equipment",
  },
  {
    icon: MapPin,
    title: "International",
    description: "Cross-border shipping to Canada and Mexico",
  },
  {
    icon: Truck,
    title: "Fleet Transport",
    description: "Bulk shipping for dealerships and companies",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "Austin, TX",
    rating: 5,
    review: "Exceptional service from start to finish. My vehicle arrived on time and in perfect condition. The tracking system kept me informed every step of the way.",
  },
  {
    name: "Michael Chen",
    location: "Seattle, WA",
    rating: 5,
    review: "Professional team, competitive pricing, and zero hassle. They handled my classic car with care and expertise. Highly recommended.",
  },
  {
    name: "Jessica Rodriguez",
    location: "Miami, FL",
    rating: 5,
    review: "Used Go Cargo for a cross-country move. The entire process was seamless, and the customer support team was incredibly responsive.",
  },
];

const steps = [
  {
    title: "Request Quote",
    description: "Fill out our simple form with vehicle and route details",
  },
  {
    title: "Book Service",
    description: "Review pricing and confirm your shipment",
  },
  {
    title: "Track Shipment",
    description: "Monitor real-time location and status updates",
  },
  {
    title: "Receive Vehicle",
    description: "Inspect and sign for your vehicle at delivery",
  },
];