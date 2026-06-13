import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, Copy, RefreshCw, Users } from 'lucide-react';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { AvatarRanking } from './AvatarRanking';
import { BadgeLiga } from './BadgeLiga';
import { useAuth } from '../contexts/AuthContext';
import { buscarTurmaProfessor, listarAlunosTurma } from '../../lib/turmas';
import { obterLigaPorPontos } from '../constants/ligasRanking';
import { TOTAL_MISSOES } from '../constants/jogos';
import type { AlunoTurma, Turma } from '../constants/turmas';
import { COR_SUCESSO } from '../constants/matmakerBrand';

export function TurmaDetalhe() {
  const { turmaId } = useParams<{ turmaId: string }>();
  const navegar = useNavigate();
  const { perfil } = useAuth();
  const [turma, setTurma] = useState<Turma | null>(null);
  const [alunos, setAlunos] = useState<AlunoTurma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function carregar() {
    if (!perfil || !turmaId) return;
    setCarregando(true);
    setErro(null);
    const [{ turma: t, erro: e1 }, { alunos: lista, erro: e2 }] = await Promise.all([
      buscarTurmaProfessor(turmaId, perfil.id),
      listarAlunosTurma(turmaId),
    ]);
    setTurma(t);
    setAlunos(lista);
    setErro(e1 ?? e2);
    setCarregando(false);
  }

  useEffect(() => {
    void carregar();
  }, [perfil?.id, turmaId]);

  async function copiarCodigo() {
    if (!turma) return;
    try {
      await navigator.clipboard.writeText(turma.codigo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      setErro('Não foi possível copiar o código.');
    }
  }

  if (!turmaId) return null;

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EBF4FA] text-[#1E40AF]">
      <MathSymbolsBackground opacity={0.04} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={() => navegar('/professor')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold sm:text-2xl">{turma?.nome ?? 'Turma'}</h1>
            <p className="text-sm text-[#1E40AF]/70">
              {alunos.length} aluno{alunos.length === 1 ? '' : 's'} · ranking da turma
            </p>
          </div>
          <button
            type="button"
            onClick={() => void carregar()}
            disabled={carregando}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/90 disabled:opacity-50"
            aria-label="Atualizar"
          >
            <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {turma && (
          <div className="glass-panel flex flex-wrap items-center gap-3 p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#1E40AF]/55">
                Código da turma
              </span>
              <span className="font-mono text-2xl font-black tracking-[0.25em] text-[#3498DB]">
                {turma.codigo}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void copiarCodigo()}
              className="flex items-center gap-2 rounded-2xl bg-[#3498DB] px-4 py-2.5 text-sm font-bold text-white shadow-md"
            >
              <Copy className="h-4 w-4" />
              {copiado ? 'Copiado!' : 'Copiar código'}
            </button>
          </div>
        )}

        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
          {carregando ? (
            <div className="flex flex-1 items-center justify-center py-10 text-sm text-[#1E40AF]/60">
              Carregando alunos…
            </div>
          ) : erro ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="text-sm font-medium text-red-700">{erro}</p>
              <button
                type="button"
                onClick={() => navegar('/professor')}
                className="rounded-2xl bg-[#3498DB] px-5 py-2 text-sm font-bold text-white"
              >
                Voltar
              </button>
            </div>
          ) : alunos.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
              <Users className="h-12 w-12 text-[#3498DB]/40" />
              <p className="font-semibold">Nenhum aluno entrou ainda</p>
              <p className="text-sm text-[#1E40AF]/60">
                Compartilhe o código <strong>{turma?.codigo}</strong> com a turma.
              </p>
            </div>
          ) : (
            <ul className="flex-1 space-y-2 overflow-y-auto pr-0.5">
              {alunos.map((aluno, indice) => {
                const posicao = indice + 1;
                const liga = obterLigaPorPontos(aluno.pontos);
                const progresso = Math.round(
                  (aluno.missoes_concluidas.length / TOTAL_MISSOES) * 100,
                );

                return (
                  <li
                    key={aluno.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-3 py-3 sm:gap-4 sm:px-4"
                  >
                    <span className="w-8 shrink-0 text-center text-sm font-bold text-[#1E40AF]/60">
                      {posicao}º
                    </span>
                    <AvatarRanking nome={aluno.nome} fotoUrl={aluno.foto_url} tamanho="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold sm:text-base">{aluno.nome}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <BadgeLiga liga={liga} tamanho="sm" />
                        <span className="text-[10px] font-medium text-[#1E40AF]/55">
                          {progresso}% lab · {aluno.jogos_completados}/{TOTAL_MISSOES} jogos
                        </span>
                      </div>
                    </div>
                    <p
                      className="shrink-0 text-base font-bold tabular-nums"
                      style={{ color: COR_SUCESSO }}
                    >
                      {aluno.pontos}
                      <span className="ml-0.5 text-[10px] font-semibold text-[#1E40AF]/45">pts</span>
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
