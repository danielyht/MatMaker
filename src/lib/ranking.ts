import { supabase } from './supabaseClient';
import {
  LIGAS_RANKING,
  obterLigaPorPontos,
  type LigaId,
} from '../app/constants/ligasRanking';
import { obterSemanaAtualRef } from './semanaRanking';

export type EntradaRanking = {
  id: string;
  nome: string;
  foto_url: string | null;
  pontos: number;
};

export type EntradaRankingCompleta = EntradaRanking & {
  pontos_semana: number;
  semana_ref: string;
};

export type ModoRanking = 'geral' | 'liga' | 'semanal';

type LinhaPerfil = {
  id: string;
  nome: string;
  foto_url: string | null;
  pontos: number | null;
  pontos_semana?: number | null;
  semana_ref?: string | null;
};

function mapearLinha(linha: LinhaPerfil): EntradaRankingCompleta {
  return {
    id: linha.id,
    nome: linha.nome,
    foto_url: linha.foto_url,
    pontos: linha.pontos ?? 0,
    pontos_semana: linha.pontos_semana ?? 0,
    semana_ref: linha.semana_ref ?? '',
  };
}

export async function buscarRankingCompleto(limite = 100): Promise<{
  dados: EntradaRankingCompleta[];
  erro: string | null;
  semanaAtual: string;
}> {
  const semanaAtual = obterSemanaAtualRef();

  if (!supabase) {
    return { dados: [], erro: 'Supabase não configurado.', semanaAtual };
  }

  const camposCompletos =
    'id, nome, foto_url, pontos, pontos_semana, semana_ref';

  let { data, error } = await supabase
    .from('perfis')
    .select(camposCompletos)
    .order('pontos', { ascending: false })
    .order('nome', { ascending: true })
    .limit(limite);

  if (error?.message?.includes('pontos_semana') || error?.message?.includes('semana_ref')) {
    const fallback = await supabase
      .from('perfis')
      .select('id, nome, foto_url, pontos')
      .order('pontos', { ascending: false })
      .order('nome', { ascending: true })
      .limit(limite);

    data = fallback.data?.map((linha) => ({
      ...linha,
      pontos_semana: 0,
      semana_ref: '',
    }));
    error = fallback.error;
  }

  if (error) {
    return { dados: [], erro: error.message, semanaAtual };
  }

  return {
    dados: (data ?? []).map((linha) => mapearLinha(linha as LinhaPerfil)),
    erro: null,
    semanaAtual,
  };
}

/** @deprecated Use buscarRankingCompleto */
export async function buscarRanking(limite = 50) {
  const { dados, erro } = await buscarRankingCompleto(limite);
  return {
    dados: dados.map(({ id, nome, foto_url, pontos }) => ({
      id,
      nome,
      foto_url,
      pontos,
    })),
    erro,
  };
}

export function faixaPontosLiga(ligaId: LigaId): { min: number; max: number | null } {
  const indice = LIGAS_RANKING.findIndex((l) => l.id === ligaId);
  if (indice < 0) return { min: 0, max: null };
  const min = LIGAS_RANKING[indice].minPontos;
  const max =
    indice < LIGAS_RANKING.length - 1 ? LIGAS_RANKING[indice + 1].minPontos - 1 : null;
  return { min, max };
}

export function usuarioNaLiga(pontos: number, ligaId: LigaId): boolean {
  const { min, max } = faixaPontosLiga(ligaId);
  return pontos >= min && (max === null || pontos <= max);
}

export function prepararListaRanking(
  dados: EntradaRankingCompleta[],
  modo: ModoRanking,
  opcoes: { ligaId?: LigaId; semanaRef?: string } = {},
): EntradaRanking[] {
  if (modo === 'semanal') {
    const ref = opcoes.semanaRef ?? obterSemanaAtualRef();
    return dados
      .filter((e) => e.semana_ref === ref && e.pontos_semana > 0)
      .map((e) => ({ ...e, pontos: e.pontos_semana }))
      .sort((a, b) => b.pontos - a.pontos || a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  if (modo === 'liga' && opcoes.ligaId) {
    const { min, max } = faixaPontosLiga(opcoes.ligaId);
    return dados
      .filter((e) => e.pontos >= min && (max === null || e.pontos <= max))
      .sort((a, b) => b.pontos - a.pontos || a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  return [...dados].sort(
    (a, b) => b.pontos - a.pontos || a.nome.localeCompare(b.nome, 'pt-BR'),
  );
}

export function ligaDoUsuario(pontos: number): LigaId {
  return obterLigaPorPontos(pontos).id;
}

export function tituloModoRanking(modo: ModoRanking, ligaId?: LigaId): string {
  switch (modo) {
    case 'geral':
      return 'Classificação geral';
    case 'liga': {
      const liga = LIGAS_RANKING.find((l) => l.id === ligaId);
      return liga ? `Liga ${liga.nome}` : 'Por liga';
    }
    case 'semanal':
      return 'Ranking semanal';
    default:
      return 'Ranking';
  }
}
