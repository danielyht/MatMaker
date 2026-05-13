import { useNavigate } from 'react-router';
import { ChevronLeft, Rocket, Cookie, Apple, Zap, Percent, ShoppingBag, Layers3 } from 'lucide-react';

export function Dashboard() {
  const navegar = useNavigate();

  const atividades = [
    {
      id: 1,
      nome: 'Invasão Espacial',
      descricao: 'Identifique naves alienígenas usando posição (esquerda/direita)',
      icone: Rocket,
      cor: '#8b5cf6',
      bloqueado: false,
      rota: '/space-position',
    },
    {
      id: 2,
      nome: 'Aventura das Frações',
      descricao: 'Aprenda frações dividindo chocolates, pizzas e muito mais!',
      icone: Cookie,
      cor: '#fb923c',
      bloqueado: false,
      rota: '/fractions',
    },
    {
      id: 3,
      nome: 'Multiplicação no mercado',
      descricao: 'Marque maçãs e resolva problemas de multiplicação no mercado',
      icone: Apple,
      cor: '#22c55e',
      bloqueado: false,
      rota: '/dobro',
    },
    {
      id: 4,
      nome: 'Potências ao quadrado',
      descricao: 'Quadrados pintados e potências ao quadrado.',
      icone: Zap,
      cor: '#7c3aed',
      bloqueado: false,
      rota: '/potencias-quadrado',
    },
    {
      id: 5,
      nome: 'Porcentagens',
      descricao: 'Grade de 100 partes e percentagens.',
      icone: Percent,
      cor: '#0d9488',
      bloqueado: false,
      rota: '/percentagens',
    },
    {
      id: 6,
      nome: 'Desafio do mercado',
      descricao: '15 perguntas mistas, com centavos.',
      icone: ShoppingBag,
      cor: '#059669',
      bloqueado: false,
      rota: '/desafio-mercado',
    },
    {
      id: 7,
      nome: 'Material dourado',
      descricao: 'Monte centenas, dezenas e unidades.',
      icone: Layers3,
      cor: '#d97706',
      bloqueado: false,
      rota: '/material-dourado',
    },
  ];

  function clicarAtividade(atividade) {
    if (!atividade.bloqueado && atividade.rota) {
      navegar(atividade.rota);
    }
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-7xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-8 md:px-8">
      <button
        type="button"
        onClick={() => navegar('/')}
        className="mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground shadow-sm transition-colors hover:bg-muted sm:mb-6"
        aria-label="Voltar ao início"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          Olá, Construtor! 👋
        </h1>
        <p className="mt-1 text-base text-muted-foreground sm:mt-2 sm:text-lg">
          Escolha uma atividade e comece a explorar o mundo da matemática
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5">
        {atividades.map((atividade) => {
          const Icone = atividade.icone;
          const podeClicar = !atividade.bloqueado;

          return (
            <div
              key={atividade.id}
              onClick={() => clicarAtividade(atividade)}
              className="rounded-3xl bg-white p-5 shadow-md transition-all duration-200 relative active:scale-[0.99] md:flex md:items-center md:gap-5 md:p-6 md:hover:shadow-xl"
              style={{
                cursor: podeClicar ? 'pointer' : 'not-allowed',
                opacity: podeClicar ? 1 : 0.6,
                transform: podeClicar ? 'scale(1)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (podeClicar && window.matchMedia('(hover: hover)').matches) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (podeClicar) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md md:mb-0 md:flex-shrink-0"
                style={{ backgroundColor: atividade.cor }}
              >
                <Icone className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>

              <div className="md:flex md:items-center md:justify-between md:gap-4 md:flex-1">
                <div className="pr-10 md:pr-0">
                  <h3 className="text-lg font-bold text-foreground sm:text-xl mb-1 sm:mb-2">
                    {atividade.nome}
                  </h3>

                  <p className="text-sm leading-snug text-muted-foreground md:mb-0">
                    {atividade.descricao}
                  </p>
                </div>

                {!atividade.bloqueado && (
                  <button
                    type="button"
                    className="mt-4 min-h-11 w-full touch-manipulation rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-foreground transition-colors active:bg-gray-300 md:mt-0 md:w-36 md:text-base md:hover:bg-gray-200"
                  >
                    Jogar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}