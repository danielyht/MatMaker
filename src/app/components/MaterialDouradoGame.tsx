import { Fragment, useEffect, useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Check, X, Sparkles, Layers3 } from 'lucide-react';

interface PerguntaMD {
  id: number;
  a: number;
  b: number;
  op: '+' | '-';
  resultado: number;
}

const TOTAL_PERGUNTAS = 8;
const PONTOS = 45;
type BlocoTipo = 'c' | 'd' | 'u';
type Zona = 'a' | 'b';

interface BlocoMontado {
  id: number;
  tipo: BlocoTipo;
}

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

function decompor(n: number) {
  return {
    c: Math.floor(n / 100),
    d: Math.floor((n % 100) / 10),
    u: n % 10,
  };
}

function contar(blocos: BlocoMontado[]) {
  const unidades = blocos.filter((b) => b.tipo === 'u');
  return {
    c: blocos.filter((b) => b.tipo === 'c').length,
    d: blocos.filter((b) => b.tipo === 'd').length,
    u: unidades.length,
  };
}

/** Operandos e resultado até 150; inclui contas só com números &lt; 100 e contas com algum valor ≥ 100. */
function montarPerguntas(): PerguntaMD[] {
  const vistos = new Set<string>();
  const lista: PerguntaMD[] = [];

  const maxTriplo = (a: number, b: number, r: number) => Math.max(a, b, r);
  const ehPequena = (a: number, b: number, r: number) => maxTriplo(a, b, r) < 100;
  const ehGrande = (a: number, b: number, r: number) => maxTriplo(a, b, r) >= 100;

  const tentarPequena = (): PerguntaMD | null => {
    const op: '+' | '-' = Math.random() < 0.52 ? '+' : '-';
    if (op === '+') {
      const a = intAleatorio(0, 99);
      const bMax = Math.min(99 - a, 99);
      if (bMax < 0) return null;
      const b = intAleatorio(0, bMax);
      const resultado = a + b;
      if (!ehPequena(a, b, resultado)) return null;
      return { id: 0, a, b, op, resultado };
    }
    const a = intAleatorio(1, 99);
    const b = intAleatorio(0, a);
    const resultado = a - b;
    if (!ehPequena(a, b, resultado)) return null;
    return { id: 0, a, b, op, resultado };
  };

  const tentarGrande = (): PerguntaMD | null => {
    const op: '+' | '-' = Math.random() < 0.52 ? '+' : '-';
    if (op === '+') {
      const resultado = intAleatorio(100, 150);
      const aMin = Math.max(0, resultado - 150);
      const aMax = Math.min(150, resultado);
      if (aMin > aMax) return null;
      const a = intAleatorio(aMin, aMax);
      const b = resultado - a;
      if (!ehGrande(a, b, resultado)) return null;
      return { id: 0, a, b, op: '+', resultado };
    }
    const a = intAleatorio(100, 150);
    const bHi = Math.max(0, a - 100);
    const b = intAleatorio(0, bHi);
    const resultado = a - b;
    if (!ehGrande(a, b, resultado) || resultado > 150) return null;
    return { id: 0, a, b, op: '-', resultado };
  };

  const tentarQualquer = (): PerguntaMD | null => {
    const op: '+' | '-' = Math.random() < 0.52 ? '+' : '-';
    if (op === '+') {
      const a = intAleatorio(0, 150);
      const b = intAleatorio(0, Math.min(150, 150 - a));
      const resultado = a + b;
      if (resultado > 150) return null;
      return { id: 0, a, b, op, resultado };
    }
    const a = intAleatorio(1, 150);
    const b = intAleatorio(0, a);
    const resultado = a - b;
    if (resultado < 0 || resultado > 150) return null;
    return { id: 0, a, b, op, resultado };
  };

  const push = (q: PerguntaMD): boolean => {
    const k = `${q.a}${q.op}${q.b}=${q.resultado}`;
    if (vistos.has(k)) return false;
    vistos.add(k);
    lista.push({ ...q, id: lista.length + 1 });
    return true;
  };

  const alvoPequenas = Math.ceil(TOTAL_PERGUNTAS * 0.4);
  const alvoGrandes = Math.ceil(TOTAL_PERGUNTAS * 0.4);

  let guard = 0;
  while (lista.filter((q) => ehPequena(q.a, q.b, q.resultado)).length < alvoPequenas && guard < 400) {
    guard += 1;
    let q: PerguntaMD | null = null;
    for (let i = 0; i < 50; i++) {
      q = tentarPequena();
      if (q) break;
    }
    if (!q) q = tentarQualquer();
    if (q && ehPequena(q.a, q.b, q.resultado)) push(q);
  }

  guard = 0;
  while (lista.filter((q) => ehGrande(q.a, q.b, q.resultado)).length < alvoGrandes && lista.length < TOTAL_PERGUNTAS && guard < 400) {
    guard += 1;
    let q: PerguntaMD | null = null;
    for (let i = 0; i < 50; i++) {
      q = tentarGrande();
      if (q) break;
    }
    if (!q) q = tentarQualquer();
    if (q && ehGrande(q.a, q.b, q.resultado)) push(q);
  }

  guard = 0;
  while (lista.length < TOTAL_PERGUNTAS && guard < 500) {
    guard += 1;
    let q = tentarQualquer();
    for (let i = 0; i < 30 && (!q || vistos.has(`${q.a}${q.op}${q.b}=${q.resultado}`)); i++) {
      q = tentarQualquer();
    }
    if (q) push(q);
  }

  return embaralhar(lista).map((q, i) => ({ ...q, id: i + 1 }));
}

function playSomSucesso() {
  try {
    const ACtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ACtx) return;
    const ctx = new ACtx();
    const notas = [523.25, 659.25, 783.99];
    notas.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.value = 0.07;
      const t0 = ctx.currentTime + i * 0.11;
      o.start(t0);
      o.stop(t0 + 0.14);
    });
  } catch {
    /* sem áudio */
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
    o.frequency.value = 170;
    g.gain.value = 0.09;
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.22);
  } catch {
    /* sem áudio */
  }
}

function BlocoUnidade({ className = '' }: { className?: string }) {
  return (
    <div className={`grid border border-emerald-700/50 bg-emerald-200 p-px ${className}`}>
      <div className="h-2 w-2 border border-emerald-700/30 bg-emerald-400 sm:h-2.5 sm:w-2.5" />
    </div>
  );
}

function BlocoDezena({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-rows-10 gap-px border border-orange-700/50 bg-orange-200 p-px ${className}`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-2 w-2 border border-orange-700/30 bg-orange-300 sm:h-2.5 sm:w-2.5" />
      ))}
    </div>
  );
}

function BlocoCentena({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-10 gap-px border border-amber-700/50 bg-amber-300 p-px ${className}`}>
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i} className="h-2 w-2 border border-amber-700/25 bg-amber-100 sm:h-2.5 sm:w-2.5" />
      ))}
    </div>
  );
}

function BlocoVisual({ tipo, className = '' }: { tipo: BlocoTipo; className?: string }) {
  if (tipo === 'c') return <BlocoCentena className={className} />;
  if (tipo === 'd') return <BlocoDezena className={className} />;
  return <BlocoUnidade className={className} />;
}

type BlocoChunk = { kind: 'single'; bloco: BlocoMontado } | { kind: 'units'; items: BlocoMontado[] };

/** Agrupa unidades consecutivas (mesma ordem) para desenhar colunas de até 10. */
function agruparBlocosEmChunks(blocos: BlocoMontado[]): BlocoChunk[] {
  const chunks: BlocoChunk[] = [];
  let i = 0;
  while (i < blocos.length) {
    const b = blocos[i];
    if (b.tipo === 'u') {
      const items: BlocoMontado[] = [];
      while (i < blocos.length && blocos[i].tipo === 'u') {
        items.push(blocos[i]);
        i++;
      }
      chunks.push({ kind: 'units', items });
    } else {
      chunks.push({ kind: 'single', bloco: b });
      i++;
    }
  }
  return chunks;
}

/** Até 10 itens por coluna (material dourado). */
function chunkEmDez<T>(arr: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += 10) out.push(arr.slice(i, i + 10));
  return out;
}

/** Área rolável da coluna: desce sozinha quando entram mais blocos. */
function AreaMontagemRolavel({
  blocos,
  onRemove,
  disabledRemove,
}: {
  blocos: BlocoMontado[];
  onRemove: (id: number) => void;
  disabledRemove: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const idsKey = blocos.map((b) => b.id).join(',');

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [idsKey]);

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-3.5">
      <MontagemEmOrdem blocos={blocos} disabledRemove={disabledRemove} onRemove={onRemove} />
    </div>
  );
}

/** Blocos na ordem em que foram colocados; unidades consecutivas formam colunas de 10 (com pequeno espaço). */
function MontagemEmOrdem({
  blocos,
  onRemove,
  disabledRemove,
}: {
  blocos: BlocoMontado[];
  onRemove: (id: number) => void;
  disabledRemove: boolean;
}) {
  if (blocos.length === 0) {
    return (
      <div
        className="min-h-[clamp(3.25rem,14dvh,5.5rem)] rounded-xl border-2 border-dashed border-sky-400/30 bg-white/35"
        aria-hidden
      />
    );
  }

  const chunks = agruparBlocosEmChunks(blocos);

  return (
    <div className="flex min-h-0 min-w-0 flex-wrap content-start items-start justify-center gap-2 sm:gap-2.5">
      {chunks.map((chunk) => {
        if (chunk.kind === 'single') {
          const b = chunk.bloco;
          const removeCentena = (
            <button
              type="button"
              onClick={() => onRemove(b.id)}
              disabled={disabledRemove}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center border border-sky-600/40 bg-white text-[10px] font-bold leading-none text-sky-900 shadow-sm disabled:opacity-40"
              aria-label="Remover este bloco"
            >
              −
            </button>
          );

          if (b.tipo === 'd' || b.tipo === 'u') {
            const btnClass =
              b.tipo === 'd'
                ? 'flex h-5 min-w-[1.125rem] shrink-0 items-center justify-center rounded border border-orange-700/45 bg-white px-1 text-[10px] font-bold leading-none text-orange-950 shadow-sm disabled:opacity-40'
                : 'flex h-5 min-w-[1.125rem] shrink-0 items-center justify-center rounded border border-emerald-800/45 bg-white px-1 text-[10px] font-bold leading-none text-emerald-950 shadow-sm disabled:opacity-40';
            return (
              <div key={b.id} className="flex shrink-0 items-center gap-0.5">
                <BlocoVisual tipo={b.tipo} />
                <button
                  type="button"
                  onClick={() => onRemove(b.id)}
                  disabled={disabledRemove}
                  className={btnClass}
                  aria-label={b.tipo === 'd' ? 'Remover esta dezena' : 'Remover esta unidade'}
                >
                  −
                </button>
              </div>
            );
          }

          return (
            <div key={b.id} className="flex shrink-0 flex-col items-center gap-1">
              <div className="relative">
                <BlocoVisual tipo={b.tipo} />
                {removeCentena}
              </div>
            </div>
          );
        }

        const { items } = chunk;
        const groupKey = `u-${items[0]?.id ?? 0}-${items.length}`;
        const colunas = chunkEmDez(items);
        return (
          <div key={groupKey} className="flex shrink-0 items-start gap-x-0.5">
            {colunas.map((grupo, colIdx) => (
              <div
                key={`${groupKey}-c${colIdx}`}
                className="grid shrink-0 rounded border border-emerald-700/45 bg-emerald-50/50 p-px"
                style={{
                  gridTemplateColumns: 'max-content max-content',
                  gridTemplateRows: `repeat(${grupo.length}, auto)`,
                  rowGap: '1px',
                  columnGap: '2px',
                  alignItems: 'center',
                }}
              >
                {grupo.map((b) => (
                  <Fragment key={b.id}>
                    <BlocoUnidade />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(b.id);
                      }}
                      disabled={disabledRemove}
                      className="flex size-2.5 shrink-0 items-center justify-center rounded-sm border border-emerald-800/40 bg-white text-[5px] font-bold leading-none text-emerald-950 shadow-sm disabled:opacity-40 sm:size-3 sm:text-[6px]"
                      aria-label="Remover esta unidade"
                    >
                      −
                    </button>
                  </Fragment>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function MaterialDouradoGame() {
  const navegar = useNavigate();
  const [perguntas, setPerguntas] = useState<PerguntaMD[]>([]);
  const [indice, setIndice] = useState(0);
  const [blocosA, setBlocosA] = useState<BlocoMontado[]>([]);
  const [blocosB, setBlocosB] = useState<BlocoMontado[]>([]);
  const [resposta, setResposta] = useState('');
  const [proximoId, setProximoId] = useState(1);
  const [feedback, setFeedback] = useState<'idle' | 'certo' | 'errado'>('idle');
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    setPerguntas(montarPerguntas());
    setIndice(0);
    setBlocosA([]);
    setBlocosB([]);
    setResposta('');
    setProximoId(1);
    setFeedback('idle');
    setPontos(0);
  }, []);

  const pergunta = perguntas[indice];

  useEffect(() => {
    setBlocosA([]);
    setBlocosB([]);
    setResposta('');
    setFeedback('idle');
  }, [indice]);

  if (!pergunta) return null;

  const esperadoA = decompor(pergunta.a);
  const esperadoB = decompor(pergunta.b);

  const atualA = contar(blocosA);
  const atualB = contar(blocosB);

  const ultima = feedback === 'certo' && indice === perguntas.length - 1;

  const setLista = (zona: Zona, fn: (prev: BlocoMontado[]) => BlocoMontado[]) => {
    if (zona === 'a') setBlocosA(fn);
    else setBlocosB(fn);
  };

  const addBloco = (tipo: BlocoTipo, zona: Zona) => {
    const id = proximoId;
    setProximoId((n) => n + 1);
    setLista(zona, (prev) => [...prev, { id, tipo }]);
    if (feedback !== 'idle') setFeedback('idle');
  };

  const removerBlocoPorId = (zona: Zona, id: number) => {
    setLista(zona, (prev) => prev.filter((b) => b.id !== id));
    if (feedback !== 'idle') setFeedback('idle');
  };

  const confirmar = () => {
    const okA = atualA.c === esperadoA.c && atualA.d === esperadoA.d && atualA.u === esperadoA.u;
    const okB = atualB.c === esperadoB.c && atualB.d === esperadoB.d && atualB.u === esperadoB.u;
    const n = Number(String(resposta).trim().replace(',', '.'));
    const okNum = Number.isFinite(n) && Math.round(n) === pergunta.resultado;
    if (okA && okB && okNum) {
      setFeedback('certo');
      setPontos((p) => p + PONTOS);
      playSomSucesso();
    } else {
      setFeedback('errado');
      playSomErro();
    }
  };

  const limparColuna = (zona: Zona) => {
    if (zona === 'a') setBlocosA([]);
    else setBlocosB([]);
    if (feedback !== 'idle') setFeedback('idle');
  };

  const proxima = () => {
    if (indice < perguntas.length - 1) setIndice((i) => i + 1);
  };

  const handleDrop = (e: DragEvent, zona: Zona) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/bloco-tipo');
    const tipo = raw as BlocoTipo;
    if (tipo === 'c' || tipo === 'd' || tipo === 'u') addBloco(tipo, zona);
  };

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-[#C7D5FC]">
      <header className="flex shrink-0 items-center justify-between border-b border-sky-300/40 bg-white/85 px-2 py-1 pt-[max(0.35rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg active:bg-sky-100/80"
            aria-label="Voltar ao painel"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-sky-200/60">
            <Layers3 className="h-3.5 w-3.5 text-sky-800/80" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-foreground sm:text-base">Material dourado</h1>
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">Centena · Dezena · Unidade</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-sky-300/45 bg-white/70 px-2 py-0.5">
          <Sparkles className="h-3 w-3 text-sky-600" />
          <span className="text-xs font-bold tabular-nums text-sky-950/90 sm:text-sm">{pontos} pontos</span>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-2 py-1.5 sm:px-3">
        {/* Conta compacta + nº da pergunta (sem barra de progresso — mais espaço para as colunas) */}
        <div
          className="mb-2 flex shrink-0 items-center justify-between gap-2 rounded-lg border border-sky-300/40 bg-white/80 px-3 py-1.5 shadow-sm sm:px-3.5"
          role="group"
          aria-label={`Conta: ${pergunta.a} ${pergunta.op === '+' ? 'mais' : 'menos'} ${pergunta.b}`}
        >
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 leading-none">
            <span className="text-lg font-bold tabular-nums text-sky-950 sm:text-xl">{pergunta.a}</span>
            <span className="text-base font-bold text-primary sm:text-lg" aria-hidden="true">
              {pergunta.op === '+' ? '+' : '−'}
            </span>
            <span className="text-lg font-bold tabular-nums text-sky-950 sm:text-xl">{pergunta.b}</span>
          </div>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-sky-800/55 sm:text-xs">
            {indice + 1}/{perguntas.length}
          </span>
        </div>

        <p className="mb-1.5 shrink-0 text-center text-sm leading-snug text-muted-foreground sm:text-sm">
          Arraste centena, dezena ou unidade para cada coluna.
        </p>

        {/* Faixa única: blocos + campo Resultado compacto */}
        <div className="mb-1.5 flex shrink-0 flex-wrap items-end justify-center gap-x-3 gap-y-2 border-b border-sky-400/30 pb-2 sm:gap-x-4">
          {(
            [
              ['c', 'Centena'],
              ['d', 'Dezena'],
              ['u', 'Unidade'],
            ] as [BlocoTipo, string][]
          ).map(([tipo, nome]) => (
            <div key={tipo} className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-bold text-foreground sm:text-xs">{nome}</span>
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/bloco-tipo', tipo);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="flex cursor-grab items-center justify-center border-2 border-dashed border-sky-500/40 bg-white/75 p-1.5 shadow-sm active:cursor-grabbing"
                aria-label={`Arrastar ${nome.toLowerCase()} para o primeiro ou segundo número`}
              >
                <BlocoVisual tipo={tipo} />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1 border-l border-sky-400/35 pl-2 sm:pl-3">
            <label htmlFor="md-resposta" className="shrink-0 text-[10px] font-bold text-foreground sm:text-xs">
              Resultado:
            </label>
            <input
              id="md-resposta"
              type="number"
              inputMode="numeric"
              min={0}
              max={150}
              step={1}
              value={resposta}
              onChange={(e) => {
                setResposta(e.target.value);
                if (feedback !== 'idle') setFeedback('idle');
              }}
              disabled={feedback === 'certo'}
              className="h-7 w-[3.75rem] border border-sky-400/50 bg-white/90 px-1 text-center text-xs font-bold tabular-nums text-foreground outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400/30 disabled:opacity-50 sm:h-8 sm:w-[4.25rem] sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-2.5 min-h-0 flex-1 grid grid-cols-2 gap-2.5 sm:gap-3">
          {(
            [
              {
                zona: 'a' as const,
                titulo: 'Primeiro número',
                valorNumero: pergunta.a,
                blocos: blocosA,
              },
              {
                zona: 'b' as const,
                titulo: 'Segundo número',
                valorNumero: pergunta.b,
                blocos: blocosB,
              },
            ] as const
          ).map(({ zona, titulo, valorNumero, blocos }) => {
            return (
              <div
                key={zona}
                role="region"
                aria-label={`Montagem do ${titulo.toLowerCase()}`}
                className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-sky-300/50 bg-white/90 shadow-md ring-1 ring-sky-200/25"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={(e) => handleDrop(e, zona)}
              >
                <div className="shrink-0 space-y-1 border-b border-sky-200/50 bg-gradient-to-b from-white to-sky-50/50 px-3 py-2 sm:py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sky-900/55 sm:text-xs">{titulo}</p>
                      <p className="text-2xl font-bold tabular-nums leading-none text-sky-950 sm:text-3xl">{valorNumero}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        limparColuna(zona);
                      }}
                      disabled={feedback === 'certo'}
                      className="shrink-0 rounded-lg border border-sky-300/60 bg-white/90 px-2 py-1 text-[11px] font-semibold text-sky-900 shadow-sm active:bg-sky-50 disabled:opacity-45 sm:px-2.5 sm:text-xs"
                      aria-label={`Limpar blocos do ${titulo.toLowerCase()}`}
                    >
                      Limpar
                    </button>
                  </div>
                </div>
                <AreaMontagemRolavel
                  blocos={blocos}
                  disabledRemove={feedback === 'certo'}
                  onRemove={(id) => removerBlocoPorId(zona, id)}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-1.5 flex shrink-0 justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
          <button
            type="button"
            onClick={confirmar}
            disabled={feedback === 'certo'}
            className="min-h-10 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow disabled:opacity-45 sm:min-h-11 sm:text-base"
          >
            Confirmar
          </button>
        </div>
      </div>

      {feedback === 'certo' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16 backdrop-blur-[1px] sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center shadow-lg">
            <Check className="mx-auto h-7 w-7 text-emerald-600" strokeWidth={3} />
            <p className="mt-2 text-base font-bold text-emerald-800">Correto!</p>
            <p className="text-xs text-emerald-800/90">+{PONTOS} pontos</p>
            {ultima ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setPerguntas(montarPerguntas());
                    setIndice(0);
                    setBlocosA([]);
                    setBlocosB([]);
                    setResposta('');
                    setProximoId(1);
                    setPontos(0);
                    setFeedback('idle');
                  }}
                  className="min-h-10 rounded-lg border-2 border-primary bg-background px-4 py-2 text-sm font-bold text-primary"
                >
                  Jogar de novo
                </button>
                <button
                  type="button"
                  onClick={() => navegar('/dashboard')}
                  className="min-h-10 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Painel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFeedback('idle');
                  proxima();
                }}
                className="mt-3 min-h-10 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
              >
                Próxima
              </button>
            )}
          </div>
        </div>
      )}

      {feedback === 'errado' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16 backdrop-blur-[1px] sm:items-center sm:p-6"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-center shadow-lg">
            <X className="mx-auto h-6 w-6 text-orange-600" strokeWidth={3} />
            <p className="mt-2 text-sm font-bold text-orange-900">Ainda não</p>
            <button
              type="button"
              onClick={() => setFeedback('idle')}
              className="mt-3 min-h-10 w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
