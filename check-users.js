const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ydrvhjpobsfvebexfkbj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnZoanBvYnNmdmViZXhma2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTY5MjYsImV4cCI6MjA4NDM3MjkyNn0.IbUWYiFbGwNjg-s4eknYjSkuQTKFZ3Km2178n5l1WEQ'
);

async function verificar() {
  const { data, count } = await supabase
    .from('users')
    .select('email, plan', { count: 'exact' });
  
  console.log('\n✅ Usuarios en tabla "users":');
  console.log('   Total:', count || 0);
  
  if (data && data.length > 0) {
    console.log('\n   Lista:');
    data.forEach(u => {
      console.log(`   - ${u.email} (${u.plan})`);
    });
  } else {
    console.log('   ⚠️  No hay usuarios');
  }
  
  console.log('\n');
}

verificar();
