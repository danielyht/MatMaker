import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { MatMakerLogo } from './MatMakerLogo';

/** Símbolos matemáticos no fundo — posição fixa, só animação vertical suave. */
const SIMBOLOS_FUNDO = [
  { char: '+', className: 'left-[6%] top-[14%] text-3xl opacity-[0.14]', delay: '0s', dur: '7s' },
  { char: '−', className: 'left-[18%] top-[72%] text-5xl opacity-[0.1]', delay: '1.2s', dur: '9s' },
  { char: '÷', className: 'left-[82%] top-[22%] text-4xl opacity-[0.12]', delay: '0.6s', dur: '8s' },
  { char: '%', className: 'left-[88%] top-[68%] text-6xl opacity-[0.08]', delay: '2s', dur: '10s' },
  { char: '=', className: 'left-[42%] top-[8%] text-2xl opacity-[0.11]', delay: '0.3s', dur: '7.5s' },
  { char: '^', className: 'left-[55%] top-[88%] text-4xl opacity-[0.1]', delay: '1.5s', dur: '8.5s' },
  { char: '+', className: 'left-[72%] top-[42%] text-2xl opacity-[0.09]', delay: '2.4s', dur: '9.5s' },
  { char: '×', className: 'left-[28%] top-[38%] text-5xl opacity-[0.07]', delay: '0.9s', dur: '11s' },
  { char: 'π', className: 'left-[12%] top-[48%] text-3xl opacity-[0.1]', delay: '1.8s', dur: '8s' },
  { char: '√', className: 'left-[92%] top-[48%] text-3xl opacity-[0.11]', delay: '0.4s', dur: '7s' },
  { char: '2', className: 'left-[35%] top-[78%] text-4xl opacity-[0.08]', delay: '2.2s', dur: '10s' },
  { char: '½', className: 'left-[62%] top-[18%] text-3xl opacity-[0.12]', delay: '1s', dur: '8s' },
] as const;

const CARDS_FLUTUANTES = [
  {
    id: 'fracoes',
    className:
      'left-[4%] top-[20%] -rotate-12 sm:left-[6%] sm:top-[18%]',
    delay: '0s',
    content: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF]/70">Desafio</p>
        <p className="mt-1 text-2xl font-bold text-[#1E40AF]">
          <span className="text-primary">¾</span> + ¼
        </p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-6 w-3 rounded-sm ${i <= 3 ? 'bg-primary/80' : 'bg-primary/25'}`}
            />
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'potencia',
    className:
      'right-[6%] bottom-[20%] -rotate-[6deg] sm:right-[10%] sm:bottom-[22%]',
    delay: '1.6s',
    content: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF]/70">Potência</p>
        <p className="mt-1 font-bold text-[#1E40AF]">
          <span className="text-3xl text-primary">2</span>
          <sup className="text-lg text-primary">²</sup>
          <span className="mx-1 text-xl">=</span>
          <span className="text-3xl">4</span>
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1">
          <div className="aspect-square rounded-lg bg-primary/20" />
          <div className="aspect-square rounded-lg bg-primary/20" />
          <div className="aspect-square rounded-lg bg-primary/20" />
          <div className="aspect-square rounded-lg bg-primary/20" />
        </div>
      </>
    ),
  },
] as const;

export function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#EBF4FA] text-[#1E40AF]">
      {/* Símbolos matemáticos — fundo */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden>
        {SIMBOLOS_FUNDO.map((s, i) => (
          <span
            key={`${s.char}-${i}`}
            className={`absolute font-bold text-[#1E40AF] zero-gravity-float-delayed ${s.className}`}
            style={
              {
                '--zg-delay': s.delay,
                animationDuration: s.dur,
              } as CSSProperties
            }
          >
            {s.char}
          </span>
        ))}
      </div>

      {/* Brilhos suaves da marca */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-[#B7E6F2]/60 blur-3xl" />
      </div>

      {/* Nav mínima */}
      <header className="relative z-20 flex items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 p-1.5 shadow-md ring-2 ring-primary/25">
            <MatMakerLogo className="h-full w-full" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1E40AF]">MatMaker</span>
        </div>
        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-4 sm:text-base">
          <Link
            to="/dashboard"
            className="rounded-full px-3 py-1.5 text-primary transition-colors hover:bg-primary/10 sm:px-4"
          >
            Laboratório
          </Link>
          <Link
            to="/sobre"
            className="rounded-full px-3 py-1.5 text-[#1E40AF]/80 transition-colors hover:bg-white/60 sm:px-4"
          >
            Sobre
          </Link>
        </nav>
      </header>

      {/* Cards flutuantes decorativos */}
      <div className="pointer-events-none absolute inset-0 z-[5] hidden sm:block" aria-hidden>
        {CARDS_FLUTUANTES.map((card) => (
          <div
            key={card.id}
            className={`zero-gravity-float-delayed absolute w-[140px] rounded-2xl border-2 border-white/80 bg-white/75 p-3 shadow-[0_12px_40px_-8px_rgba(0,202,252,0.35)] backdrop-blur-sm md:w-[160px] ${card.className}`}
            style={{ '--zg-delay': card.delay } as CSSProperties}
          >
            {card.content}
          </div>
        ))}
      </div>

      {/* Hero */}
      <main className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <div className="zero-gravity-float-slow mb-6 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white/90 p-4 shadow-[0_20px_50px_-12px_rgba(0,202,252,0.45)] ring-4 ring-primary/20 sm:h-36 sm:w-36 sm:rounded-[2.5rem] md:h-40 md:w-40">
          <MatMakerLogo className="h-full w-full drop-shadow-sm" />
        </div>

        <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#1E40AF] sm:text-4xl md:text-5xl lg:text-6xl">
          Matemática que{' '}
          <span className="bg-gradient-to-r from-primary to-[#00A1C9] bg-clip-text text-transparent">
            flutua
          </span>{' '}
          na sua mente
        </h1>

        <p className="mt-4 max-w-lg text-base font-medium text-[#1E40AF]/75 sm:text-lg md:text-xl">
          Entre no laboratório MatMaker: jogos, desafios e exploração no estilo de um brinquedo
          digital no espaço — sem complicação, só diversão.
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-[#00A1C9] px-10 py-4 text-lg font-bold text-white shadow-[0_14px_40px_-6px_rgba(0,202,252,0.65)] ring-4 ring-primary/25 transition-transform duration-300 hover:scale-105 active:scale-[0.98] sm:min-h-[3.75rem] sm:px-12 sm:text-xl"
        >
          Começar a Jogar
        </Link>

        {/* Cards compactos no mobile */}
        <div className="mt-10 grid w-full max-w-sm grid-cols-2 gap-3 sm:hidden">
          {CARDS_FLUTUANTES.slice(0, 2).map((card) => (
            <div
              key={card.id}
              className="rounded-xl border-2 border-white/80 bg-white/75 p-2.5 text-left shadow-md"
            >
              {card.content}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
