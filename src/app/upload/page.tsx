'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import ReceiptUpload from '@/components/ReceiptUpload'
import OcrStatusBadge from '@/components/OcrStatusBadge'
import type { Receipt } from '@/types'

const RECEIPT_TYPES = [
  { value: 'retail', label: 'Retail' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
] as const

export default function UploadPage() {
  const [extractedData, setExtractedData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    merchant_name: '',
    receipt_date: '',
    total_amount: '',
    tax_amount: '',
    receipt_type: 'retail' as Receipt['receipt_type'],
    payment_method: '',
    description: '',
  })

  const handleUploadComplete = (data: any) => {
    setExtractedData(data)
    setForm({
      merchant_name: data.merchant_name || '',
      receipt_date: data.receipt_date || '',
      total_amount: data.total_amount?.toString() || '',
      tax_amount: data.tax_amount?.toString() || '',
      receipt_type: data.receipt_type || 'retail',
      payment_method: data.payment_method || '',
      description: '',
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/receipts/${extractedData.receipt_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_name: form.merchant_name || null,
          receipt_date: form.receipt_date || null,
          total_amount: form.total_amount ? parseFloat(form.total_amount) : null,
          tax_amount: form.tax_amount ? parseFloat(form.tax_amount) : null,
          receipt_type: form.receipt_type,
          payment_method: form.payment_method || null,
          description: form.description || null,
          status: 'pending',
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setExtractedData(null)
      setForm({
        merchant_name: '',
        receipt_date: '',
        total_amount: '',
        tax_amount: '',
        receipt_type: 'retail',
        payment_method: '',
        description: '',
      })
    } catch {
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Receipt</h1>

        <ReceiptUpload onUploadComplete={handleUploadComplete} />

        {extractedData && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Extracted Data</h2>
              <OcrStatusBadge
                engine={extractedData.ocr_engine || 'tesseract'}
                confidence={extractedData.confidence_score || 0}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
                  <input
                    type="text"
                    value={form.merchant_name}
                    onChange={(e) => setForm({ ...form, merchant_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={form.receipt_date}
                    onChange={(e) => setForm({ ...form, receipt_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="text"
                    value={form.total_amount}
                    onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount</label>
                  <input
                    type="text"
                    value={form.tax_amount}
                    onChange={(e) => setForm({ ...form, tax_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={form.receipt_type}
                    onChange={(e) => setForm({ ...form, receipt_type: e.target.value as Receipt['receipt_type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {RECEIPT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={form.payment_method}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Receipt'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
