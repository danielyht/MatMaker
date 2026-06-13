import type { LigaRanking } from '../constants/ligasRanking';

type BadgeLigaProps = {
  liga: LigaRanking;
  tamanho?: 'sm' | 'md' | 'lg';
  className?: string;
  mostrarIcone?: boolean;
};

const tamanhos = {
  sm: { badge: 'px-2 py-0.5 text-[10px] gap-1', icone: 'h-4 w-4' },
  md: { badge: 'px-2.5 py-1 text-xs gap-1.5', icone: 'h-5 w-5' },
  lg: { badge: 'px-3.5 py-1.5 text-sm gap-2', icone: 'h-6 w-6' },
};

export function BadgeLiga({
  liga,
  tamanho = 'md',
  className = '',
  mostrarIcone = true,
}: BadgeLigaProps) {
  const estilo = tamanhos[tamanho];

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border font-bold uppercase tracking-wide ${liga.fundo} ${liga.borda} ${estilo.badge} ${className}`}
      style={{ color: liga.cor }}
      title={`Liga ${liga.nome} — a partir de ${liga.minPontos} pontos`}
    >
      {mostrarIcone ? (
        <img
          src={liga.icone}
          alt=""
          className={`${estilo.icone} shrink-0 object-contain drop-shadow-sm`}
          aria-hidden
        />
      ) : null}
      {liga.nome}
    </span>
  );
}

export function IconeLiga({
  liga,
  className = 'h-12 w-12',
}: {
  liga: LigaRanking;
  className?: string;
}) {
  return (
    <img
      src={liga.icone}
      alt={`Liga ${liga.nome}`}
      className={`object-contain drop-shadow-md ${className}`}
    />
  );
}
