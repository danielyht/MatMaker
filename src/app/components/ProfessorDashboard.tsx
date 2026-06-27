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
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EEF5FF]">
      <MathSymbolsBackground opacity={0.03} animated={false} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
          <MatMakerLogo className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight text-[#0F172A] sm:text-xl">Modo turma</h1>
            <p className="mt-0.5 truncate text-xs text-[#64748B]">
              Olá, {perfil?.nome.split(' ')[0]}
              {perfil?.instituicao && perfil?.materia
                ? ` — ${perfil.instituicao} · ${perfil.materia}`
                : ' — painel do professor'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void carregar()}
            disabled={carregando}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8] disabled:opacity-50"
            aria-label="Atualizar turmas"
          >
            <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => void sair().then(() => navegar('/login'))}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </header>

        <div className="glass-panel p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7C3AED] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Criar turma</h2>
              <p className="text-sm text-[#64748B]">
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
              className="form-input min-h-11 flex-1"
            />
            <button
              type="submit"
              disabled={criando || !nomeNova.trim()}
              className="btn-primary flex min-h-11 items-center justify-center gap-2 px-5"
            >
              <Plus className="h-4 w-4" />
              {criando ? 'Criando…' : 'Criar turma'}
            </button>
          </form>

          {erro && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {erro}
            </p>
          )}
        </div>

        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
          <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Suas turmas ({turmas.length})
          </h2>

          {carregando ? (
            <div className="flex flex-1 items-center justify-center py-10 text-sm text-[#64748B]">
              Carregando turmas…
            </div>
          ) : turmas.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
              <Users className="h-12 w-12 text-[#CBD5E1]" />
              <p className="font-semibold text-[#0F172A]">Nenhuma turma ainda</p>
              <p className="text-sm text-[#64748B]">
                Crie uma turma e compartilhe o código com a classe.
              </p>
            </div>
          ) : (
            <ul className="flex-1 space-y-3 overflow-y-auto pr-0.5">
              {turmas.map((turma) => (
                <li
                  key={turma.id}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">{turma.nome}</h3>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {turma.total_alunos ?? 0} aluno
                        {(turma.total_alunos ?? 0) === 1 ? '' : 's'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navegar(`/professor/turma/${turma.id}`)}
                      className="shrink-0 rounded-lg bg-[#EA580C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C2410C]"
                    >
                      Ver turma
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Código
                    </span>
                    <span className="font-mono text-lg font-black tracking-[0.2em] text-[#1D4ED8]">
                      {turma.codigo}
                    </span>
                    <button
                      type="button"
                      onClick={() => void copiarCodigo(turma)}
                      className="ml-auto flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm transition-colors hover:bg-[#EFF6FF]"
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
