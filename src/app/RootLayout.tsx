import { Outlet } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';

/** Envolve todas as rotas — o RouterProvider não herda contexto de fora do router. */
export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
