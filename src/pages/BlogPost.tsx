
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatDistanceToNow, format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogList } from "@/components/blog/BlogList";
import { useEffect } from "react";
import NotFound from "@/pages/NotFound";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading: postLoading } = useBlogPost(slug || '');
  const { data: allPosts = [], isLoading: postsLoading } = useBlogPosts();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (postLoading) {
    return (
      <AppLayout>
        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-32 mb-6" />
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-12 w-full mb-6" />
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="w-full h-64 rounded-xl mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </article>
      </AppLayout>
    );
  }
  
  if (!post) {
    return <NotFound />;
  }

  const relatedPosts = allPosts
    .filter(p => p.slug !== slug)
    .filter(p => p.category.some(cat => post.category.includes(cat)))
    .slice(0, 3);
  
  const publishedDate = new Date(post.publishedAt);
  const formattedDate = format(publishedDate, 'MMMM dd, yyyy');
  
  return (
    <AppLayout>
      <article className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="mb-6 hover:bg-primary/10 border border-primary/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category.map(cat => (
                <Badge key={cat} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {cat}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <img 
                  src={post.author.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=crop&h=40&w=40"} 
                  alt={post.author.name} 
                  className="w-10 h-10 rounded-full ring-2 ring-primary/20"
                />
                <div>
                  <div className="font-medium text-primary">{post.author.name}</div>
                  <div className="text-xs">Author</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8 rounded-xl overflow-hidden ring-1 ring-primary/20">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none mb-10 prose-headings:text-primary prose-a:text-primary prose-strong:text-primary" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-primary/20">
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 text-primary">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 text-primary">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 text-primary">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like
              </Button>
            </div>
          </div>
        </motion.div>
        
        {relatedPosts.length > 0 && (
          <div className="mt-16 mb-10">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              Related Articles
            </h2>
            <BlogList posts={relatedPosts} />
          </div>
        )}
      </article>
    </AppLayout>
  );
};

export default BlogPost;
