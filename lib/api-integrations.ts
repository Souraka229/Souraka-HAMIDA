/**
 * Intégration des 5 Top API Gratuites
 * Chacun avec gestion d'erreur robuste et retry logic
 */

import { withRetry } from './retry'
import { logger } from './logger'

// ============================================
// 1. OPENAI API - Génération de contenu
// ============================================

export interface OpenAIConfig {
  apiKey: string
  model?: string
}

export class OpenAIService {
  private apiKey: string
  private model: string
  private apiUrl = 'https://api.openai.com/v1'

  constructor({ apiKey, model = 'gpt-4-mini' }: OpenAIConfig) {
    if (!apiKey) throw new Error('OpenAI API key is required')
    this.apiKey = apiKey
    this.model = model
  }

  async generateText(prompt: string, maxTokens = 1024): Promise<string> {
    return withRetry(
      async () => {
        logger.info('OpenAI: Generating text', { model: this.model })

        const response = await fetch(`${this.apiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature: 0.7,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(`OpenAI Error: ${error.error?.message || 'Unknown'}`)
        }

        const data = await response.json()
        const text = data.choices[0]?.message?.content

        if (!text) throw new Error('Empty response from OpenAI')

        logger.info('OpenAI: Text generated successfully')
        return text
      },
      { maxAttempts: 3, delayMs: 2000 }
    )
  }

  async generateCode(language: string, description: string): Promise<string> {
    const prompt = `Generate production-ready ${language} code for: ${description}
    Requirements:
    - Include error handling
    - Add comments
    - Follow best practices
    - Make it maintainable`

    return this.generateText(prompt, 2048)
  }
}

// ============================================
// 2. GROQ API - Streaming ultra-rapide
// ============================================

export interface GroqConfig {
  apiKey: string
  model?: string
}

export class GroqService {
  private apiKey: string
  private model: string
  private apiUrl = 'https://api.groq.com/openai/v1'

  constructor({ apiKey, model = 'mixtral-8x7b-32768' }: GroqConfig) {
    if (!apiKey) throw new Error('Groq API key is required')
    this.apiKey = apiKey
    this.model = model
  }

  async streamText(prompt: string): Promise<ReadableStream<string>> {
    logger.info('Groq: Starting stream', { model: this.model })

    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        temperature: 0.5,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Groq Error: ${error.error?.message || 'Unknown'}`)
    }

    if (!response.body) throw new Error('No response body')

    return response.body.pipeThrough(
      new TextEncoderStream().pipeThrough(
        new TextDecoderStream()
      )
    ) as ReadableStream<string>
  }

  async generateCompletion(prompt: string): Promise<string> {
    return withRetry(
      async () => {
        logger.info('Groq: Generating completion')

        const response = await fetch(`${this.apiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        return data.choices[0]?.message?.content || ''
      },
      { maxAttempts: 2, delayMs: 1000 }
    )
  }
}

// ============================================
// 3. SUPABASE - Base de données
// ============================================

import { createClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceKey?: string
}

export class SupabaseService {
  private client: ReturnType<typeof createClient>

  constructor({ url, anonKey }: SupabaseConfig) {
    if (!url || !anonKey) throw new Error('Supabase config incomplete')
    this.client = createClient(url, anonKey)
  }

  async query<T>(
    table: string,
    filter?: Record<string, any>
  ): Promise<T[]> {
    return withRetry(
      async () => {
        logger.info('Supabase: Querying table', { table })

        let query = this.client.from(table).select()

        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            query = query.eq(key, value) as any
          })
        }

        const { data, error } = await query

        if (error) throw error

        logger.info('Supabase: Query successful', { count: data?.length })
        return (data || []) as T[]
      },
      { maxAttempts: 3 }
    )
  }

  async insert<T>(table: string, data: any): Promise<T> {
    return withRetry(
      async () => {
        logger.info('Supabase: Inserting data', { table })

        const { data: result, error } = await this.client
          .from(table)
          .insert([data])
          .select()
          .single()

        if (error) throw error

        logger.info('Supabase: Insert successful')
        return result as T
      },
      { maxAttempts: 2 }
    )
  }

  async update<T>(
    table: string,
    id: string,
    updates: any
  ): Promise<T> {
    return withRetry(
      async () => {
        logger.info('Supabase: Updating data', { table, id })

        const { data, error } = await this.client
          .from(table)
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        logger.info('Supabase: Update successful')
        return data as T
      },
      { maxAttempts: 2 }
    )
  }

  async delete(table: string, id: string): Promise<boolean> {
    return withRetry(
      async () => {
        logger.info('Supabase: Deleting data', { table, id })

        const { error } = await this.client
          .from(table)
          .delete()
          .eq('id', id)

        if (error) throw error

        logger.info('Supabase: Delete successful')
        return true
      },
      { maxAttempts: 2 }
    )
  }
}

// ============================================
// 4. VERCEL KV - Cache & Session
// ============================================

export interface CacheOptions {
  ttl?: number
  namespace?: string
}

export class CacheService {
  private namespace: string

  constructor(namespace = 'app') {
    this.namespace = namespace
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      logger.info('Cache: Getting key', { key })

      // Simulated KV get (à remplacer par @vercel/kv en production)
      const fullKey = this.getKey(key)
      // const value = await kv.get<T>(fullKey)
      // return value || null

      return null
    } catch (error) {
      logger.error('Cache: Get failed', error, { key })
      return null
    }
  }

  async set<T>(
    key: string,
    value: T,
    options?: CacheOptions
  ): Promise<void> {
    try {
      logger.info('Cache: Setting key', { key })

      const fullKey = this.getKey(key)
      const ttl = options?.ttl || 3600

      // const serialized = JSON.stringify(value)
      // await kv.setex(fullKey, ttl, serialized)
    } catch (error) {
      logger.error('Cache: Set failed', error, { key })
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      logger.info('Cache: Deleting key', { key })

      const fullKey = this.getKey(key)
      // await kv.del(fullKey)
      return true
    } catch (error) {
      logger.error('Cache: Delete failed', error, { key })
      return false
    }
  }

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached) return cached

    const value = await fetchFn()
    await this.set(key, value, options)
    return value
  }
}

// ============================================
// 5. JSONBIN - JSON Storage
// ============================================

export interface JSONBinConfig {
  binId: string
  apiKey: string
}

export class JSONBinService {
  private binId: string
  private apiKey: string
  private apiUrl = 'https://api.jsonbin.io/v3'

  constructor({ binId, apiKey }: JSONBinConfig) {
    if (!binId || !apiKey) throw new Error('JSONBin config incomplete')
    this.binId = binId
    this.apiKey = apiKey
  }

  async read<T>(): Promise<T> {
    return withRetry(
      async () => {
        logger.info('JSONBin: Reading data')

        const response = await fetch(
          `${this.apiUrl}/b/${this.binId}/latest`,
          {
            headers: { 'X-Access-Key': this.apiKey },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const { record } = await response.json()
        logger.info('JSONBin: Read successful')
        return record as T
      },
      { maxAttempts: 3 }
    )
  }

  async write<T>(data: T): Promise<void> {
    return withRetry(
      async () => {
        logger.info('JSONBin: Writing data')

        const response = await fetch(
          `${this.apiUrl}/b/${this.binId}`,
          {
            method: 'PUT',
            headers: {
              'X-Access-Key': this.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        logger.info('JSONBin: Write successful')
      },
      { maxAttempts: 2 }
    )
  }

  async merge<T>(updates: Partial<T>): Promise<void> {
    const current = await this.read<T>()
    await this.write({ ...current, ...updates })
  }
}

// ============================================
// Export Factory Functions
// ============================================

export function createOpenAIService(): OpenAIService {
  return new OpenAIService({
    apiKey: process.env.OPENAI_API_KEY || '',
  })
}

export function createGroqService(): GroqService {
  return new GroqService({
    apiKey: process.env.GROQ_API_KEY || '',
  })
}

export function createSupabaseService(): SupabaseService {
  return new SupabaseService({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  })
}

export function createCacheService(): CacheService {
  return new CacheService()
}

export function createJSONBinService(): JSONBinService {
  return new JSONBinService({
    binId: process.env.JSONBIN_BIN_ID || '',
    apiKey: process.env.JSONBIN_API_KEY || '',
  })
}
