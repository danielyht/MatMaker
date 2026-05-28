import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { AuthApiError } from '@supabase/supabase-js';
import { AuthPageShell } from './AuthPageShell';
import { COR_PRIMARIA, COR_SUCESSO } from '../constants/matmakerBrand';
import { urlRedefinirSenha } from '../../lib/authRedirect';
import { supabase, supabaseConfigurado } from '../../lib/supabaseClient';
import { traduzirErroAuth } from '../../lib/traduzirErroAuth';

const inputClass =
  'w-full rounded-2xl border border-[#3498DB]/25 bg-white/90 px-4 py-3 text-[#1E40AF] outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60';

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(
    null,
  );

  async function enviarLink(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);

    const emailTrim = email.trim().toLowerCase();

    if (!emailTrim) {
      setMensagem({ tipo: 'erro', texto: 'Informe seu e-mail.' });
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
      const { error } = await supabase.auth.resetPasswordForEmail(emailTrim, {
        redirectTo: urlRedefinirSenha(),
      });

      if (error) {
        const texto =
          error instanceof AuthApiError
            ? traduzirErroAuth(error, 'recuperacao')
            : error.message;
        setMensagem({ tipo: 'erro', texto });
        return;
      }

      setMensagem({
        tipo: 'sucesso',
        texto:
          'Se existir uma conta com este e-mail, enviamos um link para redefinir a senha. Verifique a caixa de entrada e o spam.',
      });
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
    <AuthPageShell
      titulo="Esqueci a senha"
      subtitulo="Informe seu e-mail e enviaremos um link para criar uma nova senha."
      voltarPara="/login"
      voltarLabel="Voltar ao login"
    >
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

      <form onSubmit={enviarLink} className="space-y-5">
        <div>
          <label htmlFor="recuperar-email" className="mb-1.5 block text-sm font-semibold text-[#1E40AF]">
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
            className={inputClass}
            placeholder="voce@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-2xl px-6 py-4 text-lg font-bold text-white shadow-[0_12px_32px_-6px_rgba(255,140,0,0.55)] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          style={{ backgroundColor: COR_SUCESSO }}
        >
          {carregando ? 'Enviando link…' : 'Enviar link de recuperação'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#1E40AF]/70">
        Lembrou a senha?{' '}
        <Link to="/login" className="font-semibold hover:underline" style={{ color: COR_PRIMARIA }}>
          Entrar
        </Link>
      </p>
    </AuthPageShell>
  );
}
