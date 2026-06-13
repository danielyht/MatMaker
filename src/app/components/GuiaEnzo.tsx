import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from './ui/utils';
import {
  ENZO_AVATARES,
  ENZO_CARGOS,
  type EnzoVariante,
} from '../constants/enzoGuia';

const TAMANHO_AVATAR = {
  sm: 'h-14 w-14',
  md: 'h-[4.5rem] w-[4.5rem]',
  lg: 'h-20 w-20',
} as const;

export interface GuiaEnzoProps {
  mensagem: string;
  variante?: EnzoVariante;
  cargo?: string;
  expandido?: boolean;
  aoAlternarExpandido?: (expandido: boolean) => void;
  posicao?: 'inferior-direita' | 'inferior-esquerda';
  tema?: 'claro' | 'escuro';
  visivel?: boolean;
  pulso?: boolean;
  className?: string;
  children?: ReactNode;
}

export function EnzoAvatar({
  variante = 'normal',
  tamanho = 'md',
  className,
  pulso = false,
}: {
  variante?: EnzoVariante;
  tamanho?: keyof typeof TAMANHO_AVATAR;
  className?: string;
  pulso?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full border-[3px] border-white/80 bg-gradient-to-br from-[#3498DB]/20 to-[#3498DB]/40 shadow-lg',
        TAMANHO_AVATAR[tamanho],
        pulso && 'animate-pulse',
        className,
      )}
    >
      <img
        src={ENZO_AVATARES[variante]}
        alt="Enzo, mascote do MatMaker"
        className="h-full w-full object-cover object-top"
        draggable={false}
      />
    </div>
  );
}

export function GuiaEnzo({
  mensagem,
  variante = 'normal',
  cargo,
  expandido: expandidoControlado,
  aoAlternarExpandido,
  posicao = 'inferior-direita',
  tema = 'claro',
  visivel = true,
  pulso = false,
  className,
  children,
}: GuiaEnzoProps) {
  const [expandidoInterno, setExpandidoInterno] = useState(true);
  const expandido = expandidoControlado ?? expandidoInterno;
  const mensagemAnterior = useRef(mensagem);

  const alternarExpandido = (valor: boolean) => {
    if (aoAlternarExpandido) aoAlternarExpandido(valor);
    else setExpandidoInterno(valor);
  };

  useEffect(() => {
    if (mensagemAnterior.current === mensagem) return;
    mensagemAnterior.current = mensagem;
    if (expandidoControlado === undefined) setExpandidoInterno(true);
    else aoAlternarExpandido?.(true);
  }, [mensagem, expandidoControlado, aoAlternarExpandido]);

  if (!visivel) return null;

  const cargoExibido = cargo ?? ENZO_CARGOS[variante];
  const escuro = tema === 'escuro';

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-40 flex max-w-[min(20rem,calc(100vw-1.5rem))] flex-col gap-2',
        posicao === 'inferior-direita'
          ? 'bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 items-end sm:right-4'
          : 'bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 items-start sm:left-4',
        className,
      )}
      aria-live="polite"
    >
      {expandido && (
        <div
          className={cn(
            'pointer-events-auto animate-scale-in w-full rounded-2xl border p-3 shadow-xl backdrop-blur-md sm:p-4',
            escuro
              ? 'border-cyan-300/30 bg-slate-900/90 text-white'
              : 'border-[#3498DB]/25 bg-white/95 text-foreground',
          )}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={cn(
                  'text-sm font-bold leading-tight',
                  escuro ? 'text-cyan-100' : 'text-[#3498DB]',
                )}
              >
                Enzo
              </p>
              <p
                className={cn(
                  'text-[10px] font-medium sm:text-xs',
                  escuro ? 'text-cyan-200/80' : 'text-muted-foreground',
                )}
              >
                {cargoExibido}
              </p>
            </div>
            <button
              type="button"
              onClick={() => alternarExpandido(false)}
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                escuro
                  ? 'text-white/70 active:bg-white/10 md:hover:bg-white/10'
                  : 'text-muted-foreground active:bg-slate-100 md:hover:bg-slate-100',
              )}
              aria-label="Minimizar guia Enzo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p
            className={cn(
              'text-xs leading-relaxed sm:text-sm',
              escuro ? 'text-white/90' : 'text-foreground/90',
            )}
          >
            {mensagem}
          </p>

          {children}
        </div>
      )}

      <button
        type="button"
        onClick={() => alternarExpandido(!expandido)}
        className={cn(
          'pointer-events-auto group flex items-center gap-2 rounded-full transition-transform active:scale-95 md:hover:scale-[1.02]',
          !expandido && 'shadow-lg',
        )}
        aria-label={expandido ? 'Minimizar Enzo' : 'Abrir dica do Enzo'}
        aria-expanded={expandido}
      >
        {!expandido && (
          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md sm:text-xs',
              escuro
                ? 'border border-cyan-300/40 bg-slate-900/90 text-cyan-100'
                : 'border border-[#3498DB]/30 bg-white text-[#3498DB]',
            )}
          >
            <MessageCircle className="h-3 w-3" />
            Dica
          </span>
        )}
        <EnzoAvatar variante={variante} tamanho="md" pulso={pulso && !expandido} />
      </button>
    </div>
  );
}
