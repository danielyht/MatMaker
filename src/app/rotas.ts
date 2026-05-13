import { createBrowserRouter } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SpacePosition } from './components/SpacePosition';
import { FractionsGame } from './components/FractionsGame';
import { DoubleGame } from './components/DoubleGame';
import { SquarePowerGame } from './components/SquarePowerGame';
import { PercentGame } from './components/PercentGame';
import { MarketChallengeGame } from './components/MarketChallengeGame';
import { MaterialDouradoGame } from './components/MaterialDouradoGame';
import { SobrePlaceholderPage } from './components/SobrePlaceholderPage';

export const roteador = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
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
    path: '/percentagens',
    Component: PercentGame,
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
