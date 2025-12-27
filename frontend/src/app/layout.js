import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AWS Speed Test - Local Zone vs Regional',
  description: 'Compare EC2 performance between AWS Local Zone Chile and sa-east-1 São Paulo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
