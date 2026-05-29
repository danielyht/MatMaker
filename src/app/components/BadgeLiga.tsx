import type { LigaRanking } from '../constants/ligasRanking';

type BadgeLigaProps = {
  liga: LigaRanking;
  tamanho?: 'sm' | 'md' | 'lg';
  className?: string;
};

const tamanhos = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3.5 py-1.5 text-sm gap-2',
};

export function BadgeLiga({ liga, tamanho = 'md', className = '' }: BadgeLigaProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border font-bold uppercase tracking-wide ${liga.fundo} ${liga.borda} ${tamanhos[tamanho]} ${className}`}
      style={{ color: liga.cor }}
      title={`Liga ${liga.nome} — a partir de ${liga.minPontos} pontos`}
    >
      <span
        className={`h-2 w-2 rounded-full bg-gradient-to-br sm:h-2.5 sm:w-2.5 ${liga.gradiente}`}
        aria-hidden
      />
      {liga.nome}
    </span>
  );
}
