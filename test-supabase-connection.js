const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://uofardoxcfxdzajcrzxh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZmFyZG94Y2Z4ZHphamNyenhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTI2MjksImV4cCI6MjA4NDEyODYyOX0.SEMMbAQyI93XYeJVCcGkWqXGN6a3Y1FxOG6stEUk0Lo";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("🔍 Probando conexión a Supabase...\n");

  try {
    // Test 1: Verificar conexión básica
    console.log("✓ Cliente Supabase creado correctamente");
    console.log(`  URL: ${supabaseUrl}`);
    console.log(`  Key: ${supabaseAnonKey.substring(0, 20)}...`);

    // Test 2: Intentar obtener usuarios
    console.log("\n📝 Intentando obtener usuarios de la tabla 'users'...");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    if (usersError) {
      console.log(`  ❌ Error: ${usersError.message}`);
      console.log(`  Código: ${usersError.code}`);
    } else {
      console.log(`  ✓ Conexión exitosa!`);
      console.log(`  Usuarios encontrados: ${users?.length || 0}`);
      if (users && users.length > 0) {
        console.log(`  Primer usuario: ${users[0].email}`);
      }
    }

    // Test 3: Verificar tablas
    console.log("\n📊 Verificando tablas de la base de datos...");
    const tables = ["users", "investments", "deposits", "chat_sessions", "chat_messages", "notifications"];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .limit(1);

      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`);
      } else {
        console.log(`  ✓ ${table}: OK`);
      }
    }

    console.log("\n✅ Prueba de conexión completada");
  } catch (error) {
    console.error("\n❌ Error de conexión:", error.message);
  }
}

testConnection();
