'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Edit } from 'lucide-react'
import Navbar from '@/components/Navbar'
import OcrStatusBadge from '@/components/OcrStatusBadge'
import type { Receipt } from '@/types'

const RECEIPT_TYPES = [
  { value: 'retail', label: 'Retail' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
] as const

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function ReceiptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [form, setForm] = useState({
    merchant_name: '',
    receipt_date: '',
    total_amount: '',
    tax_amount: '',
    receipt_type: 'other' as Receipt['receipt_type'],
    payment_method: '',
    description: '',
  })

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/receipts/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setReceipt(data)
        setForm({
          merchant_name: data.merchant_name || '',
          receipt_date: data.receipt_date || '',
          total_amount: data.total_amount?.toString() || '',
          tax_amount: data.tax_amount?.toString() || '',
          receipt_type: data.receipt_type || 'other',
          payment_method: data.payment_method || '',
          description: data.description || '',
        })
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchReceipt()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/receipts/${id}`, {
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
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const updated = await res.json()
      setReceipt(updated)
      setEditing(false)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/receipts/${id}`, { method: 'DELETE' })
      if (res.ok) router.push('/receipts')
    } catch {
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-gray-500">Receipt not found.</p>
          <Link href="/receipts" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to receipts
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/receipts" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Receipt Detail</h1>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[receipt.status] || 'bg-gray-100 text-gray-700'}`}>
              {receipt.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditing(false)
                    setForm({
                      merchant_name: receipt.merchant_name || '',
                      receipt_date: receipt.receipt_date || '',
                      total_amount: receipt.total_amount?.toString() || '',
                      tax_amount: receipt.tax_amount?.toString() || '',
                      receipt_type: receipt.receipt_type || 'other',
                      payment_method: receipt.payment_method || '',
                      description: receipt.description || '',
                    })
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {receipt.image_url && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <img
                  src={receipt.image_url}
                  alt="Receipt"
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {receipt.ocr_engine && receipt.confidence_score != null && (
              <div className="mt-4">
                <OcrStatusBadge engine={receipt.ocr_engine} confidence={receipt.confidence_score} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Name</label>
                  <input
                    type="text"
                    value={form.merchant_name}
                    onChange={(e) => setForm({ ...form, merchant_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Date</label>
                  <input
                    type="date"
                    value={form.receipt_date}
                    onChange={(e) => setForm({ ...form, receipt_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (HKD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.total_amount}
                      onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount (HKD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.tax_amount}
                      onChange={(e) => setForm({ ...form, tax_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Type</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-500">Merchant</p>
                  <p className="font-medium text-gray-900">{receipt.merchant_name || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{receipt.receipt_date || '—'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total (HKD)</p>
                    <p className="font-medium text-gray-900">{receipt.total_amount != null ? receipt.total_amount.toFixed(2) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tax (HKD)</p>
                    <p className="font-medium text-gray-900">{receipt.tax_amount != null ? receipt.tax_amount.toFixed(2) : '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900 capitalize">{receipt.receipt_type || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{receipt.payment_method || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium text-gray-900">{receipt.description || '—'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {receipt.line_items && receipt.line_items.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Qty</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Unit Price</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {receipt.line_items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{item.description}</td>
                    <td className="py-2 text-right text-gray-900">{item.quantity ?? '—'}</td>
                    <td className="py-2 text-right text-gray-900">{item.unit_price != null ? item.unit_price.toFixed(2) : '—'}</td>
                    <td className="py-2 text-right text-gray-900">{item.total_price != null ? item.total_price.toFixed(2) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">Are you sure you want to delete this receipt?</p>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
