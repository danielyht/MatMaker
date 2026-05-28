/** Missões do laboratório (rotas protegidas com jogo). */
export const MISSOES_LABORATORIO = [
  { slug: 'space-position', nome: 'Invasão Espacial' },
  { slug: 'fractions', nome: 'Aventura das Frações' },
  { slug: 'dobro', nome: 'Multiplicação no mercado' },
  { slug: 'potencias-quadrado', nome: 'Potências ao quadrado' },
  { slug: 'desafio-mercado', nome: 'Desafio do mercado' },
  { slug: 'material-dourado', nome: 'Material dourado' },
] as const;

export type SlugMissao = (typeof MISSOES_LABORATORIO)[number]['slug'];

export const TOTAL_MISSOES = MISSOES_LABORATORIO.length;
