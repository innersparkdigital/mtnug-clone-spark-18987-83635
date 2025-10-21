import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Innerspark Africa ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mental health and wellness platform.
            </p>
            <p>
              By accessing or using our services, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Personal Information</h3>
            <p className="mb-4">We may collect personal information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Date of birth and gender</li>
              <li>Location information (city, country)</li>
              <li>Payment and billing information</li>
              <li>Profile information and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Health and Wellness Information</h3>
            <p className="mb-4">To provide our mental health services, we may collect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Mental health assessments and mood check-in data</li>
              <li>Therapy session notes and recordings (with your consent)</li>
              <li>Journal entries and personal goals</li>
              <li>Communication with therapists and support groups</li>
              <li>Emergency contact information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Technical Information</h3>
            <p className="mb-4">We automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address and location data</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Delivery:</strong> To provide mental health services, connect you with therapists, and facilitate support groups</li>
              <li><strong>Communication:</strong> To send appointment reminders, wellness reports, and important updates</li>
              <li><strong>Personalization:</strong> To customize your experience and provide relevant recommendations</li>
              <li><strong>Safety:</strong> To respond to emergency situations and ensure user safety</li>
              <li><strong>Improvement:</strong> To analyze usage patterns and improve our services</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Payment Processing:</strong> To process donations and therapy payments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With Healthcare Providers:</strong> Licensed therapists and counselors on our platform who you choose to work with</li>
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform (hosting, payment processing, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights, safety, and property</li>
              <li><strong>Emergency Situations:</strong> To emergency services or contacts when there is an imminent risk of harm</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
            <p className="mt-4">
              <strong>We will never sell your personal health information to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement robust security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption for therapy sessions and sensitive communications</li>
              <li>Secure server infrastructure with regular security audits</li>
              <li>Access controls and authentication protocols</li>
              <li>Regular data backups and disaster recovery procedures</li>
              <li>Employee training on data protection and confidentiality</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p className="mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Restriction:</strong> Request limitation on how we process your information</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for processing where applicable</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at <a href="mailto:info@innersparkafrica.com" className="text-primary hover:underline">info@innersparkafrica.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. Health records and therapy session data may be retained for longer periods as required by law or professional standards. You may request deletion of your account and associated data at any time, subject to legal and regulatory requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18 without parental consent. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than Uganda. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our platform and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-secondary p-6 rounded-lg space-y-2">
              <p><strong>Innerspark Africa</strong></p>
              <p>National ICT Innovation Hub</p>
              <p>Kampala, Uganda</p>
              <p>Phone: <a href="tel:+256780570987" className="text-primary hover:underline">+256 780 570 987</a></p>
              <p>Email: <a href="mailto:info@innersparkafrica.com" className="text-primary hover:underline">info@innersparkafrica.com</a></p>
            </div>
          </section>

          <section className="border-t pt-8 mt-8">
            <p className="text-sm text-muted-foreground italic">
              Your trust is essential to us. We are committed to maintaining the confidentiality and security of your personal health information while providing you with accessible, stigma-free mental health support.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;