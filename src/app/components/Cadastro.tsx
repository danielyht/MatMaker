import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { AuthApiError } from '@supabase/supabase-js';
import { ChevronLeft } from 'lucide-react';
import { traduzirErroAuth } from '../../lib/traduzirErroAuth';
import { MatMakerLogo } from './MatMakerLogo';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import { rotaInicialPorPapel } from '../constants/turmas';
import {
  MATERIAS_PROFESSOR,
  perfilProfessorCompleto,
  resolverMateriaProfessor,
} from '../constants/professorCadastro';
import { useAuth } from '../contexts/AuthContext';
import { supabase, supabaseConfigurado } from '../../lib/supabaseClient';

const BUCKET_AVATARES = 'avatares';
const MAX_FOTO_BYTES = 2 * 1024 * 1024;

function extensaoDeArquivo(nome: string): string {
  const partes = nome.split('.');
  const ext = partes.length > 1 ? partes.pop()?.toLowerCase() : '';
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : 'jpg';
}

type PerfilInsert = Record<string, unknown>;

async function inserirPerfilComFallback(payload: PerfilInsert) {
  if (!supabase) return { error: new Error('Supabase não configurado') };

  let tentativa = payload;
  let { error } = await supabase.from('perfis').insert(tentativa);

  if (error?.message?.includes('instituicao') || error?.message?.includes('materia')) {
    const { instituicao: _i, materia: _m, ...semProfessor } = tentativa;
    tentativa = semProfessor;
    ({ error } = await supabase.from('perfis').insert(tentativa));
  }

  if (error?.message?.includes('papel')) {
    const { papel: _p, ...semPapel } = tentativa;
    ({ error } = await supabase.from('perfis').insert(semPapel));
  }

  return { error };
}

function CamposProfessor({
  instituicao,
  setInstituicao,
  materiaPreset,
  setMateriaPreset,
  materiaOutra,
  setMateriaOutra,
  carregando,
}: {
  instituicao: string;
  setInstituicao: (v: string) => void;
  materiaPreset: string;
  setMateriaPreset: (v: string) => void;
  materiaOutra: string;
  setMateriaOutra: (v: string) => void;
  carregando: boolean;
}) {
  return (
    <div className="space-y-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div>
        <label htmlFor="instituicao" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
          Instituição <span className="text-red-500">*</span>
        </label>
        <input
          id="instituicao"
          type="text"
          required
          maxLength={120}
          value={instituicao}
          onChange={(e) => setInstituicao(e.target.value)}
          disabled={carregando}
          className="form-input"
          placeholder="Ex.: Escola Municipal João Silva"
        />
        <p className="mt-1.5 text-xs text-[#64748B]">
          Onde você utilizará o MatMaker com suas turmas
        </p>
      </div>

      <div>
        <label htmlFor="materia" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
          Matéria que leciona <span className="text-red-500">*</span>
        </label>
        <select
          id="materia"
          required
          value={materiaPreset}
          onChange={(e) => setMateriaPreset(e.target.value)}
          disabled={carregando}
          className="form-input"
        >
          <option value="">Selecione…</option>
          {MATERIAS_PROFESSOR.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {materiaPreset === 'Outra' && (
        <div>
          <label htmlFor="materia-outra" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
            Especifique a matéria <span className="text-red-500">*</span>
          </label>
          <input
            id="materia-outra"
            type="text"
            required
            maxLength={80}
            value={materiaOutra}
            onChange={(e) => setMateriaOutra(e.target.value)}
            disabled={carregando}
            className="form-input"
            placeholder="Ex.: História"
          />
        </div>
      )}
    </div>
  );
}

export function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const inputFotoRef = useRef<HTMLInputElement>(null);
  const { autenticado, carregando: authCarregando, perfil, recarregarPerfil } = useAuth();

  const modoCompletar = searchParams.get('completar') === 'professor';
  const papelInicial = (location.state as { papelInicial?: 'professor' } | null)?.papelInicial;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [papel, setPapel] = useState<'aluno' | 'professor'>('aluno');
  const [instituicao, setInstituicao] = useState('');
  const [materiaPreset, setMateriaPreset] = useState('');
  const [materiaOutra, setMateriaOutra] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);

  useEffect(() => {
    if (papelInicial === 'professor') setPapel('professor');
  }, [papelInicial]);

  useEffect(() => {
    if (authCarregando) return;

    if (modoCompletar) {
      if (!autenticado) {
        navigate('/login', { replace: true, state: { from: '/cadastro?completar=professor' } });
        return;
      }
      if (perfil && perfilProfessorCompleto(perfil)) {
        navigate('/professor', { replace: true });
      }
    }
  }, [authCarregando, autenticado, perfil, modoCompletar, navigate]);

  function validarCamposProfessor(): string | null {
    const instituicaoTrim = instituicao.trim();
    const materiaFinal = resolverMateriaProfessor(materiaPreset, materiaOutra);

    if (!instituicaoTrim) return 'Informe a instituição.';
    if (!materiaPreset) return 'Informe a matéria que leciona.';
    if (materiaPreset === 'Outra' && !materiaOutra.trim()) {
      return 'Informe a matéria que leciona.';
    }
    if (!materiaFinal) return 'Informe a matéria que leciona.';
    return null;
  }

  function aoEscolherFoto(arquivo: File | undefined) {
    if (!arquivo) { setFoto(null); setPreviewUrl(null); return; }
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

  async function completarPerfilProfessor(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);

    const erroValidacao = validarCamposProfessor();
    if (erroValidacao) {
      setMensagem({ tipo: 'erro', texto: erroValidacao });
      return;
    }

    if (!supabaseConfigurado() || !supabase || !perfil?.id) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível salvar os dados. Tente entrar novamente.' });
      return;
    }

    setCarregando(true);
    try {
      const instituicaoTrim = instituicao.trim();
      const materiaFinal = resolverMateriaProfessor(materiaPreset, materiaOutra);

      const { error } = await supabase
        .from('perfis')
        .update({ instituicao: instituicaoTrim, materia: materiaFinal })
        .eq('id', perfil.id);

      if (error) {
        setMensagem({ tipo: 'erro', texto: `Não foi possível salvar: ${error.message}` });
        return;
      }

      await recarregarPerfil();
      setMensagem({ tipo: 'sucesso', texto: 'Dados salvos! Redirecionando…' });
      window.setTimeout(() => navigate('/professor', { replace: true }), 1200);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro inesperado. Tente novamente.' });
    } finally {
      setCarregando(false);
    }
  }

  async function enviarCadastro(evento: FormEvent) {
    evento.preventDefault();
    setMensagem(null);

    const nomeTrim = nome.trim();
    const emailTrim = email.trim().toLowerCase();

    if (!nomeTrim) { setMensagem({ tipo: 'erro', texto: 'Informe seu nome completo.' }); return; }
    if (!emailTrim) { setMensagem({ tipo: 'erro', texto: 'Informe seu e-mail.' }); return; }
    if (senha.length < 6) { setMensagem({ tipo: 'erro', texto: 'A senha deve ter pelo menos 6 caracteres.' }); return; }

    if (papel === 'professor') {
      const erroValidacao = validarCamposProfessor();
      if (erroValidacao) {
        setMensagem({ tipo: 'erro', texto: erroValidacao });
        return;
      }
    }

    if (!supabaseConfigurado() || !supabase) {
      setMensagem({ tipo: 'erro', texto: 'Supabase não configurado. Adicione as variáveis VITE_SUPABASE_* no arquivo .env.' });
      return;
    }

    setCarregando(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailTrim,
        password: senha,
        options: { data: { nome_completo: nomeTrim } },
      });

      if (authError) {
        const texto = authError instanceof AuthApiError ? traduzirErroAuth(authError, 'cadastro') : authError.message;
        setMensagem({ tipo: 'erro', texto });
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        setMensagem({ tipo: 'erro', texto: 'Conta criada, mas não foi possível obter o ID do usuário. Tente fazer login.' });
        return;
      }

      let fotoUrl: string | null = null;
      if (foto) {
        const ext = extensaoDeArquivo(foto.name);
        const caminho = `${userId}/avatar-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_AVATARES)
          .upload(caminho, foto, { cacheControl: '3600', upsert: true, contentType: foto.type });
        if (uploadError) {
          setMensagem({ tipo: 'erro', texto: `Conta criada, mas o upload da foto falhou: ${uploadError.message}` });
          return;
        }
        const { data: urlData } = supabase.storage.from(BUCKET_AVATARES).getPublicUrl(caminho);
        fotoUrl = urlData.publicUrl;
      }

      const perfilBase: PerfilInsert = {
        id: userId,
        nome: nomeTrim,
        email: emailTrim,
        foto_url: fotoUrl,
        pontos: 0,
        jogos_completados: 0,
        papel,
      };

      if (papel === 'professor') {
        perfilBase.instituicao = instituicao.trim();
        perfilBase.materia = resolverMateriaProfessor(materiaPreset, materiaOutra);
      }

      const { error: perfilError } = await inserirPerfilComFallback(perfilBase);
      if (perfilError) {
        setMensagem({ tipo: 'erro', texto: `Conta criada, mas não foi possível salvar o perfil: ${perfilError.message}` });
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
      setMensagem({ tipo: 'erro', texto: 'Erro inesperado. Verifique sua conexão e tente novamente.' });
    } finally {
      setCarregando(false);
    }
  }

  if (modoCompletar && (authCarregando || !autenticado)) {
    return null;
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
          to={modoCompletar ? '/professor' : '/'}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 py-10">
        <div className="auth-card w-full max-w-md p-8 sm:p-10">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
              {modoCompletar ? 'Complete seu perfil' : 'Criar conta'}
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              {modoCompletar
                ? 'Informe a instituição e a matéria para usar o modo turma.'
                : 'Junte-se ao laboratório e prepare-se para o ranking.'}
            </p>
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

          {modoCompletar ? (
            <form onSubmit={completarPerfilProfessor} className="space-y-5">
              <CamposProfessor
                instituicao={instituicao}
                setInstituicao={setInstituicao}
                materiaPreset={materiaPreset}
                setMateriaPreset={setMateriaPreset}
                materiaOutra={materiaOutra}
                setMateriaOutra={setMateriaOutra}
                carregando={carregando}
              />
              <button
                type="submit"
                disabled={carregando}
                className="btn-primary mt-1 w-full py-3 text-base"
              >
                {carregando ? 'Salvando…' : 'Salvar e continuar'}
              </button>
            </form>
          ) : (
            <form onSubmit={enviarCadastro} className="space-y-5">
              <div>
                <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
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
                  className="form-input"
                  placeholder="Seu nome"
                />
              </div>

              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-[#0F172A]">Eu sou…</legend>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPapel('aluno')}
                    disabled={carregando}
                    className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                      papel === 'aluno'
                        ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8] ring-2 ring-[#1D4ED8]/20'
                        : 'border-[#CBD5E1] bg-white text-[#64748B] hover:border-[#93C5FD] hover:bg-[#EFF6FF]/50 hover:text-[#1D4ED8]'
                    }`}
                  >
                    Aluno
                  </button>
                  <button
                    type="button"
                    onClick={() => setPapel('professor')}
                    disabled={carregando}
                    className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                      papel === 'professor'
                        ? 'border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED] ring-2 ring-[#7C3AED]/20'
                        : 'border-[#CBD5E1] bg-white text-[#64748B] hover:border-[#A78BFA] hover:bg-[#F5F3FF]/50 hover:text-[#7C3AED]'
                    }`}
                  >
                    Professor
                  </button>
                </div>
              </fieldset>

              {papel === 'professor' && (
                <CamposProfessor
                  instituicao={instituicao}
                  setInstituicao={setInstituicao}
                  materiaPreset={materiaPreset}
                  setMateriaPreset={setMateriaPreset}
                  materiaOutra={materiaOutra}
                  setMateriaOutra={setMateriaOutra}
                  carregando={carregando}
                />
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
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
                  className="form-input"
                  placeholder="voce@email.com"
                />
              </div>

              <div>
                <label htmlFor="senha" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
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
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label htmlFor="foto" className="mb-1.5 block text-sm font-semibold text-[#0F172A]">
                  Foto de perfil{' '}
                  <span className="font-normal text-[#94A3B8]">(opcional)</span>
                </label>
                <input
                  ref={inputFotoRef}
                  id="foto"
                  type="file"
                  accept="image/*"
                  disabled={carregando}
                  onChange={(e) => aoEscolherFoto(e.target.files?.[0])}
                  className="w-full rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#64748B]
                    file:mr-3 file:rounded-lg file:border-0 file:bg-[#EFF6FF] file:px-3 file:py-1.5
                    file:text-sm file:font-semibold file:text-[#1D4ED8] hover:border-[#93C5FD]
                    disabled:opacity-55 disabled:cursor-not-allowed"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Pré-visualização da foto"
                    className="mt-3 h-16 w-16 rounded-full border-2 border-white object-cover shadow-md"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="mt-1 w-full rounded-xl bg-[#EA580C] px-6 py-3 text-base font-semibold text-white shadow-[0_4px_14px_-2px_rgb(234_88_12_/_0.3)] transition-colors hover:bg-[#C2410C] active:bg-[#9A3412] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {carregando ? 'Criando conta…' : 'Criar conta'}
              </button>
            </form>
          )}

          {!modoCompletar && (
            <p className="mt-6 text-center text-sm text-[#64748B]">
              Já tem conta?{' '}
              <Link to="/login" className="font-semibold text-[#1D4ED8] hover:underline">
                Entrar
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
