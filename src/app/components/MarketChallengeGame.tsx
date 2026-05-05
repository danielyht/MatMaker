import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Check, X, Sparkles, ShoppingBag } from 'lucide-react';
import { Progress } from './ui/progress';

const PONTOS_POR_ACERTO = 50;
const TOTAL_PERGUNTAS = 12;

type NivelP = 'facil' | 'medio' | 'dificil';

interface OpcaoMC {
  label: string;
  correta: boolean;
}

interface PerguntaMercado {
  id: number;
  /** Só para leitura rápida no canto da tela */
  nivel: NivelP;
  texto: string;
  opcoes: OpcaoMC[];
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

/** Centavos (inteiro). Ex.: brlFmt(12345) → "R$ 123,45" */
function brlFmt(cents: number): string {
  if (cents <= 0) return 'R$ 0,00';
  const reais = Math.floor(cents / 100);
  const c = cents % 100;
  const part = `${reais.toLocaleString('pt-BR')},${String(c).padStart(2, '0')}`;
  return `R$ ${part}`;
}

/** Aleatório em centavos: entre minReais×100 e maxReais×100, com centavos “de loja”. */
function precoEmCentavos(minReais: number, maxReais: number): number {
  const reais = intAleatorio(minReais, maxReais);
  const centExtras = embaralhar([0, 10, 19, 25, 45, 50, 79, 90, 99, intAleatorio(0, 99)])[0];
  return reais * 100 + Math.min(99, Math.max(0, centExtras));
}

function pctDe(cents: number, pct: number) {
  return Math.round((cents * pct) / 100);
}

/** Alternativas em reais únicas por valor em centavos */
function opcoesReaisCentavos(correto: number): OpcaoMC[] {
  const erradas = new Set<number>();
  for (const delta of [-1, 1, -10, 10, -25, 25, -89, 89, -199, 199, -349, 349, -577, 577]) {
    const x = correto + delta;
    if (x > 0 && x !== correto) erradas.add(x);
  }
  while (erradas.size < 9) erradas.add(Math.max(49, correto + intAleatorio(-750, 750)));
  const tres = embaralhar([...erradas])
    .filter((x) => Math.abs(x - correto) > 14)
    .slice(0, 12);
  const escolhem = new Set<number>([correto]);
  for (const x of tres) {
    if (escolhem.size >= 4) break;
    if (!escolhem.has(x)) escolhem.add(x);
  }
  let extra = 1;
  while (escolhem.size < 4) {
    const x = correto + extra * intAleatorio(-50, 50);
    if (x > 0 && !escolhem.has(x)) escolhem.add(x);
    extra++;
  }
  const numeros = embaralhar([...escolhem]).slice(0, 4);
  return numeros.map((v) => ({
    label: brlFmt(v),
    correta: v === correto,
  }));
}

function opcoesQuantidade(correto: number): OpcaoMC[] {
  const err = new Set<number>();
  for (let d = 1; d <= 15; d++) {
    err.add(correto + d);
    if (correto - d >= 1) err.add(correto - d);
  }
  err.delete(correto);
  const tres = embaralhar([...err])
    .filter((x) => x > 0)
    .slice(0, 3);
  return embaralhar([correto, ...tres]).slice(0, 4).map((v) => ({
    label: `${v} un.`,
    correta: v === correto,
  }));
}

/** Primeira entrada de `labels` = correta após shuffle */
function opcoesTexto(labelsCorretaPrimeiro: string[]): OpcaoMC[] {
  return embaralhar(
    labelsCorretaPrimeiro.map((label, i) => ({
      label,
      correta: i === 0,
    })),
  );
}

/** Constrói um banco maior e mistura antes de tirar TOTAL_PERGUNTAS */
function montarDesafio(): PerguntaMercado[] {
  const pool: Omit<PerguntaMercado, 'id'>[] = [];

  /* ——— FÁCIL ——— */
  {
    const uni = precoEmCentavos(1, 4);
    const q = intAleatorio(3, 8);
    const tot = uni * q;
    pool.push({
      nivel: 'facil',
      texto: `Cada banana custa ${brlFmt(uni)}. Quanto custam ${q} bananas?`,
      opcoes: opcoesReaisCentavos(tot),
    });
  }

  {
    const p = precoEmCentavos(2, 9);
    const n = intAleatorio(2, 5);
    const tot = p * n;
    pool.push({
      nivel: 'facil',
      texto: `Sabonete custa ${brlFmt(p)} a unidade. ${n} unidades ficam por quanto?`,
      opcoes: opcoesReaisCentavos(tot),
    });
  }

  /* ——— MÉDIO ——— */
  {
    const base = precoEmCentavos(45, 150);
    const pct = embaralhar([10, 12, 15, 18, 20])[0];
    const final = Math.max(50, base - pctDe(base, pct));
    pool.push({
      nivel: 'medio',
      texto: `Uma louça está por ${brlFmt(base)} com promoção de ${pct}% só hoje. Qual o preço a pagar?`,
      opcoes: opcoesReaisCentavos(final),
    });
  }

  {
    const ovo = intAleatorio(45, 229);
    const nO = intAleatorio(6, 14);
    const pao = precoEmCentavos(5, 18);
    const tot = ovo * nO + pao;
    pool.push({
      nivel: 'medio',
      texto: `Cada ovo custa ${brlFmt(ovo)}; você leva ${nO} ovos e um pão por ${brlFmt(pao)}. Total a pagar?`,
      opcoes: opcoesReaisCentavos(tot),
    });
  }

  {
    const unit = precoEmCentavos(3, 12);
    const din = unit * intAleatorio(6, 14) + intAleatorio(0, unit - 1);
    const maxq = Math.floor(din / unit);
    pool.push({
      nivel: 'medio',
      texto: `Você tem ${brlFmt(din)}. Cada caixa de leite custa ${brlFmt(unit)}. Quantas caixas dá para comprar no máximo (sem dividir a caixa)?`,
      opcoes: opcoesQuantidade(maxq),
    });
  }

  {
    const a = precoEmCentavos(10, 45);
    const b = precoEmCentavos(5, 25);
    const tot = a + b;
    pool.push({
      nivel: 'medio',
      texto: `Comprei frango por ${brlFmt(a)} e arroz por ${brlFmt(b)}. Quanto gastei no total?`,
      opcoes: opcoesReaisCentavos(tot),
    });
  }

  {
    const base = precoEmCentavos(30, 120);
    const ganho = 8;
    const novo = base + pctDe(base, ganho);
    pool.push({
      nivel: 'medio',
      texto: `O preço de um produto é ${brlFmt(base)} e sobe ${ganho}%. Qual o novo preço?`,
      opcoes: opcoesReaisCentavos(novo),
    });
  }

  /* ——— DIFÍCIL ——— */
  {
    const base = precoEmCentavos(70, 220);
    const tip = 10;
    const gorj = pctDe(base, tip);
    pool.push({
      nivel: 'dificil',
      texto: `A conta do restaurante deu ${brlFmt(base)}. A gorjeta sugerida é ${tip}% sobre essa conta. Quanto é só a gorjeta?`,
      opcoes: opcoesReaisCentavos(gorj),
    });
  }

  {
    const base = precoEmCentavos(80, 180);
    const tip = 10;
    const totalCom = base + pctDe(base, tip);
    pool.push({
      nivel: 'dificil',
      texto: `Conta de ${brlFmt(base)} com ${tip}% de gorjeta em cima do valor da conta. Quanto fica o total a pagar?`,
      opcoes: opcoesReaisCentavos(totalCom),
    });
  }

  {
    const p = precoEmCentavos(12, 45);
    const total = p + Math.round(p / 2);
    pool.push({
      nivel: 'dificil',
      texto: `Promoção “leve 2 pelo preço de 1 e meio”: cada peça custa ${brlFmt(p)}. Duas peças custam quanto?`,
      opcoes: opcoesReaisCentavos(total),
    });
  }

  {
    const melhorA = Math.random() < 0.5;
    let unitAc: number;
    let unitBc: number;
    if (melhorA) {
      unitAc = intAleatorio(350, 650);
      unitBc = intAleatorio(unitAc + 30, unitAc + 220);
    } else {
      unitBc = intAleatorio(350, 650);
      unitAc = intAleatorio(unitBc + 30, unitBc + 220);
    }
    const ua = intAleatorio(5, 9);
    const ub = intAleatorio(5, 9);
    const pa = ua * unitAc;
    const pb = ub * unitBc;
    pool.push({
      nivel: 'dificil',
      texto: `Pacote A: ${ua} iogurtes por ${brlFmt(pa)}. Pacote B: ${ub} iogurtes por ${brlFmt(pb)}. Onde o iogurte sai mais barato CADA um?`,
      opcoes:
        melhorA
          ? opcoesTexto(['Pacote A', 'Pacote B', 'Sai o mesmo', 'Não dá para saber'])
          : opcoesTexto(['Pacote B', 'Pacote A', 'Sai o mesmo', 'Não dá para saber']),
    });
  }

  {
    const base = precoEmCentavos(99, 189);
    const pct = 15;
    const desc = pctDe(base, pct);
    pool.push({
      nivel: 'dificil',
      texto: `Tênis por ${brlFmt(base)} com ${pct}% de desconto. Quanto você economiza (valor do desconto)?`,
      opcoes: opcoesReaisCentavos(desc),
    });
  }

  {
    const sub = precoEmCentavos(40, 120);
    const frete = precoEmCentavos(5, 15);
    const tot = sub + frete;
    pool.push({
      nivel: 'dificil',
      texto: `Compra online: produtos ${brlFmt(sub)} + frete ${brlFmt(frete)}. Valor total?`,
      opcoes: opcoesReaisCentavos(tot),
    });
  }

  {
    const part = precoEmCentavos(15, 45);
    const n = intAleatorio(3, 5);
    const tot = part * n;
    pool.push({
      nivel: 'dificil',
      texto: `Cada fatia de bolo custa ${brlFmt(part)}. Uma turma compra ${n} fatias iguais. Quanto pagam juntos?`,
      opcoes: opcoesReaisCentavos(tot),
    });
  }

  {
    const c = precoEmCentavos(20, 60);
    const metade = Math.round(c / 2);
    const tot = c + metade;
    pool.push({
      nivel: 'medio',
      texto: `Dois sorvetes: o primeiro custa ${brlFmt(c)} e o segundo metade desse valor. Quanto você paga pelos dois?`,
      opcoes: opcoesReaisCentavos(tot),
    });
  }

  return embaralhar(pool)
    .slice(0, TOTAL_PERGUNTAS)
    .map((p, i) => ({ ...p, id: i + 1 }));
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

function badgeNivel(n: NivelP) {
  if (n === 'facil') return 'Esta é mais leve';
  if (n === 'medio') return 'Esta é média';
  return 'Esta está puxada';
}

export function MarketChallengeGame() {
  const navegar = useNavigate();
  const [comecou, setComecou] = useState(false);
  const [lista, setLista] = useState<PerguntaMercado[]>([]);
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
  }, [indice, comecou]);

  const iniciar = () => {
    setLista(montarDesafio());
    setIndice(0);
    setPontos(0);
    setComecou(true);
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
      setPontos((p) => p + PONTOS_POR_ACERTO);
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

  if (!comecou) {
    return (
      <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-gradient-to-b from-amber-50 via-white to-emerald-50/80 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between border-b border-amber-100/90 bg-white/90 px-4 py-3 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-5">
          <button
            type="button"
            onClick={voltarPainel}
            className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors active:bg-amber-100"
            aria-label="Voltar ao painel"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-foreground sm:text-lg">Desafio do mercado</h1>
          <span className="w-11" />
        </header>

        <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6">
          <div className="mx-auto w-full max-w-lg text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 shadow-inner">
              <ShoppingBag className="h-10 w-10 text-emerald-700" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Pronto para o desafio?</h2>
            <button
              type="button"
              onClick={iniciar}
              className="mt-8 min-h-12 w-full max-w-xs rounded-2xl bg-emerald-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform active:scale-[0.99] sm:mx-auto"
            >
              Começar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pergunta) return null;

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-gradient-to-b from-amber-50 via-white to-emerald-50/80 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between border-b border-amber-100/90 bg-white/90 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-sm sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setComecou(false);
              setLista([]);
            }}
            className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl active:bg-amber-100 sm:h-9 sm:w-9"
            aria-label="Voltar ao início do desafio"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <ShoppingBag className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-foreground sm:text-base">Desafio do mercado</h1>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
              {TOTAL_PERGUNTAS} perguntas · mistura de níveis
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
          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
            <span>
              Pergunta {indice + 1} / {lista.length}
            </span>
            <span className="normal-case rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground sm:text-xs">
              {badgeNivel(pergunta.nivel)}
            </span>
          </div>
          <Progress value={Math.min(100, progressoPercentual)} className="h-2" />
        </div>

        <div className="animate-scale-in space-y-5">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <p className="text-center text-sm font-medium leading-relaxed text-card-foreground sm:text-base">{pergunta.texto}</p>
          </div>

          <fieldset className="space-y-3" disabled={feedback === 'certo'}>
            <legend className="sr-only">Escolha uma opção</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              {pergunta.opcoes.map((op, oi) => (
                <button
                  key={`${oi}-${op.label}`}
                  type="button"
                  onClick={() => {
                    setEscolha(op.label);
                    if (feedback !== 'idle') setFeedback('idle');
                    setMostrarDica(false);
                  }}
                  className={`min-h-12 touch-manipulation rounded-xl border-2 px-3 py-3 text-center text-sm font-bold leading-snug transition-transform active:scale-[0.99] sm:min-h-14 sm:text-base ${
                    escolha === op.label
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-400/40'
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
              <p className="text-sm text-emerald-800/90">+{PONTOS_POR_ACERTO} pontos</p>
              {ultimoAcerto ? (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={iniciar}
                    className="min-h-11 rounded-xl border-2 border-primary bg-background px-6 py-2.5 text-sm font-bold text-primary"
                  >
                    Jogar de novo
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
              <p className="mt-2 font-bold text-orange-900">Tente outra vez</p>
              <p className="text-sm text-orange-900/85">Atenção a centavos e à ordem: % em cima de qual valor.</p>
            </div>
          )}

          {mostrarDica && feedback === 'errado' && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-center text-sm text-sky-950">
              <strong>Dica:</strong> trabalhe em centavos na cabeça (R$ 1,00 = 100 centavos) ou passe tudo pra reais com vírgula. Em gorjeta, leia se é só a gorjeta ou o total da conta + gorjeta.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
