import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { TrackingForm } from "@/components/TrackingForm";
import { StatsDisplay } from "@/components/StatsDisplay";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Truck,
  Ship,
  Plane,
  Shield,
  Clock,
  Globe,
  CheckCircle2,
  Star,
  Award,
  Users,
  Package,
  TrendingUp,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title="Go Cargo Logistics - International Vehicle & Freight Shipping"
        description="Professional logistics and transportation services for vehicles, freight, and heavy equipment. Secure, reliable shipping solutions nationwide and worldwide."
        image="/og-image.png"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card z-0" />
            <div
              className="absolute inset-0 opacity-20 z-0"
              style={{
                backgroundImage: "url('/hero-car-carrier.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="container mx-auto px-4 relative z-10 py-20">
              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                  {t("hero.title")}
                  <span className="block text-primary mt-2">{t("hero.subtitle")}</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {t("hero.description")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/quote">
                    <Button size="lg" className="font-mono text-lg">
                      {t("hero.getQuote")}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/track">
                    <Button size="lg" variant="outline" className="font-mono text-lg">
                      {t("hero.trackShipment")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Badges */}
          <section className="py-12 bg-card/50 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <p className="text-sm font-medium">{t("trust.licensed")}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                  <p className="text-sm font-medium">{t("trust.verified")}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <Globe className="h-10 w-10 text-accent mb-2" />
                  <p className="text-sm font-medium">{t("trust.worldwide")}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <Clock className="h-10 w-10 text-primary mb-2" />
                  <p className="text-sm font-medium">{t("trust.support")}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <Award className="h-10 w-10 text-amber-500 mb-2" />
                  <p className="text-sm font-medium">{t("trust.excellence")}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <Star className="h-10 w-10 text-primary mb-2" />
                  <p className="text-sm font-medium">{t("trust.service")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Company Statistics */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t("stats.title")}</h2>
                <p className="text-muted-foreground text-lg">
                  {t("stats.subtitle")}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="p-8 text-center border-border">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">25+</div>
                  <p className="text-muted-foreground">{t("stats.years")}</p>
                </Card>
                <Card className="p-8 text-center border-border">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">500K+</div>
                  <p className="text-muted-foreground">{t("stats.shipments")}</p>
                </Card>
                <Card className="p-8 text-center border-border">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">98.7%</div>
                  <p className="text-muted-foreground">{t("stats.ontime")}</p>
                </Card>
                <Card className="p-8 text-center border-border">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">50+</div>
                  <p className="text-muted-foreground">{t("stats.countries")}</p>
                </Card>
              </div>
            </div>
          </section>

          {/* Track Your Shipment */}
          <section className="py-16 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t("track.title")}</h2>
                <p className="text-muted-foreground mb-8">
                  {t("track.description")}
                </p>
                <TrackingForm />
              </div>
            </div>
          </section>

          {/* Services Overview */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t("services.title")}</h2>
                <p className="text-muted-foreground text-lg">
                  {t("services.subtitle")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6 border-border hover:border-primary transition-all">
                  <div className="mb-4">
                    <img
                      src="/hero-car-carrier.jpg"
                      alt="Auto Transport"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <Truck className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t("service.auto.title")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("service.auto.desc")}
                  </p>
                  <Link href="/services#auto-transport">
                    <Button variant="link" className="p-0 h-auto font-mono">
                      {t("services.learnMore")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border-border hover:border-primary transition-all">
                  <div className="mb-4">
                    <img
                      src="/port-operations.png"
                      alt="International Shipping"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <Ship className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t("service.international.title")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("service.international.desc")}
                  </p>
                  <Link href="/services#international">
                    <Button variant="link" className="p-0 h-auto font-mono">
                      {t("services.learnMore")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border-border hover:border-primary transition-all">
                  <div className="mb-4">
                    <img
                      src="/heavy-equipment.png"
                      alt="Heavy Equipment"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <Package className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t("service.heavy.title")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("service.heavy.desc")}
                  </p>
                  <Link href="/services#heavy-equipment">
                    <Button variant="link" className="p-0 h-auto font-mono">
                      {t("services.learnMore")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border-border hover:border-primary transition-all">
                  <div className="mb-4">
                    <img
                      src="/motorcycle-transport.png"
                      alt="Motorcycle Shipping"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <Plane className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t("service.motorcycle.title")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("service.motorcycle.desc")}
                  </p>
                  <Link href="/services#motorcycle">
                    <Button variant="link" className="p-0 h-auto font-mono">
                      {t("services.learnMore")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border-border hover:border-primary transition-all">
                  <div className="mb-4">
                    <img
                      src="/enclosed-transport.png"
                      alt="Enclosed Carrier"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t("service.enclosed.title")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("service.enclosed.desc")}
                  </p>
                  <Link href="/services#enclosed">
                    <Button variant="link" className="p-0 h-auto font-mono">
                      {t("services.learnMore")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border-border hover:border-primary transition-all">
                  <div className="mb-4">
                    <img
                      src="/fleet-highway.jpg"
                      alt="Fleet Services"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <TrendingUp className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t("service.fleet.title")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("service.fleet.desc")}
                  </p>
                  <Link href="/services#fleet">
                    <Button variant="link" className="p-0 h-auto font-mono">
                      {t("services.learnMore")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-16 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t("why.title")}</h2>
                <p className="text-muted-foreground text-lg">
                  {t("why.subtitle")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Real-Time Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor your shipment 24/7 with GPS tracking and instant status updates via our customer portal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Verified Carrier Network</h3>
                    <p className="text-sm text-muted-foreground">
                      All carriers fully licensed, insured, and vetted through our rigorous qualification process.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Competitive Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      Transparent pricing with no hidden fees. Get instant quotes and lock in the best rates.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Experienced Logistics Team</h3>
                    <p className="text-sm text-muted-foreground">
                      Dedicated professionals with 25+ years handling complex domestic and international shipments.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Comprehensive Insurance</h3>
                    <p className="text-sm text-muted-foreground">
                      Full cargo insurance coverage on all shipments for complete peace of mind.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">24/7 Customer Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Round-the-clock support team ready to assist with tracking, documentation, and inquiries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t("testimonials.title")}</h2>
                <p className="text-muted-foreground text-lg">
                  {t("testimonials.subtitle")}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6 border-border">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Exceptional service from start to finish. My vehicle arrived on time and in perfect condition. The real-time tracking gave me peace of mind throughout the entire process."
                  </p>
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Auto Transport Customer</div>
                </Card>

                <Card className="p-6 border-border">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "We've used Go Cargo Logistics for our fleet shipments for over 5 years. Their professionalism, competitive rates, and reliability keep us coming back."
                  </p>
                  <div className="font-medium">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Fleet Manager, AutoNation</div>
                </Card>

                <Card className="p-6 border-border">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "International shipping can be complex, but Go Cargo made it seamless. Their team handled all customs paperwork and kept me updated every step of the way."
                  </p>
                  <div className="font-medium">David Martinez</div>
                  <div className="text-sm text-muted-foreground">International Shipping Customer</div>
                </Card>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">{t("faq.title")}</h2>
                  <p className="text-muted-foreground">
                    {t("faq.subtitle")}
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">
                      How does the shipping process work?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Our shipping process is simple: (1) Request a free quote online, (2) Review and accept your quote, (3) Schedule pickup at your preferred location, (4) Track your shipment in real-time, (5) Receive delivery at the destination. Our team guides you through every step.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      What are the typical transit times?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Domestic transit times typically range from 3-7 days depending on distance and route. Expedited shipping (1-3 days) is available for time-sensitive shipments. International shipping varies by destination country, usually 14-30 days including customs clearance.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                      How can I track my shipment?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Track your shipment 24/7 using your unique tracking number on our website or through your customer portal. You'll receive real-time GPS updates, status notifications, and estimated delivery times. Email and SMS notifications are also available.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                      Is insurance included?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes, all shipments include basic cargo insurance at no additional cost. Additional coverage is available for high-value items. Our insurance covers damage, loss, and theft during transit. Detailed insurance documentation is provided with every shipment.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                      Do you offer international shipping?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes, we provide comprehensive international shipping services to over 50 countries worldwide. Our team handles all customs documentation, duties, and regulatory compliance. We offer both air and ocean freight options depending on your timeline and budget.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-left">
                      What documents do I need for vehicle transport?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      For domestic transport: valid ID, vehicle title or registration, and proof of insurance. For international shipping: original title, bill of sale, export declaration, and destination country import permits. Our team provides a complete checklist and assists with all paperwork.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-left">
                      What payment methods do you accept?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      We accept major credit cards (Visa, MasterCard, American Express), wire transfers, certified checks, and ACH payments. Payment terms are flexible: deposit required at booking, balance due upon delivery. Corporate accounts with NET 30 terms available for qualified businesses.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-left">
                      Can I ship personal belongings with my vehicle?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Limited personal belongings (up to 100 lbs) can be placed in the trunk or cargo area for domestic shipments. Items must not be visible through windows and are not covered by insurance. International shipments have stricter regulations - contact us for specific country requirements.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* Service Coverage CTA */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">{t("coverage.title")}</h2>
                  <p className="text-muted-foreground mb-6 text-lg">
                    {t("coverage.description")}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">Domestic Coverage</div>
                        <div className="text-sm text-muted-foreground">
                          All 50 states, Alaska, Hawaii, Puerto Rico, and U.S. territories
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">International Coverage</div>
                        <div className="text-sm text-muted-foreground">
                          Canada, Mexico, Europe, Asia, Australia, South America, Middle East
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/quote">
                    <Button size="lg" className="font-mono">
                      {t("services.getQuote")}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div>
                  <img
                    src="/team-operations.jpg"
                    alt="Professional logistics team"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10 border-y border-border">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">{t("cta.ready")}</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                {t("cta.description")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/quote">
                  <Button size="lg" className="font-mono">
                    {t("cta.requestQuote")}
                  </Button>
                </Link>
                <Link href="/track">
                  <Button size="lg" variant="outline" className="font-mono">
                    {t("hero.trackShipment")}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="font-mono">
                    <Phone className="mr-2 h-5 w-5" />
                    {t("cta.contactUs")}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}