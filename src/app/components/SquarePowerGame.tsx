import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Check, X, Sparkles, Zap, Leaf, Flame } from 'lucide-react';
import { Progress } from './ui/progress';

type Nivel = 'facil' | 'medio' | 'dificil';

const PONTOS = { facil: 35, medio: 45, dificil: 55 } as const;

/** Fácil: só perguntas n² com n ∈ {2,3,4,5}. Médio: mesmas bases, só conta total pintado → n² ∈ {4,9,16,25}. */
const BASES_FACIL_E_MEDIO = [2, 3, 4, 5];
/** Difícil: bases 6 a 9. */
const BASES_DIFICIL = [6, 7, 8, 9];

const QUADRADOS_TOTAIS_PEQUENO = BASES_FACIL_E_MEDIO.map((b) => b * b);
const QUADRADOS_TOTAIS_GRANDE = BASES_DIFICIL.map((b) => b * b);

type TipoPergunta = 'potencia' | 'quantidade' | 'lado';

interface OpcaoMC {
  label: string;
  correta: boolean;
}

interface PerguntaQuadrado {
  id: number;
  n: number;
  tipo: TipoPergunta;
  outer: number;
  offRow: number;
  offCol: number;
  texto: string;
  opcoes: OpcaoMC[];
  /** 0=violet 1=indigo 2=fuchsia para a figura parecer menos “iguais”. */
  matiz: number;
}

const TEXTOS_POTENCIA = [
  'Olhe o bloco pintado em formato de quadrado. Qual escrita como potência ao quadrado (n²) combina com ele?',
  'A região colorida forma um quadrado. Qual dessas é a potência que representa essa forma?',
  'Esse grupo de quadrinhos fecha um quadrado. Marque a potência n² correspondente ao lado dessa forma.',
];

const TEXTOS_QUANTIDADE = [
  'Quantos quadradinhos estão pintados no total?',
  'Conte todas as casinhas pintadas. Qual número total aparece?',
  'Some os quadrinhos pintados. Qual valor obtém?',
];

const TEXTOS_LADO = [
  'Somente um lado dessa forma (sem contar volta completa): quantos quadradinhos tem cada lado?',
  'A figura pintada é um quadrado. Quantos quadradinhos mede UM lado dela?',
  'Contando só uma fileira ao longo da borda: quantos quadradinhos tem o lado?',
];

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function intAleatorio(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Mistura diferente por pergunta, mas estável se recarregar a mesma lista. */
function embaralharComSemente<T>(arr: T[], sementeStr: string): T[] {
  let h = 2166136261;
  for (let p = 0; p < sementeStr.length; p++) {
    h ^= sementeStr.charCodeAt(p);
    h = Math.imul(h, 16777619);
  }
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Alternativas = exatamente n² das bases dadas (4 botões típicos: 2²…5² ou 6²…9²). */
function opcoesPotenciaConjunto(baseCorreta: number, basesPool: number[], sementeOp: string): OpcaoMC[] {
  const rotulos = basesPool.map((b) => `${b}²`);
  return embaralharComSemente(
    rotulos.map((label) => ({
      label,
      correta: label === `${baseCorreta}²`,
    })),
    `${sementeOp}-pconj`,
  );
}

/** Distratoras apenas entre quadrados “permitidos no nível” (ex.: 4, 9, 16, 25 ou 36…81). */
function opcoesQuantidadeConjunto(correto: number, valoresPossiveis: number[], sementeOp: string): OpcaoMC[] {
  const outros = valoresPossiveis.filter((v) => v !== correto);
  const rotulosStr = outros.map(String);
  const baralho = embaralharComSemente([String(correto), ...rotulosStr], `${sementeOp}|qconj`);
  return baralho.slice(0, 4).map((label) => ({ label, correta: label === String(correto) }));
}

function opcoesLado(n: number, sementeOp: string): OpcaoMC[] {
  const rotulos = new Set<string>([String(n)]);
  for (let d = 1; rotulos.size < 4 && d <= 8; d++) {
    if (n - d > 0) rotulos.add(String(n - d));
    if (rotulos.size < 4) rotulos.add(String(n + d));
  }
  return embaralharComSemente(
    [...rotulos].slice(0, 4).map((label) => ({ label, correta: label === String(n) })),
    sementeOp,
  );
}

/** Fácil: só escolher n². Médio: só quantos quadradinhos (mesmas bases 2–5). */
function tipoFacilOuMedio(nivel: Nivel): TipoPergunta {
  return nivel === 'facil' ? 'potencia' : 'quantidade';
}

/** Quatro perguntas no difícil (uma por base): potência, quantidade, lado e mais um sorteado entre eles. */
function misturaTiposDificil4(): TipoPergunta[] {
  const b: [TipoPergunta, TipoPergunta, TipoPergunta] = ['potencia', 'quantidade', 'lado'];
  const repete = b[intAleatorio(0, 2)];
  return embaralhar([...b, repete] as TipoPergunta[]);
}

function textoENMatiz(i: number, tipo: TipoPergunta): { texto: string; matiz: number } {
  const matiz = (i * 5 + (tipo === 'lado' ? 1 : tipo === 'quantidade' ? 3 : 0)) % 3;
  if (tipo === 'potencia')
    return { texto: TEXTOS_POTENCIA[i % TEXTOS_POTENCIA.length], matiz };
  if (tipo === 'quantidade')
    return { texto: TEXTOS_QUANTIDADE[i % TEXTOS_QUANTIDADE.length], matiz };
  return { texto: TEXTOS_LADO[i % TEXTOS_LADO.length], matiz };
}

function outerParaPergunta(nivel: Nivel, n: number): number {
  if (nivel === 'facil') return Math.max(n + intAleatorio(1, 2), 6);
  if (nivel === 'medio')
    return intAleatorio(Math.max(n + 2, 8), Math.max(n + 3, 9));
  /* Difícil: grade grande mas limitada para caber no telemóvel; n ≤ 10 exige outer ≤ 15. */
  const lo = Math.max(n + intAleatorio(2, 4), 12);
  const hi = Math.min(Math.max(n + intAleatorio(5, 7), Math.max(lo + 1, 14)), 15);
  return lo <= hi ? intAleatorio(lo, hi) : Math.min(Math.max(lo, 12), 15);
}

/** Evita dois enunciados com a mesma assinatura visual e tipo (principalmente repetir “aquela foto”). */
function montarListaNivel(nivel: Nivel): PerguntaQuadrado[] {
  const basesPorNivel: Record<Nivel, number[]> = {
    facil: BASES_FACIL_E_MEDIO,
    medio: BASES_FACIL_E_MEDIO,
    dificil: BASES_DIFICIL,
  };
  const pool = basesPorNivel[nivel];
  /** Sem repetir base n: no máximo uma pergunta por valor do pool (4 em cada nível). */
  const repetir = pool.length;
  const nsBase = embaralhar([...pool]);
  const tiposDificil = nivel === 'dificil' ? misturaTiposDificil4() : [];

  const usados = new Set<string>();
  const lista: PerguntaQuadrado[] = [];

  for (let i = 0; i < repetir; i++) {
    const n = nsBase[i];
    const tipo = nivel === 'dificil' ? tiposDificil[i] : tipoFacilOuMedio(nivel);
    const { texto, matiz } = textoENMatiz(i, tipo);
    const sementeOp = `${nivel}|${i}|${n}|${tipo}`;

    let outer = outerParaPergunta(nivel, n);
    let offRow = 0;
    let offCol = 0;
    let achou = false;

    for (let tent = 0; tent < 80 && !achou; tent++) {
      if (tent > 0) outer = outerParaPergunta(nivel, n);
      const maxDesloc = outer - n;
      if (maxDesloc < 0) continue;
      if (nivel === 'facil' && tent === 0) {
        offRow = Math.floor(maxDesloc / 2);
        offCol = Math.floor(maxDesloc / 2);
      } else {
        offRow = intAleatorio(0, Math.max(0, maxDesloc));
        offCol = intAleatorio(0, Math.max(0, maxDesloc));
      }
      const chave = `${n}|${tipo}|${outer}|${offRow}|${offCol}`;
      if (!usados.has(chave)) {
        usados.add(chave);
        achou = true;
      }
    }

    if (!achou) {
      outer = outerParaPergunta(nivel, n);
      const md = outer - n;
      offRow = intAleatorio(0, Math.max(0, md));
      offCol = intAleatorio(0, Math.max(0, md));
      usados.add(`${n}|${tipo}|${outer}|${offRow}|${offCol}|f`);
    }

    let opcoes: OpcaoMC[];
    if (tipo === 'potencia') {
      const poolPot = nivel === 'dificil' ? BASES_DIFICIL : BASES_FACIL_E_MEDIO;
      opcoes = opcoesPotenciaConjunto(n, poolPot, sementeOp);
    } else if (tipo === 'quantidade') {
      const valores = nivel === 'medio' ? QUADRADOS_TOTAIS_PEQUENO : QUADRADOS_TOTAIS_GRANDE;
      opcoes = opcoesQuantidadeConjunto(n * n, valores, sementeOp);
    } else opcoes = opcoesLado(n, sementeOp);

    lista.push({
      id: lista.length + 1,
      n,
      tipo,
      outer,
      offRow,
      offCol,
      texto,
      opcoes,
      matiz,
    });
  }

  const ordenada = embaralhar(lista);
  return ordenada.map((p, ix) => ({ ...p, id: ix + 1 }));
}

function playSomSucesso() {
  try {
    const ACtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ACtx) return;
    const ctx = new ACtx();
    const sequencia = [523.25, 659.25, 783.99];
    sequencia.forEach((freq, ti) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.07;
      const t0 = ctx.currentTime + ti * 0.11;
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

function textoDica(tipo: TipoPergunta, n: number): string {
  if (tipo === 'potencia') {
    return `Conte quantos quadradinhos há de um lado da figura pintada: esse número é a base. Escreve-se base² (ex.: ${n}²).`;
  }
  if (tipo === 'quantidade') {
    return `Você pode multiplicar o número de quadradinhos na linha de cima pela quantidade de linhas (${n} × ${n} = ${n * n}).`;
  }
  return `Cada lado do quadrado tem a mesma medida — é só contar quadradinhos numa lateral sem “dar a volta” (${n}).`;
}

const CORES_MATIZ = [
  'bg-violet-400/95 dark:bg-violet-500/90',
  'bg-indigo-400/95 dark:bg-indigo-500/90',
  'bg-fuchsia-400/90 dark:bg-fuchsia-500/90',
] as const;

function GradeQuadradoPintado({
  outer,
  n,
  offRow,
  offCol,
  matiz,
}: {
  outer: number;
  n: number;
  offRow: number;
  offCol: number;
  matiz: number;
}) {
  const tonal = CORES_MATIZ[Math.max(0, Math.min(CORES_MATIZ.length - 1, matiz))];
  return (
    <div
      className="mx-auto grid w-full max-w-md items-start gap-px rounded-xl border border-slate-300 bg-slate-300 p-px shadow-inner"
      style={{ gridTemplateColumns: `repeat(${outer}, minmax(0, 1fr))` }}
      role="img"
      aria-label={`Grade ${outer} por ${outer} com um bloco pintado`}
    >
      {Array.from({ length: outer * outer }).map((_, idx) => {
        const row = Math.floor(idx / outer);
        const col = idx % outer;
        const dentro = row >= offRow && row < offRow + n && col >= offCol && col < offCol + n;
        return (
          <div
            key={idx}
            className={`aspect-square min-w-0 w-full rounded-[2px] sm:rounded-[3px] ${dentro ? tonal : 'bg-white dark:bg-card'}`}
          />
        );
      })}
    </div>
  );
}

export function SquarePowerGame() {
  const navegar = useNavigate();
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [lista, setLista] = useState<PerguntaQuadrado[]>([]);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'certo' | 'errado'>('idle');
  const [pontos, setPontos] = useState(0);
  const [mostrarDica, setMostrarDica] = useState(false);

  const pergunta = lista[indice];

  useEffect(() => {
    setEscolha(null);
    setFeedback('idle');
    setMostrarDica(false);
  }, [indice, nivel]);

  const escolherNivel = (n: Nivel) => {
    setNivel(n);
    setLista(montarListaNivel(n));
    setIndice(0);
    setPontos(0);
    setEscolha(null);
    setFeedback('idle');
    setMostrarDica(false);
  };

  const voltarNiveis = () => {
    setNivel(null);
    setLista([]);
    setIndice(0);
    setPontos(0);
    setEscolha(null);
    setFeedback('idle');
    setMostrarDica(false);
  };

  const voltarPainel = () => navegar('/dashboard');

  const confirmar = () => {
    if (!pergunta || feedback === 'certo' || !escolha) return;
    const opcao = pergunta.opcoes.find((o) => o.label === escolha);
    if (opcao?.correta) {
      setFeedback('certo');
      setMostrarDica(false);
      setPontos((p) => p + PONTOS[nivel ?? 'facil']);
      playSomSucesso();
    } else {
      setFeedback('errado');
      setMostrarDica(true);
      playSomErro();
    }
  };

  const proxima = () => {
    if (indice < lista.length - 1) setIndice((i) => i + 1);
  };

  const progressoPercentual = lista.length ? ((indice + 1) / lista.length) * 100 : 0;
  const ultimoAcerto = feedback === 'certo' && indice === lista.length - 1;

  const badge =
    nivel === 'facil' ? 'Fácil' : nivel === 'medio' ? 'Médio' : nivel === 'dificil' ? 'Difícil' : '';

  /* — seleção nível — */
  if (!nivel) {
    return (
      <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-gradient-to-b from-violet-50 via-white to-sky-50/70 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between border-b border-violet-100/80 bg-white/90 px-4 py-3 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-5">
          <button
            type="button"
            onClick={voltarPainel}
            className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors active:bg-violet-100"
            aria-label="Voltar ao painel"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-foreground sm:text-lg">Potências ao quadrado</h1>
          <span className="w-11" />
        </header>

        <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto w-full max-w-3xl">
            <p className="mb-8 text-center text-lg font-medium text-muted-foreground sm:mb-10 sm:text-xl">
              Olhe os quadrados pintados e responda.
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
                    Escolha a potência que combina com o desenho.
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => escolherNivel('medio')}
                className="flex w-full items-center gap-5 rounded-3xl border-2 border-amber-200/90 bg-white p-6 text-left shadow-md transition-transform active:scale-[0.99] md:hover:border-amber-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 sm:h-16 sm:w-16">
                  <Zap className="h-8 w-8 text-amber-700 sm:h-9 sm:w-9" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">Médio</p>
                  <p className="mt-1 text-base leading-snug text-muted-foreground sm:text-lg">
                    Conte os quadradinhos pintados e marque o total.
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => escolherNivel('dificil')}
                className="flex w-full items-center gap-5 rounded-3xl border-2 border-violet-200/90 bg-white p-6 text-left shadow-md transition-transform active:scale-[0.99] md:hover:border-violet-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 sm:h-16 sm:w-16">
                  <Flame className="h-8 w-8 text-violet-600 sm:h-9 sm:w-9" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">Difícil</p>
                  <p className="mt-1 text-base leading-snug text-muted-foreground sm:text-lg">
                    Mais desafio — leia com atenção o que cada pergunta pede.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* — jogo — */
  if (!pergunta) {
    return null;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-gradient-to-b from-violet-50 via-white to-sky-50/70 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between border-b border-violet-100/80 bg-white/90 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={voltarNiveis}
            className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl active:bg-violet-100 sm:h-9 sm:w-9"
            aria-label="Voltar à escolha de nível"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <Zap className="h-4 w-4 text-violet-600" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-foreground sm:text-base">Potências ao quadrado</h1>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">{badge}</p>
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
            <span>Lado da grade grande: {pergunta.outer}</span>
          </div>
          <Progress value={Math.min(100, progressoPercentual)} className="h-2" />
        </div>

        <div className="animate-scale-in space-y-5">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <p className="text-center text-sm font-medium leading-relaxed text-card-foreground sm:text-base">{pergunta.texto}</p>
          </div>

          <GradeQuadradoPintado
            outer={pergunta.outer}
            n={pergunta.n}
            offRow={pergunta.offRow}
            offCol={pergunta.offCol}
            matiz={pergunta.matiz}
          />

          <fieldset className="space-y-3" disabled={feedback === 'certo'}>
            <legend className="sr-only">Escolha uma alternativa</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {pergunta.opcoes.map((op, oi) => (
                <button
                  key={`${oi}-${op.label}`}
                  type="button"
                  onClick={() => {
                    setEscolha(op.label);
                    if (feedback !== 'idle') setFeedback('idle');
                    setMostrarDica(false);
                  }}
                  className={`min-h-12 touch-manipulation rounded-xl border-2 px-3 py-2 text-center text-base font-bold tabular-nums transition-transform active:scale-[0.99] sm:min-h-14 sm:text-lg ${
                    escolha === op.label
                      ? 'border-violet-500 bg-violet-100 text-violet-950 ring-2 ring-violet-400/40'
                      : 'border-border bg-muted/40 text-foreground'
                  } ${feedback === 'certo' ? 'opacity-80' : ''}`}
                  aria-pressed={escolha === op.label}
                >
                  {op.label.includes('²') ? (
                    <>
                      <span className="tabular-nums">{op.label.slice(0, -1)}</span>
                      <sup className="ml-px text-[0.65em]">2</sup>
                    </>
                  ) : (
                    op.label
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={confirmar}
              disabled={feedback === 'certo' || !escolha}
              className="min-h-11 rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.99] disabled:opacity-45"
            >
              Confirmar
            </button>
          </div>

          {feedback === 'certo' && (
            <div className="animate-scale-in rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center" role="status">
              <Check className="mx-auto h-8 w-8 text-emerald-600" strokeWidth={3} />
              <p className="mt-2 text-lg font-bold text-emerald-800">Certo!</p>
              <p className="text-sm text-emerald-800/90">
                +{PONTOS[nivel ?? 'facil']} pts —
                {pergunta.tipo === 'potencia'
                  ? ` potência ${pergunta.n}² (${pergunta.n} × ${pergunta.n} = ${pergunta.n * pergunta.n}).`
                  : pergunta.tipo === 'quantidade'
                    ? ` no total há ${pergunta.n * pergunta.n} quadradinhos (${pergunta.n}²).`
                    : ` cada lado tem ${pergunta.n} quadradinhos (${pergunta.n}² = ${pergunta.n * pergunta.n} no quadrado inteiro).`}
              </p>
              {ultimoAcerto ? (
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
                <button type="button" onClick={proxima} className="mt-4 min-h-11 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white sm:w-auto sm:px-10">
                  Próxima
                </button>
              )}
            </div>
          )}

          {feedback === 'errado' && (
            <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-center" role="alert">
              <X className="mx-auto h-7 w-7 text-orange-600" strokeWidth={3} />
              <p className="mt-2 font-bold text-orange-900">Ops — tente de novo</p>
              <p className="text-sm text-orange-900/85">Escolha outra opção e confirme.</p>
            </div>
          )}

          {mostrarDica && feedback === 'errado' && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-center text-sm text-sky-950">
              <strong>Dica:</strong> {textoDica(pergunta.tipo, pergunta.n)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
