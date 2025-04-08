import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MikeySEO - AI SEO Assistant',
  description: 'Your AI-powered SEO assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 