import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthApiError } from '@supabase/supabase-js';
import { MatMakerLogo } from './MatMakerLogo';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { COR_FUNDO_SISTEMA, COR_PRIMARIA } from '../constants/matmakerBrand';
import { supabase, supabaseConfigurado } from '../../lib/supabaseClient';
import { traduzirErroAuth } from '../../lib/traduzirErroAuth';
import { useAuth } from '../contexts/AuthContext';
import { rotaInicialPorPapel } from '../constants/turmas';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { autenticado, carregando: authCarregando, perfil } = useAuth();
  const destinoSalvo = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    if (!authCarregando && autenticado && perfil) {
      const rotaPorPapel = rotaInicialPorPapel(perfil.papel);
      const destinoSalvoValido =
        destinoSalvo &&
        destinoSalvo !== '/login' &&
        !(destinoSalvo.startsWith('/professor') && perfil.papel !== 'professor') &&
        !(destinoSalvo === '/dashboard' && perfil.papel === 'professor');

      const destino = destinoSalvoValido ? destinoSalvo : rotaPorPapel;
      navigate(destino, { replace: true });
    }
  }, [authCarregando, autenticado, perfil, destinoSalvo, navigate]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(
    null,
  );

  async function enviarLogin(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);

    const emailTrim = email.trim().toLowerCase();

    if (!emailTrim) {
      setMensagem({ tipo: 'erro', texto: 'Informe seu e-mail.' });
      return;
    }
    if (!senha) {
      setMensagem({ tipo: 'erro', texto: 'Informe sua senha.' });
      return;
    }

    if (!supabaseConfigurado() || !supabase) {
      setMensagem({
        tipo: 'erro',
        texto: 'Supabase não configurado. Adicione as variáveis VITE_SUPABASE_* no arquivo .env.',
      });
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailTrim,
        password: senha,
      });

      if (error) {
        const texto =
          error instanceof AuthApiError
            ? traduzirErroAuth(error, 'login')
            : error.message;
        setMensagem({ tipo: 'erro', texto });
        return;
      }

      setMensagem({ tipo: 'sucesso', texto: 'Login realizado! Redirecionando…' });
      /* redirect via useEffect when perfil loads */
    } catch {
      setMensagem({
        tipo: 'erro',
        texto: 'Erro inesperado. Verifique sua conexão e tente novamente.',
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="relative min-h-[100dvh] overflow-hidden text-[#1E40AF]"
      style={{ backgroundColor: COR_FUNDO_SISTEMA }}
    >
      <MathSymbolsBackground variant="landing" opacity={0.1} />

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-[12%] h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-20 bottom-[8%] h-64 w-64 rounded-full bg-[#B7E6F2]/60 blur-3xl" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <MatMakerLogo className="h-9 w-9" />
          <span className="text-lg font-bold text-[#1E40AF]">MatMaker</span>
        </Link>
        <Link
          to="/"
          className="rounded-full px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Voltar
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-white/65 bg-white/75 p-8 shadow-[0_16px_48px_-12px_rgba(52,152,219,0.22)] backdrop-blur-xl sm:p-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#1E40AF] sm:text-3xl">Entrar</h1>
            <p className="mt-2 text-sm text-[#1E40AF]/75">
              Acesse o laboratório com sua conta MatMaker.
            </p>
          </div>

          {mensagem && (
            <div
              role="alert"
              className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
                mensagem.tipo === 'erro'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              }`}
            >
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={enviarLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-[#1E40AF]">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={carregando}
                className="w-full rounded-2xl border border-[#3498DB]/25 bg-white/90 px-4 py-3 text-[#1E40AF] outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label htmlFor="login-senha" className="mb-1.5 block text-sm font-semibold text-[#1E40AF]">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                id="login-senha"
                type="password"
                required
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                className="w-full rounded-2xl border border-[#3498DB]/25 bg-white/90 px-4 py-3 text-[#1E40AF] outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                placeholder="Sua senha"
              />
              <p className="mt-2 text-right">
                <Link
                  to="/esqueci-senha"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 w-full rounded-2xl px-6 py-4 text-lg font-bold text-white shadow-[0_12px_32px_-6px_rgba(52,152,219,0.45)] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              style={{ backgroundColor: COR_PRIMARIA }}
            >
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1E40AF]/70">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="font-semibold text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
