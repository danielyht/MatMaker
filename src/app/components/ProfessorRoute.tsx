import { Navigate, Outlet } from 'react-router';
import { COR_FUNDO_SISTEMA } from '../constants/matmakerBrand';
import { useAuth } from '../contexts/AuthContext';
import { MatMakerLogo } from './MatMakerLogo';

export function ProfessorRoute() {
  const { perfil, carregando, autenticado } = useAuth();

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

  if (!autenticado || !perfil) {
    return <Navigate to="/login" replace state={{ from: '/professor' }} />;
  }

  if (perfil.papel !== 'professor') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
