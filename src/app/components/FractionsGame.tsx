import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Check, X, ArrowUp, ArrowDown, Cookie } from 'lucide-react';
import { usePontosMissao } from '../hooks/usePontosMissao';

const PONTOS_POR_ACERTO = 40;

interface Pergunta {
  id: number;
  texto: string;
  /** Resposta canônica (geralmente irredutível); equivalentes também contam. */
  numeradorCorreto: number;
  denominadorCorreto: number;
}

function mdc(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

/** Fração positiva na forma mais simples (para exibir o gabarito). */
function reduzirFrac(n: number, d: number): [number, number] {
  if (d <= 0 || n < 0) return [n, d];
  const g = mdc(n, d);
  return [n / g, d / g];
}

function fracoesEquivalentes(n1: number, d1: number, n2: number, d2: number): boolean {
  if (d1 <= 0 || d2 <= 0 || n1 < 0 || n2 < 0) return false;
  return n1 * d2 === n2 * d1;
}

const PERGUNTAS: Pergunta[] = [
  {
    id: 1,
    texto:
      'Maria tem uma pizza em 8 fatias iguais e come exatamente 3 fatias. Escreva a fração da pizza que ela comeu.',
    numeradorCorreto: 3,
    denominadorCorreto: 8,
  },
  {
    id: 2,
    texto: 'Calcule e escreva o resultado: 2/7 + 3/7 (mesmo denominador).',
    numeradorCorreto: 5,
    denominadorCorreto: 7,
  },
  {
    id: 3,
    texto:
      'Um reservatório estava 9/10 cheio de água. Retirou-se 2/10 para regar. Com que fração do reservatório ele ficou cheio depois disso?',
    numeradorCorreto: 7,
    denominadorCorreto: 10,
  },
  {
    id: 4,
    texto:
      'De 10 alunos convocados, 4 faltaram à apresentação. Escreva em fração irredutível a parte dos alunos que compareceu.',
    numeradorCorreto: 3,
    denominadorCorreto: 5,
  },
  {
    id: 5,
    texto:
      'Em um pacote com 10 guloseimas iguais, 3 são de chocolate e o restante é de fruta. Que fração do pacote é de fruta?',
    numeradorCorreto: 7,
    denominadorCorreto: 10,
  },
  {
    id: 6,
    texto:
      'Em um experimento, 2/5 das sementes não germinaram. Que fração das sementes germinou (a parte “boa”)?',
    numeradorCorreto: 3,
    denominadorCorreto: 5,
  },
  {
    id: 7,
    texto: 'Simplifique 8/10 ao máximo (escreva a fração irredutível).',
    numeradorCorreto: 4,
    denominadorCorreto: 5,
  },
  {
    id: 8,
    texto: 'Some 1/6 + 2/6 e dê o resultado na forma irredutível.',
    numeradorCorreto: 1,
    denominadorCorreto: 2,
  },
  {
    id: 9,
    texto: 'Simplifique 8/12 ao máximo.',
    numeradorCorreto: 2,
    denominadorCorreto: 3,
  },
  {
    id: 10,
    texto: 'Uma faixa tem 8 quadrados iguais. Pintaram-se 5 e depois mais 2. Que fração da faixa ficou pintada no total?',
    numeradorCorreto: 7,
    denominadorCorreto: 8,
  },
  {
    id: 11,
    texto: 'Uma torta foi cortada em 12 pedaços iguais e sobraram 5 inteiros na mesa. Que fração da torta inteira ainda está lá?',
    numeradorCorreto: 5,
    denominadorCorreto: 12,
  },
  {
    id: 12,
    texto:
      'Uma hora foi pensada em 6 blocos iguais de 10 minutos. Dez minutos correspondem a que fração dessa hora?',
    numeradorCorreto: 1,
    denominadorCorreto: 6,
  },
  {
    id: 13,
    texto: 'Calcule 9/10 − 5/10 e escreva o resultado na forma irredutível.',
    numeradorCorreto: 2,
    denominadorCorreto: 5,
  },
  {
    id: 14,
    texto:
      'Um tanque comporta 1 litro. Primeiro encheu-se 3/4 do tanque e depois mais 1/4. Que fração do tanque ficou cheia no final?',
    numeradorCorreto: 1,
    denominadorCorreto: 1,
  },
  {
    id: 15,
    texto: 'Simplifique 15/18 ao máximo.',
    numeradorCorreto: 5,
    denominadorCorreto: 6,
  },
];

function PizzaComPedacos({ numerador, denominador }: { numerador: number; denominador: number }) {
  if (denominador === 0) return null;

  const raioBorda = 116;
  const raioQueijo = 104;
  const cx = 200;
  const cy = 140;
  const anguloPorFatia = (2 * Math.PI) / denominador;

  function pontoNoCirculo(raio: number, angulo: number) {
    return {
      x: cx + raio * Math.cos(angulo),
      y: cy + raio * Math.sin(angulo),
    };
  }

  function gerarToppingsDaFatia(inicio: number, fim: number, indice: number) {
    const largura = fim - inicio;
    const anguloCalabresa1 = inicio + largura * 0.36;
    const anguloCalabresa2 = inicio + largura * 0.68;
    const anguloVerde = inicio + largura * 0.52;
    const corBase = indice % 2 === 0 ? '#b91c1c' : '#dc2626';

    return {
      calabresas: [
        {
          ponto: pontoNoCirculo(66, anguloCalabresa1),
          tamanho: 7.6,
          cor: corBase,
        },
        {
          ponto: pontoNoCirculo(84, anguloCalabresa2),
          tamanho: 6.8,
          cor: corBase === '#b91c1c' ? '#dc2626' : '#b91c1c',
        },
      ],
      verde: {
        ponto: pontoNoCirculo(92, anguloVerde),
        rx: 5.8,
        ry: 2.2,
        rotacao: (anguloVerde * 180) / Math.PI + (indice % 2 === 0 ? 20 : -20),
        cor: indice % 2 === 0 ? '#16a34a' : '#22c55e',
      },
    };
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 400 300" className="w-full h-auto max-h-64">
        <ellipse cx={cx} cy={258} rx="142" ry="22" fill="#d1d5db" opacity="0.7" />

        {denominador === 1 ? (
          <g>
            <circle cx={cx} cy={cy} r={raioBorda} fill="#b45309" stroke="#7c2d12" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={raioQueijo} fill={numerador >= 1 ? '#fb923c' : '#fde68a'} stroke="#92400e" strokeWidth="1.6" />
            {(() => {
              const calabresaSombra = { filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' } as const;
              const verdeSombra = { filter: 'drop-shadow(1px 1.5px 1px rgba(20, 83, 45, 0.35))' } as const;

              const centro = [
                { raio: 0, angulo: 0, r: 7.2, cor: '#b91c1c' as const },
                { raio: 24, angulo: 0, r: 6.4, cor: '#dc2626' as const },
                { raio: 24, angulo: (2 * Math.PI) / 3, r: 6.4, cor: '#b91c1c' as const },
                { raio: 24, angulo: (4 * Math.PI) / 3, r: 6.4, cor: '#dc2626' as const },
              ];

              const anelMedio = Array.from({ length: 6 }, (_, k) => ({
                raio: 58 + (k % 2) * 6,
                angulo: -Math.PI / 2 + (k * (2 * Math.PI)) / 6 + 0.08,
                r: 7,
                cor: (k % 2 === 0 ? '#b91c1c' : '#dc2626') as '#b91c1c' | '#dc2626',
              }));

              const anelExterno = Array.from({ length: 8 }, (_, k) => ({
                raio: 86 + (k % 3) * 5,
                angulo:
                  -Math.PI / 2 +
                  (k * (2 * Math.PI)) / 8 +
                  (k % 2 === 0 ? 0.12 : -0.1),
                r: 6.6,
                cor: (k % 2 === 0 ? '#dc2626' : '#b91c1c') as '#b91c1c' | '#dc2626',
              }));

              const verdes = Array.from({ length: 10 }, (_, k) => {
                const ang = -Math.PI / 2 + (k * (2 * Math.PI)) / 10 + 0.15;
                const raio = [72, 94, 56, 82, 98, 68, 89, 61, 92, 76][k];
                return { raio, ang, rot: (ang * 180) / Math.PI + (k % 2 === 0 ? 22 : -18) };
              });

              return (
                <>
                  {[...centro, ...anelMedio, ...anelExterno].map((c, i) => {
                    const p = pontoNoCirculo(c.raio, c.angulo);
                    return (
                      <circle
                        key={`cal-1-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r={c.r}
                        fill={c.cor}
                        stroke={c.cor === '#b91c1c' ? '#7f1d1d' : '#991b1b'}
                        strokeWidth="1.2"
                        style={calabresaSombra}
                      />
                    );
                  })}
                  {verdes.map((v, i) => {
                    const p = pontoNoCirculo(v.raio, v.ang);
                    return (
                      <ellipse
                        key={`verde-1-${i}`}
                        cx={p.x}
                        cy={p.y}
                        rx="5.8"
                        ry="2.2"
                        fill={i % 2 === 0 ? '#16a34a' : '#22c55e'}
                        stroke="#166534"
                        strokeWidth="0.8"
                        transform={`rotate(${v.rot} ${p.x} ${p.y})`}
                        style={verdeSombra}
                      />
                    );
                  })}
                </>
              );
            })()}
          </g>
        ) : (
        Array.from({ length: denominador }).map((_, i) => {
          const separado = denominador > 1 && i < numerador;
          const inicio = -Math.PI / 2 + i * anguloPorFatia;
          const fim = inicio + anguloPorFatia;
          const meio = (inicio + fim) / 2;
          const deslocamento = separado ? 32 : 0;
          const dx = deslocamento * Math.cos(meio);
          const dy = deslocamento * Math.sin(meio);

          const p1Borda = pontoNoCirculo(raioBorda, inicio);
          const p2Borda = pontoNoCirculo(raioBorda, fim);
          const p1Queijo = pontoNoCirculo(raioQueijo, inicio);
          const p2Queijo = pontoNoCirculo(raioQueijo, fim);
          const { calabresas, verde } = gerarToppingsDaFatia(inicio, fim, i);
          const anguloExtraCalabresa = inicio + (fim - inicio) * 0.2;
          const pontoCalabresaExtra = pontoNoCirculo(56, anguloExtraCalabresa);
          const anguloExtraCalabresa2 = inicio + (fim - inicio) * 0.82;
          const pontoCalabresaExtra2 = pontoNoCirculo(60, anguloExtraCalabresa2);
          const anguloExtraCalabresa3 = inicio + (fim - inicio) * 0.5;
          const pontoCalabresaExtra3 = pontoNoCirculo(74, anguloExtraCalabresa3);
          const anguloExtraCalabresa4 = inicio + (fim - inicio) * 0.34;
          const pontoCalabresaExtra4 = pontoNoCirculo(92, anguloExtraCalabresa4);
          const anguloExtraCalabresa5 = inicio + (fim - inicio) * 0.66;
          const pontoCalabresaExtra5 = pontoNoCirculo(48, anguloExtraCalabresa5);
          const anguloExtraCalabresaTopo =
            denominador === 2
              ? (i === 0 ? -Math.PI / 2 + 0.32 : -Math.PI / 2 - 0.32)
              : inicio + (fim - inicio) * 0.5;
          const pontoCalabresaExtraTopo = pontoNoCirculo(92, anguloExtraCalabresaTopo);
          const anguloExtraCalabresaInferior =
            denominador === 2
              ? (i === 0 ? Math.PI / 2 - 0.32 : Math.PI / 2 + 0.32)
              : inicio + (fim - inicio) * 0.5;
          const pontoCalabresaExtraInferior = pontoNoCirculo(92, anguloExtraCalabresaInferior);
          const anguloVerdeExtra1 = inicio + (fim - inicio) * 0.14;
          const pontoVerdeExtra1 = pontoNoCirculo(98, anguloVerdeExtra1);
          const anguloVerdeExtra2 = inicio + (fim - inicio) * 0.86;
          const pontoVerdeExtra2 = pontoNoCirculo(96, anguloVerdeExtra2);
          const largeArc = anguloPorFatia > Math.PI ? 1 : 0;

          return (
            <g key={i} transform={`translate(${dx} ${dy})`} className="transition-all duration-300 ease-out">
              <path
                d={`M ${p1Borda.x} ${p1Borda.y}
                    A ${raioBorda} ${raioBorda} 0 ${largeArc} 1 ${p2Borda.x} ${p2Borda.y}
                    L ${p2Queijo.x} ${p2Queijo.y}
                    A ${raioQueijo} ${raioQueijo} 0 ${largeArc} 0 ${p1Queijo.x} ${p1Queijo.y}
                    Z`}
                fill="#b45309"
                stroke="#7c2d12"
                strokeWidth="1.2"
              />
              <path
                d={`M ${cx} ${cy}
                    L ${p1Queijo.x} ${p1Queijo.y}
                    A ${raioQueijo} ${raioQueijo} 0 ${largeArc} 1 ${p2Queijo.x} ${p2Queijo.y}
                    Z`}
                fill={separado ? '#fb923c' : '#fde68a'}
                stroke="#92400e"
                strokeWidth="1.6"
              />
              {calabresas.map((item, index) => (
                <circle
                  key={`calabresa-${i}-${index}`}
                  cx={item.ponto.x}
                  cy={item.ponto.y}
                  r={item.tamanho}
                  fill={item.cor}
                  stroke={item.cor === '#b91c1c' ? '#7f1d1d' : '#991b1b'}
                  strokeWidth="1.2"
                  style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                />
              ))}
              {denominador <= 3 && (
                <circle
                  cx={pontoCalabresaExtra.x}
                  cy={pontoCalabresaExtra.y}
                  r="6.8"
                  fill={i % 2 === 0 ? '#b91c1c' : '#dc2626'}
                  stroke={i % 2 === 0 ? '#7f1d1d' : '#991b1b'}
                  strokeWidth="1.1"
                  style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                />
              )}
              {denominador === 2 && (
                <>
                  <circle
                    cx={pontoCalabresaExtra2.x}
                    cy={pontoCalabresaExtra2.y}
                    r="7.2"
                    fill={i % 2 === 0 ? '#dc2626' : '#b91c1c'}
                    stroke={i % 2 === 0 ? '#991b1b' : '#7f1d1d'}
                    strokeWidth="1.2"
                    style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                  />
                  <circle
                    cx={pontoCalabresaExtra3.x}
                    cy={pontoCalabresaExtra3.y}
                    r="7"
                    fill={i % 2 === 0 ? '#b91c1c' : '#dc2626'}
                    stroke={i % 2 === 0 ? '#7f1d1d' : '#991b1b'}
                    strokeWidth="1.2"
                    style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                  />
                  <circle
                    cx={pontoCalabresaExtra4.x}
                    cy={pontoCalabresaExtra4.y}
                    r="6.6"
                    fill={i % 2 === 0 ? '#dc2626' : '#b91c1c'}
                    stroke={i % 2 === 0 ? '#991b1b' : '#7f1d1d'}
                    strokeWidth="1.1"
                    style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                  />
                  <circle
                    cx={pontoCalabresaExtra5.x}
                    cy={pontoCalabresaExtra5.y}
                    r="6.6"
                    fill={i % 2 === 0 ? '#b91c1c' : '#dc2626'}
                    stroke={i % 2 === 0 ? '#7f1d1d' : '#991b1b'}
                    strokeWidth="1.1"
                    style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                  />
                  <circle
                    cx={pontoCalabresaExtraTopo.x}
                    cy={pontoCalabresaExtraTopo.y}
                    r="6.9"
                    fill={i % 2 === 0 ? '#dc2626' : '#b91c1c'}
                    stroke={i % 2 === 0 ? '#991b1b' : '#7f1d1d'}
                    strokeWidth="1.1"
                    style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                  />
                  <circle
                    cx={pontoCalabresaExtraInferior.x}
                    cy={pontoCalabresaExtraInferior.y}
                    r="6.9"
                    fill={i % 2 === 0 ? '#b91c1c' : '#dc2626'}
                    stroke={i % 2 === 0 ? '#7f1d1d' : '#991b1b'}
                    strokeWidth="1.1"
                    style={{ filter: 'drop-shadow(1px 2px 1px rgba(80, 20, 20, 0.45))' }}
                  />
                </>
              )}
              <ellipse
                cx={verde.ponto.x}
                cy={verde.ponto.y}
                rx={verde.rx}
                ry={verde.ry}
                fill={verde.cor}
                stroke="#166534"
                strokeWidth="0.8"
                transform={`rotate(${verde.rotacao} ${verde.ponto.x} ${verde.ponto.y})`}
                style={{ filter: 'drop-shadow(1px 1.5px 1px rgba(20, 83, 45, 0.35))' }}
              />
              {denominador === 2 && (
                <>
                  <ellipse
                    cx={pontoVerdeExtra1.x}
                    cy={pontoVerdeExtra1.y}
                    rx="6.2"
                    ry="2.3"
                    fill={i % 2 === 0 ? '#16a34a' : '#22c55e'}
                    stroke="#166534"
                    strokeWidth="0.8"
                    transform={`rotate(${(anguloVerdeExtra1 * 180) / Math.PI + 24} ${pontoVerdeExtra1.x} ${pontoVerdeExtra1.y})`}
                    style={{ filter: 'drop-shadow(1px 1.5px 1px rgba(20, 83, 45, 0.35))' }}
                  />
                  <ellipse
                    cx={pontoVerdeExtra2.x}
                    cy={pontoVerdeExtra2.y}
                    rx="6"
                    ry="2.2"
                    fill={i % 2 === 0 ? '#22c55e' : '#16a34a'}
                    stroke="#166534"
                    strokeWidth="0.8"
                    transform={`rotate(${(anguloVerdeExtra2 * 180) / Math.PI - 22} ${pontoVerdeExtra2.x} ${pontoVerdeExtra2.y})`}
                    style={{ filter: 'drop-shadow(1px 1.5px 1px rgba(20, 83, 45, 0.35))' }}
                  />
                </>
              )}
            </g>
          );
        })
        )}
      </svg>

      <div className="text-center mt-1 text-xs text-muted-foreground">
        {numerador > 0 && (
          <span className="font-semibold">
            {numerador} de {denominador} pedaço{denominador !== 1 ? 's' : ''} destacado{numerador !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

function ControladorNumero({
  valor,
  aoMudar,
  label,
  min = 0,
  max = 20,
  cor,
}: {
  valor: number;
  aoMudar: (novoValor: number) => void;
  label: string;
  min?: number;
  max?: number;
  cor: string;
}) {
  function incrementar() {
    if (valor < max) aoMudar(valor + 1);
  }

  function decrementar() {
    if (valor > min) aoMudar(valor - 1);
  }

  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={incrementar}
          className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border-2 bg-white shadow-md transition-all active:scale-95 disabled:opacity-40 sm:h-8 sm:w-8 md:hover:scale-105 md:hover:shadow-lg"
          style={{ borderColor: cor }}
          disabled={valor >= max}
        >
          <ArrowUp className="h-5 w-5 sm:h-4 sm:w-4" style={{ color: cor }} />
        </button>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-xl border-3 shadow-lg sm:h-14 sm:w-14"
          style={{ borderColor: cor, backgroundColor: `${cor}15` }}
        >
          <span className="text-3xl font-bold sm:text-3xl" style={{ color: cor }}>
            {valor}
          </span>
        </div>

        <button
          type="button"
          onClick={decrementar}
          className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border-2 bg-white shadow-md transition-all active:scale-95 disabled:opacity-40 sm:h-8 sm:w-8 md:hover:scale-105 md:hover:shadow-lg"
          style={{ borderColor: cor }}
          disabled={valor <= min}
        >
          <ArrowDown className="h-5 w-5 sm:h-4 sm:w-4" style={{ color: cor }} />
        </button>
      </div>
    </div>
  );
}

export function FractionsGame() {
  const navegar = useNavigate();
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [numerador, setNumerador] = useState(0);
  const [denominador, setDenominador] = useState(0);
  const [estado, setEstado] = useState<'respondendo' | 'correto' | 'incorreto'>('respondendo');
  const [pontuacao, setPontuacao] = useState(0);
  const { ganharPontos, concluirMissao } = usePontosMissao();

  const perguntaAtual = PERGUNTAS[perguntaAtualIndex];
  const ultimaPergunta = perguntaAtualIndex === PERGUNTAS.length - 1;

  function verificarResposta() {
    if (
      fracoesEquivalentes(numerador, denominador, perguntaAtual.numeradorCorreto, perguntaAtual.denominadorCorreto)
    ) {
      setEstado('correto');
      setPontuacao((prev) => prev + 1);
      void ganharPontos(PONTOS_POR_ACERTO);
    } else {
      setEstado('incorreto');
    }
  }

  useEffect(() => {
    if (ultimaPergunta && estado === 'correto') void concluirMissao();
  }, [ultimaPergunta, estado, concluirMissao]);

  function proximaPergunta() {
    if (perguntaAtualIndex < PERGUNTAS.length - 1) {
      setPerguntaAtualIndex((prev) => prev + 1);
      setNumerador(0);
      setDenominador(0);
      setEstado('respondendo');
    } else {
      // Fim do jogo
      navegar('/dashboard');
    }
  }

  function tentarNovamente() {
    setNumerador(0);
    setDenominador(0);
    setEstado('respondendo');
  }

  const podeConfirmar = numerador > 0 && denominador > 0 && numerador <= denominador;

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden overflow-y-auto bg-[#C7D5FC] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between border-b border-amber-100 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => navegar('/dashboard')}
            className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors active:bg-amber-200 sm:h-8 sm:w-8 md:hover:bg-amber-100"
          >
            <ChevronLeft className="h-5 w-5 text-foreground sm:h-4 sm:w-4" />
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100">
            <Cookie className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="min-w-0 text-sm font-bold leading-tight text-foreground sm:text-base sm:text-lg">
            Aventura das Frações
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-center bg-white rounded-xl px-2.5 py-1 shadow-sm border border-amber-100">
            <p className="text-[10px] text-muted-foreground">Pergunta</p>
            <p className="text-xs font-bold text-foreground leading-tight">
              {perguntaAtualIndex + 1}/{PERGUNTAS.length}
            </p>
          </div>
          <div className="text-center bg-white rounded-xl px-2.5 py-1 shadow-sm border border-amber-100">
            <p className="text-[10px] text-muted-foreground">Pontos</p>
            <p className="text-xs font-bold text-emerald-600 leading-tight">{pontuacao}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-3 sm:px-5 py-3 min-h-0 max-w-5xl w-full mx-auto">
        <div className="text-center mb-3 bg-white/75 backdrop-blur-sm rounded-2xl px-4 py-3 border border-amber-100 shadow-sm">
          <h3 className="text-sm sm:text-base font-bold text-foreground">{perguntaAtual.texto}</h3>
        </div>

        <div className="mb-3 bg-gradient-to-b from-orange-50 to-amber-50 rounded-2xl p-3 flex-shrink-0 border border-amber-100 shadow-sm">
          {denominador === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <p className="text-xs italic">Ajuste o denominador para ver a pizza</p>
            </div>
          ) : (
            <PizzaComPedacos numerador={numerador} denominador={denominador} />
          )}
        </div>

        <div className="mb-3 rounded-2xl border border-amber-100 bg-white/85 p-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <ControladorNumero
            valor={numerador}
            aoMudar={setNumerador}
            label="Numerador"
            max={denominador || 18}
            cor="#3b82f6"
          />

          <div className="flex min-w-[80px] flex-col items-center justify-center rounded-xl border border-amber-100 bg-gradient-to-b from-white to-amber-50 p-2 shadow-md sm:min-w-[92px] sm:p-3">
            <div
              className="text-2xl font-bold text-blue-600 sm:text-3xl md:text-4xl"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {numerador}
            </div>
            <div className="my-1 h-0.5 w-14 rounded-full bg-gray-800 sm:w-16" />
            <div
              className="text-2xl font-bold text-orange-600 sm:text-3xl md:text-4xl"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {denominador}
            </div>
          </div>

          <ControladorNumero
            valor={denominador}
            aoMudar={setDenominador}
            label="Denominador"
            min={1}
            max={18}
            cor="#f97316"
          />
        </div>
        </div>

        {estado === 'respondendo' && (
          <button
            type="button"
            onClick={verificarResposta}
            disabled={!podeConfirmar}
            className="mb-3 min-h-12 w-full touch-manipulation rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-base font-bold text-white shadow-lg transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 md:hover:scale-[1.01] md:hover:from-emerald-600 md:hover:to-teal-700"
          >
            ✓ Confirmar Resposta
          </button>
        )}

          {estado === 'correto' && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 text-white animate-scale-in mb-3 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Check className="w-6 h-6" />
                  <div>
                    <h4 className="text-sm font-bold">Correto! 🎉</h4>
                  </div>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg p-1.5">
                  {(() => {
                    const [r, d] = reduzirFrac(perguntaAtual.numeradorCorreto, perguntaAtual.denominadorCorreto);
                    return (
                      <>
                        <div className="text-lg font-bold text-green-600" style={{ fontFamily: 'Georgia, serif' }}>
                          {r}
                        </div>
                        <div className="w-8 h-0.5 bg-gray-800 rounded-full my-0.5" />
                        <div className="text-lg font-bold text-green-600" style={{ fontFamily: 'Georgia, serif' }}>
                          {d}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              <button
                onClick={proximaPergunta}
                className="w-full bg-white text-green-600 py-2 rounded-lg font-bold text-sm hover:bg-green-50 transition-all"
              >
                {perguntaAtualIndex < PERGUNTAS.length - 1 ? '➡️ Próxima' : '🏆 Finalizar'}
              </button>
            </div>
          )}

          {estado === 'incorreto' && (
            <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl p-3 text-white animate-scale-in mb-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <X className="w-6 h-6" />
                <div>
                  <h4 className="text-sm font-bold">Ops! Tente de novo 💭</h4>
                </div>
              </div>
              <button
                onClick={tentarNovamente}
                className="w-full bg-white text-red-600 py-2 rounded-lg font-bold text-sm hover:bg-red-50 transition-all"
              >
                🔄 Tentar Novamente
              </button>
            </div>
          )}

          <div className="pt-2 mt-1 pb-2">
            <div className="flex gap-1">
              {PERGUNTAS.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    index < perguntaAtualIndex
                      ? 'bg-green-500'
                      : index === perguntaAtualIndex
                      ? 'bg-orange-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
