'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import DashboardCards from '@/components/DashboardCards'
import Chart from '@/components/Chart'
import type { Receipt } from '@/types'

interface DashboardData {
  totalReceipts: number
  totalAmount: number
  pendingCount: number
  approvedCount: number
  categoryBreakdown: Record<string, number>
  monthlyTrend: { month: string; amount: number }[]
  recentReceipts: Receipt[]
  userName: string
  role: string
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Failed to load dashboard data.</p>
        </div>
      </main>
    )
  }

  const categoryData = Object.entries(data.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {data.userName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {data.role === 'admin' ? 'Company-wide overview' : 'Your receipt overview'}
          </p>
        </div>

        <DashboardCards
          totalReceipts={data.totalReceipts}
          totalAmount={data.totalAmount}
          pendingCount={data.pendingCount}
          approvedCount={data.approvedCount}
        />

        <Chart monthlyData={data.monthlyTrend} categoryData={categoryData} />

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Recent Receipts</h3>
            <Link href="/receipts" className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          {data.recentReceipts.length === 0 ? (
            <p className="text-sm text-gray-400">No receipts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">Merchant</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Date</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Type</th>
                    <th className="text-right py-2 text-gray-500 font-medium">Amount</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentReceipts.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50">
                      <td className="py-2 text-gray-900">{r.merchant_name || '—'}</td>
                      <td className="py-2 text-gray-600">{r.receipt_date || '—'}</td>
                      <td className="py-2 text-gray-600 capitalize">{r.receipt_type || 'other'}</td>
                      <td className="py-2 text-right text-gray-900">
                        ${(r.total_amount || 0).toLocaleString('en-HK', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                            r.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
