import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700">
            Welcome to "Text to RedNote". We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our AI text-to-image service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
          <p className="text-gray-700">
            "Text to RedNote" is an AI-powered text-to-image service based on Doubao AI models. We provide users with intelligent text splitting and image generation functionality using a credit-based payment system.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information We Collect</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (features used, time spent)</li>
              <li>Technical logs and error reports</li>
              <li>IP address and general location data</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Information You Provide</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Account information (username, email, password)</li>
              <li>Text content you input for processing</li>
              <li>Payment information (processed by Creem)</li>
              <li>Customer support communications</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Provide and improve our AI image generation services</li>
            <li>Process your text inputs and generate corresponding images</li>
            <li>Manage your account and credits</li>
            <li>Process payments and transactions</li>
            <li>Send service-related notifications</li>
            <li>Provide customer support</li>
            <li>Analyze usage patterns to improve service quality</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Information Sharing</h2>
          <p className="text-gray-700 mb-4">We may share your information with:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Creem:</strong> Payment processing and compliance</li>
            <li><strong>Doubao AI:</strong> Text processing and image generation</li>
            <li><strong>Cloud Infrastructure:</strong> Secure data storage and processing</li>
            <li><strong>Legal Authorities:</strong> When required by law</li>
          </ul>
          <p className="text-gray-700 mt-4">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Encrypted data transmission (SSL/TLS)</li>
            <li>Secure cloud storage with access controls</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal data by authorized personnel</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">Our service integrates with:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Creem:</strong> Payment processing with their own privacy policies</li>
            <li><strong>Doubao AI:</strong> Text processing and image generation</li>
            <li><strong>Supabase:</strong> User authentication and data storage</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking</h2>
          <p className="text-gray-700">
            We use essential cookies to maintain your session and provide core functionality. We do not use tracking cookies for advertising purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Data Retention</h2>
          <p className="text-gray-700">
            We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Children's Privacy</h2>
          <p className="text-gray-700">
            Our service is not intended for users under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. International Data Transfers</h2>
          <p className="text-gray-700">
            Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Policy Updates</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy periodically. We will notify you of significant changes via email or service notifications.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> support@rednotewriter.com<br />
              <strong>Service:</strong> Text to RedNote<br />
              <strong>Subject:</strong> Privacy Policy Inquiry
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;