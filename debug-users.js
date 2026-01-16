// Script para debuguear el estado de usuarios en Supabase
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://uofardoxcfxdzajcrzxh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZmFyZG94Y2Z4ZHphamNyenhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTI2MjksImV4cCI6MjA4NDEyODYyOX0.SEMMbAQyI93XYeJVCcGkWqXGN6a3Y1FxOG6stEUk0Lo"
)

async function checkUsers() {
  console.log("🔍 Checking users in Supabase...\n")

  try {
    // Check users table
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error loading users:", error)
      return
    }

    console.log(`✅ Found ${data.length} users in database:\n`)
    if (data.length === 0) {
      console.log("  (empty)")
    } else {
      data.forEach((user) => {
        console.log(`  📧 ${user.email}`)
        console.log(`     Name: ${user.name}`)
        console.log(`     Plan: ${user.plan}`)
        console.log(`     Active: ${user.is_active}`)
        console.log(`     Created: ${user.created_at}\n`)
      })
    }

    // Also check auth users
    console.log("\n🔐 Checking auth users...\n")
  } catch (e) {
    console.error("Error:", e)
  }
}

checkUsers()
