import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { MatMakerLogo } from './MatMakerLogo';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { COR_FUNDO_SISTEMA } from '../constants/matmakerBrand';

const CARDS_FLUTUANTES = [
  {
    id: 'fracoes',
    className: 'left-[14%] top-[14%] -rotate-8 sm:left-[16%] sm:top-[16%]',
    delay: '0s',
    content: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF]/70">Frações</p>
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
    id: 'mercado',
    className: 'right-[12%] top-[18%] rotate-7 sm:right-[14%] sm:top-[20%]',
    delay: '0.7s',
    content: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF]/70">Mercado</p>
        <p className="mt-1 text-2xl font-bold text-primary">2 × 3</p>
        <p className="mt-1 text-xs text-[#1E40AF]/70">= 6 maçãs</p>
      </>
    ),
  },
  {
    id: 'potencia',
    className: 'left-[12%] bottom-[18%] rotate-6 sm:left-[15%] sm:bottom-[20%]',
    delay: '1.3s',
    content: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF]/70">Potência</p>
        <p className="mt-1 font-bold text-[#1E40AF]">
          <span className="text-3xl text-primary">2</span>
          <sup className="text-lg text-primary">²</sup>
          <span className="mx-1 text-xl">=</span>
          <span className="text-3xl">4</span>
        </p>
      </>
    ),
  },
  {
    id: 'espaco',
    className: 'right-[14%] bottom-[16%] -rotate-6 sm:right-[16%] sm:bottom-[18%]',
    delay: '1.9s',
    content: (
      <>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF]/70">Missão</p>
        <p className="mt-2 text-center text-3xl">🛸</p>
        <p className="mt-1 text-center text-xs font-semibold text-[#1E40AF]/80">Esquerda ou direita?</p>
      </>
    ),
  },
] as const;

export function LandingPage() {
  return (
    <div
      className="relative min-h-[100dvh] overflow-hidden text-[#1E40AF]"
      style={{ backgroundColor: COR_FUNDO_SISTEMA }}
    >
      <MathSymbolsBackground variant="landing" opacity={0.13} />

      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute -left-24 top-[18%] h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-20 bottom-[12%] h-64 w-64 rounded-full bg-[#B7E6F2]/60 blur-3xl" />
        <div className="zero-gravity-float-slow absolute left-[18%] top-[22%] h-3 w-3 rounded-full bg-primary/25" />
        <div
          className="zero-gravity-float-delayed absolute right-[22%] top-[18%] h-2 w-2 rounded-full bg-[#1E40AF]/20"
          style={{ '--zg-delay': '1s' } as CSSProperties}
        />
        <div
          className="zero-gravity-float-delayed absolute left-[72%] top-[72%] h-2.5 w-2.5 rounded-full bg-primary/20"
          style={{ '--zg-delay': '2.2s' } as CSSProperties}
        />
        <div
          className="zero-gravity-float-delayed absolute left-[28%] bottom-[18%] h-3 w-3 rounded-full bg-[#00CAFC]/15"
          style={{ '--zg-delay': '0.5s' } as CSSProperties}
        />
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <MatMakerLogo className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="text-lg font-bold tracking-tight text-[#1E40AF]">MatMaker</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-4 sm:text-base">
          <Link
            to="/login"
            className="rounded-full px-3 py-1.5 text-primary transition-colors hover:bg-primary/10 sm:px-4"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="rounded-full px-3 py-1.5 text-[#1E40AF]/80 transition-colors hover:bg-white/50 sm:px-4"
          >
            Cadastro
          </Link>
          <Link
            to="/sobre"
            className="rounded-full px-3 py-1.5 text-[#1E40AF]/80 transition-colors hover:bg-white/50 sm:px-4"
          >
            Sobre
          </Link>
        </nav>
      </header>

      {/* Cards espalhados pela tela (longe das bordas) */}
      <div className="pointer-events-none absolute inset-0 z-[5] hidden sm:block" aria-hidden>
        {CARDS_FLUTUANTES.map((card) => (
          <div
            key={card.id}
            className={`zero-gravity-float-delayed absolute w-[118px] rounded-2xl border border-white/70 bg-white/72 p-3 shadow-[0_10px_32px_-10px_rgba(0,202,252,0.28)] backdrop-blur-sm md:w-[128px] ${card.className}`}
            style={{ '--zg-delay': card.delay } as CSSProperties}
          >
            {card.content}
          </div>
        ))}
      </div>

      <main className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <div className="zero-gravity-float-slow mb-6 sm:mb-8">
          <MatMakerLogo className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44" />
        </div>

        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-[#1E40AF] sm:text-4xl md:text-5xl">
          Construa conhecimento matemático
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-[#1E40AF]/80 sm:text-lg">
          Frações, multiplicação, potências e outros desafios no laboratório. Escolha uma atividade e
          comece a jogar.
        </p>

        <Link
          to="/login"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-[#00A1C9] px-10 py-4 text-lg font-bold text-white shadow-[0_14px_40px_-6px_rgba(0,202,252,0.55)] transition-transform duration-300 hover:scale-105 active:scale-[0.98] sm:min-h-[3.75rem] sm:px-12 sm:text-xl"
        >
          Ir para o laboratório
        </Link>

        <div className="mt-10 grid w-full max-w-md grid-cols-2 gap-4 sm:hidden">
          {CARDS_FLUTUANTES.map((card) => (
            <div
              key={card.id}
              className="rounded-xl border border-white/70 bg-white/72 p-2.5 text-left shadow-sm backdrop-blur-sm"
            >
              {card.content}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
