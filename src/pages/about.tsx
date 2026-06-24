import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import type { GetServerSideProps } from "next";
import {
  Truck,
  Globe,
  Shield,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";

export default function About() {
  return (
    <>
      <SEO
        title="About Go Cargo Logistics - 25+ Years of Excellence"
        description="Learn about Go Cargo Logistics' 25+ year history of providing professional vehicle and freight transportation services worldwide."
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "url('/team-operations.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="container mx-auto px-4 relative z-10 py-20 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Go Cargo Logistics
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Over 25 years of excellence in logistics and transportation services worldwide
              </p>
            </div>
          </section>

          {/* Company Stats */}
          <section className="py-16 bg-card/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">25+</div>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">500K+</div>
                  <p className="text-muted-foreground">Shipments Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">50+</div>
                  <p className="text-muted-foreground">Countries Served</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2 font-mono">98.7%</div>
                  <p className="text-muted-foreground">Customer Satisfaction</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Founded in 1999, Go Cargo Logistics began with a simple mission: provide reliable, 
                      professional transportation services that customers can trust. What started as a small 
                      regional auto transport company has grown into a comprehensive logistics provider serving 
                      clients across the United States and in over 50 countries worldwide.
                    </p>
                    <p>
                      Our growth has been driven by an unwavering commitment to customer service, operational 
                      excellence, and continuous innovation. Today, we handle everything from individual vehicle 
                      shipments to complex international freight operations, all with the same attention to 
                      detail and professionalism that defined our early days.
                    </p>
                    <p>
                      With over 500,000 successful shipments completed and a 98.7% on-time delivery rate, 
                      we've earned the trust of thousands of customers, from individual vehicle owners to 
                      Fortune 500 companies managing global supply chains.
                    </p>
                  </div>
                </div>
                <div>
                  <img
                    src="/warehouse-operations.jpg"
                    alt="Warehouse operations"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 border-border">
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To provide reliable, efficient, and cost-effective logistics solutions that exceed 
                    customer expectations. We are committed to delivering exceptional service through 
                    innovation, integrity, and a relentless focus on customer satisfaction.
                  </p>
                </Card>

                <Card className="p-8 border-border">
                  <Globe className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be the most trusted name in global logistics, known for operational excellence, 
                    technological innovation, and unparalleled customer service. We envision a future where 
                    shipping is seamless, transparent, and stress-free for every customer.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                <p className="text-muted-foreground text-lg">
                  The principles that guide everything we do
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Integrity</h3>
                  <p className="text-muted-foreground text-sm">
                    We operate with honesty and transparency in all our dealings, building trust 
                    through consistent ethical practices.
                  </p>
                </div>

                <div className="text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Excellence</h3>
                  <p className="text-muted-foreground text-sm">
                    We strive for excellence in every shipment, continuously improving our processes 
                    and exceeding industry standards.
                  </p>
                </div>

                <div className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
                  <p className="text-muted-foreground text-sm">
                    Our customers are at the heart of everything we do. Their success is our success, 
                    and we go above and beyond to meet their needs.
                  </p>
                </div>

                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Innovation</h3>
                  <p className="text-muted-foreground text-sm">
                    We embrace technology and innovation to provide better service, from real-time 
                    tracking to automated customer portals.
                  </p>
                </div>

                <div className="text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Reliability</h3>
                  <p className="text-muted-foreground text-sm">
                    We deliver on our promises with 98.7% on-time performance, ensuring your shipments 
                    arrive when and where you need them.
                  </p>
                </div>

                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Quality</h3>
                  <p className="text-muted-foreground text-sm">
                    From carrier vetting to shipment handling, we maintain the highest quality standards 
                    at every step of the process.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Certifications & Memberships */}
          <section className="py-16 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Industry Recognition</h2>
                <p className="text-muted-foreground text-lg">
                  Licensed, insured, and certified to the highest industry standards
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6 border-border text-center">
                  <Award className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">DOT Licensed</h3>
                  <p className="text-sm text-muted-foreground">
                    Fully licensed by the U.S. Department of Transportation
                  </p>
                </Card>

                <Card className="p-6 border-border text-center">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Fully Insured</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive cargo insurance on all shipments
                  </p>
                </Card>

                <Card className="p-6 border-border text-center">
                  <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">ISO Certified</h3>
                  <p className="text-sm text-muted-foreground">
                    ISO 9001:2015 Quality Management System certified
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <img
                    src="/team-collaboration.png"
                    alt="Professional logistics team"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Team</h2>
                  <p className="text-muted-foreground mb-6">
                    Our success is built on the expertise and dedication of our team. From logistics 
                    coordinators to customer service specialists, every team member is committed to 
                    delivering exceptional service.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">Experienced Professionals</div>
                        <div className="text-sm text-muted-foreground">
                          Average 10+ years experience in logistics and transportation
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">24/7 Support Team</div>
                        <div className="text-sm text-muted-foreground">
                          Round-the-clock customer service and tracking support
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">Continuous Training</div>
                        <div className="text-sm text-muted-foreground">
                          Ongoing professional development and industry certification programs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10 border-y border-border">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust Go Cargo Logistics for their shipping needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/quote">
                  <Button size="lg" className="font-mono">
                    Get Free Quote
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="font-mono">
                    Contact Us
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