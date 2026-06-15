import { AvatarRanking } from './AvatarRanking';
import { BadgeLiga } from './BadgeLiga';
import { obterLigaPorPontos } from '../constants/ligasRanking';
import type { EntradaRanking, EntradaRankingCompleta, ModoRanking } from '../../lib/ranking';
import { cn } from './ui/utils';

type PodioRankingProps = {
  topTres: EntradaRanking[];
  dadosCompletos: EntradaRankingCompleta[];
  modo: ModoRanking;
  meuId?: string;
};

type SlotPodio = {
  posicao: 1 | 2 | 3;
  entrada: EntradaRanking | null;
};

const ORDEM_PODIO: (1 | 2 | 3)[] = [2, 1, 3];

const ESTILO_COLUNA: Record<
  1 | 2 | 3,
  { altura: string; largura: string; cor: string; corBarra: string; medalha: string }
> = {
  1: {
    altura: 'h-28 sm:h-36',
    largura: 'w-[5.5rem] sm:w-28',
    cor: 'from-[#FFD700]/90 to-[#FF8C00]',
    corBarra: 'bg-gradient-to-t from-[#FF8C00] to-[#FFD700]',
    medalha: '🥇',
  },
  2: {
    altura: 'h-20 sm:h-28',
    largura: 'w-[5rem] sm:w-24',
    cor: 'from-[#E8E8E8] to-[#C0C0C0]',
    corBarra: 'bg-gradient-to-t from-[#A8A8A8] to-[#E8E8E8]',
    medalha: '🥈',
  },
  3: {
    altura: 'h-16 sm:h-24',
    largura: 'w-[4.5rem] sm:w-[5.5rem]',
    cor: 'from-[#E8A86B] to-[#CD7F32]',
    corBarra: 'bg-gradient-to-t from-[#B87333] to-[#E8A86B]',
    medalha: '🥉',
  },
};

function montarSlots(topTres: EntradaRanking[]): SlotPodio[] {
  return ORDEM_PODIO.map((posicao) => ({
    posicao,
    entrada: topTres[posicao - 1] ?? null,
  }));
}

function obterLigaEntrada(
  entrada: EntradaRanking,
  dadosCompletos: EntradaRankingCompleta[],
  modo: ModoRanking,
) {
  const pontosTotais =
    dadosCompletos.find((d) => d.id === entrada.id)?.pontos ?? entrada.pontos;
  return obterLigaPorPontos(modo === 'semanal' ? pontosTotais : entrada.pontos);
}

function SlotPodio({
  posicao,
  entrada,
  dadosCompletos,
  modo,
  meuId,
}: SlotPodio & {
  dadosCompletos: EntradaRankingCompleta[];
  modo: ModoRanking;
  meuId?: string;
}) {
  const estilo = ESTILO_COLUNA[posicao];

  if (!entrada) {
    return (
      <div className={cn('flex flex-col items-center', estilo.largura)}>
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#1E40AF]/15 bg-white/40 sm:h-20 sm:w-20">
          <span className="text-2xl opacity-30">{estilo.medalha}</span>
        </div>
        <p className="mb-2 text-center text-xs font-medium text-[#1E40AF]/35">—</p>
        <div
          className={cn(
            'w-full rounded-t-2xl border border-white/50 bg-[#1E40AF]/5',
            estilo.altura,
          )}
        />
      </div>
    );
  }

  const ehEu = entrada.id === meuId;
  const liga = obterLigaEntrada(entrada, dadosCompletos, modo);
  const sufixoPts = modo === 'semanal' ? 'sem.' : 'pts';

  return (
    <div
      className={cn(
        'flex flex-col items-center transition-transform',
        estilo.largura,
        ehEu && 'scale-[1.02]',
      )}
    >
      <div className="relative mb-2">
        <AvatarRanking
          nome={entrada.nome}
          fotoUrl={entrada.foto_url}
          destaque={ehEu || posicao === 1}
          tamanho={posicao === 1 ? 'lg' : 'md'}
        />
        <span
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm shadow-md sm:h-7 sm:w-7 sm:text-base"
          aria-hidden
        >
          {estilo.medalha}
        </span>
      </div>

      <p
        className={cn(
          'mb-1 max-w-full truncate text-center text-xs font-bold sm:text-sm',
          ehEu && 'text-[#FF8C00]',
        )}
        title={entrada.nome}
      >
        {entrada.nome.split(' ')[0]}
        {ehEu ? <span className="block text-[10px] font-semibold text-[#FF8C00]/80">você</span> : null}
      </p>

      <BadgeLiga liga={liga} tamanho="sm" className="mb-2 max-w-full scale-90 sm:scale-100" />

      <div
        className={cn(
          'relative flex w-full flex-col items-center justify-end rounded-t-2xl border border-white/70 shadow-md',
          estilo.altura,
          estilo.corBarra,
        )}
      >
        <p
          className="pb-2 text-center text-sm font-black tabular-nums text-white drop-shadow-sm sm:text-base"
          style={{ color: posicao === 1 ? '#fff' : undefined }}
        >
          {entrada.pontos}
          <span className="block text-[9px] font-bold uppercase opacity-90">{sufixoPts}</span>
        </p>
        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-[#1E40AF] shadow-sm"
        >
          {posicao}º
        </span>
      </div>
    </div>
  );
}

export function PodioRanking({ topTres, dadosCompletos, modo, meuId }: PodioRankingProps) {
  const slots = montarSlots(topTres);

  if (topTres.length === 0) return null;

  return (
    <div className="glass-panel overflow-hidden p-4 sm:p-5">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-[#1E40AF]/60 sm:mb-4">
        Pódio — top 3
      </p>
      <div className="flex items-end justify-center gap-2 overflow-x-auto px-1 pb-1 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
        {slots.map((slot) => (
          <SlotPodio
            key={slot.posicao}
            {...slot}
            dadosCompletos={dadosCompletos}
            modo={modo}
            meuId={meuId}
          />
        ))}
      </div>
      {topTres.length === 1 && (
        <p className="mt-3 text-center text-xs text-[#1E40AF]/50">
          Seja o próximo a subir no pódio!
        </p>
      )}
    </div>
  );
}
