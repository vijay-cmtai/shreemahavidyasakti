"use client"

import React from 'react';
import { useTranslation } from "@/contexts/TranslationContext";

export default function PrivacyPolicy() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('privacy.title')}</h1>
          <p className="text-lg text-gray-600">{t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. {t('privacy.sections.introduction.title')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.introduction.content')}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. {t('privacy.sections.informationWeCollect.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{t('privacy.sections.informationWeCollect.personalInfo.title')}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>{t('privacy.sections.informationWeCollect.personalInfo.items.name')}</li>
                  <li>{t('privacy.sections.informationWeCollect.personalInfo.items.birthDetails')}</li>
                  <li>{t('privacy.sections.informationWeCollect.personalInfo.items.payment')}</li>
                  <li>{t('privacy.sections.informationWeCollect.personalInfo.items.preferences')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{t('privacy.sections.informationWeCollect.technicalInfo.title')}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>{t('privacy.sections.informationWeCollect.technicalInfo.items.ipAddress')}</li>
                  <li>{t('privacy.sections.informationWeCollect.technicalInfo.items.browser')}</li>
                  <li>{t('privacy.sections.informationWeCollect.technicalInfo.items.pagesVisited')}</li>
                  <li>{t('privacy.sections.informationWeCollect.technicalInfo.items.cookies')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. {t('privacy.sections.howWeUse.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.howWeUse.description')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('privacy.sections.howWeUse.purposes.consultations')}</li>
              <li>{t('privacy.sections.howWeUse.purposes.payments')}</li>
              <li>{t('privacy.sections.howWeUse.purposes.communication')}</li>
              <li>{t('privacy.sections.howWeUse.purposes.improvement')}</li>
              <li>{t('privacy.sections.howWeUse.purposes.compliance')}</li>
              <li>{t('privacy.sections.howWeUse.purposes.protection')}</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. {t('privacy.sections.informationSharing.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.informationSharing.description')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>{t('privacy.sections.informationSharing.circumstances.consent.title')}:</strong> {t('privacy.sections.informationSharing.circumstances.consent.description')}</li>
              <li><strong>{t('privacy.sections.informationSharing.circumstances.serviceProviders.title')}:</strong> {t('privacy.sections.informationSharing.circumstances.serviceProviders.description')}</li>
              <li><strong>{t('privacy.sections.informationSharing.circumstances.legalRequirements.title')}:</strong> {t('privacy.sections.informationSharing.circumstances.legalRequirements.description')}</li>
              <li><strong>{t('privacy.sections.informationSharing.circumstances.businessTransfers.title')}:</strong> {t('privacy.sections.informationSharing.circumstances.businessTransfers.description')}</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. {t('privacy.sections.dataSecurity.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.dataSecurity.description')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('privacy.sections.dataSecurity.measures.encryption')}</li>
              <li>{t('privacy.sections.dataSecurity.measures.secureStorage')}</li>
              <li>{t('privacy.sections.dataSecurity.measures.assessments')}</li>
              <li>{t('privacy.sections.dataSecurity.measures.limitedAccess')}</li>
              <li>{t('privacy.sections.dataSecurity.measures.paymentProcessing')}</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. {t('privacy.sections.dataRetention.title')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.dataRetention.content')}
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. {t('privacy.sections.yourRights.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.yourRights.description')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>{t('privacy.sections.yourRights.rights.access.title')}:</strong> {t('privacy.sections.yourRights.rights.access.description')}</li>
              <li><strong>{t('privacy.sections.yourRights.rights.correction.title')}:</strong> {t('privacy.sections.yourRights.rights.correction.description')}</li>
              <li><strong>{t('privacy.sections.yourRights.rights.deletion.title')}:</strong> {t('privacy.sections.yourRights.rights.deletion.description')}</li>
              <li><strong>{t('privacy.sections.yourRights.rights.portability.title')}:</strong> {t('privacy.sections.yourRights.rights.portability.description')}</li>
              <li><strong>{t('privacy.sections.yourRights.rights.optOut.title')}:</strong> {t('privacy.sections.yourRights.rights.optOut.description')}</li>
              <li><strong>{t('privacy.sections.yourRights.rights.complaints.title')}:</strong> {t('privacy.sections.yourRights.rights.complaints.description')}</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. {t('privacy.sections.cookies.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.cookies.description')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>{t('privacy.sections.cookies.types.essential.title')}:</strong> {t('privacy.sections.cookies.types.essential.description')}</li>
              <li><strong>{t('privacy.sections.cookies.types.analytics.title')}:</strong> {t('privacy.sections.cookies.types.analytics.description')}</li>
              <li><strong>{t('privacy.sections.cookies.types.preference.title')}:</strong> {t('privacy.sections.cookies.types.preference.description')}</li>
              <li><strong>{t('privacy.sections.cookies.types.marketing.title')}:</strong> {t('privacy.sections.cookies.types.marketing.description')}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {t('privacy.sections.cookies.control')}
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. {t('privacy.sections.thirdPartyServices.title')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.thirdPartyServices.content')}
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. {t('privacy.sections.childrensPrivacy.title')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.childrensPrivacy.content')}
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. {t('privacy.sections.internationalTransfers.title')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.internationalTransfers.content')}
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. {t('privacy.sections.changesToPolicy.title')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.changesToPolicy.content')}
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. {t('privacy.sections.contactUs.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.contactUs.description')}
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>{t('privacy.sections.contactUs.email')}:</strong> info@jyotidarshan.in<br />
                <strong>{t('privacy.sections.contactUs.phone')}:</strong> +91 9773380099<br />
                <strong>{t('privacy.sections.contactUs.website')}:</strong> jyotidarshan.com<br />
                <strong>{t('privacy.sections.contactUs.address')}:</strong> Jyotish Lok, India
              </p>
            </div>
          </section>

          {/* Data Protection Officer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. {t('privacy.sections.dataProtectionOfficer.title')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.dataProtectionOfficer.content')}
            </p>
          </section>

        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
          >
            ← {t('privacy.backToHome')}
          </a>
        </div>
      </div>
    </div>
  );
}
