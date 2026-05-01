import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Rocket, Target, Zap, Heart, Crosshair } from 'lucide-react';

function ModalConvocamento({ aoFechar, aoIniciar }) {
  return (
    <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full border-4 border-primary/50 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header com estrelas */}
        <div className="bg-primary/80 px-6 py-3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-10 text-2xl">⭐</div>
            <div className="absolute top-1 right-20 text-xl">✨</div>
            <div className="absolute bottom-2 left-1/3 text-lg">🌟</div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center relative z-10">
            🚀 CONVOCAMENTO URGENTE 🚀
          </h2>
        </div>

        {/* Conteúdo */}
        <div className="p-4 sm:p-6 text-white overflow-y-auto">
          {/* Avatar do companheiro */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center shadow-xl border-4 border-cyan-300/60">
              <span className="text-4xl">🤖</span>
            </div>
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
                  <span>Você tem <span className="font-bold text-yellow-300">5 balas</span> em sua nave</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Existem <span className="font-bold text-red-400">5 naves reais</span> e <span className="font-bold text-purple-400">7 hologramas falsos</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>
                    As <span className="font-bold text-cyan-200">mesmas cores</span> aparecem dos dois lados — use a{' '}
                    <span className="font-bold text-cyan-300">posição</span> da dica (esquerda/direita), não só a cor
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>Se acertar um holograma, <span className="font-bold text-red-400">você perde!</span></span>
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
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full border-2 sm:border-4 border-primary/50 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-primary to-cyan-500 px-4 py-2.5 relative overflow-hidden shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-white text-center relative z-10">
            🏆 Missão cumprida!
          </h2>
        </div>

        <div className="p-4 sm:p-5 text-white overflow-y-auto">
          <div className="flex justify-center mb-2">
            <span className="text-4xl sm:text-5xl animate-bounce">🎉</span>
          </div>

          <div className="space-y-2.5 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-base font-bold text-cyan-200 text-center mb-1">
                Parabéns, piloto!
              </p>
              <p className="text-sm leading-snug text-center text-white/90">
                Você eliminou todas as <span className="font-bold text-emerald-400">5 naves</span>. Galáxia segura! 🛸
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-2.5 border border-primary/40">
              <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center border-2 border-cyan-300/60">
                <span className="text-lg">🤖</span>
              </div>
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
                  <p className="text-base font-bold text-green-400">5/5</p>
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
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full border-2 sm:border-4 border-orange-400/50 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-white text-center">
            Missão incompleta
          </h2>
        </div>

        <div className="p-4 sm:p-5 text-white overflow-y-auto">
          <div className="flex justify-center mb-2">
            <span className="text-4xl sm:text-5xl animate-pulse">💔</span>
          </div>

          <div className="space-y-2.5 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-base font-bold text-orange-200 text-center mb-1">
                Quase lá!
              </p>
              <p className="text-sm leading-snug text-center text-white/90">
                {acertos === 5
                  ? 'Todas as naves caíram, mas a precisão não foi total. Treine de novo!'
                  : `Você acertou ${acertos}/5 naves. Sem balas — tente outra vez!`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-gradient-to-r from-orange-500/15 to-amber-500/15 backdrop-blur-sm rounded-xl p-2.5 border border-orange-400/40">
              <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center border-2 border-cyan-300/50">
                <span className="text-lg">🤖</span>
              </div>
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
                  <p className="text-base font-bold text-green-400">{acertos}/5</p>
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
  const [mostrarConvocamento, setMostrarConvocamento] = useState(true);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [naves, setNaves] = useState([]);
  const [navesReaisOrdenadas, setNavesReaisOrdenadas] = useState([]); // Lista fixa para as dicas
  const [dicaAtual, setDicaAtual] = useState(0);
  const [balasRestantes, setBalasRestantes] = useState(5);
  const [navesAcertadas, setNavesAcertadas] = useState([]);
  const [navesErradas, setNavesErradas] = useState([]); // Rastrear erros
  const [estadoJogo, setEstadoJogo] = useState('jogando'); // 'jogando', 'vitoria', 'derrota'

  // Inicializar naves quando o jogo começar
  useEffect(() => {
    if (jogoIniciado && naves.length === 0) {
      gerarNaves();
    }
  }, [jogoIniciado]);

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
    ];

    const configNaves = [
      ...coresEmAmbosLados.map((c) => ({ ...c, posicao: 'esquerda' })),
      ...coresEmAmbosLados.map((c) => ({ ...c, posicao: 'direita' })),
    ];

    const navesEsquerda = configNaves.filter((n) => n.posicao === 'esquerda');
    const navesDireita = configNaves.filter((n) => n.posicao === 'direita');

    navesEsquerda.sort(() => Math.random() - 0.5);
    navesDireita.sort(() => Math.random() - 0.5);

    const reaisEsquerda = navesEsquerda.slice(0, 2);
    const reaisDireita = navesDireita.slice(0, 3);

    const navesReais = [...reaisEsquerda, ...reaisDireita];
    const navesFalsas = configNaves.filter(
      (n) => !navesReais.some((nr) => nr.nome === n.nome && nr.posicao === n.posicao),
    );
    
    // Função para verificar se uma posição está muito próxima de outras naves
    function estaProxima(x, y, navesExistentes, distanciaMinima = 14) {
      return navesExistentes.some(nave => {
        const distanciaX = Math.abs(nave.x - x);
        const distanciaY = Math.abs(nave.y - y);
        const distancia = Math.sqrt(distanciaX ** 2 + distanciaY ** 2);
        return distancia < distanciaMinima;
      });
    }
    
    // Função para gerar posição válida (sem sobreposição)
    function gerarPosicaoValida(ehDireita, navesExistentes) {
      const maxTentativas = 100;
      let tentativa = 0;
      
      while (tentativa < maxTentativas) {
        const x = ehDireita 
          ? Math.random() * 42 + 53  // direita: 53-95%
          : Math.random() * 42 + 5;   // esquerda: 5-47%
        const y = Math.random() * 70 + 15; // 15-85%
        
        if (!estaProxima(x, y, navesExistentes)) {
          return { x, y };
        }
        
        tentativa++;
      }
      
      // Fallback com posições mais garantidas
      const fallbackX = ehDireita 
        ? 70 + (Math.random() * 15)
        : 15 + (Math.random() * 15);
      const fallbackY = 30 + (Math.random() * 40);
      
      return { x: fallbackX, y: fallbackY };
    }
    
    // Criar naves REAIS
    navesReais.forEach((corInfo, index) => {
      const ehDireita = corInfo.posicao === 'direita';
      const { x, y } = gerarPosicaoValida(ehDireita, novasNaves);
      
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
      const ehDireita = corInfo.posicao === 'direita';
      const { x, y } = gerarPosicaoValida(ehDireita, novasNaves);
      
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

    // Ordenar as naves reais para as dicas (da esquerda para direita)
    const navesReaisLista = novasNaves.filter(n => n.tipo === 'real');
    const navesOrdenadas = navesReaisLista.sort((a, b) => a.x - b.x);
    setNavesReaisOrdenadas(navesOrdenadas);
    
    console.log('🎮 NAVES REAIS GERADAS (ordem das dicas):');
    navesOrdenadas.forEach((n, i) => {
      console.log(`  ${i + 1}. ${n.nome.toUpperCase()} (${n.posicao}) - ID: ${n.id} - X: ${n.x.toFixed(1)}% - Cor: ${n.cor}`);
    });
    
    console.log('📊 DISTRIBUIÇÃO COMPLETA:');
    console.log('  ESQUERDA - REAIS:', novasNaves.filter(n => n.posicao === 'esquerda' && n.tipo === 'real').map(n => n.nome));
    console.log('  ESQUERDA - FALSAS:', novasNaves.filter(n => n.posicao === 'esquerda' && n.tipo === 'falsa').map(n => n.nome));
    console.log('  DIREITA - REAIS:', novasNaves.filter(n => n.posicao === 'direita' && n.tipo === 'real').map(n => n.nome));
    console.log('  DIREITA - FALSAS:', novasNaves.filter(n => n.posicao === 'direita' && n.tipo === 'falsa').map(n => n.nome));
    
    // Verificar cores repetidas
    const coresNaEsquerda = new Set(novasNaves.filter(n => n.posicao === 'esquerda').map(n => n.nome));
    const coresNaDireita = new Set(novasNaves.filter(n => n.posicao === 'direita').map(n => n.nome));
    const coresEmAmbos = [...coresNaEsquerda].filter(c => coresNaDireita.has(c));
    console.log('🔄 CORES PRESENTES EM AMBOS LADOS:', coresEmAmbos);
  }

  function clicarNave(nave) {
    if (estadoJogo !== 'jogando' || nave.destruida || balasRestantes === 0) return;

    // Verificar se é a nave certa (a da dica atual)
    const naveAlvo = navesReaisOrdenadas[dicaAtual];
    
    console.log('Clicou na nave:', { id: nave.id, nome: nave.nome, cor: nave.cor, tipo: nave.tipo });
    console.log('Nave alvo esperada:', { id: naveAlvo.id, nome: naveAlvo.nome, cor: naveAlvo.cor });
    console.log('Comparação:', nave.id === naveAlvo.id ? 'ACERTOU!' : 'ERROU!');
    
    // Decrementar balas independente de acerto ou erro
    const novoBalasRestantes = balasRestantes - 1;
    setBalasRestantes(novoBalasRestantes);
    
    if (nave.id === naveAlvo.id) {
      // ACERTOU!
      console.log('✅ ACERTOU A NAVE CERTA!');
      setNaves(prev => prev.map(n => 
        n.id === nave.id ? { ...n, destruida: true } : n
      ));
      
      const novosAcertos = navesAcertadas.length + 1;
      setNavesAcertadas(prev => [...prev, nave.id]);
      
      // Verificar vitória (acertou todas as 5 naves)
      if (novosAcertos === 5) {
        console.log('🎉 VITÓRIA!');
        setEstadoJogo('vitoria');
      } else if (novoBalasRestantes === 0) {
        // Acabaram as balas mas não acertou todas
        console.log('❌ DERROTA - Balas acabaram!');
        setEstadoJogo('derrota');
      } else {
        console.log('➡️ Próxima dica:', dicaAtual + 1);
        setDicaAtual(prev => prev + 1);
      }
    } else {
      // ERROU!
      console.log('❌ ERROU! Tipo da nave clicada:', nave.tipo);
      setNavesErradas(prev => [...prev, nave.id]);
      
      // Marcar a nave falsa como "errada" visualmente
      setNaves(prev => prev.map(n => 
        n.id === nave.id ? { ...n, destruida: true } : n
      ));
      
      // Verificar se acabaram as balas ou se ainda tem chance
      if (novoBalasRestantes === 0) {
        console.log('❌ DERROTA - Balas acabaram!');
        setEstadoJogo('derrota');
      } else {
        console.log('⚠️ Errou mas ainda tem balas:', novoBalasRestantes);
      }
    }
  }

  function reiniciarJogo() {
    setNaves([]);
    setDicaAtual(0);
    setBalasRestantes(5);
    setNavesAcertadas([]);
    setNavesErradas([]); // Limpar erros
    setEstadoJogo('jogando');
    gerarNaves();
  }

  function voltarDashboard() {
    navegar('/dashboard');
  }

  function iniciarJogo() {
    setMostrarConvocamento(false);
    setJogoIniciado(true);
  }

  // Pegar a nave alvo atual
  const naveAlvo = navesReaisOrdenadas[dicaAtual];

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
              {balasRestantes} / 5 balas
            </span>
          </div>
        )}
      </div>

      {/* Área do Jogo: em telas pequenas o painel fica abaixo do céu */}
      {jogoIniciado && (
        <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Canvas do Céu com Naves */}
          <div className="relative min-h-[min(42vh,280px)] flex-1 lg:min-h-0">
            {/* EIXO CENTRAL - Nave Mãe + Laser */}
            <div className="absolute left-1/2 top-0 bottom-0 z-10 flex -translate-x-1/2 transform flex-col items-center">
              {/* Nave Mãe no topo */}
              <div className="relative mt-2 sm:mt-4">
                <div className="animate-pulse text-5xl sm:text-6xl lg:text-7xl">
                  🛸
                </div>
                <div className="absolute inset-0 opacity-50 blur-xl">
                  <div className="text-5xl sm:text-6xl lg:text-7xl">
                    🛸
                  </div>
                </div>
              </div>
              
              {/* Laser/Luz descendo - SUPER MELHORADO! */}
              <div className="flex-1 relative w-20">
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
                  <span className="text-5xl sm:text-6xl">
                    🛸
                  </span>
                  {/* Indicador de cor para TODAS as naves */}
                  <div 
                    className="absolute -bottom-2 left-1/2 h-7 w-7 -translate-x-1/2 transform rounded-full border-4 border-white shadow-lg sm:h-8 sm:w-8"
                    style={{ backgroundColor: nave.cor }}
                  />
                </div>
              </button>
            ))}

            {/* Explosões */}
            {naves.filter(n => n.destruida).map((nave) => (
              <div
                key={`explosao-${nave.id}`}
                className="absolute text-5xl animate-ping"
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

          {/* Painel do Enzo (Dicas) */}
          <div className="relative z-20 flex w-full flex-shrink-0 flex-col border-t border-white/10 bg-black/40 p-4 backdrop-blur-md sm:p-5 lg:w-80 lg:border-l lg:border-t-0 lg:p-6">
            {/* Avatar do Enzo */}
            <div className="mb-4 flex items-center gap-3 sm:mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-cyan-300/60 bg-gradient-to-br from-primary to-cyan-500 shadow-xl sm:h-16 sm:w-16">
                <span className="text-2xl sm:text-3xl">🤖</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white sm:text-lg">Enzo</h3>
                <p className="text-sm text-cyan-200">Seu copiloto</p>
              </div>
            </div>

            {/* Dica Atual */}
            {estadoJogo === 'jogando' && naveAlvo && (
              <div className="mb-3 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/20 to-cyan-500/20 p-4 backdrop-blur-sm sm:mb-4 sm:p-5">
                <p className="mb-2 text-xs font-bold text-cyan-200 sm:mb-3 sm:text-sm">📡 DICA ATUAL:</p>
                <div className="mb-3 rounded-xl bg-black/30 p-3 sm:p-4">
                  <p className="text-center text-base font-bold text-white sm:text-lg">
                    "A nave{' '}
                    <span 
                      className="font-black uppercase"
                      style={{ color: naveAlvo.cor }}
                    >
                      {naveAlvo.nome}
                    </span>
                    {' '}está na{' '}
                    <span className="text-cyan-200 uppercase font-black">
                      {naveAlvo.posicao}
                    </span>
                    !"
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-full border-4 border-white shadow-lg"
                    style={{ backgroundColor: naveAlvo.cor }}
                  />
                  <span className="text-white text-2xl">🛸</span>
                </div>
              </div>
            )}

            {/* Progresso */}
            <div className="bg-white/10 rounded-2xl p-4 mb-4">
              <p className="text-white/70 text-sm mb-2">Progresso:</p>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${
                      i < navesAcertadas.length ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <p className="text-white font-bold text-center mt-2">
                {navesAcertadas.length} / 5 naves eliminadas
              </p>
            </div>

            {/* Estado do Jogo */}
            {estadoJogo === 'vitoria' && (
              <div className="bg-gradient-to-br from-primary/30 to-cyan-500/25 rounded-2xl p-5 border-2 border-primary/50 mb-4">
                <p className="text-4xl text-center mb-3">🎉</p>
                <p className="text-cyan-200 font-bold text-xl text-center mb-2">
                  MISSÃO CUMPRIDA!
                </p>
                <p className="text-white text-center text-sm">
                  Você salvou a galáxia!
                </p>
              </div>
            )}

            {estadoJogo === 'derrota' && (
              <div className="bg-gradient-to-br from-orange-500/25 to-amber-500/25 rounded-2xl p-5 border-2 border-orange-300/70 mb-4">
                <p className="text-4xl text-center mb-3">💔</p>
                <p className="text-orange-200 font-bold text-xl text-center mb-2">
                  MISSÃO FALHOU!
                </p>
                <p className="text-white text-center text-sm">
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
    </div>
  );
}