
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@socialeventory.com",
      action: "mailto:hello@socialeventory.com"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 9AM-6PM PST",
      action: "#"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters",
      contact: "San Francisco, CA",
      action: "#"
    }
  ];

  return (
    <AppLayout 
      pageTitle="Contact Us"
      pageDescription="Get in touch with the SocialEventory team"
    >
      <SEOHead 
        title="Contact SocialEventory - Get In Touch"
        description="Have questions about SocialEventory? Get in touch with our team. We're here to help with any questions about events, features, or partnerships."
        type="website"
      />
      
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Get In <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or need help? We'd love to hear from you. 
              Choose the method that works best for you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-6">How can we help?</h2>
                <div className="grid gap-6">
                  {contactMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <a
                        key={method.title}
                        href={method.action}
                        className="glass-card p-6 rounded-xl hover:bg-card/80 transition-all duration-200 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{method.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                            <p className="text-primary font-medium">{method.contact}</p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Quick Answers</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">How do I create an event?</p>
                    <p className="text-muted-foreground">Sign up for an account and click "Create Event" to get started.</p>
                  </div>
                  <div>
                    <p className="font-medium">Is SocialEventory free to use?</p>
                    <p className="text-muted-foreground">Yes! Creating and discovering events is completely free.</p>
                  </div>
                  <div>
                    <p className="font-medium">How do I promote my event?</p>
                    <p className="text-muted-foreground">Use our built-in sharing tools and social media integration.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="glass-card p-8 rounded-xl">
                <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="glass-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="glass-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="glass-input resize-none"
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full gradient-primary">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contact;
