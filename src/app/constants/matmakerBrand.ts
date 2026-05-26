/** Paleta MatMaker — espelha --color-action e --color-success em theme.css */
export const COR_PRIMARIA = '#3498DB';
export const COR_SUCESSO = '#FF8C00';
export const COR_FUNDO_SISTEMA = '#EBF4FA';

/** Equivalente Konva: shadowBlur / shadowColor na linha do segmento */
export const SEGMENTO_GLOW = {
  shadowBlur: 5,
  shadowColor: COR_PRIMARIA,
} as const;

/** Vértices do palco (pivô vs rotacionador) */
export const VERTICE_RAIO = 12;
export const VERTICE_PIVO = COR_PRIMARIA;
export const VERTICE_ROTACIONADOR = COR_SUCESSO;
