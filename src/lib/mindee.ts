interface MindeeReceiptResult {
  merchant_name?: string
  receipt_date?: string
  total_amount?: number
  tax_amount?: number
  currency?: string
  receipt_type?: string
  payment_method?: string
  line_items?: { description: string; quantity?: number; unit_price?: number; total_price?: number }[]
  confidence_score?: number
}

export async function processWithMindee(imageBuffer: Buffer, mimeType: string): Promise<MindeeReceiptResult | null> {
  const apiKey = process.env.MINDEE_API_KEY
  if (!apiKey) return null

  try {
    const formData = new FormData()
    const uint8 = new Uint8Array(imageBuffer)
    const blob = new Blob([uint8], { type: mimeType })
    formData.append('document', blob, 'receipt.jpg')

    const response = await fetch('https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict', {
      method: 'POST',
      headers: { 'Authorization': `Mindee ${apiKey}` },
      body: formData,
    })

    if (!response.ok) return null

    const data = await response.json()
    const prediction = data.document?.inference?.prediction

    if (!prediction) return null

    return {
      merchant_name: prediction.supplier_name?.value || prediction.merchant_name?.value,
      receipt_date: prediction.date?.value,
      total_amount: prediction.total_amount?.value,
      tax_amount: prediction.tax?.value || prediction.total_tax?.value,
      currency: prediction.locale?.currency || 'HKD',
      receipt_type: prediction.receipt_type?.value,
      payment_method: prediction.payment_method?.value,
      line_items: (prediction.line_items || []).map((item: any) => ({
        description: item.description?.value || '',
        quantity: item.quantity?.value,
        unit_price: item.unit_price?.value,
        total_price: item.total_amount?.value,
      })),
      confidence_score: calculateConfidence(prediction),
    }
  } catch {
    return null
  }
}

function calculateConfidence(prediction: any): number {
  const fields = ['supplier_name', 'date', 'total_amount']
  let total = 0
  let count = 0
  for (const field of fields) {
    if (prediction[field]?.confidence !== undefined) {
      total += prediction[field].confidence
      count++
    }
  }
  return count > 0 ? Math.round((total / count) * 100) / 100 : 0.5
}
