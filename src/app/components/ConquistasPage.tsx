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
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EEF5FF]">
      <MathSymbolsBackground opacity={0.03} animated={false} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8] active:scale-95"
            aria-label="Voltar ao laboratório"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <MatMakerLogo className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight text-[#0F172A] sm:text-xl">Conquistas</h1>
            <p className="mt-0.5 text-xs text-[#64748B]">
              {totalConquistas} de {totalPossivel} desbloqueadas
            </p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EA580C] shadow-sm">
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
