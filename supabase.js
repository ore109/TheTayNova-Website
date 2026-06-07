const SUPABASE_URL = "https://ngnricijtqlikjxrbtlr.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_5TfnayimjP1cq7ia0NPFCw_bf17fkdI";

// Expose a single Supabase client on `window.supabaseClient` for the app to use.
// This file is intentionally minimal and only sets up the client.
if (window.supabase && typeof window.supabase.createClient === 'function') {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase library not loaded. Ensure the Supabase script is included before supabase.js');
  window.supabaseClient = null;
}