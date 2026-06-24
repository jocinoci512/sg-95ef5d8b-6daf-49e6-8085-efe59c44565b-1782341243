import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
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
  );
}