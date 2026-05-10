import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Sidebar } from '@/components/shared/Sidebar'
import { Navbar } from '@/components/shared/Navbar'
import { LayoutContent } from '@/components/shared/LayoutContent'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fathom Marine',
  description: 'Maritime Operations Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[#0a0f1e]">
      <body className={`${geist.className} antialiased bg-[#0a0f1e] text-[#f1f5f9]`}>
        <Sidebar />
        <Navbar />
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  )
}