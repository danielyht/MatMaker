import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, KeyRound, Users } from 'lucide-react';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { MatMakerLogo } from './MatMakerLogo';
import { useAuth } from '../contexts/AuthContext';
import { entrarTurmaPorCodigo, listarTurmasAluno } from '../../lib/turmas';
import { formatarCodigoTurma, type TurmaResumo } from '../constants/turmas';

export function EntrarTurma() {
  const navegar = useNavigate();
  const { perfil, autenticado, carregando: authCarregando } = useAuth();
  const [codigo, setCodigo] = useState('');
  const [turmas, setTurmas] = useState<TurmaResumo[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(
    null,
  );

  useEffect(() => {
    if (!authCarregando && !autenticado) {
      navegar('/login', { replace: true, state: { from: '/entrar-turma' } });
      return;
    }
    if (!authCarregando && autenticado && perfil?.papel === 'professor') {
      navegar('/professor', { replace: true });
    }
  }, [authCarregando, autenticado, perfil?.papel, navegar]);

  useEffect(() => {
    if (perfil?.id && perfil.papel === 'aluno') {
      void listarTurmasAluno(perfil.id).then(({ turmas: lista }) => setTurmas(lista));
    }
  }, [perfil?.id, perfil?.papel]);

  if (authCarregando || !autenticado || !perfil || perfil.papel === 'professor') return null;

  async function handleEntrar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);
    setEnviando(true);

    const { turma, erro, jaMembro } = await entrarTurmaPorCodigo(perfil.id, codigo);

    if (erro || !turma) {
      setMensagem({ tipo: 'erro', texto: erro ?? 'Não foi possível entrar na turma.' });
      setEnviando(false);
      return;
    }

    setMensagem({
      tipo: 'sucesso',
      texto: jaMembro
        ? `Você já faz parte da turma "${turma.nome}".`
        : `Você entrou na turma "${turma.nome}"!`,
    });
    setCodigo('');
    const { turmas: lista } = await listarTurmasAluno(perfil.id);
    setTurmas(lista);
    setEnviando(false);
  }

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
          <MatMakerLogo className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-[#0F172A]">Entrar na turma</h1>
            <p className="text-xs text-[#64748B]">Digite o código que o professor passou</p>
          </div>
        </header>

        <div className="glass-panel p-5 sm:p-6">
          <form onSubmit={handleEntrar} className="mx-auto max-w-md space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF]">
              <KeyRound className="h-6 w-6 text-[#1D4ED8]" />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#0F172A]">Código da turma (6 caracteres)</span>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(formatarCodigoTurma(e.target.value))}
                placeholder="ABC123"
                maxLength={6}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-center font-mono text-2xl font-black tracking-[0.3em] text-[#1D4ED8] uppercase outline-none transition-shadow focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                autoComplete="off"
                spellCheck={false}
              />
            </label>

            <button
              type="submit"
              disabled={enviando || codigo.length < 6}
              className="btn-primary min-h-12 w-full"
            >
              {enviando ? 'Entrando…' : 'Entrar na turma'}
            </button>

            {mensagem && (
              <p
                className={`rounded-xl border px-3 py-2 text-center text-sm font-medium ${
                  mensagem.tipo === 'erro'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-green-200 bg-green-50 text-green-700'
                }`}
              >
                {mensagem.texto}
              </p>
            )}
          </form>
        </div>

        {turmas.length > 0 && (
          <div className="glass-panel flex-1 p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#1D4ED8]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Minhas turmas
              </h2>
            </div>
            <ul className="space-y-2">
              {turmas.map((turma) => (
                <li
                  key={turma.id}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A]"
                >
                  {turma.nome}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
