import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Award, ChevronLeft } from 'lucide-react';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { MatMakerLogo } from './MatMakerLogo';
import { PainelConquistas } from './PainelConquistas';
import { useAuth } from '../contexts/AuthContext';
import { useGamificacao } from '../contexts/GamificacaoContext';

export function ConquistasPage() {
  const navegar = useNavigate();
  const { autenticado, carregando } = useAuth();
  const { idsDesbloqueados, totalConquistas, totalPossivel } = useGamificacao();

  useEffect(() => {
    if (!carregando && !autenticado) {
      navegar('/login', { replace: true, state: { from: '/conquistas' } });
    }
  }, [autenticado, carregando, navegar]);

  if (carregando || !autenticado) return null;

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EBF4FA] text-[#1E40AF]">
      <MathSymbolsBackground opacity={0.04} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-[#1E40AF] shadow-sm transition-transform hover:scale-105 active:scale-95"
            aria-label="Voltar ao laboratório"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <MatMakerLogo className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">Conquistas</h1>
            <p className="mt-0.5 text-sm text-[#1E40AF]/70">
              {totalConquistas} de {totalPossivel} desbloqueadas
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#3498DB] shadow-md">
            <Award className="h-5 w-5 text-white" />
          </div>
        </header>

        <div className="glass-panel flex-1 overflow-y-auto p-3 sm:p-5">
          <PainelConquistas idsDesbloqueados={idsDesbloqueados} />
        </div>
      </div>
    </div>
  );
}
