import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { MatMakerLogo } from './MatMakerLogo';
import { MathSymbolsBackground } from './MathSymbolsBackground';

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
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#EEF5FF]">
      <MathSymbolsBackground variant="landing" opacity={0.04} animated={false} />

      <header className="relative z-20 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2 sm:px-10">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <MatMakerLogo className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-[#0F172A]">MatMaker</span>
        </Link>
        <Link
          to={voltarPara}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-50"
        >
          <ChevronLeft className="h-4 w-4" />
          {voltarLabel}
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 py-10">
        <div className="auth-card w-full max-w-md p-8 sm:p-10">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">{titulo}</h1>
            <p className="mt-2 text-sm text-[#64748B]">{subtitulo}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
