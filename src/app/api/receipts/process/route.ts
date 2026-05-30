import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient, createServerComponentClient } from '@/lib/supabase-server'
import { processWithMindee } from '@/lib/mindee'
import { processWithTesseract } from '@/lib/tesseract'
import { parseReceiptText } from '@/lib/receipt-parser'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fileName } = await request.json()

    if (!imageUrl || !fileName) {
      return NextResponse.json({ error: 'Missing imageUrl or fileName' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('receipt-images')
      .download(fileName)

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Failed to download image' }, { status: 500 })
    }

    const arrayBuffer = await fileData.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    const mimeType = fileData.type || 'image/jpeg'

    let ocrEngine: 'mindee' | 'tesseract' = 'tesseract'
    let extractedData: any = null

    const mindeeResult = await processWithMindee(imageBuffer, mimeType)
    if (mindeeResult) {
      ocrEngine = 'mindee'
      extractedData = mindeeResult
    } else {
      const tesseractResult = await processWithTesseract(imageBuffer)
      const parsed = parseReceiptText(tesseractResult.text)
      ocrEngine = 'tesseract'
      extractedData = {
        ...parsed,
        confidence_score: parsed.confidence_score * tesseractResult.confidence,
      }
    }

    const serverClient = await createServerComponentClient()
    const { data: { user } } = await serverClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await serverClient
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    const { data: receipt, error: insertError } = await supabase
      .from('receipts')
      .insert({
        user_id: user.id,
        company_id: profile?.company_id,
        image_url: imageUrl,
        merchant_name: extractedData.merchant_name || null,
        receipt_date: extractedData.receipt_date || null,
        total_amount: extractedData.total_amount || null,
        tax_amount: extractedData.tax_amount || null,
        currency: extractedData.currency || 'HKD',
        receipt_type: extractedData.receipt_type || null,
        payment_method: extractedData.payment_method || null,
        line_items: extractedData.line_items || [],
        confidence_score: extractedData.confidence_score || 0,
        ocr_engine: ocrEngine,
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      receipt_id: receipt.id,
      merchant_name: extractedData.merchant_name,
      receipt_date: extractedData.receipt_date,
      total_amount: extractedData.total_amount,
      tax_amount: extractedData.tax_amount,
      currency: extractedData.currency || 'HKD',
      receipt_type: extractedData.receipt_type,
      payment_method: extractedData.payment_method,
      line_items: extractedData.line_items,
      confidence_score: extractedData.confidence_score,
      ocr_engine: ocrEngine,
    })
  } catch {
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
