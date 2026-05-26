import type { CSSProperties } from 'react';

const SIMBOLOS = [
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

type MathSymbolsBackgroundProps = {
  /** Opacidade dos símbolos (landing ~14%, dashboard ~4%). */
  opacity?: number;
  animated?: boolean;
};

export function MathSymbolsBackground({ opacity = 0.04, animated = true }: MathSymbolsBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden" aria-hidden>
      {SIMBOLOS.map((s, i) => (
        <span
          key={`${s.char}-${i}`}
          className={`absolute font-bold text-[#1E40AF] ${animated ? 'zero-gravity-float-delayed' : ''} ${s.className}`}
          style={
            {
              opacity,
              '--zg-delay': `${(i % 5) * 0.4}s`,
              animationDuration: `${7 + (i % 4)}s`,
            } as CSSProperties
          }
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
