import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import {
  ChevronLeft,
  Rocket,
  Cookie,
  Apple,
  Zap,
  ShoppingBag,
  Layers3,
  Play,
  Trophy,
} from 'lucide-react';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { MatMakerLogo } from './MatMakerLogo';
import { useAuth } from '../contexts/AuthContext';
import { obterLigaPorPontos } from '../constants/ligasRanking';
import { BadgeLiga } from './BadgeLiga';

export function Dashboard() {
  const navegar = useNavigate();
  const { perfil, sair, autenticado, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && !autenticado) {
      navegar('/login', { replace: true, state: { from: '/dashboard' } });
    }
  }, [autenticado, carregando, navegar]);

  const atividades = [
    {
      id: 1,
      nome: 'Invasão Espacial',
      descricao: 'Identifique naves alienígenas usando posição (esquerda/direita)',
      icone: Rocket,
      cor: '#8b5cf6',
      bloqueado: false,
      rota: '/space-position',
    },
    {
      id: 2,
      nome: 'Aventura das Frações',
      descricao: 'Aprenda frações dividindo pizzas!',
      icone: Cookie,
      cor: '#fb923c',
      bloqueado: false,
      rota: '/fractions',
    },
    {
      id: 3,
      nome: 'Multiplicação no mercado',
      descricao: 'Resolva problemas de multiplicação no mercado.',
      icone: Apple,
      cor: '#22c55e',
      bloqueado: false,
      rota: '/dobro',
    },
    {
      id: 4,
      nome: 'Potências ao quadrado',
      descricao: 'Quadrados pintados e potências ao quadrado.',
      icone: Zap,
      cor: '#7c3aed',
      bloqueado: false,
      rota: '/potencias-quadrado',
    },
    {
      id: 6,
      nome: 'Desafio do mercado',
      descricao: 'Você aceita esse desafio?',
      icone: ShoppingBag,
      cor: '#059669',
      bloqueado: false,
      rota: '/desafio-mercado',
    },
    {
      id: 7,
      nome: 'Material dourado',
      descricao: 'Monte centenas, dezenas e unidades.',
      icone: Layers3,
      cor: '#d97706',
      bloqueado: false,
      rota: '/material-dourado',
    },
  ];

  if (carregando || !autenticado) {
    return null;
  }

  function clicarAtividade(atividade: (typeof atividades)[number]) {
    if (!atividade.bloqueado && atividade.rota) {
      navegar(atividade.rota);
    }
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EBF4FA] text-[#1E40AF]">
      <MathSymbolsBackground opacity={0.04} />

      <div className="pointer-events-none absolute -left-16 top-1/4 h-56 w-56 rounded-full bg-[#00CAFC]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-1/3 h-48 w-48 rounded-full bg-[#3498DB]/10 blur-3xl" />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        {/* Cabeçalho flutuante */}
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={() => navegar('/')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-[#1E40AF] shadow-sm transition-transform hover:scale-105 active:scale-95"
            aria-label="Voltar ao início"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <MatMakerLogo className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl">
              Laboratório MatMaker
            </h1>
            <p className="mt-0.5 text-sm font-medium text-[#1E40AF]/70 sm:text-base">
              {perfil?.nome
                ? `Olá, ${perfil.nome.split(' ')[0]}! Escolha uma missão.`
                : 'Escolha uma missão e comece a explorar'}
            </p>
          </div>
          {perfil?.foto_url ? (
            <img
              src={perfil.foto_url}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm sm:h-11 sm:w-11"
            />
          ) : null}
          <button
            type="button"
            onClick={() => {
              void sair().then(() => navegar('/login'));
            }}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-2xl border border-white/80 bg-white/90 px-3 text-sm font-semibold text-[#1E40AF] shadow-sm transition-transform hover:scale-105 active:scale-95"
            aria-label="Sair da conta"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </header>

        <button
          type="button"
          onClick={() => navegar('/ranking')}
          className="stage-panel flex w-full items-center gap-4 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-12px_rgba(255,140,0,0.25)] active:scale-[0.99] sm:p-5"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#3498DB] shadow-md sm:h-16 sm:w-16">
            <Trophy className="h-7 w-7 text-white sm:h-8 sm:w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold sm:text-xl">Ranking</h3>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#1E40AF]/70">
              <span>{perfil?.pontos ?? 0} pts</span>
              {perfil ? <BadgeLiga liga={obterLigaPorPontos(perfil.pontos)} tamanho="sm" /> : null}
            </p>
          </div>
          <span className="shrink-0 rounded-2xl bg-[#FF8C00] px-4 py-2 text-sm font-bold text-white shadow-md">
            Ver
          </span>
        </button>

        {/* Lista de atividades */}
        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-5">
          <p className="mb-3 px-1 text-sm font-semibold text-[#1E40AF]/80 sm:mb-4">
            Missões disponíveis
          </p>
          <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 sm:space-y-4">
            {atividades.map((atividade) => {
              const Icone = atividade.icone;
              const podeClicar = !atividade.bloqueado;

              return (
                <article
                  key={atividade.id}
                  onClick={() => clicarAtividade(atividade)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') clicarAtividade(atividade);
                  }}
                  role="button"
                  tabIndex={podeClicar ? 0 : -1}
                  className={`stage-panel flex flex-col gap-4 p-4 transition-all duration-200 sm:flex-row sm:items-center sm:gap-5 sm:p-5 ${
                    podeClicar
                      ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-12px_rgba(52,152,219,0.28)] active:scale-[0.99]'
                      : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-md sm:h-16 sm:w-16"
                    style={{ backgroundColor: atividade.cor }}
                  >
                    <Icone className="h-7 w-7 text-white sm:h-8 sm:w-8" strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold sm:text-xl">{atividade.nome}</h3>
                    <p className="mt-1 text-sm leading-snug text-[#1E40AF]/70">{atividade.descricao}</p>
                  </div>

                  {podeClicar && (
                    <button
                      type="button"
                      className="flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#3498DB] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#3498DB]/30 transition-transform hover:scale-105 active:scale-[0.98] sm:w-auto sm:min-w-[8.5rem]"
                      onClick={(e) => {
                        e.stopPropagation();
                        clicarAtividade(atividade);
                      }}
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Jogar
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
