
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <AppLayout 
      pageTitle="Privacy Policy"
      pageDescription="SocialEventory's privacy policy and data protection practices"
    >
      <SEOHead 
        title="Privacy Policy - SocialEventory"
        description="Learn about how SocialEventory protects your privacy and handles your personal data."
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
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg max-w-none">
              <div className="glass-card p-8 rounded-xl space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    At SocialEventory, we take your privacy seriously. This Privacy Policy explains how we collect, 
                    use, disclose, and safeguard your information when you use our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                      <p className="text-muted-foreground">
                        We may collect personal information such as your name, email address, phone number, 
                        and other details you provide when creating an account or event.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Usage Data</h3>
                      <p className="text-muted-foreground">
                        We automatically collect information about how you interact with our platform, 
                        including pages visited, features used, and time spent on the platform.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Location Data</h3>
                      <p className="text-muted-foreground">
                        With your permission, we may collect location data to help you discover nearby events 
                        and improve our location-based features.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• To provide and maintain our services</li>
                    <li>• To notify you about changes to our services</li>
                    <li>• To provide customer support</li>
                    <li>• To gather analysis or valuable information to improve our services</li>
                    <li>• To monitor the usage of our services</li>
                    <li>• To detect, prevent and address technical issues</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share 
                    your information in the following situations:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• With your explicit consent</li>
                    <li>• To comply with legal obligations</li>
                    <li>• To protect our rights and safety</li>
                    <li>• With service providers who assist us in operating our platform</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your 
                    personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Right to access your personal data</li>
                    <li>• Right to correct inaccurate data</li>
                    <li>• Right to delete your data</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to data portability</li>
                    <li>• Right to object to processing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our platform and 
                    store certain information to improve your experience.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform is not intended for children under 13. We do not knowingly collect personal 
                    information from children under 13.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new Privacy Policy on this page.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at{" "}
                    <a href="mailto:privacy@socialeventory.com" className="text-primary hover:underline">
                      privacy@socialeventory.com
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

export default Privacy;
