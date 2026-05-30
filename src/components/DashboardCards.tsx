'use client'

import { Receipt, DollarSign, Clock, CheckCircle } from 'lucide-react'

interface DashboardCardsProps {
  totalReceipts: number
  totalAmount: number
  pendingCount: number
  approvedCount: number
}

const cards = [
  { key: 'totalReceipts', label: 'Total Receipts', icon: Receipt, color: 'bg-blue-50 text-blue-600' },
  { key: 'totalAmount', label: 'Total Amount (HKD)', icon: DollarSign, color: 'bg-indigo-50 text-indigo-600' },
  { key: 'pendingCount', label: 'Pending', icon: Clock, color: 'bg-amber-50 text-amber-600' },
  { key: 'approvedCount', label: 'Approved', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
] as const

export default function DashboardCards({ totalReceipts, totalAmount, pendingCount, approvedCount }: DashboardCardsProps) {
  const values: Record<string, string | number> = {
    totalReceipts,
    totalAmount: totalAmount.toLocaleString('en-HK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    pendingCount,
    approvedCount,
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-xl font-semibold text-gray-900">{values[card.key]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
