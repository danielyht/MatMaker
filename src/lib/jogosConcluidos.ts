import { supabase } from './supabaseClient';

/** Marca +1 jogo concluído no perfil (chamar ao terminar uma missão). */
export async function registrarJogoConcluido(
  userId: string,
): Promise<{ jogos_completados: number | null; erro: string | null }> {
  if (!supabase) {
    return { jogos_completados: null, erro: 'Supabase não configurado.' };
  }

  const { data: atual, error: erroLeitura } = await supabase
    .from('perfis')
    .select('jogos_completados')
    .eq('id', userId)
    .single();

  if (erroLeitura) {
    return { jogos_completados: null, erro: erroLeitura.message };
  }

  const novoTotal = (atual?.jogos_completados ?? 0) + 1;

  const { data, error } = await supabase
    .from('perfis')
    .update({ jogos_completados: novoTotal })
    .eq('id', userId)
    .select('jogos_completados')
    .single();

  if (error) {
    return { jogos_completados: null, erro: error.message };
  }

  return { jogos_completados: data?.jogos_completados ?? novoTotal, erro: null };
}
