import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { MatMakerLogo } from './MatMakerLogo';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { COR_FUNDO_SISTEMA } from '../constants/matmakerBrand';

type AuthPageShellProps = {
  titulo: string;
  subtitulo: string;
  voltarPara?: string;
  voltarLabel?: string;
  children: ReactNode;
};

export function AuthPageShell({
  titulo,
  subtitulo,
  voltarPara = '/login',
  voltarLabel = 'Voltar',
  children,
}: AuthPageShellProps) {
  return (
    <div
      className="relative min-h-[100dvh] overflow-hidden text-[#1E40AF]"
      style={{ backgroundColor: COR_FUNDO_SISTEMA }}
    >
      <MathSymbolsBackground variant="landing" opacity={0.1} />

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-[12%] h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-20 bottom-[8%] h-64 w-64 rounded-full bg-[#B7E6F2]/60 blur-3xl" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <MatMakerLogo className="h-9 w-9" />
          <span className="text-lg font-bold text-[#1E40AF]">MatMaker</span>
        </Link>
        <Link
          to={voltarPara}
          className="rounded-full px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          {voltarLabel}
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-white/65 bg-white/75 p-8 shadow-[0_16px_48px_-12px_rgba(52,152,219,0.22)] backdrop-blur-xl sm:p-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#1E40AF] sm:text-3xl">{titulo}</h1>
            <p className="mt-2 text-sm text-[#1E40AF]/75">{subtitulo}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
