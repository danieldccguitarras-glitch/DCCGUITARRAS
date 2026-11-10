'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    const response = await fetch('/api/auth/sign-in/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, password }) })
    if (!response.ok) { setError('Email ou senha inválidos.'); setLoading(false); return }
    router.push('/editor'); router.refresh()
  }
  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#061426', color: 'white', fontFamily: 'Arial, sans-serif' }}><form onSubmit={submit} style={{ width: 'min(90vw, 380px)', display: 'grid', gap: 16, padding: 28, border: '1px solid #123052', borderRadius: 18, background: '#0b1f38' }}><h1 style={{ margin: 0 }}>Acesso ao editor</h1><p style={{ color: '#c7e3ff' }}>Entre para editar e salvar sua página.</p><input aria-label="Email" type="email" required placeholder="Seu email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 12, borderRadius: 8 }} /><input aria-label="Senha" type="password" required placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 8 }} /><button disabled={loading} style={{ padding: 13, border: 0, borderRadius: 8, background: '#f97316', fontWeight: 700 }}>{loading ? 'Entrando…' : 'Entrar'}</button>{error && <p role="alert" style={{ color: '#fca5a5' }}>{error}</p>}<a href="/sign-up" style={{ color: '#c7e3ff' }}>Criar meu primeiro acesso</a></form></main>
}
