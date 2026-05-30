import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HK Receipt Pro - SME Receipt Management',
  description: 'Hong Kong SME Receipt Management System with OCR and PDPO compliance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-HK">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
