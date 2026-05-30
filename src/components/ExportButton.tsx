'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  reportId: string
  month: number
  year: number
}

export default function ExportButton({ reportId, month, year }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/${reportId}/download`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `expense-report-${month}-${year}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
    >
      <Download className="h-4 w-4" />
      {loading ? 'Downloading...' : 'Download'}
    </button>
  )
}
