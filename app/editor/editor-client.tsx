'use client'

import { useEffect, useRef, useState } from 'react'

const targets = ['header', '#titulo-hero', '.diapasao-horizontal', '.filtro-btn', '#catalogo', '#customshop', '#servicos', '#sobre', '#depoimentos']

export default function EditorClient() {
  const iframe = useRef<HTMLIFrameElement>(null)
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState('Rascunho não salvo')
  function prepareFrame() {
    const doc = iframe.current?.contentDocument
    if (!doc) return
    targets.forEach((selector, index) => doc.querySelectorAll<HTMLElement>(selector).forEach((node) => {
      node.dataset.editorId = `element-${index}`; node.contentEditable = 'true'; node.draggable = true; node.style.outline = '1px dashed rgba(249,115,22,.65)'
      node.addEventListener('dragend', (event) => { const drag = event as DragEvent; const rect = node.getBoundingClientRect(); const x = Math.round(drag.clientX - rect.left - rect.width / 2); const y = Math.round(drag.clientY - rect.top - rect.height / 2); node.style.transform = `translate(${x}px, ${y}px)`; setStatus('Alteração pronta para salvar') })
    }))
  }
  async function save(publish = false) {
    const doc = iframe.current?.contentDocument
    if (!doc) return
    const elements = [...doc.querySelectorAll<HTMLElement>('[data-editor-id]')].map((node) => ({ id: node.dataset.editorId, text: node.innerText, transform: node.style.transform }))
    setStatus('Salvando…')
    const response = await fetch('/api/layout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ draft: { elements }, publish }) })
    setStatus(response.ok ? (publish ? 'Publicado' : 'Salvo no Neon') : 'Não foi possível salvar')
  }
  return <main style={{ minHeight: '100vh', background: '#020b16' }}><div style={{ position: 'fixed', zIndex: 100, top: 12, left: 12, right: 12, display: 'flex', gap: 8, alignItems: 'center', padding: 10, borderRadius: 12, background: '#0b1f38', color: 'white', fontFamily: 'Arial, sans-serif' }}><strong>Editor privado</strong><button onClick={() => { setEditing(!editing); setTimeout(prepareFrame, 0) }} style={{ marginLeft: 'auto', padding: '8px 12px' }}>{editing ? 'Parar edição' : 'Editar página'}</button><button onClick={() => save(false)} style={{ padding: '8px 12px', background: '#f97316', border: 0, borderRadius: 6, fontWeight: 700 }}>Salvar alterações</button><button onClick={() => save(true)} style={{ padding: '8px 12px', background: '#25D366', border: 0, borderRadius: 6 }}>Publicar</button><span style={{ fontSize: 12, color: '#c7e3ff' }}>{status}</span></div><iframe ref={iframe} onLoad={prepareFrame} title="Página editável" src="/index.html" style={{ width: '100%', height: '100vh', border: 0 }} /></main>
}
