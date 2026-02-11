# Guide Complet: Déploiement sur Vercel + 5 API Gratuites

## Résumé Exécutif

Ce guide vous aidera à:
1. Corriger les erreurs de déploiement sur Vercel
2. Sélectionner et intégrer les 5 meilleures API gratuites
3. Écrire du code robuste et maintenable
4. Assurer la stabilité en production

---

## ❌ PROBLÈMES COURANTS DE DÉPLOIEMENT VERCEL

### Problème 1: Build Failure (Erreur de construction)

**Symptômes:**
```
Error: Build failed
ERROR in ./app/api/route.ts
Cannot find module '@supabase/supabase-js'
```

**Solutions:**

```bash
# 1. Vérifier les dépendances
npm install

# 2. Nettoyer le cache
rm -rf node_modules package-lock.json
npm install

# 3. Vérifier tsconfig.json
```

**Fichier: tsconfig.json (à corriger)**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Problème 2: Environment Variables Non Définies

**Symptômes:**
```
ReferenceError: process.env.NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solution: Ajouter les variables d'environnement**

```
# .env.local (en développement)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_role_key

# Dans Vercel Dashboard:
# Settings → Environment Variables
# Ajouter les mêmes variables
```

### Problème 3: Runtime Errors en Production

**Symptômes:**
```
500 Internal Server Error in /api/generate/code
```

**Solution: Ajouter du logging robuste**

```typescript
// lib/logger.ts
export const logger = {
  error: (context: string, error: any, data?: any) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${context}`, {
      message: error?.message,
      stack: error?.stack,
      data,
    })
  },
  info: (context: string, data?: any) => {
    console.log(`[${new Date().toISOString()}] INFO: ${context}`, data)
  },
  warn: (context: string, data?: any) => {
    console.warn(`[${new Date().toISOString()}] WARN: ${context}`, data)
  },
}
```

### Problème 4: Timeout des Fonctions Serverless

**Symptômes:**
```
FUNCTION_INVOCATION_TIMEOUT: Your function exceeded the time limit
```

**Solutions:**

1. **Réduire le travail dans les API routes**
2. **Utiliser des tâches asynchrones**
3. **Implémenter un polling**

```typescript
// app/api/generate/code/route.ts
export const maxDuration = 30 // Max 30s pour Hobby plan, 60s Pro

import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    logger.info('Code generation started')
    
    const { prompt } = await req.json()
    
    // Validation rapide
    if (!prompt || prompt.length < 10) {
      return Response.json(
        { error: 'Prompt too short' },
        { status: 400 }
      )
    }

    // Timeout pour les opérations longues
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 25000)
    )

    // Racing condition
    const result = await Promise.race([
      generateCodeWithAI(prompt),
      timeoutPromise,
    ])

    logger.info('Code generation completed')
    return Response.json({ code: result })
  } catch (error) {
    logger.error('Code generation failed', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
```

### Problème 5: CORS Issues

**Symptômes:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

```typescript
// app/api/route.ts
export async function POST(req: Request) {
  // Ajouter les headers CORS
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 200 })
  }

  // Votre logique ici
}
```

---

## ✅ TOP 5 API GRATUITES RECOMMANDÉES

### 1. **OpenAI API (Gratuit avec crédit)**

**Cas d'usage:** Génération de texte, code, chat

**Tarification:**
- $5 crédit gratuit pour 3 mois
- GPT-4 mini: très abordable
- Token counting gratuit

**Installation:**

```bash
npm install ai @ai-sdk/openai
```

**Code Robuste:**

```typescript
// lib/ai-service.ts
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

interface GenerateCodeParams {
  prompt: string
  language: 'typescript' | 'python' | 'javascript'
  maxTokens?: number
}

export async function generateCode({
  prompt,
  language,
  maxTokens = 2048,
}: GenerateCodeParams): Promise<string> {
  try {
    const systemPrompt = `You are an expert code generator. 
    Generate clean, well-commented, production-ready code in ${language}.
    Always include error handling and type safety.`

    const result = await generateText({
      model: openai('gpt-4-mini'),
      system: systemPrompt,
      prompt,
      maxTokens,
      temperature: 0.7,
    })

    if (!result.text) {
      throw new Error('Empty response from AI')
    }

    return result.text
  } catch (error) {
    console.error('[AI Service] Code generation failed:', error)
    throw new Error(
      `Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// Exemple d'utilisation
// const code = await generateCode({
//   prompt: 'Create a React component for a user profile',
//   language: 'typescript',
// })
```

**Intégration Vercel:**

```bash
# Ajouter dans Vercel Environment Variables
OPENAI_API_KEY=sk-...
```

---

### 2. **Groq API (Ultra-Fast, Gratuit)**

**Cas d'usage:** Génération rapide, streaming, temps réel

**Tarification:** Complètement gratuit avec limite de tokens

**Installation:**

```bash
npm install ai @ai-sdk/groq
```

**Code Robuste:**

```typescript
// lib/groq-service.ts
import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'

export async function streamCodeGeneration(prompt: string) {
  try {
    const stream = streamText({
      model: groq('mixtral-8x7b-32768'),
      system: 'Generate code solutions. Focus on clarity and best practices.',
      prompt,
      temperature: 0.5,
      maxTokens: 1024,
    })

    return stream
  } catch (error) {
    console.error('[Groq Service] Stream failed:', error)
    throw error
  }
}

// API Route
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt?.trim()) {
      return Response.json({ error: 'Empty prompt' }, { status: 400 })
    }

    const stream = await streamCodeGeneration(prompt)
    return stream.toTextStreamResponse()
  } catch (error) {
    return Response.json(
      { error: 'Generation failed' },
      { status: 500 }
    )
  }
}
```

**Avantages:**
- Ultra-rapide (1-2s pour réponses courtes)
- Pas de file d'attente
- Excellent pour streaming

---

### 3. **Supabase (Base de données + Auth Gratuite)**

**Cas d'usage:** Base de données, authentification, stockage

**Tarification:** 
- Free tier: 500MB storage
- Suffisant pour MVP/prototype

**Code Robuste:**

```typescript
// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[Supabase] User fetch failed:', error)
    return null
  }
}

export async function saveProject(userId: string, project: any) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        ...project,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[Supabase] Insert failed:', error)
    throw new Error('Failed to save project')
  }
}
```

---

### 4. **Vercel KV (Cache Redis Gratuit)**

**Cas d'usage:** Cache, rate limiting, sessions

**Tarification:** 10,000 commandes/jour gratuites

**Installation:**

```bash
npm install @vercel/kv
```

**Code Robuste:**

```typescript
// lib/cache.ts
import { kv } from '@vercel/kv'

const CACHE_TTL = 3600 // 1 heure

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    // Essayer d'obtenir du cache
    const cached = await kv.get<T>(key)
    if (cached) {
      console.log(`[Cache] Hit: ${key}`)
      return cached
    }

    // Sinon, récupérer et mettre en cache
    console.log(`[Cache] Miss: ${key}, fetching...`)
    const data = await fetchFn()
    await kv.setex(key, CACHE_TTL, JSON.stringify(data))
    return data
  } catch (error) {
    console.error(`[Cache] Error for key ${key}:`, error)
    // Retourner null ou valeur par défaut
    return await fetchFn()
  }
}

// Rate limiting
export async function checkRateLimit(userId: string): Promise<boolean> {
  try {
    const key = `ratelimit:${userId}`
    const limit = 100 // 100 requests
    const window = 3600 // par heure

    const count = await kv.incr(key)

    if (count === 1) {
      await kv.expire(key, window)
    }

    return count <= limit
  } catch (error) {
    console.error('[RateLimit] Check failed:', error)
    return true // Laisser passer en cas d'erreur
  }
}
```

---

### 5. **JSONBIN.io (JSON Storage Gratuit)**

**Cas d'usage:** Stockage de données JSON simple, backups

**Tarification:** 
- Gratuit: 10 bins
- 100KB par bin
- Illimité pour public

**Code Robuste:**

```typescript
// lib/jsonbin-service.ts
interface JSONBinConfig {
  bin_id: string
  api_key: string
}

export class JSONBinService {
  private config: JSONBinConfig

  constructor(bin_id: string, api_key: string) {
    this.config = { bin_id, api_key }
  }

  async read<T>(): Promise<T> {
    try {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${this.config.bin_id}/latest`,
        {
          headers: {
            'X-Access-Key': this.config.api_key,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const { record } = await response.json()
      return record as T
    } catch (error) {
      console.error('[JSONBin] Read failed:', error)
      throw error
    }
  }

  async write<T>(data: T): Promise<void> {
    try {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${this.config.bin_id}`,
        {
          method: 'PUT',
          headers: {
            'X-Access-Key': this.config.api_key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('[JSONBin] Write failed:', error)
      throw error
    }
  }
}

// Utilisation
// const service = new JSONBinService(process.env.JSONBIN_ID!, process.env.JSONBIN_KEY!)
// const data = await service.read()
// await service.write({ updated: Date.now() })
```

---

## 🔧 PATTERNS DE CODE ROBUSTE

### Pattern 1: Error Handling Standardisé

```typescript
// lib/error-handler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public context?: string
  ) {
    super(message)
  }
}

export function handleError(error: unknown, context: string) {
  console.error(`[${context}]`, error)

  if (error instanceof AppError) {
    return { error: error.message, status: error.statusCode }
  }

  if (error instanceof SyntaxError) {
    return { error: 'Invalid JSON', status: 400 }
  }

  if (error instanceof TypeError) {
    return { error: 'Type error', status: 400 }
  }

  return { error: 'Internal server error', status: 500 }
}

// Usage dans une API
export async function POST(req: Request) {
  try {
    const data = await req.json()
    // votre logique
  } catch (error) {
    const { error: message, status } = handleError(error, 'API Handler')
    return Response.json({ error: message }, { status })
  }
}
```

### Pattern 2: Retry Logic

```typescript
// lib/retry.ts
interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  backoffMultiplier?: number
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000, backoffMultiplier = 2 } = options

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) throw error

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1)
      console.log(`[Retry] Attempt ${attempt} failed, retrying in ${delay}ms`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error('Retry failed')
}

// Usage
// const result = await withRetry(() => fetchData(), { maxAttempts: 3 })
```

### Pattern 3: Input Validation

```typescript
// lib/validation.ts
import { z } from 'zod'

const CodeGenerationSchema = z.object({
  prompt: z.string().min(10).max(2000),
  language: z.enum(['typescript', 'javascript', 'python']),
  framework: z.enum(['react', 'nextjs', 'vue']).optional(),
})

type CodeGenerationRequest = z.infer<typeof CodeGenerationSchema>

export function validateRequest<T>(data: unknown, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        `Validation error: ${error.errors[0].message}`,
        400,
        'Validation'
      )
    }
    throw error
  }
}

// Usage
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = validateRequest(body, CodeGenerationSchema)
    // utiliser validated avec type safety
  } catch (error) {
    // erreur gérée
  }
}
```

---

## 📋 CHECKLIST DE DÉPLOIEMENT VERCEL

- [ ] **Package.json**: Vérifier les dépendances
- [ ] **Environment Variables**: Toutes les clés ajoutées
- [ ] **Build Command**: `npm run build` sans erreurs
- [ ] **Start Command**: `npm start` fonctionne
- [ ] **API Routes**: Testées localement
- [ ] **Error Handling**: Logging sur toutes les routes
- [ ] **CORS**: Configuré correctement
- [ ] **Rate Limiting**: Implémenté
- [ ] **Database**: Migrations exécutées
- [ ] **Monitoring**: Logs configurés

---

## 🚀 COMMANDES DE TEST

```bash
# Test local
npm run dev

# Test build
npm run build
npm run start

# Lint
npm run lint

# Check types
npx tsc --noEmit
```

---

## 📞 RESSOURCES UTILES

- **Vercel Docs**: https://vercel.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/api-routes
- **Supabase**: https://supabase.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Groq**: https://console.groq.com

---

**Bonne chance pour votre déploiement!** 🎉
