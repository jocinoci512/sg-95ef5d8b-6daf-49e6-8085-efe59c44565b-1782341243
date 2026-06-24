import Link from "next/link";
import { Truck, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">{t("footer.company")}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t("footer.description")}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>24/7 Operations</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+1-800-555-0123" className="hover:text-primary transition-colors">
                  +1 (800) 555-0123
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@gocargologistics.com" className="hover:text-primary transition-colors">
                  info@gocargologistics.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.track")}
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.quote")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">{t("footer.services")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#auto-transport" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("service.auto.title")}
                </Link>
              </li>
              <li>
                <Link href="/services#international" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("service.international.title")}
                </Link>
              </li>
              <li>
                <Link href="/services#heavy-equipment" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("service.heavy.title")}
                </Link>
              </li>
              <li>
                <Link href="/services#motorcycle" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("service.motorcycle.title")}
                </Link>
              </li>
              <li>
                <Link href="/services#enclosed" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("service.enclosed.title")}
                </Link>
              </li>
              <li>
                <Link href="/services#fleet" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("service.fleet.title")}
                </Link>
              </li>
              <li>
                <Link href="/services#expedited" className="text-muted-foreground hover:text-primary transition-colors">
                  Expedited Shipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Resources */}
          <div>
            <h3 className="font-bold mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/portal/login" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.customerLogin")}
                </Link>
              </li>
              <li>
                <Link href="/portal/signup" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.createAccount")}
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.tracking")}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.faqs")}
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("cta.requestQuote")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.supportCenter")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.shippingResources")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 {t("footer.company")}. {t("footer.rights")}</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="/sitemap" className="hover:text-primary transition-colors">
                {t("footer.sitemap")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}