import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rynvngsrfcpopkdmqqbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bnZuZ3NyZmNwb3BrZG1xcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzYyOTgsImV4cCI6MjA5Mjk1MjI5OH0.5Pyey-v-J2E5gruLwXA6ff3qdAGGcdFvu61F7l4fZVs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);