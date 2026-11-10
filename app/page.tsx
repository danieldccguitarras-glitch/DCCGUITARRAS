import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/editor')
  return <main><iframe title="DCCGuitarras" src="/index.html" style={{ width: '100%', height: '100vh', border: 0 }} /></main>
}
