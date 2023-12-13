import './globals.css'
import type { Metadata } from 'next'
import { Lexend  } from 'next/font/google'
// import { Provider } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const lexend   = Lexend ({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Learning Journey",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lexend .className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
