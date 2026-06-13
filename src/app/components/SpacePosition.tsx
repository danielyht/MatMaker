import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Rocket, Target, Zap, Heart, Crosshair } from 'lucide-react';
import { usePontosMissao } from '../hooks/usePontosMissao';
import { useGuiaEnzo } from '../hooks/useGuiaEnzo';
import { EnzoAvatar, GuiaEnzo } from './GuiaEnzo';

/** Quantidade de naves reais a eliminar (dicas em sequência) e balas disponíveis. */
const INVASAO_NAVES_ALVO = 15;
const PONTOS_VITORIA = 100;
const INVASAO_BALAS_INICIAIS = 24;

/**
 * 8 posições por lado — centros em % do canvas.
 * Grelha 3+3+2 bem espalhada nas faixas laterais (longe do laser), sem sobreposição dos ícones.
 */
const SLOTS_ESQUERDA = [
  { x: 8, y: 12 },
  { x: 21, y: 12 },
  { x: 35, y: 12 },
  { x: 8, y: 36 },
  { x: 21, y: 36 },
  { x: 35, y: 36 },
  { x: 14, y: 60 },
  { x: 29, y: 60 },
];
const SLOTS_DIREITA = [
  { x: 65, y: 12 },
  { x: 78, y: 12 },
  { x: 92, y: 12 },
  { x: 65, y: 36 },
  { x: 78, y: 36 },
  { x: 92, y: 36 },
  { x: 71, y: 60 },
  { x: 86, y: 60 },
];

function embaralhar<T>(itens: T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function ModalConvocamento({ aoFechar, aoIniciar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:p-5">
      <div className="mx-auto flex max-h-[92vh] w-[90%] max-w-sm flex-col overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl sm:w-full sm:max-w-md md:max-w-2xl md:rounded-3xl md:border-4 lg:max-w-3xl">
        {/* Header com estrelas */}
        <div className="relative overflow-hidden bg-primary/80 px-4 py-2.5 sm:px-6 sm:py-3">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-10 text-2xl">⭐</div>
            <div className="absolute top-1 right-20 text-xl">✨</div>
            <div className="absolute bottom-2 left-1/3 text-lg">🌟</div>
          </div>
          <h2 className="relative z-10 text-center text-lg font-bold text-white sm:text-2xl">
            🚀 CONVOCAMENTO URGENTE 🚀
          </h2>
        </div>

        {/* Conteúdo */}
        <div className="overflow-y-auto p-3 text-white sm:p-6">
          {/* Avatar do companheiro */}
          <div className="flex justify-center mb-3">
            <EnzoAvatar variante="capitao" tamanho="lg" />
          </div>

          {/* Mensagem */}
          <div className="space-y-3 mb-4">
            <p className="text-base sm:text-lg font-bold text-cyan-200 text-center">
              Olá, Piloto Espacial! Sou o Enzo, seu copiloto!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-base leading-relaxed">
                <span className="font-bold text-orange-300">⚠️ ALERTA!</span> Naves alienígenas estão invadindo nosso espaço!
                Mas cuidado: <span className="font-bold text-cyan-200">nem todas são reais</span> — algumas são apenas hologramas!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-base font-bold mb-2 text-cyan-200">📋 SUA MISSÃO:</p>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>
                    Você tem <span className="font-bold text-yellow-300">{INVASAO_BALAS_INICIAIS} balas</span> em sua nave
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>
                    Se acertar um holograma, <span className="font-bold text-red-400">você perde!</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>
                    Há <span className="font-bold text-yellow-300">{INVASAO_NAVES_ALVO} naves reais</span> — siga as dicas na ordem!
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-primary/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border-2 border-primary/40">
              <p className="text-base font-bold text-center">
                💡 <span className="text-cyan-200">DICA:</span> Preste atenção nas minhas instruções!
              </p>
              <p className="text-center mt-1.5 text-sm">
                "A nave <span className="font-bold text-red-400">vermelha</span> está na <span className="font-bold text-cyan-300">DIREITA</span>!"
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={aoFechar}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 sm:py-3 rounded-2xl font-bold text-sm sm:text-base transition-all hover:scale-105 shadow-lg"
            >
              Voltar
            </button>
            <button
              onClick={aoIniciar}
              className="flex-1 bg-gradient-to-r from-primary to-cyan-500 hover:from-[#2C98B8] hover:to-cyan-600 text-white py-2.5 sm:py-3 rounded-2xl font-bold text-sm sm:text-base transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Aceitar Missão!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalVitoria({ aoProximaFase, aoRepetir }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md sm:p-5">
      <div className="animate-scale-in mx-auto flex max-h-[90vh] w-[90%] max-w-sm flex-col overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl sm:w-full sm:max-w-md md:max-w-lg md:rounded-3xl md:border-4">
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-primary to-cyan-500 px-3 py-2 sm:px-4 sm:py-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-white text-center relative z-10">
            🏆 Missão cumprida!
          </h2>
        </div>

        <div className="overflow-y-auto p-3 text-white sm:p-5">
          <div className="mb-2 flex justify-center">
            <span className="animate-bounce text-4xl sm:text-5xl">🎉</span>
          </div>

          <div className="mb-4 space-y-2.5">
            <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-sm sm:p-3">
              <p className="mb-1 text-center text-sm font-bold text-cyan-200 sm:text-base">
                Parabéns, piloto!
              </p>
              <p className="text-sm leading-snug text-center text-white/90">
                Você eliminou todas as <span className="font-bold text-emerald-400">{INVASAO_NAVES_ALVO} naves</span>. Galáxia segura! 🛸
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-2.5 border border-primary/40">
              <EnzoAvatar variante="capitao" tamanho="sm" />
              <div className="min-w-0">
                <p className="text-cyan-200 font-bold text-[10px] mb-0.5">Enzo</p>
                <p className="text-white text-xs italic leading-snug">
                  "Incrível! Próximo desafio?"
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/20">
              <p className="text-center text-white/60 text-[10px] mb-1.5">Resultados</p>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-green-500/20 rounded-lg py-1.5 px-1 text-center">
                  <p className="text-base font-bold text-green-400">
                    {INVASAO_NAVES_ALVO}/{INVASAO_NAVES_ALVO}
                  </p>
                  <p className="text-[9px] text-white/60">Acertos</p>
                </div>
                <div className="bg-red-500/20 rounded-lg py-1.5 px-1 text-center">
                  <p className="text-base font-bold text-red-400">0</p>
                  <p className="text-[9px] text-white/60">Erros</p>
                </div>
                <div className="bg-amber-500/20 rounded-lg py-1.5 px-1 text-center">
                  <p className="text-base font-bold text-amber-300">100%</p>
                  <p className="text-[9px] text-white/60">Precisão</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={aoRepetir}
              className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg"
            >
              🔄 Repetir
            </button>
            <button
              onClick={aoProximaFase}
              className="flex-1 bg-gradient-to-r from-primary to-cyan-500 hover:from-[#2C98B8] hover:to-cyan-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-1.5"
            >
              <Rocket className="w-4 h-4 shrink-0" />
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalDerrota({ aoRepetir, aoVoltar, acertos, erros }) {
  const totalTiros = acertos + erros;
  const precisao = totalTiros > 0 ? Math.round((acertos / totalTiros) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md sm:p-5">
      <div className="animate-scale-in mx-auto flex max-h-[90vh] w-[90%] max-w-sm flex-col overflow-hidden rounded-2xl border-2 border-orange-400/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl sm:w-full sm:max-w-md md:max-w-lg md:rounded-3xl md:border-4">
        <div className="shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 sm:px-4 sm:py-2.5">
          <h2 className="text-center text-lg font-bold text-white sm:text-xl">
            Missão incompleta
          </h2>
        </div>

        <div className="overflow-y-auto p-3 text-white sm:p-5">
          <div className="mb-2 flex justify-center">
            <span className="animate-pulse text-4xl sm:text-5xl">💔</span>
          </div>

          <div className="mb-4 space-y-2.5">
            <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-sm sm:p-3">
              <p className="mb-1 text-center text-sm font-bold text-orange-200 sm:text-base">
                Quase lá!
              </p>
              <p className="text-sm leading-snug text-center text-white/90">
                {acertos === INVASAO_NAVES_ALVO
                  ? 'Todas as naves caíram, mas a precisão não foi total. Treine de novo!'
                  : `Você acertou ${acertos}/${INVASAO_NAVES_ALVO} naves. Sem balas — tente outra vez!`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-gradient-to-r from-orange-500/15 to-amber-500/15 backdrop-blur-sm rounded-xl p-2.5 border border-orange-400/40">
              <EnzoAvatar variante="capitao" tamanho="sm" />
              <div className="min-w-0">
                <p className="text-orange-200 font-bold text-[10px] mb-0.5">Enzo</p>
                <p className="text-white text-xs italic leading-snug">
                  "Não desista — tente de novo!"
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/20">
              <p className="text-center text-white/60 text-[10px] mb-1.5">Resultados</p>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-green-500/20 rounded-lg py-1.5 px-1 text-center">
                  <p className="text-base font-bold text-green-400">
                    {acertos}/{INVASAO_NAVES_ALVO}
                  </p>
                  <p className="text-[9px] text-white/60">Acertos</p>
                </div>
                <div className="bg-red-500/20 rounded-lg py-1.5 px-1 text-center">
                  <p className="text-base font-bold text-red-400">{erros}</p>
                  <p className="text-[9px] text-white/60">Erros</p>
                </div>
                <div className={`${precisao === 100 ? 'bg-amber-500/20' : 'bg-orange-500/25'} rounded-lg py-1.5 px-1 text-center`}>
                  <p className={`text-base font-bold ${precisao === 100 ? 'text-amber-300' : 'text-orange-300'}`}>{precisao}%</p>
                  <p className="text-[9px] text-white/60">Precisão</p>
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] text-white/75 px-1">
              💡 Olhe <span className="font-semibold text-cyan-200">cor</span> e <span className="font-semibold text-cyan-200">posição</span>.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={aoVoltar}
              className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg"
            >
              Voltar
            </button>
            <button
              onClick={aoRepetir}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg"
            >
              🔄 De novo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpacePosition() {
  const navegar = useNavigate();
  const { ganharPontos, concluirMissao } = usePontosMissao('space-position');
  const premioVitoriaRef = useRef(false);
  const [mostrarConvocamento, setMostrarConvocamento] = useState(true);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [naves, setNaves] = useState([]);
  const [navesReaisOrdenadas, setNavesReaisOrdenadas] = useState([]); // Lista fixa para as dicas
  const [dicaAtual, setDicaAtual] = useState(0);
  const [balasRestantes, setBalasRestantes] = useState(INVASAO_BALAS_INICIAIS);
  const [navesAcertadas, setNavesAcertadas] = useState([]);
  const [navesErradas, setNavesErradas] = useState([]); // Rastrear erros
  const [estadoJogo, setEstadoJogo] = useState('jogando'); // 'jogando', 'vitoria', 'derrota'
  const [mensagemReforco, setMensagemReforco] = useState(false);
  const {
    definirMensagem,
    mostrarAcerto,
    mostrarErro,
    mostrarFim,
    mostrarInicio,
    props: enzoProps,
  } = useGuiaEnzo('space', { tema: 'escuro', posicao: 'inferior-esquerda' });

  useEffect(() => {
    if (estadoJogo === 'vitoria' && !premioVitoriaRef.current) {
      premioVitoriaRef.current = true;
      void ganharPontos(PONTOS_VITORIA);
      void concluirMissao();
    }
    if (estadoJogo === 'jogando') {
      premioVitoriaRef.current = false;
    }
  }, [estadoJogo, ganharPontos, concluirMissao]);

  // Inicializar naves quando o jogo começar
  useEffect(() => {
    if (jogoIniciado && naves.length === 0) {
      gerarNaves();
    }
  }, [jogoIniciado]);

  /** Reativa naves destruídas por erro; mantém as já acertadas na ordem das dicas e garante naves nos dois lados. */
  useEffect(() => {
    if (estadoJogo !== 'jogando' || !jogoIniciado || naves.length === 0) return;
    if (balasRestantes === 0 || navesAcertadas.length >= INVASAO_NAVES_ALVO) return;

    const acertadas = new Set(navesAcertadas);
    const navesAtivas = naves.filter((n) => !n.destruida);
    const alvoId = navesReaisOrdenadas[dicaAtual]?.id;
    const alvoNav = naves.find((n) => n.id === alvoId);
    const alvoIndisponivel = Boolean(alvoNav?.destruida);
    const ativasEsquerda = navesAtivas.filter((n) => n.posicao === 'esquerda');
    const ativasDireita = navesAtivas.filter((n) => n.posicao === 'direita');
    const ladoVazio = ativasEsquerda.length === 0 || ativasDireita.length === 0;
    const precisaRegenerar = navesAtivas.length === 0 || ladoVazio || alvoIndisponivel;

    if (!precisaRegenerar) return;

    const temOQueRegenerar = naves.some((n) => n.destruida && !acertadas.has(n.id));
    if (!temOQueRegenerar) return;

    setNaves((prev) =>
      prev.map((n) =>
        n.destruida && !acertadas.has(n.id) ? { ...n, destruida: false } : n,
      ),
    );
    setMensagemReforco(true);
  }, [naves, balasRestantes, estadoJogo, dicaAtual, navesAcertadas, navesReaisOrdenadas, jogoIniciado]);

  useEffect(() => {
    if (!mensagemReforco) return;
    const timer = setTimeout(() => setMensagemReforco(false), 3500);
    return () => clearTimeout(timer);
  }, [mensagemReforco]);

  function gerarNaves() {
    const novasNaves = [];

    // Todas as cores aparecem na esquerda E na direita — a dica só faz sentido com a POSIÇÃO.
    const coresEmAmbosLados = [
      { nome: 'vermelha', cor: '#dc6b5e' },
      { nome: 'azul', cor: '#5ea8dc' },
      { nome: 'verde', cor: '#67b887' },
      { nome: 'amarela', cor: '#e6d06e' },
      { nome: 'laranja', cor: '#e0a15f' },
      { nome: 'rosa', cor: '#d687b6' },
      { nome: 'cinza', cor: '#94a3b8' },
      { nome: 'roxa', cor: '#c084fc' },
    ];

    const configNaves = [
      ...coresEmAmbosLados.map((c) => ({ ...c, posicao: 'esquerda' })),
      ...coresEmAmbosLados.map((c) => ({ ...c, posicao: 'direita' })),
    ];

    const navesEsquerda = configNaves.filter((n) => n.posicao === 'esquerda');
    const navesDireita = configNaves.filter((n) => n.posicao === 'direita');

    navesEsquerda.sort(() => Math.random() - 0.5);
    navesDireita.sort(() => Math.random() - 0.5);

    const reaisEsquerda = navesEsquerda.slice(0, 8);
    const reaisDireita = navesDireita.slice(0, 7);

    const navesReais = [...reaisEsquerda, ...reaisDireita];
    const navesFalsas = configNaves.filter(
      (n) => !navesReais.some((nr) => nr.nome === n.nome && nr.posicao === n.posicao),
    );

    const filaEsquerda = embaralhar(SLOTS_ESQUERDA);
    const filaDireita = embaralhar(SLOTS_DIREITA);

    function consumirSlot(posicao: 'esquerda' | 'direita') {
      const fila = posicao === 'direita' ? filaDireita : filaEsquerda;
      const slot = fila.pop();
      if (!slot) {
        return posicao === 'direita' ? { x: 75, y: 40 } : { x: 19, y: 40 };
      }
      return slot;
    }

    // Criar naves REAIS
    navesReais.forEach((corInfo, index) => {
      const { x, y } = consumirSlot(corInfo.posicao);
      
      novasNaves.push({
        id: `real-${corInfo.posicao}-${index}-${corInfo.nome}`,
        tipo: 'real',
        cor: corInfo.cor,
        nome: corInfo.nome,
        posicao: corInfo.posicao,
        x: x,
        y: y,
        destruida: false,
      });
    });
    
    // Criar naves FALSAS
    navesFalsas.forEach((corInfo, index) => {
      const { x, y } = consumirSlot(corInfo.posicao);
      
      novasNaves.push({
        id: `falsa-${corInfo.posicao}-${index}-${corInfo.nome}`,
        tipo: 'falsa',
        cor: corInfo.cor,
        nome: corInfo.nome,
        posicao: corInfo.posicao,
        x: x,
        y: y,
        destruida: false,
      });
    });

    // Embaralhar ordem final das naves
    setNaves(novasNaves.sort(() => Math.random() - 0.5));

    // Ordem das dicas: aleatória (esquerda e direita podem repetir em sequência)
    const navesReaisLista = novasNaves.filter((n) => n.tipo === 'real');
    setNavesReaisOrdenadas(embaralhar(navesReaisLista));
  }

  function clicarNave(nave) {
    if (estadoJogo !== 'jogando' || nave.destruida || balasRestantes === 0) return;

    const naveAlvo = navesReaisOrdenadas[dicaAtual];

    const novoBalasRestantes = balasRestantes - 1;
    setBalasRestantes(novoBalasRestantes);

    if (nave.id === naveAlvo.id) {
      setNaves((prev) => prev.map((n) => (n.id === nave.id ? { ...n, destruida: true } : n)));

      const novosAcertos = navesAcertadas.length + 1;
      setNavesAcertadas((prev) => [...prev, nave.id]);

      if (novosAcertos === INVASAO_NAVES_ALVO) {
        mostrarFim();
        setEstadoJogo('vitoria');
      } else if (novoBalasRestantes === 0) {
        setEstadoJogo('derrota');
      } else {
        mostrarAcerto();
        setDicaAtual((prev) => prev + 1);
      }
    } else {
      setNavesErradas((prev) => [...prev, nave.id]);
      mostrarErro();

      // Hologramas permanecem no mapa; só naves reais erradas somem
      if (nave.tipo === 'real') {
        setNaves((prev) => prev.map((n) => (n.id === nave.id ? { ...n, destruida: true } : n)));
      }

      if (novoBalasRestantes === 0) {
        setEstadoJogo('derrota');
      }
    }
  }

  function reiniciarJogo() {
    setNaves([]);
    setDicaAtual(0);
    setBalasRestantes(INVASAO_BALAS_INICIAIS);
    setNavesAcertadas([]);
    setNavesErradas([]); // Limpar erros
    setEstadoJogo('jogando');
    setMensagemReforco(false);
    gerarNaves();
  }

  function voltarDashboard() {
    navegar('/dashboard');
  }

  function iniciarJogo() {
    setMostrarConvocamento(false);
    setJogoIniciado(true);
    mostrarInicio();
  }

  // Pegar a nave alvo atual
  const naveAlvo = navesReaisOrdenadas[dicaAtual];

  useEffect(() => {
    if (!jogoIniciado || estadoJogo !== 'jogando' || !naveAlvo) return;
    definirMensagem(
      `"A nave ${naveAlvo.nome.toUpperCase()} está na ${naveAlvo.posicao.toUpperCase()}!"`,
    );
  }, [dicaAtual, jogoIniciado, estadoJogo, naveAlvo, definirMensagem]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-[env(safe-area-inset-bottom)]">
      {/* Estrelas de fundo */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Modal de Convocamento */}
      {mostrarConvocamento && (
        <ModalConvocamento
          aoFechar={voltarDashboard}
          aoIniciar={iniciarJogo}
        />
      )}

      {/* Modal de Vitória */}
      {estadoJogo === 'vitoria' && (
        <ModalVitoria
          aoProximaFase={voltarDashboard}
          aoRepetir={reiniciarJogo}
        />
      )}

      {/* Modal de Derrota */}
      {estadoJogo === 'derrota' && (
        <ModalDerrota
          aoRepetir={reiniciarJogo}
          aoVoltar={voltarDashboard}
          acertos={navesAcertadas.length}
          erros={navesErradas.length}
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-slate-900/55 px-3 py-2 shadow-lg backdrop-blur-sm sm:gap-3 sm:px-6 sm:py-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={voltarDashboard}
            className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors active:bg-white/20 sm:h-10 sm:w-10 md:hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <Rocket className="hidden h-5 w-5 shrink-0 text-primary sm:block sm:h-6 sm:w-6" />
          <h2 className="min-w-0 text-base font-bold leading-tight text-white sm:text-xl md:text-2xl">
            Missão: Invasão Espacial
          </h2>
        </div>

        {/* Contador de balas */}
        {jogoIniciado && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/20 px-2.5 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
            <Crosshair className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
            <span className="whitespace-nowrap text-xs font-bold text-white sm:text-base">
              {balasRestantes} / {INVASAO_BALAS_INICIAIS} balas
            </span>
          </div>
        )}
      </div>

      {/* Área do Jogo: em telas pequenas o painel fica abaixo do céu */}
      {jogoIniciado && (
        <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Canvas do Céu com Naves */}
          <div className="relative min-h-[min(46vh,300px)] flex-1 lg:min-h-0">
            {/* EIXO CENTRAL - Nave Mãe + Laser */}
            <div className="absolute left-1/2 top-0 bottom-0 z-10 flex -translate-x-1/2 transform flex-col items-center">
              {/* Nave Mãe no topo */}
              <div className="relative mt-2 sm:mt-4">
                <div className="animate-pulse text-4xl sm:text-6xl lg:text-7xl">
                  🛸
                </div>
                <div className="absolute inset-0 opacity-50 blur-xl">
                  <div className="text-4xl sm:text-6xl lg:text-7xl">
                    🛸
                  </div>
                </div>
              </div>
              
              {/* Laser/Luz descendo - SUPER MELHORADO! */}
              <div className="relative w-14 flex-1 sm:w-20">
                {/* Camada 1 - Raio Central Brilhante */}
                <div className="absolute left-1/2 top-0 bottom-0 w-2 transform -translate-x-1/2 bg-gradient-to-b from-primary via-cyan-400 to-transparent animate-pulse"
                     style={{
                       boxShadow: '0 0 30px 8px rgba(0, 202, 252, 0.45), 0 0 60px 15px rgba(34, 211, 238, 0.25)',
                       animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                     }} 
                />
                
                {/* Camada 2 - Raio Externo Difuso */}
                <div className="absolute left-1/2 top-0 bottom-0 w-8 transform -translate-x-1/2 bg-gradient-to-b from-primary/30 via-cyan-300/20 to-transparent blur-md" />
                
                {/* Camada 3 - Raio Ultra Externo */}
                <div className="absolute left-1/2 top-0 bottom-0 w-16 transform -translate-x-1/2 bg-gradient-to-b from-primary/15 via-cyan-200/10 to-transparent blur-xl" />
                
                {/* Partículas de Energia Subindo */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 overflow-hidden">
                  <div className="absolute w-2 h-2 bg-white rounded-full animate-ping" 
                       style={{ 
                         top: '20%',
                         left: '50%',
                         transform: 'translateX(-50%)',
                         animationDelay: '0s',
                         animationDuration: '3s'
                       }} 
                  />
                  <div className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-ping" 
                       style={{ 
                         top: '50%',
                         left: '50%',
                         transform: 'translateX(-50%)',
                         animationDelay: '1s',
                         animationDuration: '3s'
                       }} 
                  />
                  <div className="absolute w-2 h-2 bg-blue-300 rounded-full animate-ping" 
                       style={{ 
                         top: '80%',
                         left: '50%',
                         transform: 'translateX(-50%)',
                         animationDelay: '2s',
                         animationDuration: '3s'
                       }} 
                  />
                </div>
                
                {/* Linha divisória fina central */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2 bg-white/50" />
              </div>
            </div>

            {naves.map((nave) => (
              <button
                type="button"
                key={nave.id}
                onClick={() => clicarNave(nave)}
                disabled={nave.destruida}
                className={`absolute touch-manipulation transition-all duration-300 ${
                  nave.destruida ? 'scale-0 opacity-0' : 'scale-100 opacity-100 active:scale-110 md:hover:scale-125'
                }`}
                style={{
                  left: `${nave.x}%`,
                  top: `${nave.y}%`,
                  transform: 'translate(-50%, -50%)',
                  filter: `drop-shadow(0 0 10px ${nave.cor})`,
                  cursor: nave.destruida ? 'default' : 'crosshair',
                }}
              >
                <div className="relative">
                  <span className="text-3xl sm:text-5xl lg:text-6xl">
                    🛸
                  </span>
                  {/* Indicador de cor para TODAS as naves */}
                  <div 
                    className="absolute -bottom-1 left-1/2 h-5 w-5 -translate-x-1/2 transform rounded-full border-[3px] border-white shadow-md sm:-bottom-2 sm:h-7 sm:w-7 sm:border-4 lg:h-8 lg:w-8"
                    style={{ backgroundColor: nave.cor }}
                  />
                </div>
              </button>
            ))}

            {/* Explosões */}
            {naves.filter(n => n.destruida).map((nave) => (
              <div
                key={`explosao-${nave.id}`}
                className="absolute text-3xl animate-ping sm:text-5xl"
                style={{
                  left: `${nave.x}%`,
                  top: `${nave.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                💥
              </div>
            ))}
          </div>

          {/* Painel de Dicas */}
          <div className="relative z-20 flex w-full flex-shrink-0 flex-col border-t border-white/10 bg-black/40 px-3 py-3 backdrop-blur-md sm:px-5 sm:py-5 lg:w-80 lg:border-l lg:border-t-0 lg:p-6">
            <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/25 text-lg sm:h-10 sm:w-10">
                📡
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white sm:text-lg">Radar</h3>
                <p className="text-xs text-cyan-200 sm:text-sm">Dicas da missão</p>
              </div>
            </div>

            {mensagemReforco && estadoJogo === 'jogando' && (
              <div className="mb-3 rounded-xl border border-cyan-300/50 bg-cyan-500/20 px-3 py-2 text-center text-xs font-semibold text-cyan-100 sm:text-sm">
                📡 Enzo: &quot;Reforço alienígena detectado — novas naves no radar!&quot;
              </div>
            )}

            {/* Dica Atual */}
            {estadoJogo === 'jogando' && naveAlvo && (
              <div className="mb-3 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/20 to-cyan-500/20 p-3 backdrop-blur-sm sm:mb-4 sm:rounded-2xl sm:p-5">
                <p className="mb-1.5 text-[10px] font-bold tracking-wide text-cyan-200 sm:mb-3 sm:text-sm">
                  📡 DICA ATUAL:
                </p>
                <div className="mb-2.5 rounded-lg bg-black/30 p-2.5 sm:mb-3 sm:rounded-xl sm:p-4">
                  <p className="text-center text-xs font-bold leading-snug text-white sm:text-base lg:text-lg">
                    "A nave{' '}
                    <span 
                      className="font-black uppercase"
                      style={{ color: naveAlvo.cor }}
                    >
                      {naveAlvo.nome}
                    </span>
                    {' '}está na{' '}
                    <span className="font-black uppercase text-cyan-200">
                      {naveAlvo.posicao}
                    </span>
                    !"
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="h-8 w-8 shrink-0 rounded-full border-2 border-white shadow-md sm:h-10 sm:w-10 sm:border-4"
                    style={{ backgroundColor: naveAlvo.cor }}
                  />
                  <span className="text-xl text-white sm:text-2xl">🛸</span>
                </div>
              </div>
            )}

            {/* Progresso */}
            <div className="mb-3 rounded-xl bg-white/10 p-3 sm:mb-4 sm:rounded-2xl sm:p-4">
              <p className="mb-1.5 text-[11px] text-white/70 sm:mb-2 sm:text-sm">Progresso</p>
              <div className="flex gap-1.5 sm:gap-2">
                {[...Array(INVASAO_NAVES_ALVO)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full sm:h-2 ${
                      i < navesAcertadas.length ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-center text-xs font-bold text-white sm:mt-2 sm:text-base">
                {navesAcertadas.length} / {INVASAO_NAVES_ALVO} naves
              </p>
            </div>

            {/* Estado do Jogo */}
            {estadoJogo === 'vitoria' && (
              <div className="mb-3 rounded-xl border-2 border-primary/50 bg-gradient-to-br from-primary/30 to-cyan-500/25 p-4 sm:mb-4 sm:rounded-2xl sm:p-5">
                <p className="mb-2 text-center text-3xl sm:mb-3 sm:text-4xl">🎉</p>
                <p className="mb-1 text-center text-base font-bold text-cyan-200 sm:mb-2 sm:text-xl">
                  MISSÃO CUMPRIDA!
                </p>
                <p className="text-center text-xs text-white sm:text-sm">
                  Você salvou a galáxia!
                </p>
              </div>
            )}

            {estadoJogo === 'derrota' && (
              <div className="mb-3 rounded-xl border-2 border-orange-300/70 bg-gradient-to-br from-orange-500/25 to-amber-500/25 p-4 sm:mb-4 sm:rounded-2xl sm:p-5">
                <p className="mb-2 text-center text-3xl sm:mb-3 sm:text-4xl">💔</p>
                <p className="mb-1 text-center text-base font-bold text-orange-200 sm:mb-2 sm:text-xl">
                  MISSÃO FALHOU!
                </p>
                <p className="text-center text-xs text-white sm:text-sm">
                  Você acertou um holograma!
                </p>
              </div>
            )}

            {/* Botão de Reiniciar */}
            {(estadoJogo === 'vitoria' || estadoJogo === 'derrota') && (
              <button
                type="button"
                onClick={reiniciarJogo}
                className="min-h-12 w-full touch-manipulation rounded-2xl bg-gradient-to-r from-primary to-cyan-500 py-3 font-bold text-white shadow-lg transition-all active:scale-[0.99] md:hover:scale-105 md:hover:from-[#2C98B8] md:hover:to-cyan-600"
              >
                🔄 Tentar Novamente
              </button>
            )}
          </div>
        </div>
      )}

      <GuiaEnzo {...enzoProps} visivel={jogoIniciado && estadoJogo === 'jogando'} />
    </div>
  );
}