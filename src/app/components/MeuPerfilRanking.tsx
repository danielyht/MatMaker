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
      className="stage-panel overflow-hidden p-5 sm:p-6"
      aria-labelledby="meu-perfil-titulo"
    >
      <p
        id="meu-perfil-titulo"
        className="text-center text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
      >
        Meu perfil
      </p>

      <div className="mt-4 flex flex-col items-center text-center">
        <div className="relative">
          <AvatarRanking nome={nome} fotoUrl={fotoUrl} destaque tamanho="xl" />
          <IconeLiga
            liga={liga}
            className="absolute -bottom-2 -right-2 h-11 w-11 sm:h-12 sm:w-12"
          />
        </div>

        <h2 className="mt-4 max-w-full truncate text-xl font-bold text-[#0F172A] sm:text-2xl">
          {nome}
        </h2>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <BadgeLiga liga={liga} tamanho="lg" />
          {posicaoRanking > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]">
              <Trophy className="h-3.5 w-3.5 text-[#EA580C]" />
              {posicaoRanking}º geral
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-[#64748B]">
          <span>Progresso na liga</span>
          <span>
            {proxima
              ? `${pontosParaProxima} pts para ${proxima.nome}`
              : 'Liga máxima alcançada'}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${liga.gradiente}`}
            style={{ width: `${pctLiga}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-3 py-4 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EA580C]/15">
            <Star className="h-5 w-5 text-[#EA580C]" fill="#EA580C" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-[#EA580C] sm:text-3xl">{pontos}</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Pontos
          </p>
        </div>

        <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-4 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D4ED8]/15">
            <Gamepad2 className="h-5 w-5 text-[#1D4ED8]" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-[#1D4ED8] sm:text-3xl">
            {jogosCompletados}
            <span className="text-base font-semibold text-[#94A3B8]">/{TOTAL_MISSOES}</span>
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Jogos completos
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-[#64748B]">
          <span>Progresso no laboratório</span>
          <span>{progressoPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] transition-all duration-500"
            style={{ width: `${progressoPct}%` }}
          />
        </div>
      </div>
    </section>
  );
}
