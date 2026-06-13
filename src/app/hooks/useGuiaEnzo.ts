import { useCallback, useMemo, useState } from 'react';
import type { GuiaEnzoProps } from '../components/GuiaEnzo';
import {
  ENZO_MENSAGENS,
  ENZO_VARIANTE_POR_MISSAO,
  type EnzoMissaoId,
  type EnzoVariante,
} from '../constants/enzoGuia';

interface UseGuiaEnzoOptions {
  variante?: EnzoVariante;
  tema?: GuiaEnzoProps['tema'];
  posicao?: GuiaEnzoProps['posicao'];
  visivel?: boolean;
}

export function useGuiaEnzo(missaoId: EnzoMissaoId, options: UseGuiaEnzoOptions = {}) {
  const mensagens = ENZO_MENSAGENS[missaoId];
  const variante = options.variante ?? ENZO_VARIANTE_POR_MISSAO[missaoId];

  const [mensagem, setMensagem] = useState(mensagens.inicio);
  const [expandido, setExpandido] = useState(true);
  const [pulso, setPulso] = useState(false);

  const mostrarInicio = useCallback(() => {
    setMensagem(mensagens.inicio);
    setExpandido(true);
    setPulso(false);
  }, [mensagens.inicio]);

  const mostrarAcerto = useCallback(() => {
    setMensagem(mensagens.acerto);
    setExpandido(true);
    setPulso(true);
  }, [mensagens.acerto]);

  const mostrarErro = useCallback(() => {
    setMensagem(mensagens.erro);
    setExpandido(true);
    setPulso(true);
  }, [mensagens.erro]);

  const mostrarProgresso = useCallback(() => {
    setMensagem(mensagens.progresso ?? mensagens.inicio);
    setExpandido(true);
    setPulso(false);
  }, [mensagens.progresso, mensagens.inicio]);

  const mostrarFim = useCallback(() => {
    setMensagem(mensagens.fim ?? mensagens.acerto);
    setExpandido(true);
    setPulso(true);
  }, [mensagens.fim, mensagens.acerto]);

  const definirMensagem = useCallback((texto: string) => {
    setMensagem(texto);
  }, []);

  const props: GuiaEnzoProps = useMemo(
    () => ({
      mensagem,
      variante,
      expandido,
      aoAlternarExpandido: setExpandido,
      tema: options.tema ?? 'claro',
      posicao: options.posicao ?? 'inferior-direita',
      visivel: options.visivel ?? true,
      pulso,
    }),
    [mensagem, variante, expandido, options.tema, options.posicao, options.visivel, pulso],
  );

  return {
    mensagem,
    expandido,
    setExpandido,
    definirMensagem,
    mostrarInicio,
    mostrarAcerto,
    mostrarErro,
    mostrarProgresso,
    mostrarFim,
    props,
  };
}
