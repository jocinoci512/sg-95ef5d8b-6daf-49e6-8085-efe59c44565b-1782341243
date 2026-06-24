import Link from "next/link";
import { Truck, Mail, Phone, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Go Cargo Logistics</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Professional logistics and transportation services for vehicles, freight, and heavy equipment worldwide.
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
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-muted-foreground hover:text-primary transition-colors">
                  Get Quote
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#auto-transport" className="text-muted-foreground hover:text-primary transition-colors">
                  Auto Transport
                </Link>
              </li>
              <li>
                <Link href="/services#international" className="text-muted-foreground hover:text-primary transition-colors">
                  International Shipping
                </Link>
              </li>
              <li>
                <Link href="/services#heavy-equipment" className="text-muted-foreground hover:text-primary transition-colors">
                  Heavy Equipment
                </Link>
              </li>
              <li>
                <Link href="/services#motorcycle" className="text-muted-foreground hover:text-primary transition-colors">
                  Motorcycle Transport
                </Link>
              </li>
              <li>
                <Link href="/services#enclosed" className="text-muted-foreground hover:text-primary transition-colors">
                  Enclosed Carrier
                </Link>
              </li>
              <li>
                <Link href="/services#fleet" className="text-muted-foreground hover:text-primary transition-colors">
                  Fleet Transportation
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
            <h3 className="font-bold mb-4">Customer Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/portal/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/portal/signup" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipment Tracking
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-muted-foreground hover:text-primary transition-colors">
                  Request Quote
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 Go Cargo Logistics. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}