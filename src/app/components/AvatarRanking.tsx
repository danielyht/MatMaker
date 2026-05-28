import { User } from 'lucide-react';

type AvatarRankingProps = {
  nome: string;
  fotoUrl: string | null;
  destaque?: boolean;
  tamanho?: 'sm' | 'md' | 'lg' | 'xl';
};

const tamanhos = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl sm:h-28 sm:w-28',
};

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

export function AvatarRanking({
  nome,
  fotoUrl,
  destaque = false,
  tamanho = 'md',
}: AvatarRankingProps) {
  const cls = tamanhos[tamanho];

  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt=""
        className={`${cls} shrink-0 rounded-full border-2 object-cover shadow-md ${
          destaque ? 'border-[#FF8C00] ring-2 ring-[#FF8C00]/40' : 'border-white'
        }`}
      />
    );
  }

  return (
    <div
      className={`${cls} flex shrink-0 items-center justify-center rounded-full border-2 font-bold text-white shadow-md ${
        destaque
          ? 'border-[#FF8C00] bg-gradient-to-br from-[#FF8C00] to-[#3498DB] ring-2 ring-[#FF8C00]/40'
          : 'border-white bg-gradient-to-br from-[#3498DB] to-[#00CAFC]'
      }`}
      aria-hidden
    >
      {iniciais(nome) || <User className="h-1/2 w-1/2" />}
    </div>
  );
}
