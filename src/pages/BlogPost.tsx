
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { blogPosts } from "@/lib/mock-data/blog-data";
import { formatDistanceToNow, format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogList } from "@/components/blog/BlogList";
import { useEffect, useState } from "react";
import { NotFound } from "@/pages/NotFound";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState(blogPosts.find(post => post.slug === slug));
  const [relatedPosts, setRelatedPosts] = useState(
    blogPosts
      .filter(p => p.slug !== slug)
      .filter(p => p.category.some(cat => post?.category.includes(cat)))
      .slice(0, 3)
  );
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Update post and related posts when slug changes
    const currentPost = blogPosts.find(p => p.slug === slug);
    setPost(currentPost);
    
    if (currentPost) {
      const related = blogPosts
        .filter(p => p.slug !== slug)
        .filter(p => p.category.some(cat => currentPost.category.includes(cat)))
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [slug]);
  
  if (!post) {
    return <NotFound />;
  }
  
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
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category.map(cat => (
                <Badge key={cat} variant="secondary">{cat}</Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-foreground">{post.author.name}</div>
                  <div className="text-xs">Author</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none mb-10" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          <div className="flex flex-wrap items-center justify-between pt-6 border-t">
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like
              </Button>
            </div>
          </div>
        </motion.div>
        
        {relatedPosts.length > 0 && (
          <div className="mt-16 mb-10">
            <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
            <BlogList posts={relatedPosts} />
          </div>
        )}
      </article>
    </AppLayout>
  );
};

export default BlogPost;
