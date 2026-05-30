export interface Company {
  id: string
  name: string
  industry?: string
  created_at: string
}

export interface Profile {
  id: string
  company_id?: string
  name: string
  role: 'employee' | 'manager' | 'admin'
  department?: string
  created_at: string
}

export interface Receipt {
  id: string
  user_id: string
  company_id: string
  image_url?: string
  merchant_name?: string
  receipt_date?: string
  total_amount?: number
  tax_amount?: number
  currency: string
  receipt_type?: 'retail' | 'restaurant' | 'transportation' | 'utilities' | 'other'
  payment_method?: string
  description?: string
  line_items?: LineItem[]
  confidence_score?: number
  ocr_engine?: 'mindee' | 'tesseract'
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
}

export interface LineItem {
  description: string
  quantity?: number
  unit_price?: number
  total_price?: number
}

export interface ExpenseReport {
  id: string
  user_id: string
  company_id: string
  month: number
  year: number
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  total_amount?: number
  approved_by?: string
  created_at: string
}

export interface DashboardData {
  totalReceipts: number
  totalAmount: number
  pendingCount: number
  approvedCount: number
  categoryBreakdown: Record<string, number>
  monthlyTrend: { month: string; amount: number }[]
}
