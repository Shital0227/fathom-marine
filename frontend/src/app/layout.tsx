import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

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
    <html lang="en" className="bg-[#f8fafc]">
      <body className={`${geist.className} antialiased bg-[#f8fafc] text-[#1e293b]`}>
        {children}
         <Toaster 
          position="top-right"
          theme="light"
          richColors
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#1e293b',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '12px 16px'
            },
            classNames: {
              toast: 'transition-all duration-300',
            }
          }}
        />
      </body>
    </html>
  )
}
