import { supabase } from './supabaseClient';
import type { SlugMissao } from '../app/constants/jogos';

export interface ResultadoMissaoConcluida {
  missoes_concluidas: SlugMissao[];
  jogos_completados: number;
  nova: boolean;
  erro: string | null;
}

const STORAGE_PREFIX = 'matmaker_missoes_';

export function lerMissoesLocais(userId: string): SlugMissao[] {
  return lerLocal(userId);
}

function lerLocal(userId: string): SlugMissao[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SlugMissao[]) : [];
  } catch {
    return [];
  }
}

function salvarLocal(userId: string, slugs: SlugMissao[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(slugs));
  } catch {
    /* ignore */
  }
}

/** Marca uma missão como concluída (idempotente — não duplica slug nem contagem). */
export async function registrarMissaoConcluida(
  userId: string,
  slug: SlugMissao,
): Promise<ResultadoMissaoConcluida> {
  if (!supabase) {
    const atuais = lerLocal(userId);
    if (atuais.includes(slug)) {
      return {
        missoes_concluidas: atuais,
        jogos_completados: atuais.length,
        nova: false,
        erro: null,
      };
    }
    const novas = [...atuais, slug];
    salvarLocal(userId, novas);
    return {
      missoes_concluidas: novas,
      jogos_completados: novas.length,
      nova: true,
      erro: null,
    };
  }

  const { data: atual, error: erroLeitura } = await supabase
    .from('perfis')
    .select('missoes_concluidas, jogos_completados')
    .eq('id', userId)
    .single();

  if (erroLeitura) {
    const fallback = lerLocal(userId);
    if (fallback.includes(slug)) {
      return {
        missoes_concluidas: fallback,
        jogos_completados: fallback.length,
        nova: false,
        erro: null,
      };
    }
    const novas = [...fallback, slug];
    salvarLocal(userId, novas);
    return {
      missoes_concluidas: novas,
      jogos_completados: novas.length,
      nova: true,
      erro: erroLeitura.message,
    };
  }

  const listaAtual = (atual?.missoes_concluidas ?? []) as SlugMissao[];
  if (listaAtual.includes(slug)) {
    return {
      missoes_concluidas: listaAtual,
      jogos_completados: atual?.jogos_completados ?? listaAtual.length,
      nova: false,
      erro: null,
    };
  }

  const novasMissoes = [...listaAtual, slug];
  const novoTotal = (atual?.jogos_completados ?? listaAtual.length) + 1;

  const { data, error } = await supabase
    .from('perfis')
    .update({
      missoes_concluidas: novasMissoes,
      jogos_completados: novoTotal,
    })
    .eq('id', userId)
    .select('missoes_concluidas, jogos_completados')
    .single();

  if (error) {
    salvarLocal(userId, novasMissoes);
    return {
      missoes_concluidas: novasMissoes,
      jogos_completados: novoTotal,
      nova: true,
      erro: error.message,
    };
  }

  salvarLocal(userId, (data?.missoes_concluidas ?? novasMissoes) as SlugMissao[]);

  return {
    missoes_concluidas: (data?.missoes_concluidas ?? novasMissoes) as SlugMissao[],
    jogos_completados: data?.jogos_completados ?? novoTotal,
    nova: true,
    erro: null,
  };
}
