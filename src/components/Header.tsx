import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold">
          <Truck className="h-6 w-6 text-primary" />
          <span>GO CARGO</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/track" className="text-sm font-medium hover:text-primary transition-colors">
            Track Shipment
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/portal/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/quote">
            <Button size="sm" className="font-mono">
              Get Quote
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-4 flex flex-col gap-3">
            <Link href="/" className="py-2 text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="py-2 text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/services" className="py-2 text-sm font-medium hover:text-primary">
              Services
            </Link>
            <Link href="/track" className="py-2 text-sm font-medium hover:text-primary">
              Track Shipment
            </Link>
            <Link href="/blog" className="py-2 text-sm font-medium hover:text-primary">
              Blog
            </Link>
            <Link href="/contact" className="py-2 text-sm font-medium hover:text-primary">
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/portal/login">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/quote">
                <Button className="w-full font-mono">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}