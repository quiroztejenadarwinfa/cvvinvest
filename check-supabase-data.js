import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ivfczbumlgohxxkgyxfl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZmN6YnVtbGdvaHh4a2d5eGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDUyNzksImV4cCI6MjA1MjYyMTI3OX0.tV8Sx-3vgXPgVaEVlHGBBHvRl3Ym7bRtxLLPz4m-dG4'
)

async function checkUsers() {
  console.log('Verificando usuarios en Supabase...\n')
  const { data, error } = await supabase.from('users').select('*')
  
  if (error) {
    console.log('Error:', error)
  } else {
    console.log(`Total de usuarios: ${data?.length || 0}`)
    data?.forEach((user, i) => {
      console.log(`\n${i + 1}. ${user.name} (${user.email})`)
      console.log(`   Plan: ${user.plan}`)
      console.log(`   Activo: ${user.is_active}`)
    })
  }
}

checkUsers()
