import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Check, X, Sparkles, Percent, Leaf, Flame } from 'lucide-react';
import { Progress } from './ui/progress';

type Nivel = 'facil' | 'medio' | 'dificil';

const PONTOS = { facil: 35, medio: 45, dificil: 55 } as const;

const PARTES = 100;
const COLS = 10;
/** Número de perguntas por nível em todos os modos. */
const FASES_POR_NIVEL = 15;

/** Fácil: percentagens “redondas”. */
const POOL_FACIL = [10, 25, 50, 75];

/** Médio: múltiplos de 5 (exceto 0 e 100 na escolha). */
const POOL_MEDIO = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

/** Difícil: percentagens que não caem só no tabuado do 5. */
const POOL_DIFICIL_IMPAR = [11, 13, 17, 19, 23, 27, 31, 33, 37, 41, 43, 47];

interface OpcaoMC {
  label: string;
  correta: boolean;
}

type ModoPergunta = 'pintado' | 'branco' | 'duas_cores';

interface PerguntaPercent {
  id: number;
  texto: string;
  respostaCorreta: number;
  opcoes: OpcaoMC[];
  modo: ModoPergunta;
  /** Índices 0..99 pintados de vermelho (uma cor). */
  indicesVermelho: Set<number>;
  indicesAzul: Set<number>;
}

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

function rotuloPct(n: number) {
  return `${n}%`;
}

function opcoesPercent(correto: number, candidatos: number[], sementeOp: string): OpcaoMC[] {
  const outros = candidatos.filter((c) => c !== correto);
  let tres = embaralharComSemente(outros, sementeOp).slice(0, 3);
  let extra = 1;
  while (tres.length < 3 && extra < 100) {
    const x = correto + (tres.length % 2 ? extra : -extra);
    if (x >= 1 && x <= 99 && x !== correto && !tres.includes(x)) tres.push(x);
    extra++;
  }
  const valores = embaralharComSemente([correto, ...tres.slice(0, 3)], `${sementeOp}|pct`);
  return valores.slice(0, 4).map((v) => ({
    label: rotuloPct(v),
    correta: v === correto,
  }));
}

function indicesUmaCor(pct: number, semente: string): Set<number> {
  const idx = [...Array(PARTES).keys()];
  const ord = embaralharComSemente(idx, `${semente}|p`);
  return new Set(ord.slice(0, Math.min(pct, PARTES)));
}

function indicesDuasCores(r: number, b: number, semente: string): { vermelho: Set<number>; azul: Set<number> } {
  const idx = embaralharComSemente([...Array(PARTES).keys()], `${semente}|2c`);
  const rv = Math.min(r, PARTES);
  const bv = Math.min(b, PARTES - rv);
  const vermelho = new Set(idx.slice(0, rv));
  const azul = new Set(idx.slice(rv, rv + bv));
  return { vermelho, azul };
}

function montarListaNivel(nivel: Nivel): PerguntaPercent[] {
  const lista: PerguntaPercent[] = [];

  if (nivel === 'facil') {
    const percents = embaralhar(
      Array.from({ length: FASES_POR_NIVEL }, (_, i) => POOL_FACIL[i % POOL_FACIL.length]),
    );
    percents.forEach((pct, i) => {
      const semente = `facil|${i}|${pct}`;
      lista.push({
        id: i + 1,
        texto: 'Que porcentagem da grade está pintada de vermelho?',
        respostaCorreta: pct,
        modo: 'pintado',
        indicesVermelho: indicesUmaCor(pct, semente),
        indicesAzul: new Set(),
        opcoes: opcoesPercent(pct, POOL_FACIL, semente),
      });
    });
  } else if (nivel === 'medio') {
    const percents = embaralhar([...POOL_MEDIO]).slice(0, FASES_POR_NIVEL);
    percents.forEach((pct, i) => {
      const semente = `medio|${i}|${pct}`;
      const emBranco = i % 2 === 1;
      const correta = emBranco ? PARTES - pct : pct;
      lista.push({
        id: i + 1,
        texto: emBranco
          ? 'Que porcentagem da grade está em branco (não pintada)?'
          : 'Que porcentagem da grade está pintada de vermelho?',
        respostaCorreta: correta,
        modo: emBranco ? 'branco' : 'pintado',
        indicesVermelho: indicesUmaCor(pct, semente),
        indicesAzul: new Set(),
        opcoes: opcoesPercent(correta, POOL_MEDIO, semente),
      });
    });
  } else {
    /** Pares vermelho+azul + ímpares só vermelho = 15 perguntas. */
    const pares: [number, number][] = [
      [20, 15],
      [25, 10],
      [17, 13],
      [12, 18],
      [22, 8],
      [14, 21],
      [19, 16],
      [11, 26],
      [16, 14],
    ];
    const odds = embaralhar([...POOL_DIFICIL_IMPAR]).slice(0, FASES_POR_NIVEL - pares.length);

    pares.forEach(([r, b], i) => {
      const semente = `dif|dc|${i}|${r}|${b}`;
      const total = r + b;
      const { vermelho, azul } = indicesDuasCores(r, b, semente);
      const candDuas = [
        ...POOL_MEDIO,
        r,
        b,
        total - 5,
        total + 5,
        total - 10,
        total + 10,
      ].filter((x) => x >= 1 && x <= 99);
      lista.push({
        id: 0,
        texto: 'Vermelho e azul ocupam partes diferentes da grade. Qual é a porcentagem pintada no total?',
        respostaCorreta: total,
        modo: 'duas_cores',
        indicesVermelho: vermelho,
        indicesAzul: azul,
        opcoes: opcoesPercent(total, [...new Set(candDuas)], semente),
      });
    });

    odds.forEach((pct, i) => {
      const semente = `dif|imp|${i}|${pct}`;
      lista.push({
        id: 0,
        texto: 'Que porcentagem da grade está pintada de vermelho?',
        respostaCorreta: pct,
        modo: 'pintado',
        indicesVermelho: indicesUmaCor(pct, semente),
        indicesAzul: new Set(),
        opcoes: opcoesPercent(pct, [...POOL_DIFICIL_IMPAR, ...POOL_MEDIO.slice(0, 12)], semente),
      });
    });
  }

  return embaralhar(lista).map((p, ix) => ({ ...p, id: ix + 1 }));
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

function textoDica(modo: ModoPergunta, correta: number, pintado: number): string {
  if (modo === 'duas_cores') {
    return 'Some as duas partes: cada quadradinho pintado é 1% da grade inteira (100 quadradinhos).';
  }
  if (modo === 'branco') {
    return `Está pintado ${pintado}% em vermelho; em branco são ${PARTES} − ${pintado} = ${correta}%.`;
  }
  return `Conte por linhas ou lembre: cada quadradinho vale 1%, são ${PARTES} no total.`;
}

function GradeCemPartes({
  vermelho,
  azul,
}: {
  vermelho: Set<number>;
  azul: Set<number>;
}) {
  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-500" aria-hidden />
          Vermelho
        </span>
        {azul.size > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-sky-500" aria-hidden />
            Azul
          </span>
        )}
      </div>
      <div
        className="mx-auto grid w-full max-w-sm gap-x-1 gap-y-px sm:max-w-md"
        style={{
          gridTemplateColumns: 'minmax(1.1rem, auto) minmax(0, 1fr)',
          gridTemplateRows: 'auto minmax(0, 1fr)',
        }}
      >
        <span className="min-w-[1.1rem] shrink-0" aria-hidden />
        <div
          className="grid gap-px pb-0.5"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          aria-hidden
        >
          {Array.from({ length: COLS }, (_, c) => (
            <div
              key={c}
              className="text-center text-[10px] font-semibold tabular-nums text-muted-foreground sm:text-[11px]"
            >
              {c + 1}
            </div>
          ))}
        </div>
        <div
          className="grid gap-px pr-0.5"
          style={{ gridTemplateRows: `repeat(${COLS}, minmax(0, 1fr))` }}
          aria-hidden
        >
          {Array.from({ length: COLS }, (_, r) => (
            <div
              key={r}
              className="flex items-center justify-end text-[10px] font-semibold tabular-nums text-muted-foreground sm:text-[11px]"
            >
              {r + 1}
            </div>
          ))}
        </div>
        <div
          className="grid aspect-square w-full gap-px border border-black bg-black"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          role="img"
          aria-label="Grade de 100 quadradinhos"
        >
          {Array.from({ length: PARTES }).map((_, idx) => {
            const v = vermelho.has(idx);
            const a = azul.has(idx);
            let bg = 'bg-white dark:bg-card';
            if (v) bg = 'bg-red-500';
            else if (a) bg = 'bg-sky-500';
            return <div key={idx} className={`aspect-square min-w-0 w-full ${bg}`} />;
          })}
        </div>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">100 quadradinhos = 100%</p>
    </div>
  );
}

export function PercentGame() {
  const navegar = useNavigate();
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [lista, setLista] = useState<PerguntaPercent[]>([]);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'certo' | 'errado'>('idle');
  const [pontos, setPontos] = useState(0);
  const [mostrarDica, setMostrarDica] = useState(false);

  const pergunta = lista[indice];
  const pintadoVermelho = pergunta ? pergunta.indicesVermelho.size : 0;

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

  if (!nivel) {
    return (
      <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#C7D5FC] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between border-b border-sky-100/80 bg-white/90 px-4 py-3 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-5">
          <button
            type="button"
            onClick={voltarPainel}
            className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors active:bg-sky-100"
            aria-label="Voltar ao painel"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-foreground sm:text-lg">Porcentagens</h1>
          <span className="w-11" />
        </header>

        <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto w-full max-w-3xl">
            <p className="mb-8 text-center text-lg font-medium text-muted-foreground sm:mb-10 sm:text-xl">
              Grade de 100 partes — cada quadradinho vale 1%
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
                    Percentagens fáceis de ler na figura.
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => escolherNivel('medio')}
                className="flex w-full items-center gap-5 rounded-3xl border-2 border-amber-200/90 bg-white p-6 text-left shadow-md transition-transform active:scale-[0.99] md:hover:border-amber-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 sm:h-16 sm:w-16">
                  <Percent className="h-8 w-8 text-amber-700 sm:h-9 sm:w-9" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">Médio</p>
                  <p className="mt-1 text-base leading-snug text-muted-foreground sm:text-lg">
                    Quanto falta?
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => escolherNivel('dificil')}
                className="flex w-full items-center gap-5 rounded-3xl border-2 border-teal-200/90 bg-white p-6 text-left shadow-md transition-transform active:scale-[0.99] md:hover:border-teal-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 sm:h-16 sm:w-16">
                  <Flame className="h-8 w-8 text-teal-600 sm:h-9 sm:w-9" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">Difícil</p>
                  <p className="mt-1 text-base leading-snug text-muted-foreground sm:text-lg">
                    Duas cores.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pergunta) return null;

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#C7D5FC] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between border-b border-sky-100/80 bg-white/90 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={voltarNiveis}
            className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl active:bg-sky-100 sm:h-9 sm:w-9"
            aria-label="Voltar à escolha de nível"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100">
            <Percent className="h-4 w-4 text-teal-700" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-foreground sm:text-base">Porcentagens</h1>
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
            <span>100 = grade inteira</span>
          </div>
          <Progress value={Math.min(100, progressoPercentual)} className="h-2" />
        </div>

        <div className="animate-scale-in space-y-5">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <p className="text-center text-sm font-medium leading-relaxed text-card-foreground sm:text-base">{pergunta.texto}</p>
          </div>

          <GradeCemPartes vermelho={pergunta.indicesVermelho} azul={pergunta.indicesAzul} />

          <fieldset className="space-y-3" disabled={feedback === 'certo'}>
            <legend className="sr-only">Escolha uma porcentagem</legend>
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
                      ? 'border-teal-500 bg-teal-100 text-teal-950 ring-2 ring-teal-400/40'
                      : 'border-border bg-muted/40 text-foreground'
                  } ${feedback === 'certo' ? 'opacity-80' : ''}`}
                  aria-pressed={escolha === op.label}
                >
                  {op.label}
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
                +{PONTOS[nivel ?? 'facil']} pts — resposta: {pergunta.respostaCorreta}% da grade.
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
              <strong>Dica:</strong> {textoDica(pergunta.modo, pergunta.respostaCorreta, pintadoVermelho)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
