import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { AuthApiError } from '@supabase/supabase-js';
import { AuthPageShell } from './AuthPageShell';
import { urlRedefinirSenha } from '../../lib/authRedirect';
import { supabase, supabaseConfigurado } from '../../lib/supabaseClient';
import { traduzirErroAuth } from '../../lib/traduzirErroAuth';

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);

  async function enviarLink(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);

    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim) { setMensagem({ tipo: 'erro', texto: 'Informe seu e-mail.' }); return; }

    if (!supabaseConfigurado() || !supabase) {
      setMensagem({ tipo: 'erro', texto: 'Supabase não configurado. Adicione as variáveis VITE_SUPABASE_* no arquivo .env.' });
      return;
    }

    setCarregando(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailTrim, { redirectTo: urlRedefinirSenha() });
      if (error) {
        const texto = error instanceof AuthApiError ? traduzirErroAuth(error, 'recuperacao') : error.message;
        setMensagem({ tipo: 'erro', texto });
        return;
      }
      setMensagem({
        tipo: 'sucesso',
        texto: 'Se existir uma conta com este e-mail, enviamos um link para redefinir a senha. Verifique a caixa de entrada e o spam.',
      });
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro inesperado. Verifique sua conexão e tente novamente.' });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthPageShell
      titulo="Esqueci a senha"
      subtitulo="Informe seu e-mail e enviaremos um link para criar uma nova senha."
      voltarPara="/login"
      voltarLabel="Voltar ao login"
    >
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

      <form onSubmit={enviarLink} className="space-y-5">
        <div>
          <label htmlFor="recuperar-email" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            id="recuperar-email"
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

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-xl bg-[#EA580C] px-6 py-3 text-base font-semibold text-white shadow-[0_4px_14px_-2px_rgb(234_88_12_/_0.3)] transition-colors hover:bg-[#C2410C] active:bg-[#9A3412] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {carregando ? 'Enviando link…' : 'Enviar link de recuperação'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#64748B]">
        Lembrou a senha?{' '}
        <Link to="/login" className="font-semibold text-[#1D4ED8] hover:underline">
          Entrar
        </Link>
      </p>
    </AuthPageShell>
  );
}
