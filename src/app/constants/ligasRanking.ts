/** Ligas por pontuação acumulada (do menor ao maior). */
export const LIGAS_RANKING = [
  {
    id: 'bronze',
    nome: 'Bronze',
    minPontos: 0,
    icone: '/ligas/IconeBronze.svg',
    cor: '#92400E',
    corClara: '#D97706',
    gradiente: 'from-[#B45309] to-[#78350F]',
    fundo: 'bg-[#FEF3C7]/90',
    borda: 'border-[#D97706]/50',
  },
  {
    id: 'prata',
    nome: 'Prata',
    minPontos: 500,
    icone: '/ligas/IconePrata.svg',
    cor: '#475569',
    corClara: '#94A3B8',
    gradiente: 'from-[#94A3B8] to-[#64748B]',
    fundo: 'bg-[#F1F5F9]/95',
    borda: 'border-[#94A3B8]/55',
  },
  {
    id: 'ouro',
    nome: 'Ouro',
    minPontos: 1200,
    icone: '/ligas/IconeOuro.svg',
    cor: '#B45309',
    corClara: '#FBBF24',
    gradiente: 'from-[#FCD34D] to-[#D97706]',
    fundo: 'bg-[#FFFBEB]/95',
    borda: 'border-[#FBBF24]/55',
  },
  {
    id: 'diamante',
    nome: 'Diamante',
    minPontos: 2500,
    icone: '/ligas/IconeDiamante.svg',
    cor: '#1D4ED8',
    corClara: '#60A5FA',
    gradiente: 'from-[#93C5FD] to-[#2563EB]',
    fundo: 'bg-[#EFF6FF]/95',
    borda: 'border-[#60A5FA]/50',
  },
  {
    id: 'ascendente',
    nome: 'Ascendente',
    minPontos: 4500,
    icone: '/ligas/IconeAscendente.svg',
    cor: '#6D28D9',
    corClara: '#A78BFA',
    gradiente: 'from-[#C4B5FD] to-[#7C3AED]',
    fundo: 'bg-[#F5F3FF]/95',
    borda: 'border-[#A78BFA]/50',
  },
] as const;

export type LigaRanking = (typeof LIGAS_RANKING)[number];
export type LigaId = LigaRanking['id'];

export function obterLigaPorPontos(pontos: number): LigaRanking {
  let liga: LigaRanking = LIGAS_RANKING[0];
  for (const candidata of LIGAS_RANKING) {
    if (pontos >= candidata.minPontos) liga = candidata;
  }
  return liga;
}

export function progressoNaLiga(pontos: number): {
  atual: LigaRanking;
  proxima: LigaRanking | null;
  percentual: number;
  pontosParaProxima: number;
} {
  const atual = obterLigaPorPontos(pontos);
  const indiceAtual = LIGAS_RANKING.findIndex((l) => l.id === atual.id);
  const proxima = indiceAtual < LIGAS_RANKING.length - 1 ? LIGAS_RANKING[indiceAtual + 1] : null;

  if (!proxima) {
    return { atual, proxima: null, percentual: 100, pontosParaProxima: 0 };
  }

  const faixa = proxima.minPontos - atual.minPontos;
  const avanco = pontos - atual.minPontos;
  const percentual = faixa > 0 ? Math.min(100, Math.round((avanco / faixa) * 100)) : 0;

  return {
    atual,
    proxima,
    percentual,
    pontosParaProxima: Math.max(0, proxima.minPontos - pontos),
  };
}
