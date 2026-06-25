import { useRouter } from "next/router";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  featured_image: string | null;
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
}

interface RelatedPost {
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

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (slugParam: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, content, excerpt, category, featured_image, published_at, seo_title, seo_description")
        .eq("slug", slugParam)
        .eq("published", true)
        .single();

      if (error) throw error;
      setPost(data);

      if (data) {
        const { data: related } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, category, featured_image, published_at, seo_title, seo_description")
          .eq("category", data.category)
          .eq("published", true)
          .neq("id", data.id)
          .limit(3);
        
        setRelatedPosts(related || []);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Loading..." />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <SEO title="Article Not Found" />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-20">
            <Card className="max-w-md p-8 text-center border-border">
              <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </Card>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        image={post.featured_image || undefined}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20">
          <article className="container max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={post.featured_image || "/truck-highway.jpg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="mb-8">
              <Badge variant="outline" className="font-mono mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-data">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <div className="text-lg text-muted-foreground mb-8 font-medium">
                {post.excerpt}
              </div>
              <div
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {relatedPosts.length > 0 && (
              <div className="border-t border-border pt-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer border-border">
                        <div className="p-6">
                          <Badge variant="outline" className="font-mono text-xs mb-3">
                            {relatedPost.category}
                          </Badge>
                          <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
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