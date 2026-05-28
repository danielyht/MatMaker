import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Project URL apenas — sem /rest/v1/ (o SDK adiciona os caminhos sozinho). */
function normalizarSupabaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/i, '');
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  ? normalizarSupabaseUrl(import.meta.env.VITE_SUPABASE_URL)
  : '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

/** Cliente só é criado quando as variáveis existem — evita tela branca sem .env */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function supabaseConfigurado(): boolean {
  return supabase !== null;
}

if (!supabase) {
  console.warn(
    '[MatMaker] Supabase não configurado. Crie um arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (veja .env.example).',
  );
}
