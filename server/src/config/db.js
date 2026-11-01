
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("SUPABASE_URL or SUPABASE_SECRET_KEY is missing from server/.env");
}

export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

export default async function connectDB() {
  const { error } = await supabase
    .from("mysteries")
    .select("id")
    .limit(1);

  if (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  console.log("Supabase PostgreSQL connected successfully");
}
