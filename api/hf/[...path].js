import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

const ALLOWED_PATH_PREFIXES = ['/oauth2/', '/mcp', '/v1/']

function isAllowedPath(path) {
  return ALLOWED_PATH_PREFIXES.some(p => path.startsWith(p))
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req) {
  const url  = new URL(req.url)
  const path = url.pathname.replace(/^\/api\/hf/, '') || '/'

  if (!isAllowedPath(path)) {
    return new Response('Not found', { status: 404 })
  }

  const origin = req.headers.get('origin') || '*'
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type, accept, mcp-session-id, x-hf-mode, x-user-token',
    'Access-Control-Allow-Credentials': 'true',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  // ── Dual mode: "own" (user's Higgsfield token) or "platform" (subscription credits) ──
  //
  //  Frontend sends:
  //    x-hf-mode: "own"      → pass Authorization header as-is
  //    x-hf-mode: "platform" → verify active subscription, inject platform key
  //
  const hfMode = req.headers.get('x-hf-mode') || 'own'

  const forward = new Headers()
  for (const [k, v] of req.headers.entries()) {
    if (['host', 'x-hf-mode', 'x-user-token'].includes(k)) continue
    forward.set(k, v)
  }

  if (hfMode === 'platform') {
    const userToken = req.headers.get('x-user-token')
    if (userToken) {
      const { data: { user } } = await supabase.auth.getUser(userToken)
      if (user) {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .single()

        if (!sub || !['active', 'trialing'].includes(sub.status)) {
          return new Response(JSON.stringify({ error: 'No active subscription' }), {
            status: 402,
            headers: { ...corsHeaders, 'content-type': 'application/json' },
          })
        }
      }
    }

    const platformKey = process.env.HF_PLATFORM_API_KEY
    if (!platformKey) {
      return new Response(JSON.stringify({ error: 'Platform key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'content-type': 'application/json' },
      })
    }
    forward.set('authorization', `Bearer ${platformKey}`)
  }

  const target   = `https://mcp.higgsfield.ai${path}${url.search}`
  const upstream = await fetch(target, {
    method: req.method,
    headers: forward,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  })

  const respHeaders = new Headers(corsHeaders)
  for (const [k, v] of upstream.headers.entries()) {
    if (['content-encoding', 'transfer-encoding', 'connection'].includes(k)) continue
    respHeaders.set(k, v)
  }

  // Stream back (critical for SSE during image/video generation)
  return new Response(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  })
}
