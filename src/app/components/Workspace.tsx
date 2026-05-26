import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Eraser, Shapes } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MathSymbolsBackground } from './MathSymbolsBackground';
import {
  COR_PRIMARIA,
  COR_SUCESSO,
  SEGMENTO_GLOW,
  VERTICE_RAIO,
  VERTICE_ROTACIONADOR,
} from '../constants/matmakerBrand';

// ESCALA: 1cm = 20 pixels
const ESCALA = 20;

/** Estilo visual do segmento (equivalente Konva: criarSegmento + shadowBlur/shadowColor). */
function criarSegmento(
  segmento: { cor: string },
  ponta1Grudada: boolean,
  ponta2Grudada: boolean,
) {
  const emSnap = Boolean(ponta1Grudada || ponta2Grudada);
  return {
    stroke: emSnap ? COR_SUCESSO : segmento.cor,
    fill: emSnap ? COR_SUCESSO : segmento.cor,
    shadowBlur: SEGMENTO_GLOW.shadowBlur,
    shadowColor: SEGMENTO_GLOW.shadowColor,
  };
}

/** Cor do vértice: pivô (azul) vs rotacionador (laranja); snap = laranja. */
function corVertice(
  ponta: 'ponta1' | 'ponta2',
  arrastando: string | null,
  grudada: boolean,
) {
  if (grudada) return COR_SUCESSO;
  if (arrastando === 'ponta1') {
    return ponta === 'ponta1' ? VERTICE_ROTACIONADOR : VERTICE_PIVO;
  }
  if (arrastando === 'ponta2') {
    return ponta === 'ponta2' ? VERTICE_ROTACIONADOR : VERTICE_PIVO;
  }
  return ponta === 'ponta1' ? VERTICE_PIVO : VERTICE_ROTACIONADOR;
}

// Configurações dos diferentes tipos de triângulos (apenas para referência educativa)
const TRIANGULOS = {
  equilatero: {
    nome: 'Equilátero',
    descricao: '3 lados iguais',
    emoji: '🔺',
    retas: [
      { tamanho: 10, cor: '#4fc3f7', nome: 'Reta 1' },
      { tamanho: 10, cor: '#81d4a6', nome: 'Reta 2' },
      { tamanho: 10, cor: '#ffb347', nome: 'Reta 3' },
      { tamanho: 5, cor: '#f472b6', nome: 'Reta 4' },
      { tamanho: 8, cor: '#a78bfa', nome: 'Reta 5' },
      { tamanho: 15, cor: '#fb923c', nome: 'Reta 6' },
    ],
  },
  isosceles: {
    nome: 'Isósceles',
    descricao: '2 lados iguais',
    emoji: '🔻',
    retas: [
      { tamanho: 11, cor: '#81d4a6', nome: 'Reta 1' },
      { tamanho: 11, cor: '#4fc3f7', nome: 'Reta 2' },
      { tamanho: 12, cor: '#ffb347', nome: 'Reta 3' },
      { tamanho: 4, cor: '#f472b6', nome: 'Reta 4' },
      { tamanho: 6, cor: '#a78bfa', nome: 'Reta 5' },
      { tamanho: 25, cor: '#fb923c', nome: 'Reta 6' },
    ],
  },
  escaleno: {
    nome: 'Escaleno',
    descricao: '3 lados diferentes',
    emoji: '📐',
    retas: [
      { tamanho: 14, cor: '#a78bfa', nome: 'Reta 1' },
      { tamanho: 15, cor: '#ffb347', nome: 'Reta 2' },
      { tamanho: 10, cor: '#81d4a6', nome: 'Reta 3' },
      { tamanho: 3, cor: '#4fc3f7', nome: 'Reta 4' },
      { tamanho: 5, cor: '#f472b6', nome: 'Reta 5' },
      { tamanho: 30, cor: '#fb923c', nome: 'Reta 6' },
    ],
  },
  retangulo: {
    nome: 'Retângulo',
    descricao: 'Com ângulo de 90°',
    emoji: '📏',
    retas: [
      { tamanho: 12, cor: '#ffb347', nome: 'Reta 1' },
      { tamanho: 9, cor: '#81d4a6', nome: 'Reta 2' },
      { tamanho: 15, cor: '#4fc3f7', nome: 'Reta 3' },
      { tamanho: 4, cor: '#f472b6', nome: 'Reta 4' },
      { tamanho: 6, cor: '#a78bfa', nome: 'Reta 5' },
      { tamanho: 22, cor: '#fb923c', nome: 'Reta 6' },
    ],
  },
  livre: {
    nome: 'Livre',
    descricao: 'Experimente!',
    emoji: '✨',
    retas: [
      { tamanho: 8, cor: '#4fc3f7', nome: 'Reta 1' },
      { tamanho: 10, cor: '#81d4a6', nome: 'Reta 2' },
      { tamanho: 12, cor: '#ffb347', nome: 'Reta 3' },
      { tamanho: 15, cor: '#a78bfa', nome: 'Reta 4' },
      { tamanho: 6, cor: '#f472b6', nome: 'Reta 5' },
      { tamanho: 20, cor: '#fb923c', nome: 'Reta 6' },
      { tamanho: 3, cor: '#ec4899', nome: 'Reta 7' },
      { tamanho: 25, cor: '#8b5cf6', nome: 'Reta 8' },
    ],
  },
};

function calcularDistancia(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function PecaArrastavel({ segmento, index }) {
  const [{ estaArrastando }, refArrastar] = useDrag(() => ({
    type: 'SEGMENTO',
    item: { segmento, origem: 'caixa' },
    collect: (monitor) => ({
      estaArrastando: monitor.isDragging(),
    }),
  }), [segmento]);

  const largura = (segmento.tamanho / 25) * 100;

  return (
    <div
      ref={refArrastar}
      className="cursor-move rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm transition-all hover:shadow-md"
      style={{
        opacity: estaArrastando ? 0.5 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">
          {segmento.nome}
        </span>
        <span className="text-xs text-muted-foreground font-bold">
          {segmento.tamanho} cm
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{
          backgroundColor: segmento.cor,
          width: Math.min(largura, 100) + '%',
        }}
      ></div>
      <div className="mt-2 text-xs text-center text-muted-foreground">
        ∞ ilimitado
      </div>
    </div>
  );
}

function SegmentoNoCanvas({ segmento, indice, aoAtualizar, aoRemover, todasAsRetas }) {
  const [arrastando, setArrastando] = useState(null);
  const [offsetInicial, setOffsetInicial] = useState({ x: 0, y: 0 });
  const [hoverPonta, setHoverPonta] = useState(null);

  // Encontrar todas as pontas de outras retas (exceto a atual)
  function encontrarPontasProximas(x, y, raio = 50) {
    const pontasProximas = [];
    
    todasAsRetas.forEach((reta, idx) => {
      if (idx === indice) return; // Pular a própria reta
      
      // Verificar ponta 1
      const dist1 = calcularDistancia(x, y, reta.x1, reta.y1);
      if (dist1 < raio) {
        pontasProximas.push({ x: reta.x1, y: reta.y1, distancia: dist1 });
      }
      
      // Verificar ponta 2
      const dist2 = calcularDistancia(x, y, reta.x2, reta.y2);
      if (dist2 < raio) {
        pontasProximas.push({ x: reta.x2, y: reta.y2, distancia: dist2 });
      }
    });
    
    // Retornar a ponta mais próxima
    if (pontasProximas.length > 0) {
      pontasProximas.sort((a, b) => a.distancia - b.distancia);
      return pontasProximas[0];
    }
    
    return null;
  }

  function iniciarArrasteCorpo(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const canvasRect = document.getElementById('canvas-svg')?.getBoundingClientRect();
    if (!canvasRect) return;

    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    
    setOffsetInicial({
      x: mouseX - segmento.x1,
      y: mouseY - segmento.y1,
    });
    
    setArrastando('corpo');
  }

  function iniciarArrastePonta(ponta, e) {
    e.stopPropagation();
    e.preventDefault();
    setArrastando(ponta);
  }

  function mover(e) {
    if (!arrastando) return;

    const canvasRect = document.getElementById('canvas-svg')?.getBoundingClientRect();
    if (!canvasRect) return;

    let mouseX = e.clientX - canvasRect.left;
    let mouseY = e.clientY - canvasRect.top;

    if (arrastando === 'corpo') {
      const novoX1 = mouseX - offsetInicial.x;
      const novoY1 = mouseY - offsetInicial.y;
      const deltaX = novoX1 - segmento.x1;
      const deltaY = novoY1 - segmento.y1;
      
      aoAtualizar({
        x1: segmento.x1 + deltaX,
        y1: segmento.y1 + deltaY,
        x2: segmento.x2 + deltaX,
        y2: segmento.y2 + deltaY,
      });
    } else if (arrastando === 'ponta1') {
      // Verificar se há pontas próximas para grudar
      const pontaProxima = encontrarPontasProximas(mouseX, mouseY);
      if (pontaProxima) {
        mouseX = pontaProxima.x;
        mouseY = pontaProxima.y;
      }

      const dx = mouseX - segmento.x2;
      const dy = mouseY - segmento.y2;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      
      if (distancia > 0) {
        const tamanhoPixels = segmento.tamanho * ESCALA;
        const fator = tamanhoPixels / distancia;
        const novoX1 = segmento.x2 + dx * fator;
        const novoY1 = segmento.y2 + dy * fator;
        
        aoAtualizar({
          x1: novoX1,
          y1: novoY1,
        });
      }
    } else if (arrastando === 'ponta2') {
      // Verificar se há pontas próximas para grudar
      const pontaProxima = encontrarPontasProximas(mouseX, mouseY);
      if (pontaProxima) {
        mouseX = pontaProxima.x;
        mouseY = pontaProxima.y;
      }

      const dx = mouseX - segmento.x1;
      const dy = mouseY - segmento.y1;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      
      if (distancia > 0) {
        const tamanhoPixels = segmento.tamanho * ESCALA;
        const fator = tamanhoPixels / distancia;
        const novoX2 = segmento.x1 + dx * fator;
        const novoY2 = segmento.y1 + dy * fator;
        
        aoAtualizar({
          x2: novoX2,
          y2: novoY2,
        });
      }
    }
  }

  function parar() {
    setArrastando(null);
  }

  const x1 = segmento.x1;
  const y1 = segmento.y1;
  const x2 = segmento.x2;
  const y2 = segmento.y2;

  // Verificar se as pontas estão grudadas em outras retas
  const ponta1Grudada = encontrarPontasProximas(x1, y1, 5);
  const ponta2Grudada = encontrarPontasProximas(x2, y2, 5);
  const visual = criarSegmento(segmento, Boolean(ponta1Grudada), Boolean(ponta2Grudada));

  // Calcular tamanho atual em cm
  const tamanhoAtualPixels = calcularDistancia(x1, y1, x2, y2);
  const tamanhoAtualCm = (tamanhoAtualPixels / ESCALA).toFixed(1);

  // Área clicável maior para retas pequenas
  const larguraClicavel = Math.max(60, tamanhoAtualPixels * 0.5);

  return (
    <g
      onMouseMove={mover}
      onMouseUp={parar}
      onMouseLeave={parar}
      style={{ userSelect: 'none' }}
    >
      {/* Linha INVISÍVEL GROSSA para facilitar o clique */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth={larguraClicavel}
        strokeLinecap="round"
        style={{ 
          cursor: arrastando === 'corpo' ? 'grabbing' : 'move',
          userSelect: 'none',
        }}
        onMouseDown={iniciarArrasteCorpo}
      />
      
      {/* Linha visível — brilho tecnológico (shadowBlur / shadowColor do Konva) */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={visual.stroke}
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#segmento-glow)"
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Label com tamanho em CM */}
      <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 10})`}>
        <rect
          x="-25"
          y="-15"
          width="50"
          height="20"
          fill="white"
          stroke={visual.stroke}
          strokeWidth="2"
          rx="6"
          style={{ pointerEvents: 'none' }}
        />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontSize="12"
          fill={visual.stroke}
          fontWeight="bold"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {tamanhoAtualCm}cm
        </text>
      </g>

      {/* Círculo invisível GRANDE para facilitar o clique - Ponta 1 */}
      <circle
        cx={x1}
        cy={y1}
        r={VERTICE_RAIO + 2}
        fill="transparent"
        style={{ 
          cursor: arrastando === 'ponta1' ? 'grabbing' : 'pointer',
          userSelect: 'none',
          pointerEvents: arrastando && arrastando !== 'ponta1' ? 'none' : 'auto',
        }}
        onMouseDown={(e) => iniciarArrastePonta('ponta1', e)}
        onMouseEnter={() => setHoverPonta('ponta1')}
        onMouseLeave={() => setHoverPonta(null)}
      />

      {/* Círculo visível — pivô (azul) / rotacionador (laranja) / snap (laranja) */}
      <circle
        cx={x1}
        cy={y1}
        r={VERTICE_RAIO}
        fill={corVertice('ponta1', arrastando, Boolean(ponta1Grudada))}
        stroke="white"
        strokeWidth="3"
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Indicador de rotação - Ponta 1 */}
      {(hoverPonta === 'ponta1' || arrastando === 'ponta1') && (
        <circle
          cx={x1}
          cy={y1}
          r="18"
          fill="none"
          stroke={VERTICE_ROTACIONADOR}
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.6"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Círculo invisível GRANDE para facilitar o clique - Ponta 2 */}
      <circle
        cx={x2}
        cy={y2}
        r={VERTICE_RAIO + 2}
        fill="transparent"
        style={{ 
          cursor: arrastando === 'ponta2' ? 'grabbing' : 'pointer',
          userSelect: 'none',
          pointerEvents: arrastando && arrastando !== 'ponta2' ? 'none' : 'auto',
        }}
        onMouseDown={(e) => iniciarArrastePonta('ponta2', e)}
        onMouseEnter={() => setHoverPonta('ponta2')}
        onMouseLeave={() => setHoverPonta(null)}
      />

      {/* Círculo visível — pivô (azul) / rotacionador (laranja) / snap (laranja) */}
      <circle
        cx={x2}
        cy={y2}
        r={VERTICE_RAIO}
        fill={corVertice('ponta2', arrastando, Boolean(ponta2Grudada))}
        stroke="white"
        strokeWidth="3"
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Indicador de rotação - Ponta 2 */}
      {(hoverPonta === 'ponta2' || arrastando === 'ponta2') && (
        <circle
          cx={x2}
          cy={y2}
          r="18"
          fill="none"
          stroke={VERTICE_ROTACIONADOR}
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.6"
          style={{ pointerEvents: 'none' }}
        />
      )}

      <g transform={`translate(${(x1 + x2) / 2 - 15}, ${(y1 + y2) / 2 + 25})`}>
        <rect
          width="30"
          height="26"
          fill="#ef4444"
          stroke="white"
          strokeWidth="2"
          rx="8"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            aoRemover();
          }}
        />
        <text
          x="15"
          y="18"
          textAnchor="middle"
          fontSize="18"
          fill="white"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          fontWeight="bold"
        >
          ×
        </text>
      </g>
    </g>
  );
}

function CanvasInterativo({ segmentosNoCanvas, setSegmentosNoCanvas, tipoAtual }) {
  const config = TRIANGULOS[tipoAtual];
  const [retaAtiva, setRetaAtiva] = useState(null);
  
  const [{ estaAcimaDaArea }, refSoltar] = useDrop(() => ({
    accept: 'SEGMENTO',
    drop: (item, monitor) => {
      const offsetCanvas = monitor.getClientOffset();
      const canvasRect = document.getElementById('canvas-svg')?.getBoundingClientRect();
      
      if (offsetCanvas && canvasRect) {
        const x = offsetCanvas.x - canvasRect.left;
        const y = offsetCanvas.y - canvasRect.top;
        
        const comprimentoPixels = item.segmento.tamanho * ESCALA;
        
        setSegmentosNoCanvas([
          ...segmentosNoCanvas,
          {
            ...item.segmento,
            x1: x - comprimentoPixels / 2,
            y1: y,
            x2: x + comprimentoPixels / 2,
            y2: y,
            id: Date.now() + Math.random(),
          },
        ]);
      }
    },
    collect: (monitor) => ({
      estaAcimaDaArea: monitor.isOver(),
    }),
  }), [segmentosNoCanvas]);

  function atualizarSegmento(indice, novasPropriedades) {
    setSegmentosNoCanvas(segmentos => {
      const novosSegmentos = [...segmentos];
      novosSegmentos[indice] = { ...novosSegmentos[indice], ...novasPropriedades };
      return novosSegmentos;
    });
  }

  function removerSegmento(indice) {
    setSegmentosNoCanvas(segmentos => segmentos.filter((_, i) => i !== indice));
  }

  function verificarTrianguloFechado() {
    if (segmentosNoCanvas.length !== 3) return false;

    // Verificar se as 3 retas formam um triângulo fechado
    const tolerancia = 5;
    let conexoes = 0;
    
    for (let i = 0; i < segmentosNoCanvas.length; i++) {
      for (let j = i + 1; j < segmentosNoCanvas.length; j++) {
        const reta1 = segmentosNoCanvas[i];
        const reta2 = segmentosNoCanvas[j];
        
        // Verificar todas as combinações de pontas
        if (calcularDistancia(reta1.x1, reta1.y1, reta2.x1, reta2.y1) < tolerancia) conexoes++;
        if (calcularDistancia(reta1.x1, reta1.y1, reta2.x2, reta2.y2) < tolerancia) conexoes++;
        if (calcularDistancia(reta1.x2, reta1.y2, reta2.x1, reta2.y1) < tolerancia) conexoes++;
        if (calcularDistancia(reta1.x2, reta1.y2, reta2.x2, reta2.y2) < tolerancia) conexoes++;
      }
    }
    
    // Um triângulo fechado tem exatamente 3 conexões
    return conexoes === 3;
  }

  const trianguloCompleto = verificarTrianguloFechado();

  return (
    <div
      ref={refSoltar}
      className="relative h-full min-h-[280px] w-full select-none rounded-2xl"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(52,152,219,0.06) 19px, rgba(52,152,219,0.06) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(52,152,219,0.06) 19px, rgba(52,152,219,0.06) 20px)',
        backgroundColor: estaAcimaDaArea ? 'rgba(52, 152, 219, 0.08)' : 'transparent',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      <svg id="canvas-svg" className="absolute inset-0 h-full w-full select-none" style={{ userSelect: 'none' }}>
        <defs>
          <filter
            id="segmento-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation={SEGMENTO_GLOW.shadowBlur * 0.45}
              floodColor={SEGMENTO_GLOW.shadowColor}
              floodOpacity="0.85"
            />
          </filter>
        </defs>
        {segmentosNoCanvas.map((seg, index) => (
          <SegmentoNoCanvas
            key={seg.id}
            segmento={seg}
            indice={index}
            aoAtualizar={(props) => atualizarSegmento(index, props)}
            aoRemover={() => removerSegmento(index)}
            todasAsRetas={segmentosNoCanvas}
          />
        ))}
      </svg>
      
      {segmentosNoCanvas.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-4xl mb-3">{config.emoji}</p>
            <p className="text-lg text-[#1E40AF]/50">Arraste as retas aqui</p>
            <p className="mt-2 text-sm text-[#1E40AF]/45">Construa triângulos!</p>
          </div>
        </div>
      )}

      {trianguloCompleto && (
        <div
          className="absolute left-1/2 top-6 z-10 -translate-x-1/2 animate-bounce rounded-3xl px-8 py-4 text-white shadow-2xl"
          style={{ backgroundColor: COR_SUCESSO, boxShadow: `0 12px 40px -6px ${COR_SUCESSO}99` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-lg">Triângulo Fechado!</p>
              <p className="text-sm">Você conectou as 3 retas!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkspaceConteudo() {
  const navegar = useNavigate();
  const [tipoTriangulo, setTipoTriangulo] = useState('livre');
  const [segmentosNoCanvas, setSegmentosNoCanvas] = useState([]);
  
  const configAtual = TRIANGULOS[tipoTriangulo];

  function limparTela() {
    setSegmentosNoCanvas([]);
  }

  function voltarDashboard() {
    navegar('/dashboard');
  }

  function trocarTipo(novoTipo) {
    setTipoTriangulo(novoTipo);
    setSegmentosNoCanvas([]);
  }

  function analisarTriangulo() {
    if (segmentosNoCanvas.length !== 3) return null;

    // Calcular os tamanhos das 3 retas em cm
    const lados = segmentosNoCanvas.map(seg => {
      const distPixels = calcularDistancia(seg.x1, seg.y1, seg.x2, seg.y2);
      return Math.round(distPixels / ESCALA);
    });

    const [a, b, c] = lados;

    // Regra de existência do triângulo
    const regra1 = (a + b) > c;
    const regra2 = (a + c) > b;
    const regra3 = (b + c) > a;
    
    const trianguloValido = regra1 && regra2 && regra3;

    // Classificar o tipo de triângulo
    let tipo = '';
    if (lados[0] === lados[1] && lados[1] === lados[2]) {
      tipo = 'Equilátero';
    } else if (lados[0] === lados[1] || lados[1] === lados[2] || lados[0] === lados[2]) {
      tipo = 'Isósceles';
    } else {
      tipo = 'Escaleno';
    }

    return {
      valido: trianguloValido,
      lados,
      tipo,
      regras: [
        { expressao: `${a} + ${b} > ${c}`, resultado: `${a + b} > ${c}`, valida: regra1 },
        { expressao: `${a} + ${c} > ${b}`, resultado: `${a + c} > ${b}`, valida: regra2 },
        { expressao: `${b} + ${c} > ${a}`, resultado: `${b + c} > ${a}`, valida: regra3 },
      ],
    };
  }

  const analise = analisarTriangulo();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <MathSymbolsBackground opacity={0.04} />

      <div className="relative z-10 m-3 flex h-[calc(100dvh-1.5rem)] min-h-0 flex-col gap-3 pb-[env(safe-area-inset-bottom)] pt-[max(0.75rem,env(safe-area-inset-top))] sm:m-4">
        {/* Cabeçalho */}
        <header className="glass-panel flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={voltarDashboard}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 transition-transform hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Shapes className="h-6 w-6 shrink-0 text-action" />
          <h2 className="min-w-0 text-lg font-bold sm:text-xl md:text-2xl">Laboratório de Triângulos</h2>
        </header>

        {/* Barra de ferramentas — tipos de desafio */}
        <div className="glass-panel shrink-0 overflow-x-auto px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex gap-2">
            {Object.entries(TRIANGULOS).map(([tipo, config]) => (
              <button
                key={tipo}
                type="button"
                onClick={() => trocarTipo(tipo)}
                className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                  tipoTriangulo === tipo
                    ? 'bg-action text-white shadow-md shadow-action/30'
                    : 'bg-white/60 text-foreground hover:bg-white/90'
                }`}
              >
                <span className="mr-2">{config.emoji}</span>
                {config.nome}
                <span className="ml-2 text-xs opacity-75">({config.descricao})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row">
          {/* Menu lateral — caixa de retas */}
          <aside className="glass-panel flex max-h-[38vh] w-full shrink-0 flex-col overflow-hidden p-4 sm:p-5 lg:max-h-none lg:w-60 xl:w-64">
            <h3 className="mb-1 text-lg font-bold">Caixa de Retas</h3>
            <p className="mb-4 text-xs text-[#1E40AF]/70">{configAtual.descricao}</p>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5">
              {configAtual.retas.map((seg, index) => (
                <PecaArrastavel key={index} segmento={seg} index={index} />
              ))}
            </div>

            <div className="mt-4 shrink-0 rounded-2xl border border-action/25 bg-action/10 p-3">
              <p className="mb-2 text-sm font-bold">💡 Como usar</p>
              <ul className="space-y-1 text-xs text-[#1E40AF]/85">
                <li>
                  Clique na <strong>linha</strong> = mover
                </li>
                <li>
                  Clique nas <strong>bolinhas</strong> = rotacionar
                </li>
                <li>
                  <strong className="text-success">Laranja</strong> = conectado!
                </li>
              </ul>
            </div>
          </aside>

          {/* Palco central */}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="stage-panel flex min-h-[min(52vh,520px)] flex-1 flex-col p-2 sm:p-3 lg:min-h-0">
              <CanvasInterativo
                segmentosNoCanvas={segmentosNoCanvas}
                setSegmentosNoCanvas={setSegmentosNoCanvas}
                tipoAtual={tipoTriangulo}
              />
            </div>
          </main>

          {/* Painel de instruções */}
          <aside className="glass-panel flex max-h-[42vh] w-full shrink-0 flex-col overflow-y-auto p-4 sm:p-5 lg:max-h-none lg:w-72 xl:w-80">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/20 text-2xl">
              {configAtual.emoji}
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold">Desafio: {configAtual.nome}</h3>
              <p className="text-sm text-[#1E40AF]/75">{configAtual.descricao}</p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-white/60 bg-white/50 p-4">
            <p className="text-sm text-foreground leading-relaxed mb-3">
              <strong>📚 Sobre triângulos:</strong>
            </p>
            <ul className="text-sm text-foreground/80 space-y-2">
              <li>🔺 <strong>Equilátero:</strong> 3 lados iguais</li>
              <li>🔻 <strong>Isósceles:</strong> 2 lados iguais</li>
              <li>📐 <strong>Escaleno:</strong> 3 lados diferentes</li>
              <li>📏 <strong>Retângulo:</strong> tem ângulo de 90°</li>
            </ul>
          </div>

          <div className="mb-4 rounded-2xl border border-white/60 bg-white/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Retas conectadas:</span>
              <span className="text-lg font-bold text-action">{segmentosNoCanvas.length}</span>
            </div>
            
            {analise && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-foreground mb-2">
                  📊 Análise do Triângulo:
                </p>
                
                <div className="mb-3">
                  <p className="text-xs text-foreground/70 mb-1">
                    <strong>Tipo:</strong> {analise.tipo}
                  </p>
                  <p className="text-xs text-foreground/70">
                    <strong>Lados:</strong> {analise.lados.join(' cm, ')} cm
                  </p>
                </div>

                <p className="text-xs font-semibold text-foreground mb-2">
                  📐 Regra de Existência:
                </p>
                <p className="text-xs text-foreground/70 mb-2 italic">
                  A base deve ser menor do que a soma dos dois outros lados.
                </p>
                <div className="space-y-1">
                  {analise.regras.map((regra, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-mono">{regra.expressao} cm</span>
                      <span className={regra.valida ? 'text-success' : 'text-red-600'}>
                        {regra.valida ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
                
                {!analise.valido && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-xl">
                    <p className="text-xs text-red-700 font-semibold">
                      ❌ Triângulo impossível!
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      As retas não formam um triângulo válido. Experimente outras combinações!
                    </p>
                  </div>
                )}
                
                {analise.valido && (
                  <div className="mt-3 rounded-xl border border-success/40 bg-success/15 p-2">
                    <p className="text-xs font-semibold text-success">
                      ✓ Triângulo {analise.tipo} válido!
                    </p>
                    <p className="mt-1 text-xs text-[#1E40AF]/80">
                      Parabéns! Você criou um triângulo que existe! 🎉
                    </p>
                  </div>
                )}
              </div>
            )}

            {segmentosNoCanvas.length < 3 && (
              <div className="mt-3 rounded-xl border border-action/30 bg-action/10 p-3">
                <p className="text-xs text-[#1E40AF]/85">
                  💡 Arraste 3 retas e conecte as pontas para formar um triângulo!
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={limparTela}
            disabled={segmentosNoCanvas.length === 0}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3.5 text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Eraser className="h-5 w-5" />
            Limpar Tela
          </button>
        </aside>
        </div>
      </div>
    </div>
  );
}

export function Workspace() {
  return (
    <DndProvider backend={HTML5Backend}>
      <WorkspaceConteudo />
    </DndProvider>
  );
}