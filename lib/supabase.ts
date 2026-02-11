import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions for common operations
export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function signOut() {
  await supabase.auth.signOut()
}

// Project operations
export async function createProject(userId: string, name: string, description: string) {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: userId,
        name,
        description,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function getUserProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase.from('projects').delete().eq('id', projectId)

  if (error) throw error
}

// Data source operations
export async function saveDataSource(projectId: string, name: string, type: string, data: any) {
  const { data: result, error } = await supabase
    .from('data_sources')
    .insert([
      {
        project_id: projectId,
        name,
        type,
        data,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return result
}

export async function getDataSources(projectId: string) {
  const { data, error } = await supabase
    .from('data_sources')
    .select('*')
    .eq('project_id', projectId)

  if (error) throw error
  return data
}

// Code generation history
export async function saveCodeGeneration(projectId: string, prompt: string, code: string, language: string) {
  const { data, error } = await supabase
    .from('code_generations')
    .insert([
      {
        project_id: projectId,
        prompt,
        code,
        language,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return data
}
