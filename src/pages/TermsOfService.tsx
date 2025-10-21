import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              Welcome to Innerspark Africa. These Terms of Service ("Terms") govern your access to and use of our mental health and wellness platform, including our website, mobile application, and all related services (collectively, the "Services").
            </p>
            <p className="mb-4">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Services.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of our Services after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p className="mb-4">Innerspark Africa provides a digital mental health and wellness platform offering:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Virtual therapy sessions (video and chat) with licensed therapists</li>
              <li>Peer support groups with professional moderation</li>
              <li>Private chat sessions for emotional support</li>
              <li>Mood tracking and journaling tools</li>
              <li>Goal setting and wellness tracking</li>
              <li>Emergency support access</li>
              <li>Mental health education and training events</li>
              <li>Community donation programs</li>
              <li>Guided meditations and relaxation resources</li>
              <li>Therapist directory and matching services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility and Account Registration</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Eligibility</h3>
            <p className="mb-4">
              You must be at least 18 years old to use our Services independently. Users under 18 may use our Services only with parental or legal guardian consent and supervision.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Account Registration</h3>
            <p className="mb-4">To access certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Medical Disclaimer and Limitations</h2>
            <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-lg mb-4">
              <p className="font-semibold mb-2">IMPORTANT MEDICAL DISCLAIMER:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our Services are not intended to replace emergency services or immediate medical care</li>
                <li>If you are experiencing a life-threatening emergency, call emergency services immediately (112 in Uganda)</li>
                <li>Our Services are not a substitute for in-person professional medical care</li>
                <li>Therapists on our platform are independent professionals; we facilitate connections but do not provide medical advice</li>
                <li>We do not guarantee specific outcomes or results from using our Services</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Therapist Relationship</h3>
            <p>
              Licensed therapists and counselors on our platform are independent professionals. The therapeutic relationship is between you and your chosen therapist. Innerspark Africa facilitates these connections but is not responsible for the quality or outcomes of therapy services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities and Conduct</h2>
            <p className="mb-4">When using our Services, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Use the Services only for lawful purposes</li>
              <li>Respect the privacy and rights of other users</li>
              <li>Provide honest and accurate information</li>
              <li>Not impersonate others or provide false information</li>
              <li>Not harass, abuse, or harm other users or therapists</li>
              <li>Not share confidential information from support groups</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not use the Services for commercial purposes without permission</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Prohibited Content</h3>
            <p className="mb-4">You may not post, share, or transmit content that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Is illegal, harmful, threatening, or abusive</li>
              <li>Violates intellectual property rights</li>
              <li>Contains viruses or malicious code</li>
              <li>Promotes self-harm or harm to others</li>
              <li>Is sexually explicit or inappropriate</li>
              <li>Violates privacy or confidentiality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Payment and Fees</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Therapy Services</h3>
            <p className="mb-4">
              Fees for therapy sessions and premium features are clearly displayed before purchase. All fees are in Uganda Shillings (UGX) unless otherwise stated.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Community Donations</h3>
            <p className="mb-4">
              The "Donate Therapy" program allows users to contribute to a community fund. Donations are voluntary and non-refundable. We use donations to provide therapy access to individuals in need.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Refund Policy</h3>
            <p>
              Refunds for therapy sessions may be requested according to our cancellation policy. Refund requests must be made within 24 hours of the session. Community donations are final and non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Privacy and Confidentiality</h2>
            <p className="mb-4">
              Your privacy is important to us. Our collection, use, and disclosure of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="mb-4">
              <strong>Confidentiality Limits:</strong> While we maintain strict confidentiality, we may disclose information when:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Required by law or legal process</li>
              <li>There is imminent risk of harm to yourself or others</li>
              <li>There is suspected child or elder abuse</li>
              <li>You provide explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="mb-4">
              All content, features, and functionality of our Services, including text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of Innerspark Africa or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or lease any part of our Services without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your access to our Services immediately, without prior notice, for conduct that we believe:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violates these Terms</li>
              <li>Is harmful to other users, therapists, or our business</li>
              <li>Exposes us to legal liability</li>
              <li>Is fraudulent or illegal</li>
            </ul>
            <p className="mt-4">
              You may terminate your account at any time through your profile settings. Upon termination, your right to use the Services will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Disclaimer of Warranties</h2>
            <p className="mb-4">
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Services will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or quality of any information</li>
              <li>Warranties that the Services will meet your specific needs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, INNERSPARK AFRICA SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from your use or inability to use the Services</li>
              <li>Damages resulting from conduct or content of third parties</li>
              <li>Unauthorized access to or alteration of your data</li>
            </ul>
            <p className="mt-4">
              Our total liability for any claim arising from these Terms or use of our Services shall not exceed the amount you paid us in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Innerspark Africa, its officers, directors, employees, contractors, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Services or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law and Dispute Resolution</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Uganda, without regard to conflict of law principles.
            </p>
            <p className="mb-4">
              Any disputes arising from these Terms or use of our Services shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through arbitration in Kampala, Uganda, in accordance with the rules of the Uganda Arbitration Centre.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. General Provisions</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">14.1 Entire Agreement</h3>
            <p className="mb-4">
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Innerspark Africa.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">14.2 Severability</h3>
            <p className="mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">14.3 Waiver</h3>
            <p className="mb-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">14.4 Assignment</h3>
            <p>
              You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-secondary p-6 rounded-lg space-y-2">
              <p><strong>Innerspark Africa</strong></p>
              <p>National ICT Innovation Hub</p>
              <p>Kampala, Uganda</p>
              <p>Phone: <a href="tel:+256780570987" className="text-primary hover:underline">+256 780 570 987</a></p>
              <p>Email: <a href="mailto:info@innersparkafrica.com" className="text-primary hover:underline">info@innersparkafrica.com</a></p>
              <p>Website: <a href="https://innersparkafrica.com" className="text-primary hover:underline">www.innersparkafrica.com</a></p>
            </div>
          </section>

          <section className="border-t pt-8 mt-8">
            <p className="text-sm text-muted-foreground italic">
              By using Innerspark Africa's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Thank you for trusting us with your mental health journey.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;