import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { perfilProfessorCompleto } from '../constants/professorCadastro';
import { MatMakerLogo } from './MatMakerLogo';

export function ProfessorRoute() {
  const { perfil, carregando, autenticado } = useAuth();

  if (carregando || (autenticado && !perfil)) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-[#EEF5FF]">
        <MatMakerLogo className="h-14 w-14 hero-float-slow opacity-90" />
        <p className="text-sm font-semibold text-[#64748B]">Carregando…</p>
      </div>
    );
  }

  if (!autenticado || !perfil) {
    return <Navigate to="/login" replace state={{ from: '/professor' }} />;
  }

  if (perfil.papel !== 'professor') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!perfilProfessorCompleto(perfil)) {
    return <Navigate to="/cadastro?completar=professor" replace />;
  }

  return <Outlet />;
}
