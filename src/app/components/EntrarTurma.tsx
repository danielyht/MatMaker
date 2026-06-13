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
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#EBF4FA] text-[#1E40AF]">
      <MathSymbolsBackground opacity={0.04} />

      <div className="relative z-10 m-3 flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4 sm:gap-4">
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm"
            aria-label="Voltar ao laboratório"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <MatMakerLogo className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">Entrar na turma</h1>
            <p className="text-sm text-[#1E40AF]/70">Digite o código que o professor passou</p>
          </div>
        </header>

        <div className="glass-panel p-5 sm:p-6">
          <form onSubmit={handleEntrar} className="mx-auto max-w-md space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3498DB]/15">
              <KeyRound className="h-7 w-7 text-[#3498DB]" />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Código da turma (6 caracteres)</span>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(formatarCodigoTurma(e.target.value))}
                placeholder="ABC123"
                maxLength={6}
                className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-center font-mono text-2xl font-black tracking-[0.3em] uppercase shadow-sm outline-none focus:ring-2 focus:ring-[#3498DB]/40"
                autoComplete="off"
                spellCheck={false}
              />
            </label>

            <button
              type="submit"
              disabled={enviando || codigo.length < 6}
              className="min-h-12 w-full rounded-2xl bg-[#3498DB] text-base font-bold text-white shadow-md disabled:opacity-50"
            >
              {enviando ? 'Entrando…' : 'Entrar na turma'}
            </button>

            {mensagem && (
              <p
                className={`rounded-xl px-3 py-2 text-center text-sm font-medium ${
                  mensagem.tipo === 'erro'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-emerald-50 text-emerald-800'
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
              <Users className="h-4 w-4 text-[#3498DB]" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#1E40AF]/80">
                Minhas turmas
              </h2>
            </div>
            <ul className="space-y-2">
              {turmas.map((turma) => (
                <li
                  key={turma.id}
                  className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm font-semibold"
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
