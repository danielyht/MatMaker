import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Apple, Check, X, Sparkles, Leaf, Flame } from 'lucide-react';
import { Progress } from './ui/progress';

type Nivel = 'facil' | 'medio' | 'dificil';

/** Maçãs na mesa (grade fixa; cobre até somas no difícil). */
const MACAS_NA_GRADE = 30;
const PONTOS = { facil: 40, medio: 50, dificil: 60 } as const;

interface PerguntaMercado {
  id: number;
  enunciado: string;
  ovos: number;
  multiplicador: number;
  /** Pessoas no total (Maria + irmãos) — médio e difícil. */
  pessoas?: number;
  /** Só no difícil: quantas partes iguais somar no final (1 = só ela, 2 = ela+1 irmão, 3 = ela+2…). ≤ `pessoas`. */
  partesSomadas?: number;
}

function macasTotais(p: PerguntaMercado) {
  return p.ovos * p.multiplicador;
}

function respostaEsperada(p: PerguntaMercado, nivel: Nivel): number {
  const total = macasTotais(p);
  if (nivel === 'facil') return total;
  const pes = p.pessoas ?? 1;
  const porPessoa = total / pes;
  if (nivel === 'medio') return porPessoa;
  const partes = Math.min(p.partesSomadas ?? 2, pes);
  return porPessoa * partes;
}

const PERGUNTAS_FACIL: PerguntaMercado[] = [
  {
    id: 1,
    enunciado:
      'Maria comprou 6 ovos e quer comprar o dobro da quantidade de ovos em maçãs. Quantas maçãs Maria vai comprar?',
    ovos: 6,
    multiplicador: 2,
  },
  {
    id: 2,
    enunciado:
      'João comprou 9 ovos e quer comprar três vezes a quantidade de ovos em maçãs. Quantas maçãs João vai comprar?',
    ovos: 9,
    multiplicador: 3,
  },
  {
    id: 3,
    enunciado:
      'Ana comprou 4 ovos e quer comprar cinco vezes a quantidade de ovos em maçãs. Quantas maçãs Ana vai comprar?',
    ovos: 4,
    multiplicador: 5,
  },
  {
    id: 4,
    enunciado:
      'Pedro comprou 7 ovos e quer o dobro dessa quantidade em maçãs. Quantas maçãs Pedro vai comprar?',
    ovos: 7,
    multiplicador: 2,
  },
  {
    id: 5,
    enunciado:
      'Carla comprou 5 ovos e quer comprar quatro vezes essa quantidade em maçãs. Quantas maçãs Carla vai comprar?',
    ovos: 5,
    multiplicador: 4,
  },
];

/** (ovos × mult) divisível por pessoas */
const PERGUNTAS_MEDIO: PerguntaMercado[] = [
  {
    id: 1,
    enunciado:
      'Maria comprou 9 ovos e quer o dobro dessa quantidade em maçãs. Depois, dividiu todas as maçãs igualmente entre ela e seus dois irmãos (três pessoas no total). Quantas maçãs Maria ficou?',
    ovos: 9,
    multiplicador: 2,
    pessoas: 3,
  },
  {
    id: 2,
    enunciado:
      'João comprou 8 ovos e quer três vezes essa quantidade em maçãs. Depois, repartiu todas as maçãs em partes iguais entre ele e seus três irmãos (quatro pessoas no total). Quantas maçãs João ficou?',
    ovos: 8,
    multiplicador: 3,
    pessoas: 4,
  },
  {
    id: 3,
    enunciado:
      'Ana comprou 6 ovos e quer o dobro em maçãs. Em seguida, dividiu as maçãs igualmente entre ela e seus cinco irmãos (seis pessoas no total). Quantas maçãs Ana ficou?',
    ovos: 6,
    multiplicador: 2,
    pessoas: 6,
  },
  {
    id: 4,
    enunciado:
      'Pedro comprou 10 ovos e quer o dobro em maçãs. Depois, dividiu todas as maçãs igualmente entre ele e seus quatro irmãos (cinco pessoas). Quantas maçãs Pedro ficou?',
    ovos: 10,
    multiplicador: 2,
    pessoas: 5,
  },
  {
    id: 5,
    enunciado:
      'Carla comprou 4 ovos e quer cinco vezes essa quantidade em maçãs. Depois, repartiu todas as maçãs em partes iguais entre ela e um irmão (duas pessoas no total). Quantas maçãs Carla ficou?',
    ovos: 4,
    multiplicador: 5,
    pessoas: 2,
  },
];

/**
 * Mesmos totais que o médio; divisão exata. No final soma-se `partesSomadas` quinhões iguais
 * (varia: só uma pessoa, duas, três ou quatro).
 */
const PERGUNTAS_DIFICIL: PerguntaMercado[] = [
  {
    id: 1,
    enunciado:
      'Maria comprou 9 ovos e quer o dobro dessa quantidade em maçãs. Depois, dividiu todas as maçãs igualmente entre ela e seus dois irmãos (três pessoas no total). Quantas maçãs Maria e um irmão têm juntos?',
    ovos: 9,
    multiplicador: 2,
    pessoas: 3,
    partesSomadas: 2,
  },
  {
    id: 2,
    enunciado:
      'João comprou 8 ovos e quer três vezes essa quantidade em maçãs. Depois, repartiu todas as maçãs em partes iguais entre ele e seus três irmãos (quatro pessoas no total). Quantas maçãs João e dois irmãos têm juntos?',
    ovos: 8,
    multiplicador: 3,
    pessoas: 4,
    partesSomadas: 3,
  },
  {
    id: 3,
    enunciado:
      'Ana comprou 6 ovos e quer o dobro em maçãs. Em seguida, dividiu as maçãs igualmente entre ela e seus cinco irmãos (seis pessoas no total). Quantas maçãs Ana e um irmão têm juntas?',
    ovos: 6,
    multiplicador: 2,
    pessoas: 6,
    partesSomadas: 2,
  },
  {
    id: 4,
    enunciado:
      'Pedro comprou 10 ovos e quer o dobro em maçãs. Depois, dividiu todas as maçãs igualmente entre ele e seus quatro irmãos (cinco pessoas no total). Quantas maçãs Pedro e três irmãos têm juntos?',
    ovos: 10,
    multiplicador: 2,
    pessoas: 5,
    partesSomadas: 4,
  },
  {
    id: 5,
    enunciado:
      'Carla comprou 4 ovos e quer cinco vezes essa quantidade em maçãs. Depois, repartiu todas as maçãs em partes iguais entre ela e um irmão (duas pessoas no total). Quantas maçãs só Carla ficou para ela?',
    ovos: 4,
    multiplicador: 5,
    pessoas: 2,
    partesSomadas: 1,
  },
];

function listaPorNivel(nivel: Nivel): PerguntaMercado[] {
  switch (nivel) {
    case 'facil':
      return PERGUNTAS_FACIL;
    case 'medio':
      return PERGUNTAS_MEDIO;
    case 'dificil':
      return PERGUNTAS_DIFICIL;
  }
}

function playSomSucesso() {
  try {
    const ACtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ACtx) return;
    const ctx = new ACtx();
    const sequencia = [523.25, 659.25, 783.99];
    sequencia.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.07;
      const t0 = ctx.currentTime + i * 0.11;
      o.start(t0);
      o.stop(t0 + 0.14);
    });
  } catch {
    /* Sem áudio */
  }
}

function playSomErro() {
  try {
    const ACtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ACtx) return;
    const ctx = new ACtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'triangle';
    o.frequency.value = 180;
    g.gain.value = 0.09;
    const t0 = ctx.currentTime;
    o.start(t0);
    o.stop(t0 + 0.22);
  } catch {
    /* Sem áudio */
  }
}

function CaixaOvos({ quantidade }: { quantidade: number }) {
  return (
    <div className="mx-auto w-full max-w-xs rounded-2xl border-2 border-amber-200/90 bg-amber-50/90 p-3 shadow-inner">
      <p className="mb-2 text-center text-xs font-semibold text-amber-900/80">Caixa de ovos</p>
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: quantidade }).map((_, i) => (
          <span key={i} className="text-2xl sm:text-3xl" role="img" aria-hidden>
            🥚
          </span>
        ))}
      </div>
    </div>
  );
}

function GradeMacasSelecionavel({
  total,
  selecionadas,
  onToggle,
  disabled,
}: {
  total: number;
  selecionadas: Set<number>;
  onToggle: (indice: number) => void;
  disabled: boolean;
}) {
  const escolhidas = selecionadas.size;

  return (
    <div className="space-y-3">
      <p className="text-center text-xs text-muted-foreground sm:text-sm">
        Selecionadas: <strong className="tabular-nums text-foreground">{escolhidas}</strong>
      </p>
      <div
        className="grid grid-cols-6 gap-1.5 sm:gap-2"
        role="group"
        aria-label="Maçãs — selecione a quantidade"
      >
        {Array.from({ length: total }).map((_, i) => {
          const ativa = selecionadas.has(i);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(i)}
              className={`flex h-10 w-full min-h-10 touch-manipulation items-center justify-center rounded-lg border-2 text-xl transition-transform active:scale-95 sm:h-11 sm:text-2xl ${
                ativa
                  ? 'border-red-600 bg-red-50 shadow-inner ring-2 ring-red-400/50'
                  : 'border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-100/80'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
              aria-pressed={ativa}
              aria-label={ativa ? `Maçã ${i + 1} marcada` : `Maçã ${i + 1} não marcada`}
            >
              <span aria-hidden>{ativa ? '🍎' : '🍏'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function textoDica(nivel: Nivel): string {
  switch (nivel) {
    case 'facil':
      return 'Leia o enunciado e pense em quantas vezes a quantidade de ovos vira maçãs; marque só essa quantidade.';
    case 'medio':
      return 'Primeiro pense no total de maçãs; depois divida pelo número de pessoas que repartiram em partes iguais.';
    case 'dificil':
      return 'Ache quantas maçãs vale cada parte igual; depois some só o que a última frase pede (uma pessoa, duas, três…).';
    default:
      return '';
  }
}

export function DoubleGame() {
  const navegar = useNavigate();
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [indice, setIndice] = useState(0);

  const lista = nivel ? listaPorNivel(nivel) : [];
  const pergunta = lista[indice];
  const esperado = nivel && pergunta ? respostaEsperada(pergunta, nivel) : 0;

  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<'idle' | 'certo' | 'errado'>('idle');
  const [pontos, setPontos] = useState(0);
  const [mostrarDica, setMostrarDica] = useState(false);

  useEffect(() => {
    setSelecionadas(new Set());
    setFeedback('idle');
    setMostrarDica(false);
  }, [indice, nivel]);

  const toggleMaca = useCallback(
    (i: number) => {
      if (feedback === 'certo') return;
      setSelecionadas((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        return next;
      });
      if (feedback !== 'idle') setFeedback('idle');
      setMostrarDica(false);
    },
    [feedback],
  );

  const limparSelecao = () => {
    setSelecionadas(new Set());
    setFeedback('idle');
    setMostrarDica(false);
  };

  const escolherNivel = (n: Nivel) => {
    setNivel(n);
    setIndice(0);
    setPontos(0);
    setSelecionadas(new Set());
    setFeedback('idle');
    setMostrarDica(false);
  };

  const voltarNiveis = () => {
    setNivel(null);
    setIndice(0);
    setPontos(0);
    setSelecionadas(new Set());
    setFeedback('idle');
    setMostrarDica(false);
  };

  const confirmar = useCallback(() => {
    if (!nivel) return;
    const n = selecionadas.size;
    if (n === esperado) {
      setFeedback('certo');
      setMostrarDica(false);
      setPontos((p) => p + PONTOS[nivel]);
      playSomSucesso();
    } else {
      setFeedback('errado');
      setMostrarDica(true);
      playSomErro();
    }
  }, [selecionadas.size, esperado, nivel]);

  const proximaPergunta = () => {
    if (indice < lista.length - 1) {
      setIndice((i) => i + 1);
    }
  };

  const progressoPercentual = lista.length ? ((indice + 1) / lista.length) * 100 : 0;
  const ultimaPerguntaAcertou = feedback === 'certo' && indice === lista.length - 1;

  const voltarPainel = () => navegar('/dashboard');

  const badgeNivel =
    nivel === 'facil'
      ? 'Fácil'
      : nivel === 'medio'
        ? 'Médio'
        : nivel === 'dificil'
          ? 'Difícil'
          : '';

  /* ——— Seleção de nível ——— */
  if (!nivel) {
    return (
      <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50/80 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between border-b border-sky-100/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-5">
          <button
            type="button"
            onClick={voltarPainel}
            className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors active:bg-sky-100"
            aria-label="Voltar ao painel"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-foreground sm:text-lg">
            Multiplicação no mercado
          </h1>
          <span className="w-11" />
        </header>

        <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto w-full max-w-3xl">
            <p className="mb-8 text-center text-lg font-medium text-muted-foreground sm:mb-10 sm:text-xl">
              Escolha um nível
            </p>

            <div className="flex flex-col gap-5 sm:gap-6">
              <button
                type="button"
                onClick={() => escolherNivel('facil')}
                className="flex w-full items-center gap-5 rounded-3xl border-2 border-emerald-200/90 bg-white p-6 text-left shadow-md transition-transform active:scale-[0.99] md:hover:border-emerald-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 sm:h-16 sm:w-16">
                  <Leaf className="h-8 w-8 text-emerald-600 sm:h-9 sm:w-9" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">Fácil</p>
                  <p className="mt-1 text-base leading-snug text-muted-foreground sm:text-lg">
                    Brincando com multiplicações no mercado
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => escolherNivel('medio')}
                className="flex w-full items-center gap-5 rounded-3xl border-2 border-amber-200/90 bg-white p-6 text-left shadow-md transition-transform active:scale-[0.99] md:hover:border-amber-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 sm:h-16 sm:w-16">
                  <Apple className="h-8 w-8 text-amber-700 sm:h-9 sm:w-9" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">Médio</p>
                  <p className="mt-1 text-base leading-snug text-muted-foreground sm:text-lg">
                    Explorando divisões e multiplicações
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => escolherNivel('dificil')}
                className="flex w-full items-center gap-5 rounded-3xl border-2 border-rose-200/90 bg-white p-6 text-left shadow-md transition-transform active:scale-[0.99] md:hover:border-rose-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 sm:h-16 sm:w-16">
                  <Flame className="h-8 w-8 text-rose-600 sm:h-9 sm:w-9" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">Difícil</p>
                  <p className="mt-1 text-base leading-snug text-muted-foreground sm:text-lg">
                    Desafio final: multiplicação, divisão e soma
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ——— Jogo ——— */
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50/80 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between border-b border-sky-100/80 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={voltarNiveis}
            className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors active:bg-sky-100 sm:h-9 sm:w-9"
            aria-label="Voltar à escolha de nível"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <Apple className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-foreground sm:text-base">Multiplicação no mercado</h1>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
              {badgeNivel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-amber-200/80 bg-amber-50 px-2.5 py-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-bold tabular-nums text-amber-900 sm:text-sm">{pontos} pts</span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-4 sm:px-5 sm:py-6">
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
            <span>
              Pergunta {indice + 1} / {lista.length}
            </span>
            <span className="tabular-nums">{MACAS_NA_GRADE} maçãs na mesa</span>
          </div>
          <Progress value={Math.min(100, progressoPercentual)} className="h-2" />
        </div>

        <div className="animate-scale-in space-y-5">
          <CaixaOvos quantidade={pergunta.ovos} />

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <p className="text-center text-sm font-medium leading-relaxed text-card-foreground sm:text-base">
              {pergunta.enunciado}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
            <GradeMacasSelecionavel
              total={MACAS_NA_GRADE}
              selecionadas={selecionadas}
              onToggle={toggleMaca}
              disabled={feedback === 'certo'}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <button
              type="button"
              onClick={confirmar}
              disabled={feedback === 'certo' || selecionadas.size === 0}
              className="min-h-11 touch-manipulation rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.99] disabled:opacity-50 md:hover:opacity-95"
            >
              Confirmar escolha
            </button>
            <button
              type="button"
              onClick={limparSelecao}
              disabled={feedback === 'certo' || selecionadas.size === 0}
              className="min-h-11 rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              Limpar maçãs
            </button>
          </div>

          {feedback === 'certo' && (
            <div
              className="animate-scale-in rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center"
              role="status"
            >
              <Check className="mx-auto h-8 w-8 text-emerald-600" strokeWidth={3} />
              <p className="mt-2 text-lg font-bold text-emerald-800">Correto!</p>
              <p className="text-sm text-emerald-700/90">+{nivel ? PONTOS[nivel] : 0} pontos</p>
              {ultimaPerguntaAcertou ? (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={voltarNiveis}
                    className="min-h-11 rounded-xl border-2 border-primary bg-background px-6 py-2.5 text-sm font-bold text-primary"
                  >
                    Outro nível
                  </button>
                  <button
                    type="button"
                    onClick={voltarPainel}
                    className="min-h-11 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white"
                  >
                    Voltar ao painel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={proximaPergunta}
                  className="mt-4 min-h-11 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white sm:w-auto sm:px-8"
                >
                  Próxima pergunta
                </button>
              )}
            </div>
          )}

          {feedback === 'errado' && (
            <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-center" role="alert">
              <X className="mx-auto h-7 w-7 text-orange-600" strokeWidth={3} />
              <p className="mt-2 font-bold text-orange-800">Tente novamente</p>
              <p className="text-sm text-orange-800/90">Ajuste as maçãs vermelhas e confirme de novo.</p>
            </div>
          )}

          {mostrarDica && feedback === 'errado' && nivel && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-center text-sm text-sky-900">
              <strong>Dica:</strong> {textoDica(nivel)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
