import Link from 'next/link'
import { Camera, Building2, BarChart3, CheckCircle, Download, Shield } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Smart OCR',
    description: 'Mindee API + Tesseract.js dual-engine OCR for accurate receipt data extraction',
  },
  {
    icon: Building2,
    title: 'Company Workspace',
    description: 'Multi-employee support with company accounts and role-based access',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description: 'Real-time expense overview with category breakdown and monthly trends',
  },
  {
    icon: CheckCircle,
    title: 'Approval Workflow',
    description: 'Submit, review, and approve expense claims with built-in workflow',
  },
  {
    icon: Download,
    title: 'Excel Export',
    description: 'Export HKD-formatted expense reports with category summaries',
  },
  {
    icon: Shield,
    title: 'PDPO Compliant',
    description: 'Built-in Hong Kong data privacy compliance with consent management',
  },
]

const comparisonRows = [
  { label: 'Price', us: '$0/month', expensify: '$5-9/user/mo', zoho: 'Free 3 users' },
  { label: 'User Limit', us: 'Unlimited', expensify: 'Per user pricing', zoho: '3 users free' },
  { label: 'HK Receipt OCR', us: true, expensify: false, zoho: false },
  { label: 'Chinese/English', us: true, expensify: false, zoho: false },
  { label: 'PDPO Compliance', us: true, expensify: false, zoho: false },
  { label: 'Approval Workflow', us: true, expensify: true, zoho: true },
  { label: 'Excel Export', us: true, expensify: true, zoho: true },
]

function CheckMark() {
  return <span className="text-green-500 font-bold text-lg">&#10003;</span>
}

function CrossMark() {
  return <span className="text-gray-400 font-bold text-lg">&#10007;</span>
}

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            HK SME Receipt Management
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-blue-100">
            Professional receipt processing for Hong Kong businesses. Upload, OCR, and export — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-white text-blue-700 px-8 py-3 font-semibold shadow-lg hover:bg-blue-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/guide"
              className="inline-block rounded-lg border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700">HK Receipt Pro</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Expensify</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Zoho Expense</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.label}</td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof row.us === 'boolean' ? (
                        row.us ? <CheckMark /> : <CrossMark />
                      ) : (
                        <span className="font-semibold text-blue-700">{row.us}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof row.expensify === 'boolean' ? (
                        row.expensify ? <CheckMark /> : <CrossMark />
                      ) : (
                        row.expensify
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof row.zoho === 'boolean' ? (
                        row.zoho ? <CheckMark /> : <CrossMark />
                      ) : (
                        row.zoho
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Start Managing Your Receipts Today
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
            Free forever for small teams. No credit card required.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-white text-blue-700 px-10 py-3 font-semibold shadow-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; 2025 HK Receipt Pro. Built for Hong Kong SMEs.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/guide" className="text-sm hover:text-white transition-colors">
              User Guide
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
