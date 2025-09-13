  "use client"
  
  import React from 'react';
  import { useTranslation } from "@/contexts/TranslationContext";

export default function TermsOfUse() {
  
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('termsOfUse.title', 'Terms of Use')}</h1>
          <p className="text-lg text-gray-600">{t('termsOfUse.lastUpdated', { date: new Date().toLocaleDateString() })}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.acceptance.title', '1. Acceptance of Terms')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.acceptance.content', 'By accessing and using Jyotish Lok ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.')}
            </p>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.servicesDescription.title', '2. Services Description')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('termsOfUse.sections.servicesDescription.content', 'Jyotish Lok provides astrological services including but not limited to:')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('termsOfUse.sections.servicesDescription.services.kundli', 'Kundli analysis and horoscope services')}</li>
              <li>{t('termsOfUse.sections.servicesDescription.services.puja', 'Puja and spiritual consultation services')}</li>
              <li>{t('termsOfUse.sections.servicesDescription.services.gemstone', 'Gemstone and Rudraksha recommendations')}</li>
              <li>{t('termsOfUse.sections.servicesDescription.services.books', 'Sacred books and spiritual materials')}</li>
              <li>{t('termsOfUse.sections.servicesDescription.services.yantra', 'Yantra and Sadhana programs')}</li>
              <li>{t('termsOfUse.sections.servicesDescription.services.horoscope', 'Daily horoscope and astrological guidance')}</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.userResponsibilities.title', '3. User Responsibilities')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('termsOfUse.sections.userResponsibilities.content', 'As a user of our services, you agree to:')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('termsOfUse.sections.userResponsibilities.responsibilities.accurate', 'Provide accurate and truthful information')}</li>
              <li>{t('termsOfUse.sections.userResponsibilities.responsibilities.personal', 'Use our services for personal and spiritual growth only')}</li>
              <li>{t('termsOfUse.sections.userResponsibilities.responsibilities.respect', 'Respect the spiritual and cultural nature of our services')}</li>
              <li>{t('termsOfUse.sections.userResponsibilities.responsibilities.misuse', 'Not misuse or misrepresent our services')}</li>
              <li>{t('termsOfUse.sections.userResponsibilities.responsibilities.confidentiality', 'Maintain confidentiality of personal consultations')}</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.disclaimer.title', '4. Disclaimer')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.disclaimer.content', 'Our astrological services are provided for spiritual guidance and entertainment purposes only. We do not guarantee specific outcomes or results. Astrological predictions and recommendations should not replace professional medical, legal, or financial advice. Users should exercise their own judgment and discretion in all matters.')}
            </p>
          </section>

          {/* Payment and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.paymentRefunds.title', '5. Payment and Refunds')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('termsOfUse.sections.paymentRefunds.content', 'All services must be paid for in advance. We offer the following refund policy:')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('termsOfUse.sections.paymentRefunds.refundPolicy.full', 'Full refund within 24 hours of booking if service hasn\'t commenced')}</li>
              <li>{t('termsOfUse.sections.paymentRefunds.refundPolicy.partial', 'Partial refund for cancelled services with 48 hours notice')}</li>
              <li>{t('termsOfUse.sections.paymentRefunds.refundPolicy.no', 'No refunds for completed consultations or services')}</li>
              <li>{t('termsOfUse.sections.paymentRefunds.refundPolicy.processed', 'Refunds processed within 5-7 business days')}</li>
            </ul>
          </section>

          {/* Privacy and Confidentiality */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.privacyConfidentiality.title', '6. Privacy and Confidentiality')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.privacyConfidentiality.content', 'We are committed to protecting your privacy and maintaining the confidentiality of all personal information shared during consultations. Your birth details, personal concerns, and consultation records are kept strictly confidential and are never shared with third parties without your explicit consent.')}
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.intellectualProperty.title', '7. Intellectual Property')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.intellectualProperty.content', 'All content on this website, including text, graphics, logos, images, and software, is the property of Jyotish Lok and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our written permission.')}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.limitationLiability.title', '8. Limitation of Liability')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.limitationLiability.content', 'Jyotish Lok shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid for the specific service in question.')}
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.modifications.title', '9. Modifications to Terms')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.modifications.content', 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.')}
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.contactInformation.title', '10. Contact Information')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.contactInformation.content', 'If you have any questions about these Terms of Use, please contact us at:')}
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>{t('termsOfUse.sections.contactInformation.email', 'Email:')}</strong> info@jyotidarshan.in<br />
                <strong>{t('termsOfUse.sections.contactInformation.phone', 'Phone:')}</strong> +91 9773380099<br />
                <strong>{t('termsOfUse.sections.contactInformation.website', 'Website:')}</strong> jyotidarshan.com
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termsOfUse.sections.governingLaw.title', '11. Governing Law')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('termsOfUse.sections.governingLaw.content', 'These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.')}
            </p>
          </section>

        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
          >
            {t('termsOfUse.backToHome', '← Back to Home')}
          </a>
        </div>
      </div>
    </div>
  );
}
