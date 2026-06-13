import { useCallback, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { SlugMissao } from '../constants/jogos';

/**
 * Pontos da sessão atual (HUD do jogo) + sincronização automática com o perfil no Supabase.
 */
export function usePontosMissao(slug: SlugMissao) {
  const { ganharPontos: syncPontos, marcarMissaoConcluida } = useAuth();
  const [pontosSessao, setPontosSessao] = useState(0);
  const missaoRegistradaRef = useRef(false);

  const ganharPontos = useCallback(
    async (quantidade: number) => {
      if (quantidade <= 0) return;
      setPontosSessao((p) => p + quantidade);
      await syncPontos(quantidade);
    },
    [syncPontos],
  );

  const concluirMissao = useCallback(async () => {
    if (missaoRegistradaRef.current) return;
    missaoRegistradaRef.current = true;
    await marcarMissaoConcluida(slug);
  }, [marcarMissaoConcluida, slug]);

  const resetSessao = useCallback(() => {
    setPontosSessao(0);
    missaoRegistradaRef.current = false;
  }, []);

  return {
    pontosSessao,
    ganharPontos,
    concluirMissao,
    resetSessao,
  };
}
