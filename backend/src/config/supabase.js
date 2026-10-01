const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || "https://tqikfuaxwoktbeggphsy.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxaWtmdWF4d29rdGJlZ2dwaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzgzNTUsImV4cCI6MjA5MzgxNDM1NX0.XM7aSlBXhwdqJQy4PtzIQdxg5wiDxxPAE75tWucbgYE";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: SUPABASE_URL o SUPABASE_KEY no están definidas.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;