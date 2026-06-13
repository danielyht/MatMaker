import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthApiError } from '@supabase/supabase-js';
import { traduzirErroAuth } from '../../lib/traduzirErroAuth';
import { MatMakerLogo } from './MatMakerLogo';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { COR_FUNDO_SISTEMA, COR_SUCESSO } from '../constants/matmakerBrand';
import { rotaInicialPorPapel } from '../constants/turmas';
import { supabase, supabaseConfigurado } from '../../lib/supabaseClient';

const BUCKET_AVATARES = 'avatares';
const MAX_FOTO_BYTES = 2 * 1024 * 1024;

function extensaoDeArquivo(nome: string): string {
  const partes = nome.split('.');
  const ext = partes.length > 1 ? partes.pop()?.toLowerCase() : '';
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : 'jpg';
}

export function Cadastro() {
  const navigate = useNavigate();
  const inputFotoRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [papel, setPapel] = useState<'aluno' | 'professor'>('aluno');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(
    null,
  );

  function aoEscolherFoto(arquivo: File | undefined) {
    if (!arquivo) {
      setFoto(null);
      setPreviewUrl(null);
      return;
    }

    if (!arquivo.type.startsWith('image/')) {
      setMensagem({ tipo: 'erro', texto: 'Envie apenas arquivos de imagem (JPG, PNG, etc.).' });
      if (inputFotoRef.current) inputFotoRef.current.value = '';
      return;
    }

    if (arquivo.size > MAX_FOTO_BYTES) {
      setMensagem({ tipo: 'erro', texto: 'A foto deve ter no máximo 2 MB.' });
      if (inputFotoRef.current) inputFotoRef.current.value = '';
      return;
    }

    setMensagem(null);
    setFoto(arquivo);
    setPreviewUrl(URL.createObjectURL(arquivo));
  }

  async function enviarCadastro(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);

    const nomeTrim = nome.trim();
    const emailTrim = email.trim().toLowerCase();

    if (!nomeTrim) {
      setMensagem({ tipo: 'erro', texto: 'Informe seu nome completo.' });
      return;
    }
    if (!emailTrim) {
      setMensagem({ tipo: 'erro', texto: 'Informe seu e-mail.' });
      return;
    }
    if (senha.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A senha deve ter pelo menos 6 caracteres.' });
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailTrim,
        password: senha,
        options: {
          data: { nome_completo: nomeTrim },
        },
      });

      if (authError) {
        const texto =
          authError instanceof AuthApiError
            ? traduzirErroAuth(authError, 'cadastro')
            : authError.message;
        setMensagem({ tipo: 'erro', texto });
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        setMensagem({
          tipo: 'erro',
          texto: 'Conta criada, mas não foi possível obter o ID do usuário. Tente fazer login.',
        });
        return;
      }

      let fotoUrl: string | null = null;

      if (foto) {
        const ext = extensaoDeArquivo(foto.name);
        const caminho = `${userId}/avatar-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_AVATARES)
          .upload(caminho, foto, {
            cacheControl: '3600',
            upsert: true,
            contentType: foto.type,
          });

        if (uploadError) {
          setMensagem({
            tipo: 'erro',
            texto: `Conta criada, mas o upload da foto falhou: ${uploadError.message}`,
          });
          return;
        }

        const { data: urlData } = supabase.storage.from(BUCKET_AVATARES).getPublicUrl(caminho);
        fotoUrl = urlData.publicUrl;
      }

      const perfilBase = {
        id: userId,
        nome: nomeTrim,
        email: emailTrim,
        foto_url: fotoUrl,
        pontos: 0,
        jogos_completados: 0,
        papel,
      };

      let { error: perfilError } = await supabase.from('perfis').insert(perfilBase);

      if (perfilError?.message?.includes('papel')) {
        const { papel: _p, ...semPapel } = perfilBase;
        const retry = await supabase.from('perfis').insert(semPapel);
        perfilError = retry.error;
      }

      if (perfilError) {
        setMensagem({
          tipo: 'erro',
          texto: `Conta criada, mas não foi possível salvar o perfil: ${perfilError.message}`,
        });
        return;
      }

      const precisaConfirmarEmail = authData.user && !authData.session;

      setMensagem({
        tipo: 'sucesso',
        texto: precisaConfirmarEmail
          ? 'Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.'
          : 'Conta criada com sucesso! Redirecionando…',
      });

      if (!precisaConfirmarEmail) {
        window.setTimeout(() => navigate(rotaInicialPorPapel(papel)), 1800);
      }
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
            <h1 className="text-2xl font-bold text-[#1E40AF] sm:text-3xl">Criar conta</h1>
            <p className="mt-2 text-sm text-[#1E40AF]/75">
              Junte-se ao laboratório e prepare-se para o ranking.
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

          <form onSubmit={enviarCadastro} className="space-y-5">
            <div>
              <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold text-[#1E40AF]">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                id="nome"
                type="text"
                required
                autoComplete="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={carregando}
                className="w-full rounded-2xl border border-[#3498DB]/25 bg-white/90 px-4 py-3 text-[#1E40AF] outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                placeholder="Seu nome"
              />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-[#1E40AF]">
                Eu sou…
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPapel('aluno')}
                  disabled={carregando}
                  className={`min-h-11 rounded-2xl border px-3 py-2 text-sm font-bold transition-all ${
                    papel === 'aluno'
                      ? 'border-[#3498DB] bg-[#3498DB]/10 text-[#3498DB] ring-2 ring-[#3498DB]/30'
                      : 'border-[#3498DB]/20 bg-white/90 text-[#1E40AF]/70'
                  }`}
                >
                  Aluno
                </button>
                <button
                  type="button"
                  onClick={() => setPapel('professor')}
                  disabled={carregando}
                  className={`min-h-11 rounded-2xl border px-3 py-2 text-sm font-bold transition-all ${
                    papel === 'professor'
                      ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED] ring-2 ring-[#7C3AED]/30'
                      : 'border-[#3498DB]/20 bg-white/90 text-[#1E40AF]/70'
                  }`}
                >
                  Professor
                </button>
              </div>
            </fieldset>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#1E40AF]">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
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
              <label htmlFor="senha" className="mb-1.5 block text-sm font-semibold text-[#1E40AF]">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                className="w-full rounded-2xl border border-[#3498DB]/25 bg-white/90 px-4 py-3 text-[#1E40AF] outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="foto" className="mb-1.5 block text-sm font-semibold text-[#1E40AF]">
                Foto de perfil <span className="font-normal text-[#1E40AF]/60">(opcional)</span>
              </label>
              <input
                ref={inputFotoRef}
                id="foto"
                type="file"
                accept="image/*"
                disabled={carregando}
                onChange={(e) => aoEscolherFoto(e.target.files?.[0])}
                className="w-full rounded-2xl border border-dashed border-[#3498DB]/35 bg-white/60 px-4 py-3 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-primary/15 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary disabled:opacity-60"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Pré-visualização da foto"
                  className="mt-3 h-20 w-20 rounded-full border-2 border-white object-cover shadow-md"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 w-full rounded-2xl px-6 py-4 text-lg font-bold text-white shadow-[0_12px_32px_-6px_rgba(255,140,0,0.55)] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              style={{ backgroundColor: COR_SUCESSO }}
            >
              {carregando ? 'Criando conta…' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1E40AF]/70">
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
