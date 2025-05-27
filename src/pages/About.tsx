
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { Heart, Users, Calendar, Globe, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Events Created", value: "10K+", icon: Calendar },
    { label: "Cities", value: "100+", icon: Globe },
    { label: "User Rating", value: "4.9", icon: Star },
  ];

  const values = [
    {
      title: "Community First",
      description: "We believe in the power of bringing people together through shared experiences.",
      icon: Heart,
    },
    {
      title: "Accessibility",
      description: "Making event discovery and participation accessible to everyone, everywhere.",
      icon: Users,
    },
    {
      title: "Innovation",
      description: "Continuously improving how people discover and engage with events.",
      icon: Target,
    },
  ];

  return (
    <AppLayout 
      pageTitle="About SocialEventory"
      pageDescription="Learn about our mission to connect communities through unforgettable events"
    >
      <SEOHead 
        title="About SocialEventory - Connecting Communities Through Events"
        description="Discover the story behind SocialEventory and our mission to make event discovery and community building accessible to everyone."
        type="website"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-primary/30" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center text-white"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Connecting Communities Through{" "}
                <span className="text-gradient">Epic Experiences</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                SocialEventory was born from the belief that life's most meaningful moments happen when people come together.
              </p>
              <Link to="/events">
                <Button size="lg" className="gradient-primary font-semibold">
                  <Calendar className="mr-2 h-5 w-5" />
                  Explore Events
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="glass-card p-6 rounded-xl">
                      <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Started in 2024, SocialEventory emerged from a simple observation: 
                  finding and attending meaningful events shouldn't be complicated.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg max-w-none"
              >
                <div className="glass-card p-8 rounded-xl">
                  <p className="text-foreground leading-relaxed mb-6">
                    What began as a weekend project to help friends discover local events has grown into a platform 
                    that connects thousands of people with experiences that matter to them. We've seen first dates 
                    sparked at art galleries, lifelong friendships formed at workshops, and communities strengthened 
                    through shared celebrations.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Today, SocialEventory is more than just an event discovery platform—it's a catalyst for 
                    human connection, a bridge between curiosity and experience, and a testament to the power 
                    of community in our increasingly digital world.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at SocialEventory.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="glass-card p-8 rounded-xl text-center"
                  >
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of others who've discovered their next favorite experience through SocialEventory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events">
                  <Button size="lg" className="gradient-primary">
                    Discover Events
                  </Button>
                </Link>
                <Link to="/create-event">
                  <Button size="lg" variant="outline">
                    Create Your Event
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default About;
