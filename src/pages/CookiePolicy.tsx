import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              This Cookie Policy explains how Innerspark Africa ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website and use our mental health platform. This policy should be read in conjunction with our Privacy Policy and Terms of Service.
            </p>
            <p>
              By using our website, you consent to the use of cookies in accordance with this Cookie Policy. If you do not agree to our use of cookies, you should adjust your browser settings or refrain from using our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience. Cookies help websites remember information about your visit, such as your preferred language and other settings.
            </p>
            <p>
              Cookies can be "persistent" (remaining on your device until deleted or expired) or "session" cookies (deleted when you close your browser).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Strictly Necessary Cookies</h3>
            <div className="bg-secondary/50 p-4 rounded-lg mb-4">
              <p className="mb-2"><strong>Purpose:</strong> Essential for the website to function properly</p>
              <p className="mb-2"><strong>Examples:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Authentication cookies to verify your login status</li>
                <li>Security cookies to prevent fraudulent use</li>
                <li>Load balancing cookies to distribute traffic</li>
              </ul>
              <p className="mt-2 text-sm"><strong>Duration:</strong> Session or up to 1 year</p>
              <p className="text-sm"><strong>Can be disabled:</strong> No (required for basic functionality)</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Functional Cookies</h3>
            <div className="bg-secondary/50 p-4 rounded-lg mb-4">
              <p className="mb-2"><strong>Purpose:</strong> Remember your preferences and provide enhanced features</p>
              <p className="mb-2"><strong>Examples:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Language preference cookies</li>
                <li>Theme selection (dark/light mode)</li>
                <li>Volume settings for meditation audio</li>
                <li>Previous session data</li>
              </ul>
              <p className="mt-2 text-sm"><strong>Duration:</strong> Up to 2 years</p>
              <p className="text-sm"><strong>Can be disabled:</strong> Yes (may affect user experience)</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Analytics and Performance Cookies</h3>
            <div className="bg-secondary/50 p-4 rounded-lg mb-4">
              <p className="mb-2"><strong>Purpose:</strong> Help us understand how visitors use our website</p>
              <p className="mb-2"><strong>Examples:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Google Analytics (anonymized)</li>
                <li>Page visit tracking</li>
                <li>Time spent on pages</li>
                <li>Click patterns and navigation flow</li>
                <li>Error reporting</li>
              </ul>
              <p className="mt-2 text-sm"><strong>Duration:</strong> Up to 2 years</p>
              <p className="text-sm"><strong>Can be disabled:</strong> Yes (via cookie preferences)</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Marketing and Advertising Cookies</h3>
            <div className="bg-secondary/50 p-4 rounded-lg mb-4">
              <p className="mb-2"><strong>Purpose:</strong> Deliver relevant advertisements and measure campaign effectiveness</p>
              <p className="mb-2"><strong>Examples:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Social media pixels (Facebook, Instagram)</li>
                <li>Google Ads conversion tracking</li>
                <li>Retargeting cookies</li>
                <li>Third-party ad networks</li>
              </ul>
              <p className="mt-2 text-sm"><strong>Duration:</strong> Up to 1 year</p>
              <p className="text-sm"><strong>Can be disabled:</strong> Yes (via cookie preferences)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p className="mb-4">
              We use services from trusted third-party providers that may set cookies on your device. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns (anonymized data)</li>
              <li><strong>Payment Processors:</strong> To securely process therapy payments and donations</li>
              <li><strong>Video Conferencing Platforms:</strong> To enable virtual therapy sessions</li>
              <li><strong>Social Media Platforms:</strong> To enable social sharing and display our social media content</li>
              <li><strong>Cloud Services:</strong> To provide reliable hosting and data storage</li>
            </ul>
            <p className="mt-4">
              These third parties have their own privacy policies governing their use of cookies. We recommend reviewing their policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Authentication:</strong> To keep you logged in securely</li>
              <li><strong>Personalization:</strong> To remember your preferences and settings</li>
              <li><strong>Security:</strong> To detect and prevent security threats</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
              <li><strong>Improvement:</strong> To identify areas for enhancement</li>
              <li><strong>Communication:</strong> To provide relevant information and updates</li>
              <li><strong>Marketing:</strong> To deliver targeted content and measure effectiveness</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Cookie Consent Banner</h3>
            <p className="mb-4">
              When you first visit our website, you will see a cookie consent banner. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Accept all cookies by clicking "Accept All Cookies"</li>
              <li>Customize your preferences by clicking "Manage Cookie Preferences"</li>
              <li>Reject non-essential cookies (some features may be limited)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Browser Settings</h3>
            <p className="mb-4">
              Most browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Block all cookies</li>
              <li>Accept only first-party cookies</li>
              <li>Delete cookies after each browsing session</li>
              <li>Set specific preferences for individual websites</li>
            </ul>
            <p className="mb-4">
              <strong>Please note:</strong> Blocking or deleting cookies may impact your ability to use certain features of our website.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Browser-Specific Instructions</h3>
            <div className="space-y-2 mb-4">
              <p><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
              <p><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</p>
              <p><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</p>
              <p><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.4 Opt-Out Tools</h3>
            <p className="mb-4">You can opt out of specific tracking services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
              <li>Facebook Pixel: Adjust your Facebook ad preferences in your Facebook account settings</li>
              <li>Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NAI Opt-Out Tool</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Mobile Application Tracking</h2>
            <p className="mb-4">
              Our mobile application may use similar tracking technologies, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mobile device identifiers</li>
              <li>Analytics SDKs</li>
              <li>Push notification tokens</li>
              <li>App usage data</li>
            </ul>
            <p className="mt-4">
              You can manage tracking preferences through your device settings (iOS: Settings → Privacy; Android: Settings → Google → Ads).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Do Not Track Signals</h2>
            <p>
              Some browsers include a "Do Not Track" (DNT) feature. Currently, there is no universal standard for how websites should respond to DNT signals. We do not currently respond to DNT browser signals, but we respect your right to control tracking through our cookie consent tools and browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Data Protection and Privacy</h2>
            <p className="mb-4">
              Cookie data is treated with the same level of protection as all personal information we collect. We:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use encryption for sensitive data transmission</li>
              <li>Limit access to cookie data to authorized personnel only</li>
              <li>Anonymize analytics data where possible</li>
              <li>Do not sell cookie data to third parties</li>
              <li>Comply with applicable data protection regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 18. We do not knowingly collect information from children through cookies. If you believe we have inadvertently collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Updates to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our practices. We will post the updated policy on our website with a revised "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have questions or concerns about our use of cookies, please contact us:
            </p>
            <div className="bg-secondary p-6 rounded-lg space-y-2">
              <p><strong>Innerspark Africa</strong></p>
              <p>National ICT Innovation Hub</p>
              <p>Kampala, Uganda</p>
              <p>Phone: <a href="tel:+256792085773" className="text-primary hover:underline">+256 792 085 773</a></p>
              <p>Email: <a href="mailto:info@innersparkafrica.com" className="text-primary hover:underline">info@innersparkafrica.com</a></p>
            </div>
          </section>

          <section className="border-t pt-8 mt-8">
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Your Choices Matter</h3>
              <p className="text-sm">
                We believe in transparency and giving you control over your data. You can always adjust your cookie preferences through our cookie consent tool or your browser settings. Essential cookies are required for the platform to function, but you have complete control over optional cookies.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;