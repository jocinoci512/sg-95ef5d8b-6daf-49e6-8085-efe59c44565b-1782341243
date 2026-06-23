import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatsDisplay } from "@/components/StatsDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import {
  Target,
  Eye,
  Shield,
  Users,
  Award,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function About() {
  return (
    <>
      <SEO
        title="About Go Cargo Logistics"
        description="Leading vehicle transportation company with 25+ years of experience. Professional logistics solutions with nationwide coverage and operational excellence."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <section className="py-20 border-b border-border">
            <div className="container">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  About Go Cargo Logistics
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Leading vehicle transportation and logistics provider with over 25 years 
                  of operational excellence. We combine advanced tracking technology with 
                  professional service to deliver reliable solutions nationwide.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container">
              <StatsDisplay />
            </div>
          </section>

          <section className="py-20 bg-card/30">
            <div className="container">
              <div className="grid md:grid-cols-2 gap-12">
                <Card className="p-8 border-border">
                  <div className="w-16 h-16 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide professional vehicle transportation services that exceed 
                    customer expectations through operational precision, transparent 
                    communication, and unwavering commitment to safety and reliability. 
                    We leverage technology and expertise to make vehicle shipping simple, 
                    secure, and stress-free.
                  </p>
                </Card>

                <Card className="p-8 border-border">
                  <div className="w-16 h-16 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the most trusted name in vehicle logistics, recognized for 
                    innovation, reliability, and customer-centric solutions. We strive 
                    to set industry standards through continuous improvement, advanced 
                    technology integration, and a culture of excellence that benefits 
                    every customer we serve.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Industry-leading capabilities that set us apart
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {values.map((value) => (
                  <Card key={value.title} className="p-6 border-border hover:border-primary/50 transition-colors">
                    <value.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-mono font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-card/30">
            <div className="container">
              <Card className="p-12 border-primary/20 bg-card/50 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Work With Us?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Experience the difference of working with a trusted logistics partner. 
                  Get your free quote today.
                </p>
                <Link href="/quote">
                  <Button size="lg" className="font-mono">
                    Get Free Quote
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

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Comprehensive insurance coverage, certified carriers, and rigorous safety protocols on every shipment.",
  },
  {
    icon: TrendingUp,
    title: "Proven Track Record",
    description: "98% on-time delivery rate with over 50,000 successful vehicle shipments nationwide.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Dedicated support team available 24/7 to address your questions and concerns.",
  },
  {
    icon: Award,
    title: "Industry Expertise",
    description: "25+ years of logistics experience with specialized knowledge across all vehicle types.",
  },
  {
    icon: Target,
    title: "Transparent Pricing",
    description: "Clear, upfront quotes with no hidden fees. What you see is what you pay.",
  },
  {
    icon: TrendingUp,
    title: "Technology Driven",
    description: "Advanced tracking systems, real-time updates, and modern logistics platform.",
  },
];