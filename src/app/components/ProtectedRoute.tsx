import { Navigate, Outlet, useLocation } from 'react-router';
import { COR_FUNDO_SISTEMA } from '../constants/matmakerBrand';
import { useAuth } from '../contexts/AuthContext';
import { supabaseConfigurado } from '../../lib/supabaseClient';
import { MatMakerLogo } from './MatMakerLogo';

export function ProtectedRoute() {
  const { autenticado, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-[#1E40AF]"
        style={{ backgroundColor: COR_FUNDO_SISTEMA }}
      >
        <MatMakerLogo className="h-16 w-16 zero-gravity-float-slow" />
        <p className="text-sm font-semibold text-[#1E40AF]/70">Carregando…</p>
      </div>
    );
  }

  if (!supabaseConfigurado() || !autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
