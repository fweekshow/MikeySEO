import './globals.css'
import { inter } from './fonts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MikeySEO',
  description: 'Your AI SEO Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
} 