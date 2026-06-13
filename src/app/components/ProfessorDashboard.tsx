import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  Copy,
  GraduationCap,
  LogOut,
  Plus,
  RefreshCw,
  Users,
} from 'lucide-react';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { MatMakerLogo } from './MatMakerLogo';
import { useAuth } from '../contexts/AuthContext';
import { criarTurma, listarTurmasProfessor } from '../../lib/turmas';
import type { Turma } from '../constants/turmas';

export function ProfessorDashboard() {
  const navegar = useNavigate();
  const { perfil, sair } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [nomeNova, setNomeNova] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  async function carregar() {
    if (!perfil) return;
    setCarregando(true);
    setErro(null);
    const { turmas: lista, erro: msgErro } = await listarTurmasProfessor(perfil.id);
    setTurmas(lista);
    setErro(msgErro);
    setCarregando(false);
  }

  useEffect(() => {
    void carregar();
  }, [perfil?.id]);

  async function handleCriar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!perfil) return;
    setCriando(true);
    setErro(null);
    const { turma, erro: msgErro } = await criarTurma(perfil.id, nomeNova);
    if (msgErro) setErro(msgErro);
    if (turma) {
      setTurmas((prev) => [turma, ...prev]);
      setNomeNova('');
    }
    setCriando(false);
  }

  async function copiarCodigo(turma: Turma) {
    try {
      await navigator.clipboard.writeText(turma.codigo);
      setCopiadoId(turma.id);
      window.setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      setErro('Não foi possível copiar o código.');
    }
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EBF4FA] text-[#1E40AF]">
      <MathSymbolsBackground opacity={0.04} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <MatMakerLogo className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">Modo turma</h1>
            <p className="mt-0.5 truncate text-sm text-[#1E40AF]/70">
              Olá, {perfil?.nome.split(' ')[0]} — painel do professor
            </p>
          </div>
          <button
            type="button"
            onClick={() => void carregar()}
            disabled={carregando}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm disabled:opacity-50"
            aria-label="Atualizar turmas"
          >
            <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => void sair().then(() => navegar('/login'))}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-2xl border border-white/80 bg-white/90 px-3 text-sm font-semibold shadow-sm"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </header>

        <div className="glass-panel p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3498DB] to-[#7C3AED] shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Criar turma</h2>
              <p className="text-sm text-[#1E40AF]/70">
                Gere um código para os alunos entrarem no MatMaker
              </p>
            </div>
          </div>

          <form onSubmit={handleCriar} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={nomeNova}
              onChange={(e) => setNomeNova(e.target.value)}
              placeholder="Ex.: 6º ano A — matemática"
              maxLength={80}
              className="min-h-11 flex-1 rounded-2xl border border-white/80 bg-white/90 px-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#3498DB]/40"
            />
            <button
              type="submit"
              disabled={criando || !nomeNova.trim()}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#3498DB] px-5 text-sm font-bold text-white shadow-md disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {criando ? 'Criando…' : 'Criar turma'}
            </button>
          </form>

          {erro && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {erro}
            </p>
          )}
        </div>

        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
          <h2 className="mb-3 px-1 text-sm font-bold uppercase tracking-wide text-[#1E40AF]/80">
            Suas turmas ({turmas.length})
          </h2>

          {carregando ? (
            <div className="flex flex-1 items-center justify-center py-10 text-sm text-[#1E40AF]/60">
              Carregando turmas…
            </div>
          ) : turmas.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
              <Users className="h-12 w-12 text-[#3498DB]/40" />
              <p className="font-semibold">Nenhuma turma ainda</p>
              <p className="text-sm text-[#1E40AF]/60">
                Crie uma turma e compartilhe o código com a classe.
              </p>
            </div>
          ) : (
            <ul className="flex-1 space-y-3 overflow-y-auto pr-0.5">
              {turmas.map((turma) => (
                <li
                  key={turma.id}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold sm:text-lg">{turma.nome}</h3>
                      <p className="mt-1 text-sm text-[#1E40AF]/65">
                        {turma.total_alunos ?? 0} aluno
                        {(turma.total_alunos ?? 0) === 1 ? '' : 's'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navegar(`/professor/turma/${turma.id}`)}
                      className="shrink-0 rounded-2xl bg-[#FF8C00] px-4 py-2 text-sm font-bold text-white shadow-md"
                    >
                      Ver turma
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-[#3498DB]/30 bg-[#EBF4FA]/80 px-3 py-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#1E40AF]/55">
                      Código
                    </span>
                    <span className="font-mono text-lg font-black tracking-[0.2em] text-[#3498DB]">
                      {turma.codigo}
                    </span>
                    <button
                      type="button"
                      onClick={() => void copiarCodigo(turma)}
                      className="ml-auto flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#3498DB] shadow-sm"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiadoId === turma.id ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
