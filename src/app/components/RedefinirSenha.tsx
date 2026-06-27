import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthApiError } from '@supabase/supabase-js';
import { AuthPageShell } from './AuthPageShell';
import { supabase, supabaseConfigurado } from '../../lib/supabaseClient';
import { traduzirErroAuth } from '../../lib/traduzirErroAuth';

function hashIndicaRecuperacao(): boolean {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(hash).get('type') === 'recovery';
}

export function RedefinirSenha() {
  const navigate = useNavigate();
  const [verificando, setVerificando] = useState(true);
  const [linkValido, setLinkValido] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);

  useEffect(() => {
    if (!supabaseConfigurado() || !supabase) { setVerificando(false); setLinkValido(false); return; }
    let ativo = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (!ativo) return;
      if (evento === 'PASSWORD_RECOVERY' || (sessao && hashIndicaRecuperacao())) {
        setLinkValido(true); setVerificando(false);
      }
    });
    if (hashIndicaRecuperacao()) setLinkValido(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ativo) return;
      if (session && hashIndicaRecuperacao()) setLinkValido(true);
      setVerificando(false);
    });
    return () => { ativo = false; subscription.unsubscribe(); };
  }, []);

  async function salvarNovaSenha(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);
    if (novaSenha.length < 6) { setMensagem({ tipo: 'erro', texto: 'A nova senha deve ter pelo menos 6 caracteres.' }); return; }
    if (novaSenha !== confirmarSenha) { setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' }); return; }
    if (!supabaseConfigurado() || !supabase) {
      setMensagem({ tipo: 'erro', texto: 'Supabase não configurado. Adicione as variáveis VITE_SUPABASE_* no arquivo .env.' });
      return;
    }
    setCarregando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) {
        const texto = error instanceof AuthApiError ? traduzirErroAuth(error, 'recuperacao') : error.message;
        setMensagem({ tipo: 'erro', texto }); return;
      }
      await supabase.auth.signOut();
      setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso! Redirecionando para o login…' });
      window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro inesperado. Tente solicitar um novo link.' });
    } finally {
      setCarregando(false);
    }
  }

  if (verificando) {
    return (
      <AuthPageShell titulo="Nova senha" subtitulo="Validando o link de recuperação…" voltarPara="/login">
        <p className="text-center text-sm text-[#64748B]">Aguarde um instante.</p>
      </AuthPageShell>
    );
  }

  if (!linkValido) {
    return (
      <AuthPageShell
        titulo="Link inválido"
        subtitulo="Este link expirou ou já foi usado. Solicite um novo e-mail de recuperação."
        voltarPara="/esqueci-senha"
        voltarLabel="Solicitar novo link"
      >
        <Link to="/login" className="mt-2 block text-center text-sm font-semibold text-[#1D4ED8] hover:underline">
          Voltar ao login
        </Link>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell titulo="Nova senha" subtitulo="Escolha uma senha nova para sua conta MatMaker." voltarPara="/login">
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

      <form onSubmit={salvarNovaSenha} className="space-y-5">
        <div>
          <label htmlFor="nova-senha" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
            Nova senha <span className="text-red-500">*</span>
          </label>
          <input
            id="nova-senha"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            disabled={carregando}
            className="form-input"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmar-senha" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
            Confirmar senha <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmar-senha"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={carregando}
            className="form-input"
            placeholder="Repita a nova senha"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="btn-primary w-full py-3 text-base"
        >
          {carregando ? 'Salvando…' : 'Salvar nova senha'}
        </button>
      </form>
    </AuthPageShell>
  );
}
