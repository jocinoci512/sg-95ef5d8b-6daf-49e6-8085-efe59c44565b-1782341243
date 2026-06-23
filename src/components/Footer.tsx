import Link from "next/link";
import { Truck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <span>GO CARGO</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional vehicle transportation and logistics solutions nationwide.
            </p>
          </div>

          <div>
            <h3 className="font-mono font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
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
            </ul>
          </div>

          <div>
            <h3 className="font-mono font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/portal/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>contact@gocargo.com</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>123 Logistics Ave<br />Transport City, TC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Go Cargo Logistics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}