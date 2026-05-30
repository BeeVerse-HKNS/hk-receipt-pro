'use client'

import { useState } from 'react'

interface ConsentDialogProps {
  open: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function ConsentDialog({ open, onAccept, onDecline }: ConsentDialogProps) {
  const [agreed, setAgreed] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Data (Privacy) Ordinance Consent
        </h2>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 leading-relaxed max-h-64 overflow-y-auto">
          <p className="mb-3">
            Pursuant to the Personal Data (Privacy) Ordinance (Cap. 486) of Hong Kong, we hereby
            inform you of the following regarding the collection and processing of your personal data:
          </p>
          <p className="mb-3">
            <strong>Purpose of Collection:</strong> Your personal data (including but not limited to
            your name, email address, and employment information) is collected for the purpose of
            expense management, receipt processing, and report generation within this platform.
          </p>
          <p className="mb-3">
            <strong>Data Usage:</strong> Your data will be used solely for the operation of this
            expense management system, including receipt OCR processing, expense report generation,
            and administrative functions.
          </p>
          <p className="mb-3">
            <strong>Data Transfer:</strong> Your data may be transferred to authorized personnel
            within your organization for approval and review purposes. Data will not be transferred
            to third parties without your consent except as required by law.
          </p>
          <p className="mb-3">
            <strong>Access and Correction:</strong> You have the right to request access to and
            correction of your personal data held by us. Requests should be directed to your
            company administrator.
          </p>
          <p>
            <strong>Retention:</strong> Your personal data will be retained for as long as your
            account is active or as required by applicable laws and regulations.
          </p>
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the collection and processing of my personal data for expense management
            purposes in accordance with the Personal Data (Privacy) Ordinance of Hong Kong.
          </span>
        </label>

        <div className="flex items-center justify-end gap-3">
          <a
            href="/privacy"
            className="text-sm text-blue-600 hover:underline"
          >
            Privacy Policy
          </a>
          <button
            onClick={onDecline}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            disabled={!agreed}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
