import Link from 'next/link'

const gettingStartedSteps = [
  { step: 1, title: 'Register your company account', description: 'Create your company workspace with your business email. Each company gets its own isolated space for receipt management.' },
  { step: 2, title: 'Login and invite team members', description: 'After registration, invite colleagues to join your workspace. Assign roles (admin or employee) to control access levels.' },
  { step: 3, title: 'Upload your first receipt', description: 'Use the upload page to submit a receipt image. Our OCR engine will automatically extract merchant name, amount, date, and receipt type.' },
]

const uploadMethods = [
  { title: 'Upload from computer', description: 'Drag and drop receipt images directly onto the upload area, or click to browse and select files from your device.' },
  { title: 'Upload from mobile camera', description: 'On mobile devices, tap the upload area to open your camera and take a photo of the receipt directly.' },
]

const supportedFormats = [
  { format: 'JPG', note: 'Most common format from phone cameras' },
  { format: 'PNG', note: 'Lossless format, great for clear text' },
  { format: 'WEBP', note: 'Modern format with smaller file sizes' },
]

const ocrEngines = [
  { name: 'Mindee API', type: 'Primary', description: 'High-accuracy OCR with structured output. Best for supported receipt types. Requires API key configuration.' },
  { name: 'Tesseract.js', type: 'Fallback', description: 'Browser-side OCR engine. Always available, no API key needed. Runs entirely in your browser.' },
]

const receiptTypes = [
  {
    category: 'Retail (零售)',
    examples: ['7-Eleven', 'OK便利店', '百佳', '惠康', '萬寧', '屈臣氏'],
  },
  {
    category: 'Restaurant (餐飲)',
    examples: ['翠華', '大家樂', '美心', 'Starbucks'],
  },
  {
    category: 'Transportation (交通)',
    examples: ['MTR', 'Taxi', 'Bus'],
  },
  {
    category: 'Utilities (公用)',
    examples: ['中電', '煤氣', '水務署'],
  },
  {
    category: 'Other (其他)',
    examples: ['Any receipt not in the above categories'],
  },
]

const faqItems = [
  {
    question: 'Is it really free?',
    answer: 'Yes, free forever for up to 50,000 monthly active users. No credit card required, no hidden fees.',
  },
  {
    question: 'What OCR engine is used?',
    answer: 'Mindee API (primary) for high-accuracy structured extraction, with Tesseract.js (fallback) as a browser-side alternative that is always available.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use Row Level Security (RLS) in the database, HTTPS encryption for all connections, JWT authentication, and full PDPO compliance.',
  },
  {
    question: 'Can I export to Excel?',
    answer: 'Yes. Generate monthly expense reports and download as Excel files with HKD currency formatting and category summary sheets.',
  },
  {
    question: 'What languages are supported?',
    answer: 'English and Traditional Chinese (繁體中文). The interface and OCR support both languages.',
  },
]

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-blue-200 hover:text-white text-sm transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4">User Guide</h1>
          <p className="mt-2 text-blue-100 text-lg">Everything you need to know about HK Receipt Pro</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
          <div className="space-y-6">
            {gettingStartedSteps.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploading Receipts</h2>
          <div className="space-y-4">
            {uploadMethods.map((method) => (
              <div key={method.title} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900">{method.title}</h3>
                <p className="text-gray-600 mt-1">{method.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported Formats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {supportedFormats.map((fmt) => (
                <div key={fmt.format} className="border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-bold text-blue-600 text-lg">{fmt.format}</p>
                  <p className="text-sm text-gray-500 mt-1">{fmt.note}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">Maximum file size: 10MB per receipt</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">OCR Processing</h2>
          <div className="space-y-4">
            {ocrEngines.map((engine) => (
              <div key={engine.name} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{engine.name}</h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${engine.type === 'Primary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                    {engine.type}
                  </span>
                </div>
                <p className="text-gray-600">{engine.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900">Reviewing Extracted Data</h3>
            <p className="text-blue-800 mt-1">After OCR processing, review the extracted data (merchant, amount, date, type) and make any necessary corrections before saving. All fields are editable.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported HK Receipt Types</h2>
          <div className="space-y-4">
            {receiptTypes.map((type) => (
              <div key={type.category} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900">{type.category}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {type.examples.map((example) => (
                    <span key={example} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Receipts</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">View, Edit, Delete</h3>
              <p className="text-gray-600 mt-1">Access all your receipts from the dashboard. Click any receipt to view details, edit extracted data, or delete it.</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter &amp; Search</h3>
              <p className="text-gray-600 mt-1">Filter receipts by type (retail, restaurant, transportation, utilities, other), date range, or processing status.</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Submit for Approval</h3>
              <p className="text-gray-600 mt-1">Submit receipts to your company admin for approval. Track the status of each submission (pending, approved, rejected).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exporting Reports</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Generate Monthly Expense Report</h3>
              <p className="text-gray-600 mt-1">Select a month and generate a comprehensive expense report covering all approved receipts in that period.</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Download as Excel</h3>
              <p className="text-gray-600 mt-1">Export reports as Excel (.xlsx) files with HKD currency formatting for all amounts.</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Summary Sheet</h3>
              <p className="text-gray-600 mt-1">Each report includes a summary sheet with category totals (retail, restaurant, transportation, utilities, other) and grand total.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm group">
                <summary className="p-6 cursor-pointer list-none flex items-center justify-between font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {item.question}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

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
