
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BlogList } from "@/components/blog/BlogList";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogCategories } from "@/components/blog/BlogCategories";
import { SearchBar } from "@/components/SearchBar";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCategoryNames } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: blogPosts = [], isLoading: postsLoading } = useBlogPosts();
  const { data: categoryNames = [], isLoading: categoriesLoading } = useCategoryNames();
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  
  useEffect(() => {
    // Filter posts based on search query and category
    const filtered = blogPosts.filter((post) => {
      const matchesSearch = 
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        !selectedCategory ||
        post.category.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, blogPosts]);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category || null);
  };
  
  if (postsLoading) {
    return (
      <AppLayout
        pageTitle="Event Industry Blog"
        pageDescription="Insights, tips and trends for event planners and attendees"
      >
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-xl mb-8">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // Select the most recent post as featured
  const featuredPost = blogPosts[0];
  // Remove the featured post from the regular list
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);
  
  return (
    <AppLayout
      pageTitle="Event Industry Blog"
      pageDescription="Insights, tips and trends for event planners and attendees"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="glass-panel p-4 rounded-xl mb-8 border border-primary/20">
          <SearchBar 
            onSearch={setSearchQuery} 
            initialValue={searchQuery} 
            placeholder="Search articles, topics, or tags..."
          />
        </div>
        
        {searchQuery === "" && selectedCategory === null && featuredPost && (
          <FeaturedPost post={featuredPost} />
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/4">
            <Tabs defaultValue="latest" className="mb-8">
              <TabsList className="bg-background/50 border border-primary/20">
                <TabsTrigger value="latest" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Latest</TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Popular</TabsTrigger>
              </TabsList>
              <TabsContent value="latest" className="pt-4">
                <BlogList posts={regularPosts} />
              </TabsContent>
              <TabsContent value="popular" className="pt-4">
                <BlogList posts={[...regularPosts].sort((a, b) => b.readTime - a.readTime)} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:w-1/4">
            <div className="glass-panel p-6 rounded-xl sticky top-24 border border-primary/20">
              {!categoriesLoading && (
                <BlogCategories 
                  categories={categoryNames} 
                  onCategorySelect={handleCategorySelect}
                  selectedCategory={selectedCategory}
                />
              )}
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium mb-4 text-primary">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogPosts.flatMap(post => post.tags))).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 border-primary/30 text-primary hover:border-primary/50"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Blog;
