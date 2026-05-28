import { supabase } from './supabaseClient';

export type EntradaRanking = {
  id: string;
  nome: string;
  foto_url: string | null;
  pontos: number;
};

export async function buscarRanking(limite = 50): Promise<{
  dados: EntradaRanking[];
  erro: string | null;
}> {
  if (!supabase) {
    return { dados: [], erro: 'Supabase não configurado.' };
  }

  const { data, error } = await supabase
    .from('perfis')
    .select('id, nome, foto_url, pontos')
    .order('pontos', { ascending: false })
    .order('nome', { ascending: true })
    .limit(limite);

  if (error) {
    return { dados: [], erro: error.message };
  }

  return {
    dados: (data ?? []).map((linha) => ({
      id: linha.id,
      nome: linha.nome,
      foto_url: linha.foto_url,
      pontos: linha.pontos ?? 0,
    })),
    erro: null,
  };
}
