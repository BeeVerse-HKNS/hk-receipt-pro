import type { Receipt, LineItem } from '@/types'

interface ParsedReceipt {
  merchant_name?: string
  receipt_date?: string
  total_amount?: number
  tax_amount?: number
  currency: string
  receipt_type?: 'retail' | 'restaurant' | 'transportation' | 'utilities' | 'other'
  payment_method?: string
  line_items?: LineItem[]
  confidence_score: number
}

const HK_MERCHANTS: Record<string, string> = {
  '翠華': 'restaurant',
  '大家樂': 'restaurant',
  '美心': 'restaurant',
  '麥當勞': 'restaurant',
  '肯德基': 'restaurant',
  '星巴克': 'restaurant',
  '7-eleven': 'retail',
  'ok便利店': 'retail',
  '百佳': 'retail',
  '惠康': 'retail',
  '萬寧': 'retail',
  '屈臣氏': 'retail',
  'mtr': 'transportation',
  '港鐵': 'transportation',
  '的士': 'transportation',
  '中電': 'utilities',
  '煤氣': 'utilities',
  '水務': 'utilities',
}

const PAYMENT_KEYWORDS: Record<string, string> = {
  '現金': 'Cash',
  'cash': 'Cash',
  '八達通': 'Octopus',
  'octopus': 'Octopus',
  '信用卡': 'Credit Card',
  'credit card': 'Credit Card',
  'visa': 'Credit Card',
  'mastercard': 'Credit Card',
  '支付寶': 'Alipay',
  'alipay': 'Alipay',
  '微信': 'WeChat Pay',
  'wechat': 'WeChat Pay',
  'fps': 'FPS',
  '轉數快': 'FPS',
}

export function parseReceiptText(text: string): ParsedReceipt {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const merchant_name = extractMerchant(lines)
  const receipt_type = classifyType(merchant_name, lines)
  const total_amount = extractTotal(lines)
  const tax_amount = extractTax(lines)
  const receipt_date = extractDate(lines)
  const payment_method = extractPaymentMethod(lines)
  const currency = 'HKD'

  return {
    merchant_name,
    receipt_date,
    total_amount,
    tax_amount,
    currency,
    receipt_type,
    payment_method,
    confidence_score: 0.6,
  }
}

function extractMerchant(lines: string[]): string | undefined {
  if (lines.length === 0) return undefined
  for (const line of lines.slice(0, 5)) {
    for (const merchant of Object.keys(HK_MERCHANTS)) {
      if (line.toLowerCase().includes(merchant.toLowerCase())) {
        return line
      }
    }
  }
  return lines[0]
}

function classifyType(merchant: string | undefined, lines: string[]): ParsedReceipt['receipt_type'] {
  if (merchant) {
    for (const [keyword, type] of Object.entries(HK_MERCHANTS)) {
      if (merchant.toLowerCase().includes(keyword.toLowerCase())) {
        return type as ParsedReceipt['receipt_type']
      }
    }
  }
  const text = lines.join(' ').toLowerCase()
  if (text.includes('餐') || text.includes('food') || text.includes('restaurant')) return 'restaurant'
  if (text.includes('車') || text.includes('transport') || text.includes('mtr')) return 'transportation'
  if (text.includes('電') || text.includes('水') || text.includes('煤氣') || text.includes('utility')) return 'utilities'
  return 'retail'
}

function extractTotal(lines: string[]): number | undefined {
  const patterns = [
    /(?:總計|總額|合計|total|amount|合共)\s*[:：]?\s*[hk$]?\s*(\d+[.,]\d{2})/i,
    /[hk$]\s*(\d+[.,]\d{2})\s*$/im,
  ]
  for (const pattern of patterns) {
    for (const line of lines) {
      const match = line.match(pattern)
      if (match) {
        return parseFloat(match[1].replace(',', ''))
      }
    }
  }
  return undefined
}

function extractTax(lines: string[]): number | undefined {
  const patterns = [
    /(?:稅|tax|gst)\s*[:：]?\s*[hk$]?\s*(\d+[.,]\d{2})/i,
  ]
  for (const pattern of patterns) {
    for (const line of lines) {
      const match = line.match(pattern)
      if (match) {
        return parseFloat(match[1].replace(',', ''))
      }
    }
  }
  return undefined
}

function extractDate(lines: string[]): string | undefined {
  const patterns = [
    /(\d{4}[-/]\d{2}[-/]\d{2})/,
    /(\d{2}[-/]\d{2}[-/]\d{4})/,
    /(\d{2}[-/]\d{2}[-/]\d{2})/,
  ]
  for (const pattern of patterns) {
    for (const line of lines) {
      const match = line.match(pattern)
      if (match) return match[1]
    }
  }
  return undefined
}

function extractPaymentMethod(lines: string[]): string | undefined {
  const text = lines.join(' ')
  for (const [keyword, method] of Object.entries(PAYMENT_KEYWORDS)) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      return method
    }
  }
  return undefined
}
