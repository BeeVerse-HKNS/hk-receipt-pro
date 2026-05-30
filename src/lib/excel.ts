import * as XLSX from 'xlsx'
import type { Receipt } from '@/types'

export function generateExpenseReport(receipts: Receipt[], month: number, year: number): Buffer {
  const wb = XLSX.utils.book_new()

  const detailsData = receipts.map((r, i) => ({
    'No.': i + 1,
    'Date': r.receipt_date || '',
    'Merchant': r.merchant_name || '',
    'Type': r.receipt_type || 'other',
    'Description': r.description || '',
    'Amount (HKD)': r.total_amount || 0,
    'Tax (HKD)': r.tax_amount || 0,
    'Payment Method': r.payment_method || '',
    'Status': r.status,
    'OCR Engine': r.ocr_engine || '',
    'Confidence': r.confidence_score || 0,
  }))

  const ws1 = XLSX.utils.json_to_sheet(detailsData)
  ws1['!cols'] = [
    { wch: 5 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 25 },
    { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 10 },
  ]
  XLSX.utils.book_append_sheet(wb, ws1, 'Details')

  const categoryTotals: Record<string, { count: number; amount: number }> = {}
  for (const r of receipts) {
    const type = r.receipt_type || 'other'
    if (!categoryTotals[type]) categoryTotals[type] = { count: 0, amount: 0 }
    categoryTotals[type].count++
    categoryTotals[type].amount += r.total_amount || 0
  }

  const summaryData = Object.entries(categoryTotals).map(([type, data]) => ({
    'Category': type,
    'Count': data.count,
    'Total (HKD)': Math.round(data.amount * 100) / 100,
  }))

  const totalAmount = receipts.reduce((sum, r) => sum + (r.total_amount || 0), 0)
  summaryData.push({
    'Category': 'TOTAL',
    'Count': receipts.length,
    'Total (HKD)': Math.round(totalAmount * 100) / 100,
  })

  const ws2 = XLSX.utils.json_to_sheet(summaryData)
  ws2['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Summary')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  return Buffer.from(buf)
}
