import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Check, X, Sparkles, Layers3 } from 'lucide-react';
import { Progress } from './ui/progress';

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

function montarPerguntas(): PerguntaMD[] {
  const lista: PerguntaMD[] = [];
  const vistos = new Set<string>();

  while (lista.length < TOTAL_PERGUNTAS) {
    const op: '+' | '-' = Math.random() < 0.55 ? '+' : '-';
    let a = 0;
    let b = 0;
    let resultado = 0;

    if (op === '+') {
      a = intAleatorio(18, 360);
      b = intAleatorio(7, 280);
      resultado = a + b;
      if (resultado > 999) continue;
    } else {
      a = intAleatorio(50, 420);
      b = intAleatorio(8, 320);
      if (b > a) [a, b] = [b, a];
      resultado = a - b;
      if (resultado < 0 || resultado > 999) continue;
    }

    const k = `${a}${op}${b}=${resultado}`;
    if (vistos.has(k)) continue;
    vistos.add(k);

    lista.push({ id: lista.length + 1, a, b, op, resultado });
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
      <div className="h-3 w-3 border border-emerald-700/30 bg-emerald-400" />
    </div>
  );
}

function BlocoDezena({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-rows-10 gap-px border border-orange-700/50 bg-orange-200 p-px ${className}`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-3 w-3 border border-orange-700/30 bg-orange-300" />
      ))}
    </div>
  );
}

function BlocoCentena({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-10 gap-px border border-amber-700/50 bg-amber-300 p-px ${className}`}>
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i} className="h-3 w-3 border border-amber-700/25 bg-amber-100" />
      ))}
    </div>
  );
}

function BlocoVisual({ tipo, className = '' }: { tipo: BlocoTipo; className?: string }) {
  if (tipo === 'c') return <BlocoCentena className={className} />;
  if (tipo === 'd') return <BlocoDezena className={className} />;
  return <BlocoUnidade className={className} />;
}

export function MaterialDouradoGame() {
  const navegar = useNavigate();
  const [perguntas, setPerguntas] = useState<PerguntaMD[]>([]);
  const [indice, setIndice] = useState(0);
  const [blocos, setBlocos] = useState<BlocoMontado[]>([]);
  const [proximoId, setProximoId] = useState(1);
  const [feedback, setFeedback] = useState<'idle' | 'certo' | 'errado'>('idle');
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    setPerguntas(montarPerguntas());
    setIndice(0);
    setBlocos([]);
    setProximoId(1);
    setFeedback('idle');
    setPontos(0);
  }, []);

  const pergunta = perguntas[indice];

  useEffect(() => {
    setBlocos([]);
    setFeedback('idle');
  }, [indice]);

  if (!pergunta) return null;

  const esperado = decompor(pergunta.resultado);
  const unidades = blocos.filter((b) => b.tipo === 'u');
  const atual = {
    c: blocos.filter((b) => b.tipo === 'c').length,
    d: blocos.filter((b) => b.tipo === 'd').length,
    u: unidades.length,
  };
  const progresso = perguntas.length ? ((indice + 1) / perguntas.length) * 100 : 0;
  const ultima = feedback === 'certo' && indice === perguntas.length - 1;

  const addBloco = (tipo: BlocoTipo) => {
    setBlocos((prev) => [...prev, { id: proximoId, tipo }]);
    setProximoId((n) => n + 1);
    if (feedback !== 'idle') {
      setFeedback('idle');
    }
  };

  const removerBloco = (id: number) => {
    setBlocos((prev) => prev.filter((b) => b.id !== id));
    if (feedback !== 'idle') {
      setFeedback('idle');
    }
  };

  const confirmar = () => {
    if (atual.c === esperado.c && atual.d === esperado.d && atual.u === esperado.u) {
      setFeedback('certo');
      setPontos((p) => p + PONTOS);
      playSomSucesso();
    } else {
      setFeedback('errado');
      playSomErro();
    }
  };

  const proxima = () => {
    if (indice < perguntas.length - 1) setIndice((i) => i + 1);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-gradient-to-b from-amber-50 via-white to-orange-50/70 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between border-b border-amber-100/90 bg-white/90 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl active:bg-amber-100 sm:h-9 sm:w-9"
            aria-label="Voltar ao painel"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Layers3 className="h-4 w-4 text-amber-700" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-foreground sm:text-base">Material dourado</h1>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
              Centena · Dezena · Unidade
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
              Pergunta {indice + 1} / {perguntas.length}
            </span>
            <span>Monte os blocos</span>
          </div>
          <Progress value={Math.min(100, progresso)} className="h-2" />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <p className="text-center text-base font-bold text-card-foreground sm:text-lg">
              {pergunta.a} {pergunta.op} {pergunta.b}
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Monte os blocos para representar o resultado.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(
              [
                ['c', 'Centena'],
                ['d', 'Dezena'],
                ['u', 'Unidade'],
              ] as [BlocoTipo, string][]
            ).map(([tipo, nome]) => (
              <div key={tipo} className="rounded-xl border border-border bg-card p-3">
                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">{nome}</p>
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/bloco-tipo', tipo);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => addBloco(tipo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      addBloco(tipo);
                    }
                  }}
                  className="mx-auto flex cursor-grab items-center justify-center rounded-lg border border-dashed border-amber-400/70 bg-amber-50 p-2 active:cursor-grabbing"
                  aria-label={`Arrastar bloco de ${nome.toLowerCase()}`}
                >
                  <BlocoVisual tipo={tipo} />
                </div>
              </div>
            ))}
          </div>

          <div
            className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const tipo = e.dataTransfer.getData('text/bloco-tipo') as BlocoTipo;
              if (tipo === 'c' || tipo === 'd' || tipo === 'u') addBloco(tipo);
            }}
          >
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-amber-900/80">
              Arraste os blocos para montar
            </p>
            <p className="text-center text-xs text-amber-900/75">
              Centenas: <strong>{atual.c}</strong> · Dezenas: <strong>{atual.d}</strong> · Unidades: <strong>{atual.u}</strong>
            </p>
            <div className="space-y-3 rounded-xl border border-dashed border-amber-300 bg-white/70 p-3">
              {blocos.length === 0 ? (
                <span className="text-xs text-muted-foreground">Solte blocos aqui.</span>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900/70">Centenas</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const alvo = blocos.findLast((b) => b.tipo === 'c');
                          if (alvo) removerBloco(alvo.id);
                        }}
                        className="h-7 min-w-7 rounded border border-amber-300 bg-white px-2 text-xs font-bold text-amber-900 disabled:opacity-40"
                        disabled={atual.c === 0}
                      >
                        -
                      </button>
                      <div
                        className="inline-grid border border-amber-700/40 bg-amber-200"
                        style={{
                          gridTemplateRows: 'repeat(10, minmax(0, max-content))',
                          gridAutoFlow: 'column',
                        }}
                      >
                        {Array.from({ length: atual.c * 100 }).map((_, i) => (
                          <div key={i} className="h-3 w-3 border border-amber-700/25 bg-amber-100" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900/70">Dezenas</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const alvo = blocos.findLast((b) => b.tipo === 'd');
                          if (alvo) removerBloco(alvo.id);
                        }}
                        className="h-7 min-w-7 rounded border border-orange-300 bg-white px-2 text-xs font-bold text-orange-900 disabled:opacity-40"
                        disabled={atual.d === 0}
                      >
                        -
                      </button>
                      <div
                        className="inline-grid border border-orange-700/40 bg-orange-200"
                        style={{
                          gridTemplateRows: 'repeat(10, minmax(0, max-content))',
                          gridAutoFlow: 'column',
                        }}
                      >
                        {Array.from({ length: atual.d * 10 }).map((_, i) => (
                          <div key={i} className="h-3 w-3 border border-orange-700/25 bg-orange-300" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900/70">Unidades</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const alvo = blocos.findLast((b) => b.tipo === 'u');
                          if (alvo) removerBloco(alvo.id);
                        }}
                        className="h-7 min-w-7 rounded border border-emerald-300 bg-white px-2 text-xs font-bold text-emerald-900 disabled:opacity-40"
                        disabled={atual.u === 0}
                      >
                        -
                      </button>
                      <div
                        className="inline-grid border border-emerald-700/40 bg-emerald-100"
                        style={{
                          gridTemplateRows: 'repeat(10, minmax(0, max-content))',
                          gridAutoFlow: 'column',
                        }}
                      >
                        {Array.from({ length: atual.u }).map((_, i) => (
                          <div key={i} className="h-3 w-3 border border-emerald-700/30 bg-emerald-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={confirmar}
              disabled={feedback === 'certo'}
              className="min-h-11 rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground shadow-md disabled:opacity-45"
            >
              Confirmar montagem
            </button>
            <button
              type="button"
              onClick={() => {
                setBlocos([]);
                setFeedback('idle');
              }}
              disabled={feedback === 'certo'}
              className="min-h-11 rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-semibold disabled:opacity-45"
            >
              Limpar
            </button>
          </div>

          {feedback === 'certo' && (
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center" role="status">
              <Check className="mx-auto h-8 w-8 text-emerald-600" strokeWidth={3} />
              <p className="mt-2 text-lg font-bold text-emerald-800">Correto!</p>
              <p className="text-sm text-emerald-800/90">+{PONTOS} pontos</p>
              {ultima ? (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setPerguntas(montarPerguntas());
                      setIndice(0);
                      setBlocos([]);
                      setProximoId(1);
                      setPontos(0);
                    }}
                    className="min-h-11 rounded-xl border-2 border-primary bg-background px-6 py-2.5 text-sm font-bold text-primary"
                  >
                    Jogar de novo
                  </button>
                  <button
                    type="button"
                    onClick={() => navegar('/dashboard')}
                    className="min-h-11 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white"
                  >
                    Voltar ao painel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={proxima}
                  className="mt-4 min-h-11 rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white"
                >
                  Próxima pergunta
                </button>
              )}
            </div>
          )}

          {feedback === 'errado' && (
            <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-center" role="alert">
              <X className="mx-auto h-7 w-7 text-orange-600" strokeWidth={3} />
              <p className="mt-2 font-bold text-orange-900">Ainda não</p>
              <p className="text-sm text-orange-900/85">Revise centenas, dezenas e unidades.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
