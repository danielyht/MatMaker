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
      {/* Cabeçalho */}
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-1 sm:mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-[#0F172A] sm:text-lg">Mapa do laboratório</h2>
          <p className="mt-0.5 text-xs text-[#64748B]">Complete missões para acender cada setor</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#EA580C]" />
          <span>{totalAceso}/{TOTAL_MISSOES} setores</span>
        </div>
      </div>

      {/*
        MAPA VISUAL — apenas sm e acima.
        O container usa aspect-ratio puro, sem min-h, para que os % de posição
        dos botões sejam sempre calculados sobre a mesma proporção (4:3).
        overflow-hidden garante que nada vaze para fora.
      */}
      <div className="relative mx-auto hidden w-full max-w-3xl sm:block">
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-2xl border border-[#BFDBFE]/40',
            'bg-gradient-to-br from-[#dbeafe] via-[#EEF5FF] to-[#e0f2fe] shadow-inner',
            'aspect-[4/3]',
          )}
        >
          {/* Decoração de fundo */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-40">
            <div className="absolute left-1/2 top-[26%] h-[46%] w-[70%] -translate-x-1/2 rounded-[2rem] border-2 border-dashed border-[#1D4ED8]/20 bg-white/30" />
            <div className="absolute left-1/2 top-[50%] h-px w-[76%] -translate-x-1/2 bg-[#1D4ED8]/12" />
            <div className="absolute left-1/2 top-[26%] h-[46%] w-px -translate-x-1/2 bg-[#1D4ED8]/08" />
          </div>

          {/* Núcleo central */}
          <div className="pointer-events-none absolute left-1/2 top-[50%] z-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#1D4ED8]/20 bg-white/80 shadow-md lg:h-20 lg:w-20">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#1D4ED8]/70 lg:text-[11px]">
              Núcleo
            </span>
          </div>

          {/* Linhas SVG */}
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
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

          {/* Botões dos setores */}
          {SETORES_LABORATORIO.map((setor) => {
            const Icone = setor.icone;
            const aceso = concluidas.has(setor.slug);

            return (
              <button
                key={setor.slug}
                type="button"
                onClick={() => navegar(setor.rota)}
                className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
                style={{ top: setor.top, left: setor.left }}
                aria-label={`${setor.nome}${aceso ? ' — concluída' : ''}`}
              >
                <div className="relative">
                  {aceso && (
                    <span
                      className="absolute inset-0 animate-ping rounded-xl opacity-25"
                      style={{ backgroundColor: setor.cor }}
                    />
                  )}
                  <div
                    className={cn(
                      'relative flex items-center justify-center rounded-xl border-2 shadow-md transition-all duration-300',
                      'h-11 w-11 lg:h-14 lg:w-14',
                      aceso
                        ? 'scale-105 border-white/90 text-white'
                        : 'border-white/60 bg-white/80 text-[#64748B] grayscale-[0.4]',
                    )}
                    style={{
                      backgroundColor: aceso ? setor.cor : undefined,
                      boxShadow: aceso
                        ? `0 0 16px ${setor.cor}55, 0 4px 12px ${setor.cor}33`
                        : undefined,
                    }}
                  >
                    <Icone className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.5} />
                    {aceso && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm lg:h-5 lg:w-5">
                        <Check className="h-2.5 w-2.5 lg:h-3 lg:w-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    'max-w-[5rem] rounded-lg px-1.5 py-0.5 text-center transition-colors lg:max-w-[6rem]',
                    aceso ? 'bg-white/90 shadow-sm' : 'bg-white/50',
                  )}
                >
                  <p
                    className={cn(
                      'text-[9px] font-bold leading-tight lg:text-[11px]',
                      aceso ? 'text-[#0F172A]' : 'text-[#64748B]',
                    )}
                  >
                    {setor.setor}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/*
        GRADE DE NAVEGAÇÃO — mobile (< sm): substitui o mapa visual.
        Grid 2×3 confiável em qualquer largura de tela.
      */}
      <ul className="grid grid-cols-2 gap-2 sm:hidden">
        {SETORES_LABORATORIO.map((setor) => {
          const Icone = setor.icone;
          const aceso = concluidas.has(setor.slug);
          return (
            <li key={`grade-${setor.slug}`}>
              <button
                type="button"
                onClick={() => navegar(setor.rota)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all active:scale-[0.97]',
                  aceso
                    ? 'border-[#E2E8F0] bg-white shadow-sm'
                    : 'border-[#E2E8F0] bg-white/70',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
                    !aceso && 'opacity-50 grayscale',
                  )}
                  style={{ backgroundColor: aceso ? setor.cor : '#94a3b8' }}
                >
                  <Icone className="h-4.5 w-4.5 h-[1.125rem] w-[1.125rem]" strokeWidth={2.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block truncate text-xs font-bold leading-tight',
                      aceso ? 'text-[#0F172A]' : 'text-[#94A3B8]',
                    )}
                  >
                    {setor.setor}
                  </span>
                  <span
                    className={cn(
                      'block text-[10px] font-medium',
                      aceso ? 'text-emerald-600' : 'text-[#CBD5E1]',
                    )}
                  >
                    {aceso ? 'Concluída' : 'Pendente'}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Mini-legenda abaixo do mapa — apenas sm+ */}
      <ul className="mt-3 hidden grid-cols-3 gap-1.5 sm:grid lg:grid-cols-6">
        {SETORES_LABORATORIO.map((setor) => {
          const aceso = concluidas.has(setor.slug);
          return (
            <li key={`legenda-${setor.slug}`} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: aceso ? setor.cor : '#CBD5E1' }}
              />
              <span
                className={cn(
                  'truncate text-[10px] font-medium',
                  aceso ? 'text-[#0F172A]' : 'text-[#94A3B8]',
                )}
              >
                {setor.setor}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
