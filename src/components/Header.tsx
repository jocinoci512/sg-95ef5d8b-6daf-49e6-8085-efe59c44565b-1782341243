import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Truck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => router.pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/track", label: "Track Shipment" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold">
          <Truck className="h-6 w-6 text-primary" />
          <span>GO CARGO</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-primary" : "hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`md:hidden border-t border-border bg-card overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-primary font-bold" : "hover:text-primary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/portal/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full font-mono">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}