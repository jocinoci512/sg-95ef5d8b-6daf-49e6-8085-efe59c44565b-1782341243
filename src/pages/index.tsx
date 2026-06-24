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

          {/* Excellence in Every Delivery */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <img
                    src="/hero-driver.jpg"
                    alt="Professional driver"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">WHY GO CARGO</p>
                  <h2 className="text-4xl font-bold mb-4">
                    Excellence in <span className="text-primary">Every Delivery</span>
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    We set the standard for premium auto transport with unmatched service quality, cutting-edge technology, and a network of 500+ vetted carriers across North America.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 border-border hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Premium Enclosed & Open Transport</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the perfect protection level for your vehicle with our open and enclosed transportation options.
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Live GPS Tracking Map</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time shipment visibility with live location updates and ETA tracking on our interactive map.
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Licensed, Bonded & Fully Insured</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive insurance protection and secure transportation coverage on every shipment.
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Door-to-Door Pickup & Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Convenient vehicle pickup from your location and delivery directly to your destination.
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Fast Turnaround & Transparent Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    No hidden fees, quick scheduling, and clear pricing. Get instant quotes and lock in the best rates.
                  </p>
                </Card>

                <Card className="p-6 border-border hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">24/7 Customer Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Around-the-clock customer assistance ready to answer questions and provide updates.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-card/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  How It <span className="text-primary">Works</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Four simple steps to ship your vehicle.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Request Your Quote</h3>
                    <p className="text-sm text-muted-foreground">
                      Fill out our simple form with your vehicle and route details.
                    </p>
                  </div>
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-0" />
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">We Pick Up Your Vehicle</h3>
                    <p className="text-sm text-muted-foreground">
                      Our insured driver arrives at your location on the scheduled date.
                    </p>
                  </div>
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-0" />
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Track Your Vehicle Live</h3>
                    <p className="text-sm text-muted-foreground">
                      Watch your vehicle in real time on our GPS tracking map.
                    </p>
                  </div>
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-0" />
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                      <span className="text-2xl font-bold text-primary">4</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Delivered Safely</h3>
                    <p className="text-sm text-muted-foreground">
                      Your vehicle arrives in perfect condition at your destination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Statistics - Premium Dark Version */}
          <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">OUR IMPACT</p>
                <h2 className="text-4xl font-bold mb-4">
                  Numbers That <span className="text-primary">Speak for Themselves</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">5,000+</div>
                  <p className="text-sm text-slate-300">Vehicles Shipped</p>
                  <p className="text-xs text-slate-400 mt-1">and counting</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">50</div>
                  <p className="text-sm text-slate-300">States Covered</p>
                  <p className="text-xs text-slate-400 mt-1">all across the USA</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">99%</div>
                  <p className="text-sm text-slate-300">On-Time Delivery</p>
                  <p className="text-xs text-slate-400 mt-1">reliability matters</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">15+</div>
                  <p className="text-sm text-slate-300">Years Experience</p>
                  <p className="text-xs text-slate-400 mt-1">trusted since 2009</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">10,000+</div>
                  <p className="text-sm text-slate-300">Happy Customers</p>
                  <p className="text-xs text-slate-400 mt-1">nationwide</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">100K</div>
                  <p className="text-sm text-slate-300">Max Insurance</p>
                  <p className="text-xs text-slate-400 mt-1">per shipment</p>
                </div>
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

          {/* Advanced Technology */}
          <section className="py-16 bg-card/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">BUILT FOR THE MODERN AGE</p>
                <h2 className="text-4xl font-bold mb-4">
                  Advanced <span className="text-primary">Technology</span> Behind Every Shipment
                </h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                  We invest heavily in technology so you get real-time visibility, accurate ETAs, and zero surprises.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-8 border-border hover:border-primary/50 transition-all">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Live GPS Tracking</h3>
                  <p className="text-muted-foreground mb-6">
                    Real-time location updates every 5 minutes via satellite. See your vehicle on an interactive map from pickup to delivery.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                    <div>
                      <div className="text-3xl font-bold text-primary font-mono">5min</div>
                      <div className="text-xs text-muted-foreground">Update Interval</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary font-mono">99.9%</div>
                      <div className="text-xs text-muted-foreground">GPS Uptime</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-border hover:border-primary/50 transition-all">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Smart Route Optimization</h3>
                  <p className="text-muted-foreground mb-6">
                    AI-powered route planning selects the fastest, safest path accounting for weather, traffic, and road conditions.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                    <div>
                      <div className="text-3xl font-bold text-primary font-mono">18%</div>
                      <div className="text-xs text-muted-foreground">Faster Delivery</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary font-mono">500+</div>
                      <div className="text-xs text-muted-foreground">Routes Optimized Daily</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-border hover:border-primary/50 transition-all">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Predictive ETA Engine</h3>
                  <p className="text-muted-foreground mb-6">
                    Machine learning models analyze historical data and real-time conditions to give you accurate delivery windows — not just guesses.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                    <div>
                      <div className="text-3xl font-bold text-primary font-mono">97%</div>
                      <div className="text-xs text-muted-foreground">ETA Accuracy</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary font-mono">±4hrs</div>
                      <div className="text-xs text-muted-foreground">Delivery Window</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Complete Shipping Solutions - Pricing Cards */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">FLEXIBLE OPTIONS</p>
                <h2 className="text-4xl font-bold mb-4">
                  Complete <span className="text-primary">Shipping Solutions</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                  Choose the transport option that fits your vehicle, budget, and timeline.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {/* Open Auto Transport */}
                <Card className="p-6 border-border hover:border-primary/50 transition-all relative">
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Best Value
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Open Auto Transport</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">$549</span>
                      <span className="text-sm text-muted-foreground">/starting</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Most economical option</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Door-to-door pickup & delivery</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Open carrier GPS tracking</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Licensed & insured carriers</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Standard 7-14 day delivery</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>4.5/5 customer rating</span>
                    </li>
                  </ul>
                  <Link href="/quote">
                    <Button variant="outline" className="w-full font-mono">
                      Get a Quote
                    </Button>
                  </Link>
                </Card>

                {/* Enclosed Auto Transport - Featured */}
                <Card className="p-6 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 relative transform lg:scale-105 shadow-lg">
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                      Most Popular
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Enclosed Auto Transport</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">$849</span>
                      <span className="text-sm text-muted-foreground">/starting</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="font-medium">Premium protection</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Fully enclosed trailer</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Ideal for luxury & exotic vehicles</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Maximum weather protection</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>White-glove loading</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Priority scheduling</span>
                    </li>
                  </ul>
                  <Link href="/quote">
                    <Button className="w-full font-mono">
                      Get a Quote
                    </Button>
                  </Link>
                </Card>

                {/* Expedited Shipping */}
                <Card className="p-6 border-border hover:border-primary/50 transition-all relative">
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Priority Service
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Expedited Shipping</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">$749</span>
                      <span className="text-sm text-muted-foreground">/starting</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Guaranteed pickup date</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Pickup within 24-48 hours</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Express delivery windows</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Dedicated transport coordinator</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Real-time status updates</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Auction & dealer pickups</span>
                    </li>
                  </ul>
                  <Link href="/quote">
                    <Button variant="outline" className="w-full font-mono">
                      Get a Quote
                    </Button>
                  </Link>
                </Card>

                {/* Fleet & Dealership */}
                <Card className="p-6 border-border hover:border-primary/50 transition-all relative">
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Business-Focused
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Fleet & Dealership</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">Custom</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Multi-vehicle discounts</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Dedicated fleet account</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Auction & dealer pickups</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Volume-based pricing</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Priority scheduling</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Custom reporting dashboard</span>
                    </li>
                  </ul>
                  <Link href="/quote">
                    <Button variant="outline" className="w-full font-mono">
                      Get a Quote
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