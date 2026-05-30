'use client'

import { Edit, Trash2 } from 'lucide-react'
import OcrStatusBadge from '@/components/OcrStatusBadge'
import type { Receipt } from '@/types'

interface ReceiptTableProps {
  receipts: Receipt[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function ReceiptTable({ receipts, onEdit, onDelete }: ReceiptTableProps) {
  if (receipts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No receipts found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Merchant</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium">Amount (HKD)</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">OCR Engine</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{receipt.receipt_date || '—'}</td>
                <td className="py-3 px-4 text-gray-900">{receipt.merchant_name || '—'}</td>
                <td className="py-3 px-4 text-gray-900 capitalize">{receipt.receipt_type || '—'}</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {receipt.total_amount != null ? receipt.total_amount.toFixed(2) : '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[receipt.status] || 'bg-gray-100 text-gray-700'}`}>
                    {receipt.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {receipt.ocr_engine && receipt.confidence_score != null ? (
                    <OcrStatusBadge engine={receipt.ocr_engine} confidence={receipt.confidence_score} />
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(receipt.id)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(receipt.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{receipt.merchant_name || '—'}</p>
                <p className="text-sm text-gray-500">{receipt.receipt_date || '—'}</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[receipt.status] || 'bg-gray-100 text-gray-700'}`}>
                {receipt.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 capitalize">{receipt.receipt_type || '—'}</span>
                {receipt.ocr_engine && receipt.confidence_score != null && (
                  <OcrStatusBadge engine={receipt.ocr_engine} confidence={receipt.confidence_score} />
                )}
              </div>
              <p className="font-semibold text-gray-900">
                {receipt.total_amount != null ? `HKD ${receipt.total_amount.toFixed(2)}` : '—'}
              </p>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => onEdit(receipt.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(receipt.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
