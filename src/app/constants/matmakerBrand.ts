/**
 * MatMaker Brand Tokens — espelha variáveis CSS de theme.css para uso em TS/Konva.
 * Atualizado para refletir o design system revisado.
 */

/** Azul interativo principal (--color-action / --primary) */
export const COR_PRIMARIA = '#1D4ED8';

/** Laranja destaque / conquistas (--color-success / --accent-foreground) */
export const COR_SUCESSO = '#EA580C';

/** Fundo base da aplicação (--background) */
export const COR_FUNDO_SISTEMA = '#EEF5FF';

/** Glow padrão de segmentos no canvas Konva */
export const SEGMENTO_GLOW = {
  shadowBlur: 5,
  shadowColor: COR_PRIMARIA,
} as const;

/** Vértices do palco Konva */
export const VERTICE_RAIO = 12;
export const VERTICE_PIVO = COR_PRIMARIA;
export const VERTICE_ROTACIONADOR = COR_SUCESSO;
