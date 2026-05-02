import { createBrowserRouter } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SpacePosition } from './components/SpacePosition';
import { FractionsGame } from './components/FractionsGame';
import { DoubleGame } from './components/DoubleGame';

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
]);