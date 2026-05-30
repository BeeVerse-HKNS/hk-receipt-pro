'use client'

import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react'

interface OcrStatusBadgeProps {
  engine: 'mindee' | 'tesseract'
  confidence: number
}

export default function OcrStatusBadge({ engine, confidence }: OcrStatusBadgeProps) {
  if (engine === 'mindee' && confidence >= 0.8) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
        <ShieldCheck className="h-3.5 w-3.5" />
        Mindee · {Math.round(confidence * 100)}%
      </span>
    )
  }

  if (engine === 'mindee' && confidence < 0.8) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
        <ShieldAlert className="h-3.5 w-3.5" />
        Mindee · {Math.round(confidence * 100)}%
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
      <Shield className="h-3.5 w-3.5" />
      Tesseract · {Math.round(confidence * 100)}%
    </span>
  )
}
