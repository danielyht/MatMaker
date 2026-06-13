import { Lock } from 'lucide-react';
import { cn } from './ui/utils';
import { CONQUISTAS, type ConquistaDef } from '../constants/conquistas';

interface PainelConquistasProps {
  idsDesbloqueados: Set<string>;
  compacto?: boolean;
}

function CartaoConquista({
  conquista,
  desbloqueada,
  compacto,
}: {
  conquista: ConquistaDef;
  desbloqueada: boolean;
  compacto?: boolean;
}) {
  const Icone = conquista.icone;

  return (
    <article
      className={cn(
        'relative flex flex-col items-center rounded-2xl border p-3 text-center transition-all sm:p-4',
        desbloqueada
          ? 'border-white/90 bg-white/90 shadow-md'
          : 'border-white/40 bg-white/40 opacity-70',
        compacto ? 'gap-1.5' : 'gap-2',
      )}
      title={conquista.descricao}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-xl shadow-sm',
          compacto ? 'h-11 w-11' : 'h-14 w-14',
          desbloqueada ? '' : 'bg-slate-100',
        )}
        style={
          desbloqueada
            ? { backgroundColor: `${conquista.cor}20`, color: conquista.cor }
            : undefined
        }
      >
        {desbloqueada ? (
          <Icone className={compacto ? 'h-5 w-5' : 'h-7 w-7'} strokeWidth={2.25} />
        ) : (
          <Lock className="h-5 w-5 text-slate-400" />
        )}
      </div>
      <h3
        className={cn(
          'font-bold leading-tight text-[#1E40AF]',
          compacto ? 'text-[11px]' : 'text-xs sm:text-sm',
        )}
      >
        {conquista.titulo}
      </h3>
      {!compacto && (
        <p className="text-[10px] leading-snug text-[#1E40AF]/60 sm:text-xs">{conquista.descricao}</p>
      )}
    </article>
  );
}

export function PainelConquistas({ idsDesbloqueados, compacto = false }: PainelConquistasProps) {
  const desbloqueadas = CONQUISTAS.filter((c) => idsDesbloqueados.has(c.id)).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-[#1E40AF]/80">
          {desbloqueadas}/{CONQUISTAS.length} conquistas
        </p>
      </div>
      <div
        className={cn(
          'grid gap-2 sm:gap-3',
          compacto ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        )}
      >
        {CONQUISTAS.map((conquista) => (
          <CartaoConquista
            key={conquista.id}
            conquista={conquista}
            desbloqueada={idsDesbloqueados.has(conquista.id)}
            compacto={compacto}
          />
        ))}
      </div>
    </div>
  );
}
