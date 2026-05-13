import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { MatMakerLogo } from './MatMakerLogo';

const navLinkClass =
  'rounded-full px-3 py-2 text-sm font-semibold text-foreground/85 transition-colors hover:bg-muted hover:text-foreground sm:px-4 sm:text-base';

function linkClass(isActive: boolean, isPrimary?: boolean) {
  if (isActive && isPrimary) {
    return `${navLinkClass} bg-primary/15 text-primary ring-1 ring-primary/35`;
  }
  if (isActive) {
    return `${navLinkClass} bg-muted text-foreground`;
  }
  if (isPrimary) {
    return `${navLinkClass} text-primary hover:bg-primary/10`;
  }
  return navLinkClass;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-border/60 bg-background/95 shadow-sm backdrop-blur-md pt-[max(0.35rem,env(safe-area-inset-top))]">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6 md:px-8"
        aria-label="Principal"
      >
        <NavLink
          to="/"
          end
          className="flex min-w-0 max-w-[min(100%,calc(100%-2.75rem))] shrink items-center gap-2.5 rounded-2xl py-1.5 pl-0.5 pr-1 no-underline outline-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40 md:max-w-none"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/85 p-0.5 shadow-sm ring-1 ring-primary/20 sm:h-9 sm:w-9 sm:rounded-xl sm:p-1">
            <MatMakerLogo className="block h-[72%] w-[72%] shrink-0 sm:h-[76%] sm:w-[76%]" />
          </span>
          <span className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">MatMaker</span>
        </NavLink>

        <div className="hidden items-center gap-1 sm:gap-2 md:flex">
          <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive, true)}>
            Laboratório
          </NavLink>
          <NavLink to="/sobre" className={({ isActive }) => linkClass(isActive)}>
            Sobre
          </NavLink>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground shadow-sm transition-colors hover:bg-muted md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div
          id="nav-mobile-menu"
          className="border-t border-border/60 bg-background/95 px-4 py-3 shadow-md backdrop-blur-md md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `${linkClass(isActive, true)} block text-center`}
              onClick={() => setOpen(false)}
            >
              Laboratório
            </NavLink>
            <NavLink
              to="/sobre"
              className={({ isActive }) => `${linkClass(isActive)} block text-center`}
              onClick={() => setOpen(false)}
            >
              Sobre
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
