# 🔧 Guide de Troubleshooting Complet

## Diagnostic Rapide

### 1️⃣ Build échoue sur Vercel

**Symptômes:**
```
ERROR: Build failed
Command 'npm run build' exited with 1
```

**Diagnostic:**

```bash
# Test local
npm run build

# Si ça marche localement
rm -rf .next node_modules
npm install
npm run build

# Vérifier TypeScript
npx tsc --noEmit

# Vérifier les imports
grep -r "import.*from" app/
```

**Solutions:**

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Cannot find module 'X'` | Dépendance manquante | `npm install X` |
| `Type '...' is not assignable` | Type error | Vérifier tsconfig.json |
| `Unexpected token` | Syntax error | Vérifier la syntaxe TSX |

**Fichier: next.config.mjs (corriger les erreurs)**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Ignorer les erreurs TS en build (attention: mauvaise pratique!)
    // ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorer les erreurs ESLint
    // ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
```

---

### 2️⃣ Variables d'environnement manquantes

**Symptômes:**
```
ReferenceError: process.env.OPENAI_API_KEY is undefined
Cannot read property 'split' of undefined
```

**Diagnostic:**

```bash
# Vérifier les env vars locales
cat .env.local

# Vérifier que Next.js charge les vars
echo $OPENAI_API_KEY

# Vérifier dans Vercel Dashboard
# Settings → Environment Variables
```

**Solutions:**

```bash
# 1. Créer .env.local
cp .env.example .env.local

# 2. Remplir les variables
# OPENAI_API_KEY=sk-proj-...

# 3. Redémarrer le serveur dev
npm run dev

# 4. Dans Vercel Dashboard:
# Settings → Environment Variables → Add
```

**Checklist des variables à ajouter:**

```env
# APIs
OPENAI_API_KEY=sk-proj-...
GROQ_API_KEY=gsk_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional
JSONBIN_BIN_ID=abc123
JSONBIN_API_KEY=xxx
```

**Code: Validation des env vars**

```typescript
// lib/env-validator.ts
function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const optional = [
    'OPENAI_API_KEY',
    'GROQ_API_KEY',
  ]

  for (const key of required) {
    if (!process.env[key]) {
      console.error(`❌ Missing required env var: ${key}`)
    }
  }

  for (const key of optional) {
    if (!process.env[key]) {
      console.warn(`⚠️ Missing optional env var: ${key}`)
    }
  }
}

validateEnv()
```

---

### 3️⃣ Erreurs d'API en production (500 errors)

**Symptômes:**
```
POST /api/generate/code 500 Internal Server Error
Error: OPENAI_API_KEY is not set
```

**Diagnostic:**

```bash
# Vérifier les logs Vercel
vercel logs

# Ou via Dashboard
# Deployments → [latest] → Functions
```

**Solutions:**

```typescript
// Ajouter du logging robuste
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    logger.info('API called', { path: req.url })

    const data = await req.json()
    logger.info('Request body parsed', data)

    // Validation
    if (!process.env.OPENAI_API_KEY) {
      logger.error('Missing env var', new Error('OPENAI_API_KEY'))
      return Response.json(
        { error: 'Configuration error' },
        { status: 500 }
      )
    }

    // Opération
    const result = await someOperation()
    logger.info('Operation successful', { result })

    return Response.json({ success: true, result })
  } catch (error) {
    logger.error('API failed', error)
    return Response.json(
      { error: 'Operation failed' },
      { status: 500 }
    )
  }
}
```

**Vérifier chaque couche:**

```bash
# 1. Vérifier la syntaxe
npx tsc --noEmit

# 2. Tester localement
curl http://localhost:3000/api/test

# 3. Vérifier les logs
vercel logs --tail

# 4. Tester avec retry
# Code avec withRetry() implémenté
```

---

### 4️⃣ Timeout Vercel (Function Invocation Timeout)

**Symptômes:**
```
FUNCTION_INVOCATION_TIMEOUT: Your serverless function exceeded the maximum
execution time of 30 seconds for the Hobby plan.
```

**Diagnostic:**

```typescript
// Ajouter du timing
const startTime = Date.now()
logger.info('Started', { startTime })

// ...opération lente...

const duration = Date.now() - startTime
logger.info('Completed', { duration })
```

**Solutions:**

```typescript
// 1. Augmenter maxDuration (Pro plan: 60s)
export const maxDuration = 60

// 2. Diviser le travail
export async function POST(req: Request) {
  // Retour immédiat
  const { prompt } = await req.json()

  // Queue la tâche longue
  queueBackgroundJob('generate-code', { prompt })

  return Response.json({ 
    status: 'queued',
    jobId: 'xxx'
  })
}

// 3. Implémenter un polling
// Client fait des requêtes GET pour vérifier le statut
```

**Pattern: Background Job**

```typescript
// API pour queuer
export async function POST(req: Request) {
  const { jobId, task } = await req.json()

  // Sauvegarder le job
  await supabase.insert('jobs', {
    id: jobId,
    task,
    status: 'pending',
  })

  // Retour immédiat
  return Response.json({ jobId, status: 'queued' })
}

// API pour checker le statut
export async function GET(req: Request) {
  const jobId = req.nextUrl.searchParams.get('jobId')

  const job = await supabase.query('jobs', { id: jobId })
  return Response.json(job)
}

// Tâche de fond (via Cron ou Vercel Workflows)
// Récupérer les jobs "pending"
// Les exécuter
// Mettre à jour le statut
```

---

### 5️⃣ CORS Errors

**Symptômes:**
```
Access to XMLHttpRequest from origin 'https://example.com' 
has been blocked by CORS policy
```

**Diagnostic:**

```bash
# Vérifier les headers de réponse
curl -i https://api.example.com/endpoint

# Vérifier la requête du navigateur
# DevTools → Network → Headers
```

**Solutions:**

```typescript
// Option 1: Ajouter les headers CORS
export async function GET(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 200 })
  }

  return Response.json({ data: 'ok' }, { headers })
}

// Option 2: Si c'est une API interne, faire la requête côté serveur
// Client → Votre API → API externe
export async function POST(req: Request) {
  const data = await req.json()

  // Requête serveur (pas de CORS)
  const response = await fetch('https://external-api.com/endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response
}
```

---

### 6️⃣ Rate Limiting Issues

**Symptômes:**
```
429 Too Many Requests
X-RateLimit-Remaining: 0
```

**Diagnostic:**

```typescript
// Vérifier le nombre de requêtes
const count = await kv.get(`ratelimit:${userId}`)
logger.info('Rate limit', { count })
```

**Solutions:**

```typescript
// Implémenter le rate limiting
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const userId = req.headers.get('x-user-id') || 'anonymous'

  const { allowed, remaining } = await checkRateLimit(userId, 100, 3600)

  if (!allowed) {
    return Response.json(
      { error: 'Rate limited' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 3600000).toISOString(),
        },
      }
    )
  }

  // Opération
  return Response.json({
    success: true,
    remaining,
  })
}
```

---

## 🔍 Debugging Avancé

### Ajouter des logs stratégiques

```typescript
// lib/debug-logger.ts
export class DebugLogger {
  static logAPICall(method: string, url: string, body?: any) {
    console.log(`[${method}] ${url}`, body)
  }

  static logResponse(status: number, data: any) {
    console.log(`[${status}]`, data)
  }

  static logError(context: string, error: Error) {
    console.error(`[ERROR] ${context}:`, {
      message: error.message,
      stack: error.stack,
    })
  }

  static logPerformance(operation: string, ms: number) {
    console.log(`[PERF] ${operation}: ${ms}ms`)
  }
}
```

### Tester les API manuellement

```bash
# Avec curl
curl -X POST http://localhost:3000/api/generate/code \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a button"}'

# Avec fetch
fetch('/api/generate/code', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Create a button' })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

# Avec Bruno ou Postman
# Importer: https://github.com/.../postman-collection.json
```

### Monitorer en production

```bash
# Logs Vercel
vercel logs --tail

# Erreurs
vercel logs --tail --filter error

# Spécifique
vercel logs --tail /api/generate/code
```

---

## 📋 Checklist de Déploiement

### Avant de déployer:

```bash
# 1. Build
npm run build
# ✅ Aucune erreur

# 2. Lint
npm run lint
# ✅ Aucune erreur

# 3. Types
npx tsc --noEmit
# ✅ Aucune erreur

# 4. Tester
npm run dev
# ✅ Navigation OK
# ✅ API OK
# ✅ Auth OK

# 5. Git
git add .
git commit -m "Ready for deployment"
git push
```

### Après le déploiement:

```bash
# 1. Vérifier la build
vercel logs

# 2. Tester l'app
curl https://your-app.vercel.app

# 3. Vérifier les API
curl https://your-app.vercel.app/api/health

# 4. Monitorer
vercel logs --tail
```

---

## 🚨 Erreurs Courantes

### Erreur: "Module not found"

```bash
# Solution
npm install missing-module
npm run build
```

### Erreur: "Type '...' has no properties"

```typescript
// ❌ Mauvais
const data = response.json()

// ✅ Correct
const data = await response.json()
```

### Erreur: "Function code too large"

```bash
# Réduire la taille du bundle
npm run build
# Vérifier les imports inutilisés

# Ou diviser en plusieurs routes
```

### Erreur: "Memory exceeded"

```typescript
// Éviter de charger de grandes données
// Utiliser la pagination
const projects = await supabase
  .from('projects')
  .select()
  .limit(10)
  .range(0, 9)
```

---

## 📞 Besoin d'aide?

1. **Vérifier les docs** - Consulter les fichiers `.md`
2. **Vérifier les logs** - `vercel logs --tail`
3. **Tester localement** - `npm run dev`
4. **Isoler le problème** - Tester chaque composant
5. **Contacter le support** - Vercel ou API provider

---

**Bonne chance! Vous trouverez la solution. 🚀**
