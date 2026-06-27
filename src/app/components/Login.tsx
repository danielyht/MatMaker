import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthApiError } from '@supabase/supabase-js';
import { MatMakerLogo } from './MatMakerLogo';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { supabase, supabaseConfigurado } from '../../lib/supabaseClient';
import { traduzirErroAuth } from '../../lib/traduzirErroAuth';
import { useAuth } from '../contexts/AuthContext';
import { rotaInicialPorPapel } from '../constants/turmas';
import { perfilProfessorCompleto } from '../constants/professorCadastro';
import { ChevronLeft } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { autenticado, carregando: authCarregando, perfil } = useAuth();
  const destinoSalvo = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    if (!authCarregando && autenticado && perfil) {
      if (perfil.papel === 'professor' && !perfilProfessorCompleto(perfil)) {
        navigate('/cadastro?completar=professor', { replace: true });
        return;
      }

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
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);

  async function enviarLogin(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);

    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim) { setMensagem({ tipo: 'erro', texto: 'Informe seu e-mail.' }); return; }
    if (!senha)     { setMensagem({ tipo: 'erro', texto: 'Informe sua senha.' }); return; }

    if (!supabaseConfigurado() || !supabase) {
      setMensagem({ tipo: 'erro', texto: 'Supabase não configurado. Adicione as variáveis VITE_SUPABASE_* no arquivo .env.' });
      return;
    }

    setCarregando(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: emailTrim, password: senha });
      if (error) {
        const texto = error instanceof AuthApiError ? traduzirErroAuth(error, 'login') : error.message;
        setMensagem({ tipo: 'erro', texto });
        return;
      }
      setMensagem({ tipo: 'sucesso', texto: 'Login realizado! Redirecionando…' });
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro inesperado. Verifique sua conexão e tente novamente.' });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#EEF5FF]">
      <MathSymbolsBackground variant="landing" opacity={0.04} animated={false} />

      <header className="relative z-20 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2 sm:px-10">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <MatMakerLogo className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-[#0F172A]">MatMaker</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 py-10">
        <div className="auth-card w-full max-w-md p-8 sm:p-10">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">Entrar</h1>
            <p className="mt-2 text-sm text-[#64748B]">Acesse o laboratório com sua conta MatMaker.</p>
          </div>

          {mensagem && (
            <div
              role="alert"
              className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                mensagem.tipo === 'erro'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-green-200 bg-green-50 text-green-700'
              }`}
            >
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={enviarLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
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
                className="form-input"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-senha" className="text-sm font-semibold text-[#0F172A]">
                  Senha <span className="text-red-500">*</span>
                </label>
                <Link to="/esqueci-senha" className="text-xs font-semibold text-[#1D4ED8] hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <input
                id="login-senha"
                type="password"
                required
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                className="form-input"
                placeholder="Sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary mt-1 w-full py-3 text-base"
            >
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#64748B]">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="font-semibold text-[#1D4ED8] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
