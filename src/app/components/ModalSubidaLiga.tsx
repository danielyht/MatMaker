import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { IconeLiga } from './BadgeLiga';
import type { LigaRanking } from '../constants/ligasRanking';

interface ModalSubidaLigaProps {
  anterior: LigaRanking;
  nova: LigaRanking;
  onFechar: () => void;
}

const CONFETES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  delay: `${(i % 8) * 0.08}s`,
  cor: ['#3498DB', '#FF8C00', '#FBBF24', '#A78BFA', '#22C55E'][i % 5],
  size: 6 + (i % 4) * 2,
}));

export function ModalSubidaLiga({ anterior, nova, onFechar }: ModalSubidaLigaProps) {
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimar(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subida-liga-titulo"
    >
      {CONFETES.map((c) => (
        <span
          key={c.id}
          className="animate-confete pointer-events-none absolute top-0 rounded-full opacity-0"
          style={{
            left: c.left,
            width: c.size,
            height: c.size,
            backgroundColor: c.cor,
            animationDelay: c.delay,
          }}
        />
      ))}

      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-slate-900 via-[#1e3a5f] to-slate-900 p-6 text-center text-white shadow-2xl transition-all duration-700 sm:p-8 ${
          animar ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${nova.corClara}55, transparent 60%)`,
          }}
        />

        <div className="relative mb-2 flex items-center justify-center gap-2 text-cyan-200">
          <Sparkles className="h-5 w-5 animate-pulse text-[#FF8C00]" />
          <p className="text-xs font-bold uppercase tracking-[0.25em]">Nova liga!</p>
          <Sparkles className="h-5 w-5 animate-pulse text-[#FF8C00]" />
        </div>

        <h2 id="subida-liga-titulo" className="relative text-2xl font-black sm:text-3xl">
          Subiu de liga!
        </h2>
        <p className="relative mt-2 text-sm text-white/75">
          Você passou de <strong className="text-white">{anterior.nome}</strong> para{' '}
          <strong style={{ color: nova.corClara }}>{nova.nome}</strong>
        </p>

        <div className="relative mx-auto mt-8 flex items-center justify-center gap-4 sm:gap-6">
          <div
            className={`flex flex-col items-center gap-2 transition-all duration-700 delay-150 ${
              animar ? 'translate-y-0 opacity-60' : 'translate-y-4 opacity-0'
            }`}
          >
            <IconeLiga liga={anterior} className="h-14 w-14 grayscale sm:h-16 sm:w-16" />
            <span className="text-[10px] font-semibold uppercase text-white/50">{anterior.nome}</span>
          </div>

          <ArrowRight
            className={`h-6 w-6 shrink-0 text-[#FF8C00] transition-all duration-500 delay-300 ${
              animar ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          />

          <div
            className={`flex flex-col items-center gap-2 transition-all duration-700 delay-500 ${
              animar ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-75 opacity-0'
            }`}
          >
            <div className="animate-liga-glow relative rounded-full p-1">
              <IconeLiga liga={nova} className="relative h-20 w-20 sm:h-24 sm:w-24" />
            </div>
            <span className="text-sm font-bold uppercase" style={{ color: nova.corClara }}>
              {nova.nome}
            </span>
          </div>
        </div>

        <p className="relative mt-8 text-xs text-white/55">
          A partir de {nova.minPontos.toLocaleString('pt-BR')} pontos
        </p>

        <button
          type="button"
          onClick={onFechar}
          className="relative mt-6 min-h-12 w-full rounded-2xl bg-gradient-to-r from-[#3498DB] to-[#FF8C00] text-base font-bold text-white shadow-lg transition-transform active:scale-[0.98] md:hover:scale-[1.02]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
