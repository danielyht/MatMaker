import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LogOut,
  ChevronLeft,
  Rocket,
  Cookie,
  Apple,
  Zap,
  ShoppingBag,
  Layers3,
  Play,
  Trophy,
  Award,
  GraduationCap,
} from 'lucide-react';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { MatMakerLogo } from './MatMakerLogo';
import { useAuth } from '../contexts/AuthContext';
import { obterLigaPorPontos } from '../constants/ligasRanking';
import { MapaLaboratorio } from './MapaLaboratorio';
import { BadgeLiga } from './BadgeLiga';
import { useGamificacao } from '../contexts/GamificacaoContext';
import { listarTurmasAluno } from '../../lib/turmas';

export function Dashboard() {
  const navegar = useNavigate();
  const { perfil, sair, autenticado, carregando, ehProfessor } = useAuth();
  const { totalConquistas, totalPossivel } = useGamificacao();
  const [minhasTurmas, setMinhasTurmas] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    if (!carregando && autenticado && ehProfessor) {
      navegar('/professor', { replace: true });
    }
  }, [carregando, autenticado, ehProfessor, navegar]);

  useEffect(() => {
    if (perfil?.id && perfil.papel === 'aluno') {
      void listarTurmasAluno(perfil.id).then(({ turmas }) => setMinhasTurmas(turmas));
    }
  }, [perfil?.id, perfil?.papel]);

  useEffect(() => {
    if (!carregando && !autenticado) {
      navegar('/login', { replace: true, state: { from: '/dashboard' } });
    }
  }, [autenticado, carregando, navegar]);

  const atividades = [
    { id: 1, nome: 'Invasão Espacial', descricao: 'Identifique naves alienígenas usando posição (esquerda/direita)', icone: Rocket, cor: '#7C3AED', rota: '/space-position' },
    { id: 2, nome: 'Aventura das Frações', descricao: 'Aprenda frações dividindo pizzas!', icone: Cookie, cor: '#EA580C', rota: '/fractions' },
    { id: 3, nome: 'Multiplicação no mercado', descricao: 'Resolva problemas de multiplicação no mercado.', icone: Apple, cor: '#16A34A', rota: '/dobro' },
    { id: 4, nome: 'Potências ao quadrado', descricao: 'Quadrados pintados e potências ao quadrado.', icone: Zap, cor: '#1D4ED8', rota: '/potencias-quadrado' },
    { id: 6, nome: 'Desafio do mercado', descricao: 'Você aceita esse desafio?', icone: ShoppingBag, cor: '#0891B2', rota: '/desafio-mercado' },
    { id: 7, nome: 'Material dourado', descricao: 'Monte centenas, dezenas e unidades.', icone: Layers3, cor: '#B45309', rota: '/material-dourado' },
  ];

  if (carregando || !autenticado || ehProfessor) return null;

  function clicarAtividade(atividade: (typeof atividades)[number]) {
    if (atividade.rota) navegar(atividade.rota);
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EEF5FF]">
      <MathSymbolsBackground opacity={0.03} animated={false} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">

        {/* Header */}
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
          <button
            type="button"
            onClick={() => navegar('/')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8] active:scale-95"
            aria-label="Voltar ao início"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <MatMakerLogo className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight text-[#0F172A] sm:text-xl">
              Laboratório MatMaker
            </h1>
            <p className="mt-0.5 text-xs font-medium text-[#64748B]">
              {perfil?.nome
                ? `Olá, ${perfil.nome.split(' ')[0]}! Escolha uma missão.`
                : 'Escolha uma missão e comece a explorar'}
            </p>
          </div>
          {perfil?.foto_url ? (
            <img src={perfil.foto_url} alt="" className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover shadow-sm" />
          ) : null}
          <button
            type="button"
            onClick={() => { void sair().then(() => navegar('/login')); }}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95"
            aria-label="Sair da conta"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </header>

        {/* Card turma */}
        <button
          type="button"
          onClick={() => navegar('/entrar-turma')}
          className="stage-panel flex w-full items-center gap-4 p-4 text-left transition-all hover:border-[#7C3AED]/40 hover:shadow-lg active:scale-[0.99] sm:p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED] shadow-sm sm:h-14 sm:w-14">
            <GraduationCap className="h-6 w-6 text-white sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">Minha turma</h3>
            <p className="mt-0.5 text-sm text-[#64748B]">
              {minhasTurmas.length > 0
                ? minhasTurmas.map((t) => t.nome).join(' · ')
                : 'Entre com o código do professor'}
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-[#7C3AED] px-4 py-1.5 text-sm font-semibold text-white">
            {minhasTurmas.length > 0 ? 'Ver' : 'Entrar'}
          </span>
        </button>

        {/* Cards Conquistas + Ranking */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <button
            type="button"
            onClick={() => navegar('/conquistas')}
            className="stage-panel flex w-full items-center gap-4 p-4 text-left transition-all hover:border-[#1D4ED8]/40 hover:shadow-lg active:scale-[0.99] sm:p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8] shadow-sm sm:h-14 sm:w-14">
              <Award className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">Conquistas</h3>
              <p className="mt-0.5 text-sm text-[#64748B]">{totalConquistas}/{totalPossivel} desbloqueadas</p>
            </div>
            <span className="shrink-0 rounded-lg bg-[#1D4ED8] px-4 py-1.5 text-sm font-semibold text-white">Ver</span>
          </button>

          <button
            type="button"
            onClick={() => navegar('/ranking')}
            className="stage-panel flex w-full items-center gap-4 p-4 text-left transition-all hover:border-[#EA580C]/40 hover:shadow-lg active:scale-[0.99] sm:p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EA580C] shadow-sm sm:h-14 sm:w-14">
              <Trophy className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">Ranking</h3>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
                <span>{perfil?.pontos ?? 0} pts</span>
                {perfil ? <BadgeLiga liga={obterLigaPorPontos(perfil.pontos)} tamanho="sm" /> : null}
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-[#EA580C] px-4 py-1.5 text-sm font-semibold text-white">Ver</span>
          </button>
        </div>

        {/* Mapa do laboratório */}
        <MapaLaboratorio missoesConcluidas={perfil?.missoes_concluidas ?? []} />

        {/* Lista de missões */}
        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-5">
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-[#94A3B8] sm:mb-4">
            Missões disponíveis
          </p>
          <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5 sm:space-y-3">
            {atividades.map((atividade) => {
              const Icone = atividade.icone;
              return (
                <article
                  key={atividade.id}
                  onClick={() => clicarAtividade(atividade)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') clicarAtividade(atividade); }}
                  role="button"
                  tabIndex={0}
                  className="stage-panel flex cursor-pointer flex-col gap-3 p-4 transition-all duration-150 hover:border-[#93C5FD] hover:shadow-lg active:scale-[0.99] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-14 sm:w-14"
                    style={{ backgroundColor: atividade.cor }}
                  >
                    <Icone className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-[#0F172A]">{atividade.nome}</h3>
                    <p className="mt-0.5 text-sm text-[#64748B]">{atividade.descricao}</p>
                  </div>

                  <button
                    type="button"
                    className="flex min-h-[2.5rem] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1D4ED8] bg-[#EFF6FF] px-5 py-2 text-sm font-semibold text-[#1D4ED8] transition-colors hover:bg-[#1D4ED8] hover:text-white sm:w-auto sm:min-w-[7rem]"
                    onClick={(e) => { e.stopPropagation(); clicarAtividade(atividade); }}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Jogar
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
