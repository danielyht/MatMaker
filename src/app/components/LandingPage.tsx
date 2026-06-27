import { useState } from 'react';
import { Link } from 'react-router';
import {
  Menu,
  X,
  Target,
  Trophy,
  BarChart3,
  Rocket,
  Cookie,
  Apple,
  Zap,
  ShoppingBag,
  Layers3,
  GraduationCap,
  Check,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';
import { MatMakerLogo } from './MatMakerLogo';

/* ── Dados das missões ── */
const MISSOES = [
  {
    id: 1,
    nome: 'Invasão Espacial',
    descricao: 'Identifique naves alienígenas usando posição (esquerda/direita)',
    icone: Rocket,
    cor: '#7C3AED',
    fundo: '#F5F3FF',
  },
  {
    id: 2,
    nome: 'Aventura das Frações',
    descricao: 'Aprenda frações dividindo pizzas e outros objetos do cotidiano',
    icone: Cookie,
    cor: '#EA580C',
    fundo: '#FFF7ED',
  },
  {
    id: 3,
    nome: 'Multiplicação no mercado',
    descricao: 'Resolva problemas de multiplicação em situações do dia a dia',
    icone: Apple,
    cor: '#16A34A',
    fundo: '#F0FDF4',
  },
  {
    id: 4,
    nome: 'Potências ao quadrado',
    descricao: 'Quadrados pintados e potências ao quadrado de forma visual',
    icone: Zap,
    cor: '#1D4ED8',
    fundo: '#EFF6FF',
  },
  {
    id: 5,
    nome: 'Desafio do mercado',
    descricao: 'Enfrente situações-problema que combinam operações diversas',
    icone: ShoppingBag,
    cor: '#0891B2',
    fundo: '#ECFEFF',
  },
  {
    id: 6,
    nome: 'Material dourado',
    descricao: 'Monte centenas, dezenas e unidades com material concreto virtual',
    icone: Layers3,
    cor: '#B45309',
    fundo: '#FFFBEB',
  },
] as const;

/* ── Como funciona ── */
const COMO_FUNCIONA = [
  {
    icone: FlaskConical,
    cor: '#1D4ED8',
    fundo: '#EFF6FF',
    titulo: 'Escolha uma missão',
    descricao: 'Selecione entre frações, multiplicação, potências e mais — cada uma com um contexto diferente.',
  },
  {
    icone: Trophy,
    cor: '#EA580C',
    fundo: '#FFF7ED',
    titulo: 'Ganhe pontos e suba de liga',
    descricao: 'Cada missão concluída dá pontos. Suba do Bronze ao Ascendente e apareça no ranking.',
  },
  {
    icone: BarChart3,
    cor: '#0891B2',
    fundo: '#ECFEFF',
    titulo: 'Acompanhe o progresso',
    descricao: 'Veja seu mapa do laboratório, conquistas desbloqueadas e evolução por semana.',
  },
] as const;

/* ── NAV ── */
function NavBar() {
  const [aberto, setAberto] = useState(false);

  const linkAncora = (href: string, label: string) => (
    <a
      href={href}
      onClick={() => setAberto(false)}
      className="min-h-[44px] flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]"
    >
      {label}
    </a>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <MatMakerLogo className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-[#0F172A]">MatMaker</span>
        </Link>

        {/* Links desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {linkAncora('#como-funciona', 'Como funciona')}
          {linkAncora('#missoes', 'Missões')}
          {linkAncora('#professores', 'Professores')}
          {linkAncora('#sobre', 'Sobre')}
        </nav>

        {/* Ações desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="min-h-[44px] flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-[#1D4ED8] transition-colors hover:bg-[#EFF6FF]"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="min-h-[44px] flex items-center rounded-xl bg-[#1D4ED8] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF]"
          >
            Criar conta
          </Link>
        </div>

        {/* Hambúrguer mobile */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] md:hidden"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
        >
          {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {aberto && (
        <div className="border-t border-[#E2E8F0] bg-white px-5 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {linkAncora('#como-funciona', 'Como funciona')}
            {linkAncora('#missoes', 'Missões')}
            {linkAncora('#professores', 'Professores')}
            {linkAncora('#sobre', 'Sobre')}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-[#E2E8F0] pt-3">
            <Link
              to="/login"
              onClick={() => setAberto(false)}
              className="min-h-[44px] flex items-center justify-center rounded-xl border border-[#E2E8F0] px-4 text-sm font-semibold text-[#1D4ED8]"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              onClick={() => setAberto(false)}
              className="min-h-[44px] flex items-center justify-center rounded-xl bg-[#1D4ED8] px-4 text-sm font-semibold text-white"
            >
              Criar conta
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── HERO ── */
function SecaoHero() {
  return (
    <section className="relative overflow-hidden bg-[#EEF5FF] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            Aprenda matemática{' '}
            <span className="text-[#1D4ED8]">jogando</span>,{' '}
            no seu ritmo
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#64748B] sm:text-lg lg:mx-0 mx-auto">
            Frações, multiplicação, potências e outros desafios no laboratório.
            Ganhe pontos, suba de liga e acompanhe seu progresso em tempo real.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/login"
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-[#1D4ED8] px-8 py-3 text-base font-semibold text-white shadow-[0_4px_14px_-2px_rgb(29_78_216_/_0.35)] transition-colors hover:bg-[#1E40AF] sm:w-auto"
            >
              Ir para o laboratório
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex min-h-[3rem] w-full items-center justify-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-white px-8 py-3 text-base font-semibold text-[#0F172A] transition-colors hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] sm:w-auto"
            >
              Ver como funciona
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Mockup desktop — janela do app */}
        <div className="hidden lg:flex lg:justify-center">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
            {/* Conteúdo do app */}
            <div className="p-4 space-y-3 bg-[#EEF5FF]">

              {/* Card de progresso */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Meu progresso</p>
                  <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-bold text-[#B45309]">
                    Liga Bronze
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF]">
                    <Trophy className="h-5 w-5 text-[#EA580C]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-[#0F172A]">
                      320 <span className="text-sm font-normal text-[#94A3B8]">pts</span>
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                      <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA]" />
                    </div>
                    <p className="mt-1 text-[10px] text-[#94A3B8]">180 pts para Prata</p>
                  </div>
                </div>
              </div>

              {/* Lista de missões */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
                <p className="mb-2.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Missões disponíveis
                </p>
                <div className="space-y-2">
                  {[
                    { icone: Rocket, cor: '#7C3AED', fundo: '#F5F3FF', nome: 'Invasão Espacial', pts: '+50 pts', done: true },
                    { icone: Cookie, cor: '#EA580C', fundo: '#FFF7ED', nome: 'Aventura das Frações', pts: '+40 pts', done: false },
                    { icone: Apple, cor: '#16A34A', fundo: '#F0FDF4', nome: 'Multiplicação', pts: '+35 pts', done: false },
                  ].map((m) => {
                    const Icone = m.icone;
                    return (
                      <div key={m.nome} className="flex items-center gap-3 rounded-lg border border-[#F1F5F9] p-2.5">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: m.fundo }}
                        >
                          <Icone className="h-4 w-4" style={{ color: m.cor }} strokeWidth={2} />
                        </div>
                        <p className="flex-1 text-xs font-semibold text-[#0F172A]">{m.nome}</p>
                        {m.done ? (
                          <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#16A34A]">
                            ✓ Feito
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8]">
                            {m.pts}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Grid mobile — preview de missões */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {MISSOES.slice(0, 4).map((m) => {
            const Icone = m.icone;
            return (
              <div key={m.id} className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-sm">
                <div
                  className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: m.fundo }}
                >
                  <Icone className="h-5 w-5" style={{ color: m.cor }} />
                </div>
                <p className="text-sm font-bold text-[#0F172A]">{m.nome}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── COMO FUNCIONA ── */
function SecaoComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Processo
          </p>
          <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl lg:text-4xl">
            Simples assim
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#64748B]">
            Em três passos você já está aprendendo matemática de forma interativa.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {COMO_FUNCIONA.map((item, i) => {
            const Icone = item.icone;
            return (
              <div
                key={i}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.fundo }}
                >
                  <Icone className="h-6 w-6" style={{ color: item.cor }} strokeWidth={2} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0F172A]">{item.titulo}</h3>
                <p className="text-sm leading-relaxed text-[#64748B]">{item.descricao}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── MISSÕES ── */
function SecaoMissoes() {
  return (
    <section id="missoes" className="bg-[#EEF5FF] px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Laboratório
          </p>
          <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl lg:text-4xl">
            6 atividades no laboratório
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#64748B]">
            Cada missão aborda um tema com desafios visuais e feedback imediato.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MISSOES.map((m) => {
            const Icone = m.icone;
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: m.fundo }}
                  >
                    <Icone className="h-5 w-5" style={{ color: m.cor }} strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[10px] font-bold text-[#16A34A]">
                    Disponível
                  </span>
                </div>
                <h3 className="mb-1.5 text-base font-bold text-[#0F172A]">{m.nome}</h3>
                <p className="text-sm leading-snug text-[#64748B]">{m.descricao}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/cadastro"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-[#1D4ED8] px-10 py-3 text-base font-semibold text-white shadow-[0_4px_14px_-2px_rgb(29_78_216_/_0.35)] transition-colors hover:bg-[#1E40AF]"
          >
            Começar agora — é gratuito
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── PROFESSORES ── */
function SecaoProfessores() {
  const bullets = [
    'Crie quantas turmas precisar',
    'Código de 6 caracteres para os alunos entrarem',
    'Ranking individual da turma em tempo real',
  ];

  return (
    <section id="professores" className="bg-[#F0F7FF] px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D4ED8]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Modo turma
          </p>
          <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl lg:text-4xl">
            Para professores
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-[#64748B]">
            Crie turmas, compartilhe um código e acompanhe o ranking dos seus
            alunos em tempo real.
          </p>

          <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8]">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-[#334155]">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              to="/cadastro"
              state={{ papelInicial: 'professor' }}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border-2 border-[#1D4ED8] px-8 py-3 text-base font-semibold text-[#1D4ED8] transition-colors hover:bg-[#1D4ED8] hover:text-white"
            >
              Criar conta como professor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SOBRE ── */
function SecaoSobre() {
  const stats = [
    { valor: '6', label: 'Missões disponíveis', icone: FlaskConical },
    { valor: '3', label: 'Tipos de ranking', icone: BarChart3 },
    { valor: '5', label: 'Ligas (Bronze → Ascendente)', icone: Trophy },
  ];

  return (
    <section id="sobre" className="bg-white px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Texto */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Sobre o projeto
            </p>
            <h2 className="mb-6 text-2xl font-bold text-[#0F172A] sm:text-3xl">
              O que é o MatMaker?
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-[#64748B]">
              <p>
                O MatMaker é um laboratório de matemática em que você resolve desafios
                visuais, recebe retorno na hora e vai desbloqueando novas formas de
                pensar números, formas e quantidades.
              </p>
              <p>
                No Laboratório, cada atividade convida a explorar um tema com calma:
                frações com situações concretas, posição no espaço, operações no dia a
                dia, porcentagens, desafios que misturam contextos e o material dourado
                para ligar quantidade à representação.
              </p>
              <p>
                O objetivo não é decorar fórmulas à pressa, mas entender o que está por
                trás de cada passo, com tentativas e correções que fazem parte do
                aprendizado.
              </p>
              <p>
                O projeto nasce da ideia de que a matemática pode ser acessível, divertida
                e útil — seja para reforçar o que você vê na escola, para estudar com mais
                autonomia ou para experimentar conteúdos de outro jeito.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/sobre"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:underline"
              >
                Ler mais sobre o projeto
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-center gap-4">
            {stats.map((s, i) => {
              const Icone = s.icone;
              return (
                <div
                  key={i}
                  className="flex items-center gap-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF]">
                    <Icone className="h-6 w-6 text-[#1D4ED8]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#0F172A]">{s.valor}</p>
                    <p className="text-sm text-[#64748B]">{s.label}</p>
                  </div>
                </div>
              );
            })}

            <div className="mt-2 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-5">
              <p className="text-sm font-semibold text-[#1D4ED8]">
                "Se você está aqui pela primeira vez, comece pelo Laboratório, escolha uma
                atividade e siga no seu ritmo. Bons estudos!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer className="bg-[#0F172A] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <MatMakerLogo className="h-7 w-7" />
              <span className="text-base font-bold text-white">MatMaker</span>
            </div>
            <p className="text-sm text-[#64748B]">Matemática acessível, no seu ritmo</p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-sm text-[#94A3B8] transition-colors hover:text-white">
              Entrar
            </Link>
            <Link to="/cadastro" className="text-sm text-[#94A3B8] transition-colors hover:text-white">
              Cadastro
            </Link>
            <Link to="/sobre" className="text-sm text-[#94A3B8] transition-colors hover:text-white">
              Sobre
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-[#1E293B] pt-6 text-center">
          <p className="text-xs text-[#475569]">
            © 2025 MatMaker — Projeto acadêmico (TCC)
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── EXPORT PRINCIPAL ── */
export function LandingPage() {
  return (
    <div className="min-h-[100dvh]">
      <NavBar />
      <SecaoHero />
      <SecaoComoFunciona />
      <SecaoMissoes />
      <SecaoProfessores />
      <SecaoSobre />
      <Footer />
    </div>
  );
}
