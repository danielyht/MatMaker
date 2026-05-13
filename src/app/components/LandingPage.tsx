import { Compass, Layers, Rocket } from 'lucide-react';
import { Navbar } from './Navbar';

export function LandingPage() {
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
      titulo: 'Conceitos sob muitos ângulos',
      descricao:
        'Figuras, frações e situações do dia a dia mostram cada ideia de formas diferentes, para encaixar no jeito que você pensa melhor.',
      icone: Layers,
    },
  ];

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-8 top-12 h-48 w-48 rounded-full bg-[var(--color-success)]/20 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-40 w-40 rounded-full bg-[var(--color-warning)]/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(3.5rem+max(0.35rem,env(safe-area-inset-top,0px))+1rem)] sm:gap-8 sm:px-6 sm:pb-16 sm:pt-[calc(4rem+max(0.35rem,env(safe-area-inset-top,0px))+1rem)] md:px-8">
        <section className="max-w-2xl">
          <div className="space-y-5 sm:space-y-6">
            <span className="mt-2 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:mt-3 sm:px-4 sm:text-sm">
              Plataforma educativa interativa
            </span>
            <h2 className="text-3xl font-bold leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl">
              Transforme a matemática em uma experiência viva.
            </h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              O MatMaker combina jogos e desafios guiados para ajudar
              estudantes a aprender com autonomia, clareza e diversão.
            </p>
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