import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import type { GetServerSideProps } from "next";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar, ArrowRight, Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featured_image: string | null;
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (data && !error) {
      setPosts(data);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ["Industry News", "Shipping Tips", "Company Updates", "How-To Guides", "Case Studies"];

  return (
    <>
      <SEO
        title="Logistics & Shipping Blog"
        description="Expert insights on vehicle transportation, shipping tips, industry news, and logistics best practices."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Logistics Blog</h1>
              <p className="text-xl text-muted-foreground">
                Expert insights, shipping tips, and industry news from Go Cargo Logistics
              </p>
            </div>

            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="font-mono"
                >
                  All Posts
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="font-mono"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading articles...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card className="p-12 text-center border-border">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No articles match your search." : "No articles published yet."}
                  </p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer border-border overflow-hidden">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <Image
                            src={post.featured_image || "/truck-highway.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="font-mono text-xs">
                              {post.category}
                            </Badge>
                          </div>
                          <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.published_at).toLocaleDateString()}
                            </div>
                            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
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