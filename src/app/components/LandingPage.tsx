import { useNavigate } from 'react-router';
import { Compass, Rocket, Triangle, Trophy } from 'lucide-react';

export function LandingPage() {
  const navegar = useNavigate();

  const diferenciais = [
    {
      titulo: 'Missões interativas',
      descricao:
        'Resolva desafios de matemática em um ambiente visual e intuitivo.',
      icone: Rocket,
    },
    {
      titulo: 'Aprendizado por exploração',
      descricao:
        'Construa conceitos com feedback imediato e atividades em etapas.',
      icone: Compass,
    },
    {
      titulo: 'Evolução contínua',
      descricao:
        'Acompanhe seu progresso e desbloqueie novos objetivos no laboratório.',
      icone: Trophy,
    },
  ];

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-12 h-48 w-48 rounded-full bg-[var(--color-success)]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-40 w-40 rounded-full bg-[var(--color-warning)]/20 blur-3xl" />

      <header className="mx-auto flex w-full max-w-6xl items-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:px-6 sm:py-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-3xl bg-primary shadow-lg sm:h-12 sm:w-12">
            <Triangle className="h-6 w-6 fill-white text-white sm:h-7 sm:w-7" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">MatMaker</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 sm:gap-16 sm:px-6 sm:pb-16 sm:pt-8 md:px-8">
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-5 sm:space-y-6">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
              Plataforma educativa interativa
            </span>
            <h2 className="text-3xl font-bold leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl">
              Transforme a matemática em uma experiência viva.
            </h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              O MatMaker combina jogos e desafios guiados para ajudar
              estudantes a aprender com autonomia, clareza e diversão.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                onClick={() => navegar('/dashboard')}
                className="min-h-12 w-full rounded-3xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition active:scale-[0.98] sm:min-h-0 sm:w-auto sm:px-8 sm:py-4 sm:text-lg md:hover:scale-[1.02] md:hover:bg-[#2C98B8] md:hover:shadow-xl"
              >
                Entrar no laboratório
              </button>
              <button
                onClick={() => navegar('/fractions')}
                className="min-h-12 w-full rounded-3xl border border-border bg-card px-6 py-3.5 text-base font-semibold transition active:bg-muted sm:min-h-0 sm:w-auto sm:px-8 sm:py-4 sm:text-lg md:hover:bg-muted"
              >
                Ir para frações
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xl sm:rounded-[2rem] sm:p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:mb-6 sm:text-sm">
              Trilha de hoje
            </p>
            <div className="space-y-4">
              <div className="rounded-2xl bg-primary/10 p-4">
                <h3 className="text-base font-bold">Desafios numéricos</h3>
                <p className="text-sm text-muted-foreground">
                  Resolva problemas com lógica, contagem e interpretação.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--color-success)]/15 p-4">
                <h3 className="text-base font-bold">Frações visuais</h3>
                <p className="text-sm text-muted-foreground">
                  Monte equivalências com blocos e comparações intuitivas.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--color-warning)]/15 p-4">
                <h3 className="text-base font-bold">Desafio semanal</h3>
                <p className="text-sm text-muted-foreground">
                  Complete a missão bônus para ganhar medalhas no ranking.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {diferenciais.map((item) => (
            <article
              key={item.titulo}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <item.icone className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.titulo}</h3>
              <p className="text-muted-foreground">{item.descricao}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}