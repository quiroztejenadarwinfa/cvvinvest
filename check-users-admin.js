const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ydrvhjpobsfvebexfkbj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NjkyNiwiZXhwIjoyMDg0MzcyOTI2fQ.6KxaywUYnWS4DqgzpANzWLTjiT-S0vejydFG4sV8ImY'
);

async function verificar() {
  console.log('\n🔍 Verificando usuarios en tabla "users"...\n');
  
  const { data, count, error } = await supabaseAdmin
    .from('users')
    .select('id, email, plan', { count: 'exact' });
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  console.log('✅ Usuarios encontrados:', count || 0);
  
  if (data && data.length > 0) {
    console.log('\n📋 Lista:');
    data.forEach(u => {
      console.log(`   - ${u.email} (${u.plan}) [ID: ${u.id.substring(0, 8)}...]`);
    });
  }
  
  console.log('\n');
}

verificar().catch(e => console.error('Error:', e.message));
