import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function SobrePlaceholderPage() {
  const navegar = useNavigate();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 md:px-8">
        <button
          type="button"
          onClick={() => navegar('/')}
          className="mb-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
          aria-label="Voltar ao início"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">Sobre</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        O  MatMaker é um laboratório de matemática em que você resolve desafios visuais, recebe retorno na hora e vai desbloqueando novas formas de pensar números, formas e quantidades.
        No Laboratório, cada atividade convida a explorar um tema com calma: frações com situações concretas, posição no espaço, operações no dia a dia, porcentagens, desafios que misturam contextos e o material dourado para ligar quantidade à representação. O objetivo não é decorar fórmulas à pressa, mas entender o que está por trás de cada passo, com tentativas e correções que fazem parte do aprendizado.
        O projeto nasce da ideia de que a matemática pode ser acessível, divertida e útil, seja para reforçar o que você vê na escola, para estudar com mais autonomia ou para experimentar conteúdos de outro jeito.
        Se você está aqui pela primeira vez, comece pelo Laboratório, escolha uma atividade e siga no seu ritmo. Bons estudos!
        </p>
      </div>
    </div>
  );
}
