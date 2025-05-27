
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <AppLayout 
      pageTitle="Terms of Service"
      pageDescription="SocialEventory's terms of service and user agreement"
    >
      <SEOHead 
        title="Terms of Service - SocialEventory"
        description="Read SocialEventory's terms of service and user agreement."
        type="website"
      />
      
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg max-w-none">
              <div className="glass-card p-8 rounded-xl space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using SocialEventory, you accept and agree to be bound by the terms 
                    and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Use License</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Permission is granted to temporarily use SocialEventory for personal, non-commercial 
                    transitory viewing only. This is the grant of a license, not a transfer of title, and 
                    under this license you may not:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Modify or copy the materials</li>
                    <li>• Use the materials for any commercial purpose or for any public display</li>
                    <li>• Attempt to reverse engineer any software contained on the platform</li>
                    <li>• Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    When you create an account with us, you must provide information that is accurate, 
                    complete, and current at all times. You are responsible for:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Safeguarding your password</li>
                    <li>• All activities that occur under your account</li>
                    <li>• Immediately notifying us of any unauthorized use</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Event Content</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Users may post events and related content. By posting content, you warrant that:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• You own or have the right to use the content</li>
                    <li>• Your content does not violate any third-party rights</li>
                    <li>• Your content is accurate and not misleading</li>
                    <li>• Your content does not contain illegal or harmful material</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You may not use our platform:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>• To submit false or misleading information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Content Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We shall not be held responsible for any content that appears on your platform. 
                    You agree to protect and defend us against all claims that are raised on your platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs 
                    your use of the platform, to understand our practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Reservation of Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to request that you remove all links or any particular link to 
                    our platform. You approve to immediately remove all links to our platform upon request.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may terminate or suspend your account and bar access to the service immediately, 
                    without prior notice or liability, under our sole discretion, for any reason whatsoever.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The information on this platform is provided on an 'as is' basis. To the fullest extent 
                    permitted by law, this Company excludes all representations, warranties, conditions and terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at{" "}
                    <a href="mailto:legal@socialeventory.com" className="text-primary hover:underline">
                      legal@socialeventory.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Terms;
