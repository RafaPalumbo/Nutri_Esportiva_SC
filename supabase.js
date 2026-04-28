import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rynvngsrfcpopkdmqqbw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bnZuZ3NyZmNwb3BrZG1xcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzYyOTgsImV4cCI6MjA5Mjk1MjI5OH0.5Pyey-v-J2E5gruLwXA6ff3qdAGGcdFvu61F7l4fZVs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function inserirUsuario() {
  const { data, error } = await supabase
    .from('Usuários')
    .insert([
      { nome: 'admin', email: 'admin@admin.com', senha_hash: 'admin' }
    ])

  console.log({ data, error })
}

inserirUsuario()
async function testarConsulta() {
  const { data, error } = await supabase
    .from('Usuários')
    .select('*')

  if (error) {
    console.error('Erro:', error)
  } else {
    console.log('Dados:', data)
  }
}

testarConsulta()