import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'DCCGuitarras', description: 'Luthieria artesanal e Custom Shop' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body style={{ margin: 0 }}>{children}</body></html>
}
