'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, X, UserPlus, Users, ClipboardList } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { createClientComponentClient } from '@/lib/supabase'
import type { Receipt } from '@/types'

type Tab = 'approvals' | 'employees'

interface EmployeeRow {
  id: string
  name: string
  email: string
  role: string
  department: string | null
}

interface PendingReceipt extends Receipt {
  profiles: { name: string } | null
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('approvals')
  const [pendingReceipts, setPendingReceipts] = useState<PendingReceipt[]>([])
  const [employees, setEmployees] = useState<EmployeeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState('employee')
  const [inviteDepartment, setInviteDepartment] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const fetchPendingReceipts = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') return

    const { data } = await supabase
      .from('receipts')
      .select('*, profiles:user_id(name)')
      .eq('company_id', profile.company_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (data) setPendingReceipts(data as unknown as PendingReceipt[])
  }, [supabase])

  const fetchEmployees = useCallback(async () => {
    const res = await fetch('/api/admin/employees')
    if (res.ok) {
      const data = await res.json()
      setEmployees(data.employees || [])
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchPendingReceipts(), fetchEmployees()]).finally(() =>
      setLoading(false)
    )
  }, [fetchPendingReceipts, fetchEmployees])

  const handleApproval = async (receiptId: string, action: 'approve' | 'reject') => {
    setActionLoading(receiptId)
    try {
      const res = await fetch(`/api/admin/approvals/${receiptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        setPendingReceipts((prev) =>
          prev.filter((r) => r.id !== receiptId)
        )
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)
    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName,
          role: inviteRole,
          department: inviteDepartment || undefined,
        }),
      })
      if (res.ok) {
        setInviteEmail('')
        setInviteName('')
        setInviteRole('employee')
        setInviteDepartment('')
        fetchEmployees()
      }
    } finally {
      setInviteLoading(false)
    }
  }

  const tabs: { key: Tab; label: string; icon: typeof ClipboardList }[] = [
    { key: 'approvals', label: 'Pending Approvals', icon: ClipboardList },
    { key: 'employees', label: 'Employee Management', icon: Users },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : activeTab === 'approvals' ? (
          <div className="space-y-4">
            {pendingReceipts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No pending receipts to review
              </div>
            ) : (
              pendingReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Date</span>
                      <p className="font-medium text-gray-900">
                        {receipt.receipt_date
                          ? new Date(receipt.receipt_date).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Merchant</span>
                      <p className="font-medium text-gray-900">
                        {receipt.merchant_name || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount</span>
                      <p className="font-medium text-gray-900">
                        {receipt.total_amount != null
                          ? `$${receipt.total_amount.toFixed(2)}`
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Employee</span>
                      <p className="font-medium text-gray-900">
                        {receipt.profiles?.name || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type</span>
                      <p className="font-medium text-gray-900 capitalize">
                        {receipt.receipt_type || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApproval(receipt.id, 'approve')}
                      disabled={actionLoading === receipt.id}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(receipt.id, 'reject')}
                      disabled={actionLoading === receipt.id}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Invite New Employee
              </h2>
              <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    {inviteLoading ? 'Inviting...' : 'Invite Employee'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Company Employees
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Role</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                          <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full capitalize">
                              {emp.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{emp.department || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
