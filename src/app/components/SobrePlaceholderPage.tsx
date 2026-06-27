import { Link } from 'react-router';
import {
  ChevronLeft,
  FlaskConical,
  Trophy,
  BarChart3,
  GraduationCap,
  Rocket,
  Cookie,
  Apple,
  Zap,
  ShoppingBag,
  Layers3,
} from 'lucide-react';
import { MatMakerLogo } from './MatMakerLogo';

const MISSOES_RESUMO = [
  { nome: 'Invasão Espacial', icone: Rocket, cor: '#7C3AED', fundo: '#F5F3FF' },
  { nome: 'Aventura das Frações', icone: Cookie, cor: '#EA580C', fundo: '#FFF7ED' },
  { nome: 'Multiplicação no mercado', icone: Apple, cor: '#16A34A', fundo: '#F0FDF4' },
  { nome: 'Potências ao quadrado', icone: Zap, cor: '#1D4ED8', fundo: '#EFF6FF' },
  { nome: 'Desafio do mercado', icone: ShoppingBag, cor: '#0891B2', fundo: '#ECFEFF' },
  { nome: 'Material dourado', icone: Layers3, cor: '#B45309', fundo: '#FFFBEB' },
];

export function SobrePlaceholderPage() {
  return (
    <div className="min-h-[100dvh] bg-[#EEF5FF]">
      {/* Header simples */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3 sm:px-8">
          <Link
            to="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
            aria-label="Voltar ao início"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2 no-underline">
            <MatMakerLogo className="h-8 w-8" />
            <span className="text-base font-bold tracking-tight text-[#0F172A]">MatMaker</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Hero da página */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D4ED8]">
            <FlaskConical className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">
            Sobre o MatMaker
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#64748B]">
            Um laboratório de matemática desenvolvido como projeto de TCC —
            interativo, gamificado e acessível para todos.
          </p>
        </div>

        {/* O que é */}
        <section className="mb-12 rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#0F172A]">O que é o MatMaker?</h2>
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
              trás de cada passo, com tentativas e correções que fazem parte do aprendizado.
            </p>
            <p>
              O projeto nasce da ideia de que a matemática pode ser acessível, divertida
              e útil — seja para reforçar o que você vê na escola, para estudar com mais
              autonomia ou para experimentar conteúdos de outro jeito.
            </p>
            <p className="font-medium text-[#334155]">
              Se você está aqui pela primeira vez, comece pelo Laboratório, escolha uma
              atividade e siga no seu ritmo. Bons estudos!
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          {[
            { icone: FlaskConical, valor: '6', label: 'Missões', desc: 'Atividades interativas no laboratório' },
            { icone: Trophy, valor: '5', label: 'Ligas', desc: 'Do Bronze ao Ascendente' },
            { icone: BarChart3, valor: '3', label: 'Rankings', desc: 'Geral, por liga e semanal' },
          ].map((s, i) => {
            const Icone = s.icone;
            return (
              <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF]">
                  <Icone className="h-6 w-6 text-[#1D4ED8]" />
                </div>
                <p className="text-3xl font-bold text-[#0F172A]">{s.valor}</p>
                <p className="text-sm font-semibold text-[#1D4ED8]">{s.label}</p>
                <p className="mt-1 text-xs text-[#94A3B8]">{s.desc}</p>
              </div>
            );
          })}
        </section>

        {/* Missões */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-[#0F172A]">Atividades disponíveis</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MISSOES_RESUMO.map((m) => {
              const Icone = m.icone;
              return (
                <div
                  key={m.nome}
                  className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: m.fundo }}
                  >
                    <Icone className="h-5 w-5" style={{ color: m.cor }} strokeWidth={2} />
                  </div>
                  <p className="text-sm font-semibold text-[#0F172A]">{m.nome}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Modo turma */}
        <section className="mb-12 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-bold text-[#0F172A]">Modo turma para professores</h2>
              <p className="text-base leading-relaxed text-[#64748B]">
                Professores podem criar turmas, gerar um código de 6 caracteres e acompanhar o
                desempenho individual de cada aluno no ranking da turma — tudo em tempo real.
              </p>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/cadastro"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-[#1D4ED8] px-8 py-3 text-base font-semibold text-white shadow-[0_4px_14px_-2px_rgb(29_78_216_/_0.35)] transition-colors hover:bg-[#1E40AF] sm:w-auto"
          >
            Criar conta gratuita
          </Link>
          <Link
            to="/login"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-8 py-3 text-base font-semibold text-[#0F172A] transition-colors hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] sm:w-auto"
          >
            Já tenho conta
          </Link>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="mt-16 border-t border-[#E2E8F0] bg-[#0F172A] px-5 py-8 text-center sm:px-8">
        <p className="text-sm text-[#475569]">© 2025 MatMaker — Projeto acadêmico (TCC)</p>
      </footer>
    </div>
  );
}
