import { createBrowserRouter } from 'react-router';
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

export const roteador = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/cadastro',
    Component: Cadastro,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/sobre',
    Component: SobrePlaceholderPage,
  },
  {
    path: '/space-position',
    Component: SpacePosition,
  },
  {
    path: '/fractions',
    Component: FractionsGame,
  },
  {
    path: '/dobro',
    Component: DoubleGame,
  },
  {
    path: '/potencias-quadrado',
    Component: SquarePowerGame,
  },
  {
    path: '/desafio-mercado',
    Component: MarketChallengeGame,
  },
  {
    path: '/material-dourado',
    Component: MaterialDouradoGame,
  },
]);
