import { Award } from 'lucide-react';
import type { ConquistaDef } from '../constants/conquistas';

interface ModalConquistaProps {
  conquista: ConquistaDef;
  onFechar: () => void;
}

export function ModalConquista({ conquista, onFechar }: ModalConquistaProps) {
  const Icone = conquista.icone;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conquista-titulo"
    >
      <div className="animate-scale-in w-full max-w-sm overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl">
        <div
          className="px-5 py-6 text-center"
          style={{
            background: `linear-gradient(180deg, ${conquista.cor}22 0%, white 55%)`,
          }}
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
            <Award className="h-7 w-7 text-[#FF8C00]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3498DB]">
            Conquista desbloqueada!
          </p>
          <h2 id="conquista-titulo" className="mt-2 text-xl font-black text-[#1E40AF]">
            {conquista.titulo}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1E40AF]/70">{conquista.descricao}</p>

          <div
            className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
            style={{ backgroundColor: `${conquista.cor}22`, color: conquista.cor }}
          >
            <Icone className="h-8 w-8" strokeWidth={2.25} />
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onFechar}
            className="min-h-11 w-full rounded-2xl bg-[#3498DB] text-sm font-bold text-white shadow-md transition-transform active:scale-[0.98]"
          >
            Legal!
          </button>
        </div>
      </div>
    </div>
  );
}
