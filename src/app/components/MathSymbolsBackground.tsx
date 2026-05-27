import type { CSSProperties } from 'react';

const SIMBOLOS_BASE = [
  { char: '+', className: 'left-[5%] top-[10%] text-4xl' },
  { char: '−', className: 'left-[15%] top-[75%] text-5xl' },
  { char: '÷', className: 'left-[85%] top-[18%] text-4xl' },
  { char: '%', className: 'left-[90%] top-[70%] text-6xl' },
  { char: '=', className: 'left-[45%] top-[6%] text-3xl' },
  { char: '^', className: 'left-[50%] top-[90%] text-4xl' },
  { char: '×', className: 'left-[25%] top-[40%] text-5xl' },
  { char: 'π', className: 'left-[8%] top-[45%] text-3xl' },
  { char: '√', className: 'left-[92%] top-[42%] text-3xl' },
  { char: '2', className: 'left-[70%] top-[55%] text-4xl' },
  { char: '½', className: 'left-[60%] top-[12%] text-3xl' },
  { char: '+', className: 'left-[35%] top-[82%] text-2xl' },
] as const;

/** Símbolos das fases espalhados pela tela (sem cards nas bordas). */
const SIMBOLOS_LANDING = [
  // Coluna esquerda
  { char: '¼', className: 'left-[6%] top-[8%] text-3xl' },
  { char: '×', className: 'left-[10%] top-[20%] text-4xl' },
  { char: '½', className: 'left-[4%] top-[32%] text-2xl' },
  { char: '÷', className: 'left-[12%] top-[44%] text-3xl' },
  { char: '%', className: 'left-[7%] top-[56%] text-4xl' },
  { char: '¾', className: 'left-[11%] top-[68%] text-3xl' },
  { char: '^', className: 'left-[5%] top-[80%] text-3xl' },
  { char: '⅓', className: 'left-[9%] top-[92%] text-2xl' },

  // Faixa esquerda-centro
  { char: '×', className: 'left-[22%] top-[12%] text-3xl' },
  { char: '÷', className: 'left-[26%] top-[28%] text-2xl' },
  { char: '¼', className: 'left-[20%] top-[42%] text-3xl' },
  { char: '²', className: 'left-[24%] top-[58%] text-3xl' },
  { char: '%', className: 'left-[18%] top-[74%] text-4xl' },
  { char: '½', className: 'left-[22%] top-[88%] text-2xl' },

  // Faixa direita-centro
  { char: '¾', className: 'left-[74%] top-[10%] text-3xl' },
  { char: '%', className: 'left-[78%] top-[24%] text-3xl' },
  { char: '×', className: 'left-[72%] top-[38%] text-4xl' },
  { char: '÷', className: 'left-[76%] top-[52%] text-3xl' },
  { char: '^', className: 'left-[70%] top-[66%] text-3xl' },
  { char: '⅓', className: 'left-[74%] top-[82%] text-2xl' },

  // Coluna direita
  { char: '÷', className: 'left-[90%] top-[6%] text-3xl' },
  { char: '%', className: 'left-[94%] top-[18%] text-4xl' },
  { char: '×', className: 'left-[88%] top-[30%] text-3xl' },
  { char: '¼', className: 'left-[92%] top-[42%] text-2xl' },
  { char: '²', className: 'left-[86%] top-[54%] text-3xl' },
  { char: '¾', className: 'left-[93%] top-[66%] text-3xl' },
  { char: '^', className: 'left-[89%] top-[78%] text-4xl' },
  { char: '³', className: 'left-[95%] top-[90%] text-2xl' },

  // Topo e base (evitando só o miolo do hero)
  { char: '×', className: 'left-[38%] top-[6%] text-2xl' },
  { char: '÷', className: 'left-[52%] top-[5%] text-3xl' },
  { char: '½', className: 'left-[62%] top-[7%] text-2xl' },
  { char: '¼', className: 'left-[42%] top-[93%] text-2xl' },
  { char: '^', className: 'left-[56%] top-[94%] text-3xl' },
  { char: '%', className: 'left-[66%] top-[92%] text-2xl' },

  // Laterais do hero (discretos)
  { char: '∕', className: 'left-[32%] top-[22%] text-2xl' },
  { char: '×', className: 'left-[66%] top-[26%] text-2xl' },
  { char: '÷', className: 'left-[34%] top-[78%] text-2xl' },
  { char: '%', className: 'left-[64%] top-[74%] text-2xl' },
] as const;

type MathSymbolsBackgroundProps = {
  opacity?: number;
  animated?: boolean;
  variant?: 'default' | 'landing';
  className?: string;
};

export function MathSymbolsBackground({
  opacity = 0.04,
  animated = true,
  variant = 'default',
  className = '',
}: MathSymbolsBackgroundProps) {
  const simbolos = variant === 'landing' ? [...SIMBOLOS_LANDING] : [...SIMBOLOS_BASE];

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 select-none overflow-hidden ${className}`}
      aria-hidden
    >
      {simbolos.map((s, i) => (
        <span
          key={`${s.char}-${i}-${s.className}`}
          className={`absolute font-bold text-[#1E40AF] ${animated ? 'zero-gravity-float-delayed' : ''} ${s.className}`}
          style={
            {
              opacity,
              '--zg-delay': `${(i % 11) * 0.25}s`,
              animationDuration: `${5.5 + (i % 7)}s`,
            } as CSSProperties
          }
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
