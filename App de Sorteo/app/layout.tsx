import './globals.css'
import type { Metadata } from 'next'
import { Poppins, Bungee } from 'next/font/google'
import { Toaster } from "@/app/components/ui/toaster"


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-sans',
})

const bungee = Bungee({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Sorteo Nuevo Hundred',
  description: 'Aplicación de sorteo para Nuevo Hundred',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${bungee.variable}`}>
      <body>

        {children}
        <Toaster />

      </body>
    </html>
  )
}

