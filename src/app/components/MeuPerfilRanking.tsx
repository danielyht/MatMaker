import { Gamepad2, Star, Trophy } from 'lucide-react';
import { AvatarRanking } from './AvatarRanking';
import { BadgeLiga, IconeLiga } from './BadgeLiga';
import { TOTAL_MISSOES } from '../constants/jogos';
import { progressoNaLiga } from '../constants/ligasRanking';
import { COR_PRIMARIA, COR_SUCESSO } from '../constants/matmakerBrand';

type MeuPerfilRankingProps = {
  nome: string;
  fotoUrl: string | null;
  pontos: number;
  jogosCompletados: number;
  posicaoRanking: number;
};

export function MeuPerfilRanking({
  nome,
  fotoUrl,
  pontos,
  jogosCompletados,
  posicaoRanking,
}: MeuPerfilRankingProps) {
  const progressoPct = Math.min(100, Math.round((jogosCompletados / TOTAL_MISSOES) * 100));
  const { atual: liga, proxima, percentual: pctLiga, pontosParaProxima } = progressoNaLiga(pontos);

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/90 via-white/80 to-[#EBF4FA]/90 p-5 shadow-[0_20px_56px_-16px_rgba(52,152,219,0.28)] backdrop-blur-xl sm:p-6"
      aria-labelledby="meu-perfil-titulo"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FF8C00]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />

      <p
        id="meu-perfil-titulo"
        className="relative text-center text-xs font-bold uppercase tracking-[0.2em] text-[#1E40AF]/55"
      >
        Meu perfil
      </p>

      <div className="relative mt-4 flex flex-col items-center text-center">
        <div className="zero-gravity-float-slow relative">
          <AvatarRanking nome={nome} fotoUrl={fotoUrl} destaque tamanho="xl" />
          <IconeLiga
            liga={liga}
            className="absolute -bottom-2 -right-2 h-11 w-11 sm:h-12 sm:w-12"
          />
        </div>

        <h2 className="mt-5 max-w-full truncate text-xl font-bold text-[#1E40AF] sm:text-2xl">
          {nome}
        </h2>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <BadgeLiga liga={liga} tamanho="lg" />
          {posicaoRanking > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#3498DB]/10 px-2.5 py-1 text-xs font-semibold text-[#3498DB]">
              <Trophy className="h-3.5 w-3.5" style={{ color: COR_SUCESSO }} />
              {posicaoRanking}º geral
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/80 bg-white/70 px-4 py-3">
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-[#1E40AF]/65">
          <span>Progresso na liga</span>
          <span>
            {proxima
              ? `${pontosParaProxima} pts para ${proxima.nome}`
              : 'Liga máxima alcançada'}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#1E40AF]/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${liga.gradiente}`}
            style={{ width: `${pctLiga}%` }}
          />
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[#FF8C00]/20 bg-white/85 px-3 py-4 text-center shadow-sm">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF8C00]/15">
            <Star className="h-5 w-5" style={{ color: COR_SUCESSO }} fill={COR_SUCESSO} />
          </div>
          <p className="text-2xl font-bold tabular-nums sm:text-3xl" style={{ color: COR_SUCESSO }}>
            {pontos}
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]/55">
            Pontos
          </p>
        </div>

        <div className="rounded-2xl border border-[#3498DB]/20 bg-white/85 px-3 py-4 text-center shadow-sm">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#3498DB]/15">
            <Gamepad2 className="h-5 w-5" style={{ color: COR_PRIMARIA }} />
          </div>
          <p className="text-2xl font-bold tabular-nums text-[#1E40AF] sm:text-3xl">
            {jogosCompletados}
            <span className="text-lg font-semibold text-[#1E40AF]/45">/{TOTAL_MISSOES}</span>
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]/55">
            Jogos completos
          </p>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-[#1E40AF]/60">
          <span>Progresso no laboratório</span>
          <span>{progressoPct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#1E40AF]/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3498DB] to-[#00CAFC] transition-all duration-500"
            style={{ width: `${progressoPct}%` }}
          />
        </div>
      </div>
    </section>
  );
}
