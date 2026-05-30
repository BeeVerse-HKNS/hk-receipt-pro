import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-blue-200 hover:text-white text-sm transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4">Privacy Policy</h1>
          <p className="mt-2 text-blue-100 text-lg">HK Receipt Pro</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <p className="text-sm text-gray-500">Effective Date: May 30, 2025</p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              HK Receipt Pro is committed to protecting your personal data in accordance with the Personal Data (Privacy) Ordinance (Cap. 486) of Hong Kong.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data Collection</h2>
            <p className="text-gray-600 mb-3 leading-relaxed">We collect the following personal data:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Account information: name, email address, company name</li>
              <li>Receipt data: merchant names, amounts, dates, receipt images</li>
              <li>Usage data: login times, feature usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Purpose of Collection (DPP1)</h2>
            <p className="text-gray-600 mb-3 leading-relaxed">Your data is collected for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Expense management and reporting</li>
              <li>Receipt OCR processing</li>
              <li>Company workspace management</li>
              <li>Approval workflow processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Accuracy and Retention (DPP2)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>You can edit your receipt data at any time</li>
              <li>Data is retained for 3 years after last activity</li>
              <li>You can request early deletion</li>
              <li>Expired data is automatically purged</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Use (DPP3)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Your data is used only for expense management</li>
              <li>We do not share your data with third parties</li>
              <li>Receipt images are processed by Mindee API (if available) or Tesseract.js (browser-side)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Security (DPP4)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Row Level Security (RLS) in database</li>
              <li>HTTPS encryption for all connections</li>
              <li>JWT authentication</li>
              <li>Company data isolation</li>
              <li>No API keys in frontend code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Information Availability (DPP5)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>This privacy policy is publicly accessible</li>
              <li>Data collection notices are shown during registration</li>
              <li>Consent is required before data collection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Access (DPP6)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>You can export all your data at any time</li>
              <li>You can request account deletion</li>
              <li>Deleted data is permanently removed within 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Cross-Border Data Transfer</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Supabase servers are located in your selected region</li>
              <li>Mindee API processes receipt images in their servers</li>
              <li>You can opt out of Mindee by using Tesseract.js only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For privacy inquiries, contact your company administrator.
            </p>
          </section>
        </div>

        <div className="text-center pt-8 pb-4">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 text-white px-8 py-3 font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
