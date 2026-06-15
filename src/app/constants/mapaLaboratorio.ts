import {
  Rocket,
  Cookie,
  Apple,
  Zap,
  ShoppingBag,
  Layers3,
  type LucideIcon,
} from 'lucide-react';
import type { SlugMissao } from './jogos';

export interface SetorLaboratorio {
  slug: SlugMissao;
  nome: string;
  setor: string;
  descricao: string;
  rota: string;
  icone: LucideIcon;
  cor: string;
  /** Posição no mapa (% do container) */
  top: string;
  left: string;
}

export const SETORES_LABORATORIO: SetorLaboratorio[] = [
  {
    slug: 'space-position',
    nome: 'Invasão Espacial',
    setor: 'Hangar orbital',
    descricao: 'Posição espacial',
    rota: '/space-position',
    icone: Rocket,
    cor: '#8b5cf6',
    top: '12%',
    left: '50%',
  },
  {
    slug: 'fractions',
    nome: 'Aventura das Frações',
    setor: 'Sala da pizza',
    descricao: 'Frações visuais',
    rota: '/fractions',
    icone: Cookie,
    cor: '#fb923c',
    top: '36%',
    left: '22%',
  },
  {
    slug: 'dobro',
    nome: 'Multiplicação no mercado',
    setor: 'Mercado verde',
    descricao: 'Dobro e multiplicação',
    rota: '/dobro',
    icone: Apple,
    cor: '#22c55e',
    top: '36%',
    left: '50%',
  },
  {
    slug: 'potencias-quadrado',
    nome: 'Potências ao quadrado',
    setor: 'Torre violeta',
    descricao: 'Quadrados e potências',
    rota: '/potencias-quadrado',
    icone: Zap,
    cor: '#7c3aed',
    top: '36%',
    left: '78%',
  },
  {
    slug: 'desafio-mercado',
    nome: 'Desafio do mercado',
    setor: 'Caixa registradora',
    descricao: 'Contas do dia a dia',
    rota: '/desafio-mercado',
    icone: ShoppingBag,
    cor: '#059669',
    top: '70%',
    left: '34%',
  },
  {
    slug: 'material-dourado',
    nome: 'Material dourado',
    setor: 'Bancada dourada',
    descricao: 'Centena, dezena, unidade',
    rota: '/material-dourado',
    icone: Layers3,
    cor: '#d97706',
    top: '70%',
    left: '66%',
  },
];
