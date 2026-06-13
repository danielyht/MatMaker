import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SpacePosition } from './components/SpacePosition';
import { FractionsGame } from './components/FractionsGame';
import { DoubleGame } from './components/DoubleGame';
import { SquarePowerGame } from './components/SquarePowerGame';
import { MarketChallengeGame } from './components/MarketChallengeGame';
import { MaterialDouradoGame } from './components/MaterialDouradoGame';
import { SobrePlaceholderPage } from './components/SobrePlaceholderPage';
import { Cadastro } from './components/Cadastro';
import { Login } from './components/Login';
import { EsqueciSenha } from './components/EsqueciSenha';
import { RedefinirSenha } from './components/RedefinirSenha';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Ranking } from './components/Ranking';
import { ConquistasPage } from './components/ConquistasPage';
import { ProfessorRoute } from './components/ProfessorRoute';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { TurmaDetalhe } from './components/TurmaDetalhe';
import { EntrarTurma } from './components/EntrarTurma';

/** Rotas que exigem login (laboratório e jogos). */
const rotasProtegidas = [
  { path: 'dashboard', Component: Dashboard },
  { path: 'ranking', Component: Ranking },
  { path: 'conquistas', Component: ConquistasPage },
  { path: 'entrar-turma', Component: EntrarTurma },
  { path: 'space-position', Component: SpacePosition },
  { path: 'fractions', Component: FractionsGame },
  { path: 'dobro', Component: DoubleGame },
  { path: 'potencias-quadrado', Component: SquarePowerGame },
  { path: 'desafio-mercado', Component: MarketChallengeGame },
  { path: 'material-dourado', Component: MaterialDouradoGame },
] as const;

export const roteador = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        Component: LandingPage,
      },
      {
        path: '/cadastro',
        Component: Cadastro,
      },
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/esqueci-senha',
        Component: EsqueciSenha,
      },
      {
        path: '/redefinir-senha',
        Component: RedefinirSenha,
      },
      {
        path: '/sobre',
        Component: SobrePlaceholderPage,
      },
      {
        element: <ProfessorRoute />,
        children: [
          { path: 'professor', Component: ProfessorDashboard },
          { path: 'professor/turma/:turmaId', Component: TurmaDetalhe },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: rotasProtegidas.map((rota) => ({
          path: rota.path,
          Component: rota.Component,
        })),
      },
    ],
  },
]);
