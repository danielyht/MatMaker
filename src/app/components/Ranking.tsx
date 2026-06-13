import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarDays, ChevronLeft, RefreshCw, Trophy, Users } from 'lucide-react';
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
import { cn } from './ui/utils';

const MEDALHAS = ['🥇', '🥈', '🥉'] as const;

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

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EBF4FA] text-[#1E40AF]">
      <MathSymbolsBackground opacity={0.05} />

      <div className="pointer-events-none absolute -left-16 top-1/4 h-56 w-56 rounded-full bg-[#FF8C00]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-1/3 h-48 w-48 rounded-full bg-[#3498DB]/15 blur-3xl" />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-[#1E40AF] shadow-sm transition-transform hover:scale-105 active:scale-95"
            aria-label="Voltar ao laboratório"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#3498DB] shadow-md sm:h-11 sm:w-11">
            <Trophy className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">Ranking</h1>
            <p className="mt-0.5 text-sm font-medium text-[#1E40AF]/70">
              Geral, por liga ou semanal
            </p>
          </div>
          <button
            type="button"
            onClick={() => void carregar()}
            disabled={carregando}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-[#1E40AF] shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
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
            className="flex gap-1 rounded-2xl bg-[#1E40AF]/5 p-1"
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
                  'min-h-10 flex-1 rounded-xl px-2 text-xs font-bold transition-all sm:text-sm',
                  modo === aba.id
                    ? 'bg-white text-[#1E40AF] shadow-sm'
                    : 'text-[#1E40AF]/55 active:bg-white/50',
                )}
              >
                {aba.rotulo}
              </button>
            ))}
          </div>

          {modo === 'liga' && (
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5 pt-1">
              {LIGAS_RANKING.map((liga) => {
                const selecionada = ligaSelecionada === liga.id;
                const ehMinha = liga.id === ligaAtual.id;
                return (
                  <button
                    key={liga.id}
                    type="button"
                    onClick={() => setLigaSelecionada(liga.id)}
                    className={cn(
                      'shrink-0 rounded-full transition-transform active:scale-95',
                      selecionada && 'ring-2 ring-[#3498DB] ring-offset-1',
                    )}
                    aria-pressed={selecionada}
                    title={ehMinha ? 'Sua liga atual' : `Ver liga ${liga.nome}`}
                  >
                    <BadgeLiga liga={liga} tamanho="sm" />
                  </button>
                );
              })}
            </div>
          )}

          {modo === 'semanal' && semanaAtual && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-[#1E40AF]/65">
              <CalendarDays className="h-3.5 w-3.5" />
              Semana {rotuloSemanaAtual(semanaAtual)} — pontos ganhos neste período
            </p>
          )}
        </div>

        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 px-1 sm:mb-4">
            <Users className="h-4 w-4 text-[#3498DB]" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#1E40AF]/80">
              {tituloLista}
            </h2>
          </div>

          {carregando ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10">
              <MatMakerLogo className="h-12 w-12 zero-gravity-float-slow opacity-80" />
              <p className="text-sm font-medium text-[#1E40AF]/70">Carregando…</p>
            </div>
          ) : erro ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
              <p className="text-sm font-medium text-red-700">{erro}</p>
              <button
                type="button"
                onClick={() => void carregar()}
                className="rounded-2xl bg-[#3498DB] px-5 py-2.5 text-sm font-bold text-white"
              >
                Tentar de novo
              </button>
            </div>
          ) : listaExibida.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
              <Trophy className="h-12 w-12 text-[#3498DB]/40" />
              <p className="font-semibold text-[#1E40AF]/80">
                {modo === 'semanal'
                  ? 'Ninguém pontuou esta semana ainda'
                  : modo === 'liga'
                    ? `Nenhum jogador na liga ${LIGAS_RANKING.find((l) => l.id === ligaSelecionada)?.nome ?? ''}`
                    : 'Ninguém no ranking ainda'}
              </p>
              <p className="text-sm text-[#1E40AF]/60">
                {modo === 'semanal'
                  ? 'Complete missões para aparecer no ranking semanal.'
                  : 'Complete missões para ganhar pontos.'}
              </p>
            </div>
          ) : (
            <ul className="flex-1 space-y-2 overflow-y-auto pr-0.5 sm:space-y-2.5">
              {listaExibida.map((entrada, indice) => {
                const posicao = indice + 1;
                const ehEu = entrada.id === meuId;
                const topTres = posicao <= 3;
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
                      'flex items-center gap-3 rounded-2xl border px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3',
                      ehEu
                        ? 'border-[#FF8C00]/40 bg-white/95 ring-2 ring-[#FF8C00]/45'
                        : 'border-white/60 bg-white/70',
                      topTres && !ehEu && 'shadow-sm',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center font-bold sm:h-9 sm:w-9',
                        topTres ? 'text-xl' : 'text-sm text-[#1E40AF]/65',
                      )}
                    >
                      {posicaoLabel(posicao)}
                    </span>

                    <div className="relative shrink-0">
                      <AvatarRanking
                        nome={entrada.nome}
                        fotoUrl={entrada.foto_url}
                        destaque={ehEu}
                        tamanho={topTres || ehEu ? 'md' : 'sm'}
                      />
                      {modo !== 'semanal' && (
                        <IconeLiga
                          liga={liga}
                          className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold sm:text-base">
                        {entrada.nome}
                        {ehEu ? (
                          <span className="ml-1.5 text-xs font-semibold text-[#FF8C00]">(você)</span>
                        ) : null}
                      </p>
                      {modo === 'liga' ? (
                        <p className="mt-0.5 text-[10px] font-medium text-[#1E40AF]/50">
                          {dadosCompletos.find((d) => d.id === entrada.id)?.pontos ?? entrada.pontos}{' '}
                          pts totais
                        </p>
                      ) : modo === 'semanal' ? (
                        <p className="mt-0.5 text-[10px] font-medium text-[#1E40AF]/50">
                          {dadosCompletos.find((d) => d.id === entrada.id)?.pontos ?? 0} pts totais
                        </p>
                      ) : (
                        <BadgeLiga liga={liga} tamanho="sm" className="mt-1" />
                      )}
                    </div>

                    <p
                      className="shrink-0 text-base font-bold tabular-nums sm:text-lg"
                      style={{ color: topTres ? COR_SUCESSO : liga.cor }}
                    >
                      {entrada.pontos}
                      <span className="ml-0.5 text-[10px] font-semibold text-[#1E40AF]/45">
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
