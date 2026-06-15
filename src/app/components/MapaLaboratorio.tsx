import { useNavigate } from 'react-router';
import { Check, Sparkles } from 'lucide-react';
import { cn } from './ui/utils';
import { SETORES_LABORATORIO } from '../constants/mapaLaboratorio';
import type { SlugMissao } from '../constants/jogos';
import { TOTAL_MISSOES } from '../constants/jogos';

interface MapaLaboratorioProps {
  missoesConcluidas: SlugMissao[];
}

export function MapaLaboratorio({ missoesConcluidas }: MapaLaboratorioProps) {
  const navegar = useNavigate();
  const concluidas = new Set(missoesConcluidas);
  const totalAceso = missoesConcluidas.length;

  return (
    <section className="glass-panel overflow-hidden p-3 sm:p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-1 sm:mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold sm:text-xl">Mapa do laboratório</h2>
          <p className="mt-0.5 text-sm text-[#1E40AF]/70">
            Complete missões para acender cada setor
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-3 py-1.5 text-sm font-semibold text-[#1E40AF] shadow-sm">
          <Sparkles className="h-4 w-4 text-[#FF8C00]" />
          <span>
            {totalAceso}/{TOTAL_MISSOES} setores
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-1 sm:px-0">
        <div
          className={cn(
            'relative w-full overflow-visible rounded-3xl border border-[#3498DB]/15',
            'bg-gradient-to-br from-[#dbeafe] via-[#EBF4FA] to-[#e0f2fe] shadow-inner',
            'min-h-[17.5rem] aspect-[4/5] sm:min-h-0 sm:aspect-[4/3]',
          )}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-40">
            <div className="absolute left-1/2 top-[26%] h-[46%] w-[68%] -translate-x-1/2 rounded-[2rem] border-2 border-dashed border-[#3498DB]/20 bg-white/30 sm:w-[72%]" />
            <div className="absolute left-1/2 top-[50%] h-px w-[74%] -translate-x-1/2 bg-[#3498DB]/15 sm:w-[78%]" />
            <div className="absolute left-1/2 top-[26%] h-[46%] w-px -translate-x-1/2 bg-[#3498DB]/10" />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-[50%] z-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#3498DB]/25 bg-white/70 shadow-md sm:h-20 sm:w-20">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#3498DB]/80 sm:text-xs">
              Núcleo
            </span>
          </div>

          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-3xl"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {SETORES_LABORATORIO.map((setor) => {
              const aceso = concluidas.has(setor.slug);
              const x = parseFloat(setor.left);
              const y = parseFloat(setor.top);
              return (
                <line
                  key={`linha-${setor.slug}`}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={aceso ? setor.cor : '#94a3b8'}
                  strokeWidth={aceso ? 0.6 : 0.25}
                  strokeOpacity={aceso ? 0.55 : 0.2}
                  strokeDasharray={aceso ? '0' : '2 2'}
                />
              );
            })}
          </svg>

          {SETORES_LABORATORIO.map((setor) => {
            const Icone = setor.icone;
            const aceso = concluidas.has(setor.slug);

            return (
              <button
                key={setor.slug}
                type="button"
                onClick={() => navegar(setor.rota)}
                className="group absolute z-10 flex min-h-[2.75rem] min-w-[2.75rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-[#3498DB] focus-visible:ring-offset-2 sm:min-h-0 sm:min-w-0 sm:gap-1.5"
                style={{ top: setor.top, left: setor.left }}
                aria-label={`${setor.nome}${aceso ? ' — concluída' : ''}`}
              >
                <div className="relative">
                  {aceso && (
                    <span
                      className="absolute inset-0 animate-ping rounded-2xl opacity-30"
                      style={{ backgroundColor: setor.cor }}
                    />
                  )}
                  <div
                    className={cn(
                      'relative flex h-11 w-11 items-center justify-center rounded-xl border-2 shadow-lg transition-all duration-300 sm:h-16 sm:w-16 sm:rounded-2xl',
                      aceso
                        ? 'scale-105 border-white/90 text-white'
                        : 'border-white/60 bg-white/75 text-[#1E40AF]/45 grayscale-[0.35]',
                    )}
                    style={{
                      backgroundColor: aceso ? setor.cor : undefined,
                      boxShadow: aceso
                        ? `0 0 20px ${setor.cor}66, 0 6px 16px ${setor.cor}33`
                        : undefined,
                    }}
                  >
                    <Icone className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.5} />
                    {aceso && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-600 shadow-md sm:-right-1 sm:-top-1 sm:h-5 sm:w-5">
                        <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    'hidden max-w-[5.5rem] rounded-xl px-2 py-1 text-center transition-colors sm:block sm:max-w-[6.5rem]',
                    aceso ? 'bg-white/90 shadow-sm' : 'bg-white/50',
                  )}
                >
                  <p
                    className={cn(
                      'text-[10px] font-bold leading-tight sm:text-xs',
                      aceso ? 'text-[#1E40AF]' : 'text-[#1E40AF]/55',
                    )}
                  >
                    {setor.setor}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
          {SETORES_LABORATORIO.map((setor) => {
            const Icone = setor.icone;
            const aceso = concluidas.has(setor.slug);
            return (
              <li key={`legenda-${setor.slug}`}>
                <button
                  type="button"
                  onClick={() => navegar(setor.rota)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors active:scale-[0.98]',
                    aceso
                      ? 'border-white/80 bg-white/95 shadow-sm'
                      : 'border-white/50 bg-white/60',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white',
                      !aceso && 'grayscale-[0.35] opacity-70',
                    )}
                    style={{ backgroundColor: aceso ? setor.cor : '#94a3b8' }}
                  >
                    <Icone className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block truncate text-[11px] font-bold leading-tight',
                        aceso ? 'text-[#1E40AF]' : 'text-[#1E40AF]/55',
                      )}
                    >
                      {setor.setor}
                    </span>
                    {aceso && (
                      <span className="text-[10px] font-semibold text-emerald-600">Concluída</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
