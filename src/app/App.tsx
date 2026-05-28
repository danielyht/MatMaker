import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { roteador } from './rotas';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={roteador} />
    </AuthProvider>
  );
}
