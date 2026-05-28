import { supabase } from './supabaseClient';

/** Soma pontos ao perfil do usuário logado (para usar nas missões depois). */
export async function adicionarPontos(
  userId: string,
  quantidade: number,
): Promise<{ pontos: number | null; erro: string | null }> {
  if (!supabase || quantidade <= 0) {
    return { pontos: null, erro: quantidade <= 0 ? null : 'Supabase não configurado.' };
  }

  const { data: atual, error: erroLeitura } = await supabase
    .from('perfis')
    .select('pontos')
    .eq('id', userId)
    .single();

  if (erroLeitura) {
    return { pontos: null, erro: erroLeitura.message };
  }

  const novoTotal = (atual?.pontos ?? 0) + quantidade;

  const { data, error } = await supabase
    .from('perfis')
    .update({ pontos: novoTotal })
    .eq('id', userId)
    .select('pontos')
    .single();

  if (error) {
    return { pontos: null, erro: error.message };
  }

  return { pontos: data?.pontos ?? novoTotal, erro: null };
}
