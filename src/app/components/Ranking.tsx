import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarDays, ChevronLeft, LayoutList, RefreshCw, Trophy, Users, BarChart3 } from 'lucide-react';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { MatMakerLogo } from './MatMakerLogo';
import { AvatarRanking } from './AvatarRanking';
import { MeuPerfilRanking } from './MeuPerfilRanking';
import { useAuth } from '../contexts/AuthContext';
import {
  buscarRankingCompleto,
  ligaDoUsuario,
  prepararListaRanking,
  tituloModoRanking,
  type EntradaRanking,
  type EntradaRankingCompleta,
  type ModoRanking,
} from '../../lib/ranking';
import { lerPontosSemanaLocal } from '../../lib/pontosSemanaLocal';
import { rotuloSemanaAtual } from '../../lib/semanaRanking';
import { COR_SUCESSO } from '../constants/matmakerBrand';
import { obterLigaPorPontos, LIGAS_RANKING, type LigaId } from '../constants/ligasRanking';
import { BadgeLiga, IconeLiga } from './BadgeLiga';
import { PodioRanking } from './PodioRanking';
import { cn } from './ui/utils';

const MEDALHAS = ['🥇', '🥈', '🥉'] as const;

type VisualizacaoRanking = 'lista' | 'podio';

const ABAS: { id: ModoRanking; rotulo: string }[] = [
  { id: 'geral', rotulo: 'Geral' },
  { id: 'liga', rotulo: 'Por liga' },
  { id: 'semanal', rotulo: 'Semanal' },
];

function posicaoLabel(posicao: number): string {
  if (posicao <= 3) return MEDALHAS[posicao - 1];
  return `${posicao}º`;
}

function mesclarPontosSemanaisLocais(
  dados: EntradaRankingCompleta[],
  userId: string | undefined,
  semanaAtual: string,
): EntradaRankingCompleta[] {
  if (!userId) return dados;
  const local = lerPontosSemanaLocal(userId);
  if (local.ref !== semanaAtual || local.pontos <= 0) return dados;
  return dados.map((e) =>
    e.id === userId
      ? { ...e, pontos_semana: Math.max(e.pontos_semana, local.pontos), semana_ref: semanaAtual }
      : e,
  );
}

export function Ranking() {
  const navegar = useNavigate();
  const { perfil, session, autenticado, carregando: authCarregando, recarregarPerfil } = useAuth();
  const [dadosCompletos, setDadosCompletos] = useState<EntradaRankingCompleta[]>([]);
  const [semanaAtual, setSemanaAtual] = useState('');
  const [modo, setModo] = useState<ModoRanking>('geral');
  const [visualizacao, setVisualizacao] = useState<VisualizacaoRanking>('podio');
  const [ligaSelecionada, setLigaSelecionada] = useState<LigaId>('bronze');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    await recarregarPerfil();
    const { dados, erro: msgErro, semanaAtual: ref } = await buscarRankingCompleto();
    const mesclados = mesclarPontosSemanaisLocais(dados, session?.user?.id, ref);
    setDadosCompletos(mesclados);
    setSemanaAtual(ref);
    setErro(msgErro);
    setCarregando(false);
  }

  useEffect(() => {
    if (!authCarregando && !autenticado) {
      navegar('/login', { replace: true, state: { from: '/ranking' } });
      return;
    }
    if (autenticado) void carregar();
  }, [authCarregando, autenticado, navegar]);

  useEffect(() => {
    if (perfil) setLigaSelecionada(ligaDoUsuario(perfil.pontos));
  }, [perfil?.pontos]);

  const listaExibida: EntradaRanking[] = useMemo(
    () =>
      prepararListaRanking(dadosCompletos, modo, {
        ligaId: ligaSelecionada,
        semanaRef: semanaAtual,
      }),
    [dadosCompletos, modo, ligaSelecionada, semanaAtual],
  );

  if (authCarregando || !autenticado) {
    return null;
  }

  const meuId = perfil?.id;
  const minhaPosicao = meuId ? listaExibida.findIndex((e) => e.id === meuId) + 1 : 0;
  const ligaAtual = perfil ? obterLigaPorPontos(perfil.pontos) : LIGAS_RANKING[0];
  const tituloLista = tituloModoRanking(modo, ligaSelecionada);
  const topTres = listaExibida.slice(0, 3);
  const restanteLista = visualizacao === 'podio' ? listaExibida.slice(3) : listaExibida;

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EEF5FF]">
      <MathSymbolsBackground opacity={0.03} animated={false} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8] active:scale-95"
            aria-label="Voltar ao laboratório"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EA580C] shadow-sm">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight text-[#0F172A] sm:text-xl">Ranking</h1>
            <p className="mt-0.5 text-xs font-medium text-[#64748B]">
              Geral, por liga ou semanal
            </p>
          </div>
          <button
            type="button"
            onClick={() => void carregar()}
            disabled={carregando}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8] active:scale-95 disabled:opacity-50"
            aria-label="Atualizar ranking"
          >
            <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {perfil && (
          <MeuPerfilRanking
            nome={perfil.nome}
            fotoUrl={perfil.foto_url}
            pontos={perfil.pontos}
            jogosCompletados={perfil.jogos_completados}
            posicaoRanking={minhaPosicao}
          />
        )}

        <div className="glass-panel p-2 sm:p-2.5">
          <div
            className="flex gap-1 rounded-xl bg-[#F1F5F9] p-1"
            role="tablist"
            aria-label="Tipo de ranking"
          >
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                type="button"
                role="tab"
                aria-selected={modo === aba.id}
                onClick={() => setModo(aba.id)}
                className={cn(
                  'min-h-9 flex-1 rounded-lg px-2 text-xs font-semibold transition-all sm:text-sm',
                  modo === aba.id
                    ? 'bg-white text-[#1D4ED8] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]',
                )}
              >
                {aba.rotulo}
              </button>
            ))}
          </div>

          {modo === 'liga' && (
            <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
              {LIGAS_RANKING.map((liga) => {
                const selecionada = ligaSelecionada === liga.id;
                const ehMinha = liga.id === ligaAtual.id;
                return (
                  <button
                    key={liga.id}
                    type="button"
                    onClick={() => setLigaSelecionada(liga.id)}
                    className="shrink-0 rounded-full transition-transform active:scale-95"
                    aria-pressed={selecionada}
                    title={ehMinha ? 'Sua liga atual' : `Ver liga ${liga.nome}`}
                  >
                    <BadgeLiga
                      liga={liga}
                      tamanho="sm"
                      className={cn(selecionada && 'ring-2 ring-[#1D4ED8]')}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {modo === 'semanal' && semanaAtual && (
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-[#64748B]">
              <CalendarDays className="h-3.5 w-3.5" />
              Semana {rotuloSemanaAtual(semanaAtual)} — pontos ganhos neste período
            </p>
          )}

          <div
            className="mt-2.5 flex gap-1 rounded-xl bg-[#F1F5F9] p-1"
            role="tablist"
            aria-label="Visualização do ranking"
          >
            <button
              type="button"
              role="tab"
              aria-selected={visualizacao === 'podio'}
              onClick={() => setVisualizacao('podio')}
              className={cn(
                'flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all sm:text-sm',
                visualizacao === 'podio'
                  ? 'bg-white text-[#1D4ED8] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]',
              )}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Pódio
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={visualizacao === 'lista'}
              onClick={() => setVisualizacao('lista')}
              className={cn(
                'flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all sm:text-sm',
                visualizacao === 'lista'
                  ? 'bg-white text-[#1D4ED8] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]',
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
              Lista
            </button>
          </div>
        </div>

        {visualizacao === 'podio' && !carregando && !erro && listaExibida.length > 0 && (
          <PodioRanking
            topTres={topTres}
            dadosCompletos={dadosCompletos}
            modo={modo}
            meuId={meuId}
          />
        )}

        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 px-1 sm:mb-4">
            <Users className="h-4 w-4 text-[#1D4ED8]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              {visualizacao === 'podio' && restanteLista.length > 0
                ? 'Demais colocados'
                : tituloLista}
            </h2>
          </div>

          {carregando ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10">
              <MatMakerLogo className="h-12 w-12 hero-float-slow opacity-80" />
              <p className="text-sm font-medium text-[#64748B]">Carregando…</p>
            </div>
          ) : erro ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
              <p className="text-sm font-medium text-red-700">{erro}</p>
              <button
                type="button"
                onClick={() => void carregar()}
                className="rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Tentar de novo
              </button>
            </div>
          ) : listaExibida.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
              <Trophy className="h-12 w-12 text-[#CBD5E1]" />
              <p className="font-semibold text-[#0F172A]">
                {modo === 'semanal'
                  ? 'Ninguém pontuou esta semana ainda'
                  : modo === 'liga'
                    ? `Nenhum jogador na liga ${LIGAS_RANKING.find((l) => l.id === ligaSelecionada)?.nome ?? ''}`
                    : 'Ninguém no ranking ainda'}
              </p>
              <p className="text-sm text-[#64748B]">
                {modo === 'semanal'
                  ? 'Complete missões para aparecer no ranking semanal.'
                  : 'Complete missões para ganhar pontos.'}
              </p>
            </div>
          ) : visualizacao === 'podio' && restanteLista.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
              <p className="text-sm font-medium text-[#64748B]">
                O pódio está completo — só os três primeiros por enquanto.
              </p>
            </div>
          ) : (
            <ul className="flex-1 space-y-2 overflow-y-auto pr-0.5 sm:space-y-2.5">
              {restanteLista.map((entrada, indice) => {
                const posicao = visualizacao === 'podio' ? indice + 4 : indice + 1;
                const ehEu = entrada.id === meuId;
                const noTopTres = posicao <= 3;
                const liga =
                  modo === 'semanal'
                    ? ligaAtual
                    : obterLigaPorPontos(
                        dadosCompletos.find((d) => d.id === entrada.id)?.pontos ?? entrada.pontos,
                      );

                return (
                  <li
                    key={entrada.id}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3',
                      ehEu
                        ? 'border-[#EA580C]/30 bg-white ring-2 ring-[#EA580C]/25'
                        : 'border-[#E2E8F0] bg-white',
                      noTopTres && !ehEu && 'shadow-sm',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center font-bold sm:h-9 sm:w-9',
                        noTopTres ? 'text-xl' : 'text-sm text-[#94A3B8]',
                      )}
                    >
                      {posicaoLabel(posicao)}
                    </span>

                    <div className="relative shrink-0">
                      <AvatarRanking
                        nome={entrada.nome}
                        fotoUrl={entrada.foto_url}
                        destaque={ehEu}
                        tamanho={noTopTres || ehEu ? 'md' : 'sm'}
                      />
                      {modo !== 'semanal' && (
                        <IconeLiga
                          liga={liga}
                          className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#0F172A] sm:text-base">
                        {entrada.nome}
                        {ehEu ? (
                          <span className="ml-1.5 text-xs font-semibold text-[#EA580C]">(você)</span>
                        ) : null}
                      </p>
                      {modo === 'liga' ? (
                        <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
                          {dadosCompletos.find((d) => d.id === entrada.id)?.pontos ?? entrada.pontos}{' '}
                          pts totais
                        </p>
                      ) : modo === 'semanal' ? (
                        <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
                          {dadosCompletos.find((d) => d.id === entrada.id)?.pontos ?? 0} pts totais
                        </p>
                      ) : (
                        <BadgeLiga liga={liga} tamanho="sm" className="mt-1" />
                      )}
                    </div>

                    <p
                      className="shrink-0 text-base font-bold tabular-nums sm:text-lg"
                      style={{ color: noTopTres ? COR_SUCESSO : liga.cor }}
                    >
                      {entrada.pontos}
                      <span className="ml-0.5 text-[10px] font-semibold text-[#94A3B8]">
                        {modo === 'semanal' ? 'sem.' : 'pts'}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
