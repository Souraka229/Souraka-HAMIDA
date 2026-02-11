# Exemples d'Intégration des 5 API Gratuites

## 📋 Table des Matières

1. [OpenAI - Code Generation](#openai)
2. [Groq - Fast Streaming](#groq)
3. [Supabase - Database](#supabase)
4. [Vercel KV - Cache](#vercelkv)
5. [JSONBin - Storage](#jsonbin)

---

## <a name="openai"></a>1. OPENAI - Génération de Code

### Setup

```bash
npm install ai @ai-sdk/openai
```

### Variables d'environnement

```env
OPENAI_API_KEY=sk-proj-...
```

### Exemple 1: API Route Simple

```typescript
// app/api/generate/code/route.ts

import { OpenAIService } from '@/lib/api-integrations'
import { logger } from '@/lib/logger'
import { AppError } from '@/lib/error-handler'

export const maxDuration = 30

const openai = new OpenAIService({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(req: Request) {
  try {
    const { prompt, language } = await req.json()

    // Validation
    if (!prompt || prompt.length < 10) {
      throw new AppError('Prompt must be at least 10 characters', 400)
    }

    logger.info('Code generation started', { language, promptLength: prompt.length })

    // Générer le code
    const code = await openai.generateCode(language, prompt)

    // Optionnel: Sauvegarder en cache
    // await cache.set(`code:${prompt.slice(0, 20)}`, code, { ttl: 3600 })

    return Response.json({
      success: true,
      code,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }

    logger.error('Code generation failed', error)
    return Response.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    )
  }
}
```

### Exemple 2: Client-side avec useChat

```typescript
// app/editor/code/page.tsx

'use client'

import { useState } from 'react'
import { FormButton } from '@/components/ui/FormButton'
import { CodeDisplay } from '@/components/editor/CodeDisplay'

export default function CodeEditorPage() {
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/generate/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language: 'typescript',
        }),
      })

      if (!response.ok) {
        const { error: errorMsg } = await response.json()
        setError(errorMsg || 'Generation failed')
        return
      }

      const { code: generatedCode } = await response.json()
      setCode(generatedCode)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Code Description</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what code you want to generate..."
          className="w-full h-32 p-4 border border-border rounded-lg"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <FormButton
        onClick={handleGenerate}
        isLoading={loading}
        className="w-full"
      >
        Generate Code
      </FormButton>

      {code && <CodeDisplay code={code} />}
    </div>
  )
}
```

---

## <a name="groq"></a>2. GROQ - Streaming Ultra-Rapide

### Setup

```bash
npm install ai @ai-sdk/groq
```

### Variables d'environnement

```env
GROQ_API_KEY=gsk_...
```

### Exemple: Streaming Response

```typescript
// app/api/generate/stream/route.ts

import { GroqService } from '@/lib/api-integrations'
import { logger } from '@/lib/logger'

export const maxDuration = 25

const groq = new GroqService({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt?.trim()) {
      return Response.json({ error: 'Empty prompt' }, { status: 400 })
    }

    logger.info('Groq streaming started')

    // Créer un ReadableStream
    const encoder = new TextEncoder()
    let buffer = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [{ role: 'user', content: prompt }],
                stream: true,
              }),
            }
          )

          if (!response.body) throw new Error('No response body')

          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')

            // Traiter les lignes complètes
            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i].trim()
              if (!line || !line.startsWith('data:')) continue

              const data = line.slice(5).trim()
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const chunk = parsed.choices[0]?.delta?.content
                if (chunk) {
                  controller.enqueue(encoder.encode(chunk))
                }
              } catch (e) {
                // Ignorer les erreurs JSON
              }
            }

            buffer = lines[lines.length - 1]
          }

          controller.close()
        } catch (error) {
          logger.error('Streaming error', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    logger.error('Groq endpoint error', error)
    return Response.json(
      { error: 'Streaming failed' },
      { status: 500 }
    )
  }
}
```

### Exemple Client: Consommer le Stream

```typescript
'use client'

import { useState } from 'react'

export default function StreamingPage() {
  const [output, setOutput] = useState('')

  const handleStream = async (prompt: string) => {
    try {
      const response = await fetch('/api/generate/stream', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error('Stream failed')
      if (!response.body) throw new Error('No body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        setOutput((prev) => prev + chunk)
      }
    } catch (error) {
      console.error('Stream error:', error)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleStream('Explain React hooks')}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Start Stream
      </button>
      <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
        {output}
      </pre>
    </div>
  )
}
```

---

## <a name="supabase"></a>3. SUPABASE - Base de Données

### Setup

```bash
npm install @supabase/supabase-js
```

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Pour les Server Actions
```

### Exemple 1: Créer un Projet

```typescript
// app/api/projects/create/route.ts

import { SupabaseService } from '@/lib/api-integrations'
import { logger } from '@/lib/logger'
import { withRetry } from '@/lib/retry'

const supabase = new SupabaseService({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
})

export async function POST(req: Request) {
  try {
    const { title, description, type } = await req.json()

    logger.info('Creating project', { title, type })

    const project = await supabase.insert('projects', {
      title,
      description,
      type,
      created_at: new Date().toISOString(),
      status: 'draft',
    })

    logger.info('Project created', { id: project.id })

    return Response.json({ success: true, project }, { status: 201 })
  } catch (error) {
    logger.error('Project creation failed', error)
    return Response.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
```

### Exemple 2: Server Component avec Caching

```typescript
// app/dashboard/projects/page.tsx

import { SupabaseService } from '@/lib/api-integrations'
import { CacheService } from '@/lib/api-integrations'

const supabase = new SupabaseService({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
})

const cache = new CacheService()

async function getProjects() {
  return cache.getOrSet(
    'projects:all',
    async () => {
      return await supabase.query('projects', { status: 'draft' })
    },
    { ttl: 3600 }
  )
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-4">
      {projects.map((p: any) => (
        <div key={p.id} className="p-4 border rounded">
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## <a name="vercelkv"></a>4. VERCEL KV - Cache & Rate Limiting

### Setup

```bash
npm install @vercel/kv
```

### Configuration

Vercel KV est automatiquement disponible sur Vercel. Juste ajouter via le dashboard.

### Exemple 1: Rate Limiting

```typescript
// lib/rate-limit.ts

import { kv } from '@vercel/kv'
import { logger } from './logger'

export async function checkRateLimit(
  userId: string,
  limit: number = 100,
  windowSeconds: number = 3600
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const key = `ratelimit:${userId}`
    const count = await kv.incr(key)

    // Définir l'expiration à la première request
    if (count === 1) {
      await kv.expire(key, windowSeconds)
    }

    const allowed = count <= limit
    const remaining = Math.max(0, limit - count)

    logger.info('Rate limit check', {
      userId,
      count,
      allowed,
      remaining,
    })

    return { allowed, remaining }
  } catch (error) {
    logger.error('Rate limit check failed', error)
    // En cas d'erreur, laisser passer (fail-open)
    return { allowed: true, remaining: limit }
  }
}
```

### Exemple 2: Cache avec Invalidation

```typescript
// lib/kv-cache.ts

import { kv } from '@vercel/kv'
import { logger } from './logger'

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  try {
    // Essayer le cache
    const cached = await kv.get<T>(key)
    if (cached) {
      logger.info('Cache hit', { key })
      return cached
    }

    logger.info('Cache miss, fetching', { key })
    const data = await fetchFn()

    // Mettre en cache
    await kv.setex(key, ttl, JSON.stringify(data))

    return data
  } catch (error) {
    logger.error('Cache operation failed', error, { key })
    // Fallback: juste récupérer les données
    return fetchFn()
  }
}

export async function invalidateCache(pattern: string) {
  try {
    logger.info('Invalidating cache', { pattern })
    // Supprimer les clés correspondantes
    // Note: Vercel KV n'a pas de scan pattern, donc gérer manuellement
  } catch (error) {
    logger.error('Cache invalidation failed', error)
  }
}
```

---

## <a name="jsonbin"></a>5. JSONBIN - JSON Storage

### Setup

1. Créer un compte à https://jsonbin.io
2. Créer un bin public
3. Ajouter l'API key

### Variables d'environnement

```env
JSONBIN_BIN_ID=abc123...
JSONBIN_API_KEY=xxx...
```

### Exemple: Configuration Centralisée

```typescript
// app/api/config/route.ts

import { JSONBinService } from '@/lib/api-integrations'
import { logger } from '@/lib/logger'

const jsonbin = new JSONBinService({
  binId: process.env.JSONBIN_BIN_ID || '',
  apiKey: process.env.JSONBIN_API_KEY || '',
})

// GET: Récupérer la config
export async function GET() {
  try {
    const config = await jsonbin.read()
    return Response.json(config)
  } catch (error) {
    logger.error('Config fetch failed', error)
    return Response.json({ error: 'Failed to load config' }, { status: 500 })
  }
}

// POST: Mettre à jour la config
export async function POST(req: Request) {
  try {
    const updates = await req.json()
    await jsonbin.merge(updates)

    logger.info('Config updated', updates)
    return Response.json({ success: true })
  } catch (error) {
    logger.error('Config update failed', error)
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}
```

---

## 🔗 Combinaison des API

### Exemple Complet: Code Generator avec Cache et DB

```typescript
// app/api/generate/smart/route.ts

import { OpenAIService, SupabaseService, CacheService } from '@/lib/api-integrations'
import { withRetry } from '@/lib/retry'
import { logger } from '@/lib/logger'
import { checkRateLimit } from '@/lib/rate-limit'

const openai = new OpenAIService({ apiKey: process.env.OPENAI_API_KEY || '' })
const supabase = new SupabaseService({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
})
const cache = new CacheService()

export async function POST(req: Request) {
  const userId = req.headers.get('x-user-id') || 'anonymous'

  try {
    // 1. Vérifier le rate limit
    const { allowed, remaining } = await checkRateLimit(userId, 50, 3600)
    if (!allowed) {
      return Response.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
      )
    }

    const { prompt, language } = await req.json()

    // 2. Vérifier le cache
    const cacheKey = `code:${prompt.slice(0, 30)}:${language}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      logger.info('Using cached code')
      return Response.json({
        code: cached,
        source: 'cache',
        remaining,
      })
    }

    // 3. Générer avec OpenAI (avec retry)
    logger.info('Generating new code')
    const code = await withRetry(
      () => openai.generateCode(language, prompt),
      { maxAttempts: 3, delayMs: 2000 }
    )

    // 4. Sauvegarder en cache
    await cache.set(cacheKey, code, { ttl: 7200 })

    // 5. Sauvegarder dans la DB
    await supabase.insert('code_generations', {
      user_id: userId,
      prompt,
      language,
      code,
      created_at: new Date().toISOString(),
    })

    logger.info('Code generated and saved')

    return Response.json({
      code,
      source: 'generated',
      remaining,
    })
  } catch (error) {
    logger.error('Generation failed', error, { userId })
    return Response.json(
      { error: 'Generation failed' },
      { status: 500 }
    )
  }
}
```

---

## 📊 Checklist d'Implémentation

- [ ] OpenAI: Variables d'env configurées
- [ ] Groq: Key ajoutée si utilisé
- [ ] Supabase: URL et keys correctes
- [ ] Vercel KV: Connecté au projet
- [ ] JSONBin: Bin ID et key configurés
- [ ] Logger: Logging en place
- [ ] Retry: Implémenté pour les API
- [ ] Rate Limiting: Activé
- [ ] Error Handling: Tests d'erreurs
- [ ] Tests locaux: `npm run dev` fonctionne

---

**Next Steps**: Tester chaque intégration et déployer sur Vercel! 🚀
