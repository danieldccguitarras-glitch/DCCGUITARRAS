import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pageLayouts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user.id
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const rows = await db.select().from(pageLayouts).where(eq(pageLayouts.userId, userId)).limit(1)
  return NextResponse.json(rows[0] ?? { id: crypto.randomUUID(), userId, draft: {}, published: {} })
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await request.json() as { draft?: Record<string, unknown>; publish?: boolean }
  const existing = await db.select().from(pageLayouts).where(eq(pageLayouts.userId, userId)).limit(1)
  const id = existing[0]?.id ?? crypto.randomUUID()
  const draft = body.draft ?? existing[0]?.draft ?? {}
  if (existing[0]) {
    await db.update(pageLayouts).set({ draft, ...(body.publish ? { published: draft, publishedAt: new Date() } : {}), updatedAt: new Date() }).where(eq(pageLayouts.userId, userId))
  } else {
    await db.insert(pageLayouts).values({ id, userId, draft, published: body.publish ? draft : {}, publishedAt: body.publish ? new Date() : null })
  }
  return NextResponse.json({ ok: true, id })
}
