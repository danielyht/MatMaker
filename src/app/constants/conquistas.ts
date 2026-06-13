import type { LucideIcon } from 'lucide-react';
import {
  Rocket,
  Cookie,
  Apple,
  Zap,
  ShoppingBag,
  Layers3,
  Flag,
  FlaskConical,
  Crown,
  Star,
  Medal,
  Gem,
  Sparkles,
} from 'lucide-react';
import type { SlugMissao } from './jogos';
import { TOTAL_MISSOES } from './jogos';
import { LIGAS_RANKING, obterLigaPorPontos, type LigaId } from './ligasRanking';

export type ConquistaId =
  | 'primeira-missao'
  | 'laboratorio-completo'
  | 'missao-space-position'
  | 'missao-fractions'
  | 'missao-dobro'
  | 'missao-potencias-quadrado'
  | 'missao-desafio-mercado'
  | 'missao-material-dourado'
  | 'liga-prata'
  | 'liga-ouro'
  | 'liga-diamante'
  | 'liga-ascendente'
  | 'maratonista'
  | 'centena-pontos';

export type CategoriaConquista = 'missao' | 'liga' | 'progresso';

export interface ConquistaDef {
  id: ConquistaId;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  cor: string;
  categoria: CategoriaConquista;
}

export interface ConquistaContexto {
  pontos: number;
  missoesConcluidas: SlugMissao[];
  jogosCompletados: number;
}

const SLUG_PARA_ID: Record<SlugMissao, ConquistaId> = {
  'space-position': 'missao-space-position',
  fractions: 'missao-fractions',
  dobro: 'missao-dobro',
  'potencias-quadrado': 'missao-potencias-quadrado',
  'desafio-mercado': 'missao-desafio-mercado',
  'material-dourado': 'missao-material-dourado',
};

export const CONQUISTAS: ConquistaDef[] = [
  {
    id: 'primeira-missao',
    titulo: 'Primeiro passo',
    descricao: 'Complete sua primeira missão no laboratório.',
    icone: Flag,
    cor: '#3498DB',
    categoria: 'progresso',
  },
  {
    id: 'laboratorio-completo',
    titulo: 'Laboratório completo',
    descricao: `Conclua todas as ${TOTAL_MISSOES} missões do mapa.`,
    icone: FlaskConical,
    cor: '#FF8C00',
    categoria: 'progresso',
  },
  {
    id: 'missao-space-position',
    titulo: 'Piloto espacial',
    descricao: 'Conclua a Invasão Espacial.',
    icone: Rocket,
    cor: '#8b5cf6',
    categoria: 'missao',
  },
  {
    id: 'missao-fractions',
    titulo: 'Mestre das frações',
    descricao: 'Conclua a Aventura das Frações.',
    icone: Cookie,
    cor: '#fb923c',
    categoria: 'missao',
  },
  {
    id: 'missao-dobro',
    titulo: 'Comprador expert',
    descricao: 'Conclua a Multiplicação no mercado.',
    icone: Apple,
    cor: '#22c55e',
    categoria: 'missao',
  },
  {
    id: 'missao-potencias-quadrado',
    titulo: 'Potência máxima',
    descricao: 'Conclua Potências ao quadrado.',
    icone: Zap,
    cor: '#7c3aed',
    categoria: 'missao',
  },
  {
    id: 'missao-desafio-mercado',
    titulo: 'Caixa registradora',
    descricao: 'Conclua o Desafio do mercado.',
    icone: ShoppingBag,
    cor: '#059669',
    categoria: 'missao',
  },
  {
    id: 'missao-material-dourado',
    titulo: 'Ouro matemático',
    descricao: 'Conclua o Material dourado.',
    icone: Layers3,
    cor: '#d97706',
    categoria: 'missao',
  },
  {
    id: 'centena-pontos',
    titulo: 'Centena!',
    descricao: 'Acumule 100 pontos ou mais.',
    icone: Star,
    cor: '#FBBF24',
    categoria: 'progresso',
  },
  {
    id: 'maratonista',
    titulo: 'Maratonista',
    descricao: 'Acumule 2.000 pontos ou mais.',
    icone: Sparkles,
    cor: '#EC4899',
    categoria: 'progresso',
  },
  {
    id: 'liga-prata',
    titulo: 'Liga Prata',
    descricao: 'Alcance a liga Prata (500+ pts).',
    icone: Medal,
    cor: '#94A3B8',
    categoria: 'liga',
  },
  {
    id: 'liga-ouro',
    titulo: 'Liga Ouro',
    descricao: 'Alcance a liga Ouro (1.200+ pts).',
    icone: Crown,
    cor: '#FBBF24',
    categoria: 'liga',
  },
  {
    id: 'liga-diamante',
    titulo: 'Liga Diamante',
    descricao: 'Alcance a liga Diamante (2.500+ pts).',
    icone: Gem,
    cor: '#60A5FA',
    categoria: 'liga',
  },
  {
    id: 'liga-ascendente',
    titulo: 'Liga Ascendente',
    descricao: 'Alcance a liga máxima (4.500+ pts).',
    icone: Sparkles,
    cor: '#A78BFA',
    categoria: 'liga',
  },
];

const MAPA = new Map(CONQUISTAS.map((c) => [c.id, c]));

export function obterConquista(id: ConquistaId): ConquistaDef {
  return MAPA.get(id)!;
}

function ligaDesbloqueada(pontos: number, ligaId: LigaId): boolean {
  const liga = LIGAS_RANKING.find((l) => l.id === ligaId);
  return liga ? pontos >= liga.minPontos : false;
}

export function verificarConquista(id: ConquistaId, ctx: ConquistaContexto): boolean {
  switch (id) {
    case 'primeira-missao':
      return ctx.jogosCompletados >= 1;
    case 'laboratorio-completo':
      return ctx.missoesConcluidas.length >= TOTAL_MISSOES;
    case 'centena-pontos':
      return ctx.pontos >= 100;
    case 'maratonista':
      return ctx.pontos >= 2000;
    case 'liga-prata':
      return ligaDesbloqueada(ctx.pontos, 'prata');
    case 'liga-ouro':
      return ligaDesbloqueada(ctx.pontos, 'ouro');
    case 'liga-diamante':
      return ligaDesbloqueada(ctx.pontos, 'diamante');
    case 'liga-ascendente':
      return ligaDesbloqueada(ctx.pontos, 'ascendente');
    default:
      if (id.startsWith('missao-')) {
        const slug = Object.entries(SLUG_PARA_ID).find(([, cid]) => cid === id)?.[0];
        return slug ? ctx.missoesConcluidas.includes(slug) : false;
      }
      return false;
  }
}

export function calcularConquistasDesbloqueadas(ctx: ConquistaContexto): ConquistaDef[] {
  return CONQUISTAS.filter((c) => verificarConquista(c.id, ctx));
}

export function criarContextoConquistas(perfil: {
  pontos: number;
  missoes_concluidas: SlugMissao[];
  jogos_completados: number;
}): ConquistaContexto {
  return {
    pontos: perfil.pontos,
    missoesConcluidas: perfil.missoes_concluidas,
    jogosCompletados: perfil.jogos_completados,
  };
}

export function indiceLigaPorPontos(pontos: number): number {
  return LIGAS_RANKING.findIndex((l) => l.id === obterLigaPorPontos(pontos).id);
}
