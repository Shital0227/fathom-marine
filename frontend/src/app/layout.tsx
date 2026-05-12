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
    <html lang="en" className="bg-[#0a0f1e]">
      <body className={`${geist.className} antialiased bg-[#0a0f1e] text-[#f1f5f9]`}>
        {children}
         <Toaster 
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: '#0f1729',
              border: '1px solid #1e2d4a',
              color: '#f1f5f9',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
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
