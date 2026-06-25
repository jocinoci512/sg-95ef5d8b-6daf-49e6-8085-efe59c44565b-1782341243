import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { TrackingForm } from "@/components/TrackingForm";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GetServerSideProps } from "next";
import {
  ShieldCheck,
  Clock,
  TrendingUp,
  CheckCircle2,
  Package,
  Globe,
  Award,
  ChevronRight,
  Phone,
} from "lucide-react";

// Dynamically import heavy sections to reduce build memory
const HeroSection = dynamic(() => import("@/components/home/HeroSection").then(mod => ({ default: mod.HeroSection })), { ssr: true });
const ExcellenceSection = dynamic(() => import("@/components/home/ExcellenceSection").then(mod => ({ default: mod.ExcellenceSection })), { ssr: true });
const TechnologySection = dynamic(() => import("@/components/home/TechnologySection").then(mod => ({ default: mod.TechnologySection })), { ssr: true });

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
          <Suspense fallback={<div className="min-h-[600px]" />}>
            <HeroSection />
          </Suspense>

          {/* Trust Badges */}
          <section className="py-12 bg-card/50 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <ShieldCheck className="h-10 w-10 text-primary mb-2" />
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
                  <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
                  <p className="text-sm font-medium">{t("trust.service")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Excellence in Every Delivery */}
          <Suspense fallback={<div className="py-16" />}>
            <ExcellenceSection />
          </Suspense>

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

          {/* Services Overview - Simplified */}
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
                  <Package className="h-10 w-10 text-primary mb-4" />
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
                  <Package className="h-10 w-10 text-primary mb-4" />
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
                  <Package className="h-10 w-10 text-primary mb-4" />
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
                  <Package className="h-10 w-10 text-primary mb-4" />
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
          <Suspense fallback={<div className="py-16" />}>
            <TechnologySection />
          </Suspense>

          {/* CTA */}
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};