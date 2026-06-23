import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import {
  Truck,
  Shield,
  Bike,
  Plane,
  Globe,
  Building2,
  Package,
  Container,
  CheckCircle2,
  ArrowRight,
  Search
} from "lucide-react";

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <SEO
        title="Vehicle Transportation Services"
        description="Comprehensive vehicle shipping solutions including auto transport, enclosed carriers, motorcycle shipping, heavy equipment, and international logistics."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <section className="py-20 border-b border-border">
            <div className="container">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Transportation Services
                </h1>
                <p className="text-xl text-muted-foreground">
                  Professional vehicle logistics solutions tailored to your specific needs. 
                  From standard auto transport to specialized heavy equipment hauling.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container">
              <div className="mb-8 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              {filteredServices.length === 0 ? (
                <Card className="p-12 text-center border-border">
                  <p className="text-muted-foreground">
                    No services match your search. Try different keywords.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-12">
                  {filteredServices.map((service, index) => (
                    <Card key={service.title} className="p-8 border-border hover:border-primary/50 transition-colors">
                      <div className="grid md:grid-cols-[auto,1fr] gap-8">
                        <div className="flex items-start">
                          <div className="w-16 h-16 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
                            <service.icon className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                          <p className="text-muted-foreground mb-6 leading-relaxed">
                            {service.description}
                          </p>
                          
                          <div className="mb-6">
                            <h3 className="font-mono font-bold mb-3">Key Features</h3>
                            <ul className="grid md:grid-cols-2 gap-3">
                              {service.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Link href="/quote">
                            <Button className="font-mono">
                              Get Quote
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="py-20 bg-card/30">
            <div className="container">
              <Card className="p-12 border-primary/20 bg-card/50 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Custom Solution?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Have unique transportation requirements? Our logistics team can design 
                  a custom solution for your specific needs.
                </p>
                <Link href="/contact">
                  <Button size="lg" className="font-mono">
                    Contact Our Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
    description: "Professional door-to-door vehicle shipping for cars, trucks, and SUVs. Our nationwide network ensures reliable pickup and delivery across all 50 states.",
    features: [
      "Door-to-door service available",
      "Flexible scheduling options",
      "Multiple vehicle discounts",
      "Fully insured transport",
      "Real-time GPS tracking",
      "Professional drivers only",
    ],
  },
  {
    icon: Package,
    title: "Open Carrier Transport",
    description: "Cost-effective vehicle shipping on open carriers. Perfect for standard vehicles and the most economical option for long-distance transport.",
    features: [
      "Most affordable option",
      "Quick pickup times",
      "Nationwide availability",
      "Multi-car haulers",
      "Weather-resistant tarps",
      "Experienced carriers",
    ],
  },
  {
    icon: Shield,
    title: "Enclosed Carrier Transport",
    description: "Premium protection for luxury, classic, and high-value vehicles. Fully enclosed trailers shield your vehicle from weather and road debris.",
    features: [
      "Complete weather protection",
      "Enhanced security measures",
      "Climate-controlled options",
      "Single or multi-car enclosed",
      "White-glove service available",
      "Additional insurance coverage",
    ],
  },
  {
    icon: Bike,
    title: "Motorcycle Shipping",
    description: "Specialized motorcycle transport with custom cradles and soft-tie systems. Safe handling for cruisers, sport bikes, and touring motorcycles.",
    features: [
      "Custom motorcycle cradles",
      "Soft-tie securing systems",
      "Crate shipping available",
      "Door-to-door delivery",
      "Multiple bike discounts",
      "Enclosed options available",
    ],
  },
  {
    icon: Container,
    title: "Heavy Equipment Transport",
    description: "Specialized hauling for construction equipment, farm machinery, and industrial vehicles. Permitted and oversized load expertise.",
    features: [
      "Heavy haul specialists",
      "Oversized load permits",
      "Lowboy and RGN trailers",
      "Site-to-site delivery",
      "Project logistics support",
      "Equipment inspection reports",
    ],
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Cross-border vehicle transportation to Canada, Mexico, and overseas destinations. Full documentation and customs support.",
    features: [
      "Canada and Mexico service",
      "Overseas container shipping",
      "Customs documentation",
      "Port-to-port delivery",
      "Export compliance support",
      "International insurance",
    ],
  },
  {
    icon: Plane,
    title: "Expedited Shipping",
    description: "Priority vehicle transport for time-sensitive deliveries. Dedicated trucks and accelerated timelines when you need it fast.",
    features: [
      "Guaranteed pickup dates",
      "Priority routing",
      "Dedicated transport",
      "Reduced transit times",
      "24/7 dispatch support",
      "Premium tracking updates",
    ],
  },
  {
    icon: Building2,
    title: "Fleet & Dealer Transport",
    description: "Bulk vehicle shipping solutions for dealerships, rental companies, and fleet managers. Volume discounts and dedicated account management.",
    features: [
      "Volume pricing discounts",
      "Dedicated account manager",
      "Scheduled regular routes",
      "Auction transport services",
      "Dealer-to-dealer shipping",
      "Custom reporting dashboards",
    ],
  },
];