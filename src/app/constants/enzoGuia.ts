export type EnzoVariante = 'normal' | 'capitao';

export type EnzoMissaoId =
  | 'space'
  | 'fractions'
  | 'dobro'
  | 'potencias'
  | 'mercado'
  | 'material-dourado';

export const ENZO_AVATARES: Record<EnzoVariante, string> = {
  normal: '/enzo/EnzoNormal.svg',
  capitao: '/enzo/EnzoCapitao.svg',
};

export const ENZO_CARGOS: Record<EnzoVariante, string> = {
  normal: 'Seu guia do laboratório',
  capitao: 'Seu copiloto espacial',
};

export interface EnzoMensagensMissao {
  inicio: string;
  acerto: string;
  erro: string;
  progresso?: string;
  fim?: string;
}

export const ENZO_MENSAGENS: Record<EnzoMissaoId, EnzoMensagensMissao> = {
  space: {
    inicio: 'Piloto, siga minhas dicas e elimine só as naves reais!',
    acerto: 'Boa! Essa era a nave certa — continue assim!',
    erro: 'Cuidado! Esse era um holograma. Observe a cor e a posição.',
    progresso: 'Radar ativo — preste atenção na próxima dica!',
    fim: 'Galáxia salva! Você mandou muito bem, piloto!',
  },
  fractions: {
    inicio: 'Vamos fatiar essa pizza! Ajuste numerador e denominador com calma.',
    acerto: 'Fração certa! Você entendeu a parte da pizza.',
    erro: 'Quase! Compare quantas fatias você marcou com o enunciado.',
    progresso: 'Próximo desafio — leia o texto com atenção.',
    fim: 'Aventura concluída! Frações dominadas!',
  },
  dobro: {
    inicio: 'No mercado, dobro é multiplicar por 2. Conte as maçãs na mesa!',
    acerto: 'Isso aí! A conta bateu certinho.',
    erro: 'Revise: ovos × 2 = maçãs. Marque uma a uma na grade.',
    progresso: 'Nova compra no caixa — vamos lá!',
    fim: 'Compras fechadas! Você domina o dobro.',
  },
  potencias: {
    inicio: 'Potência é multiplicar o número por ele mesmo. Escolha a alternativa certa!',
    acerto: 'Excelente! Você acertou a potência.',
    erro: 'Pense de novo: quantas vezes o número se multiplica?',
    progresso: 'Próximo quadrado — você consegue!',
    fim: 'Potências desbloqueadas! Muito bem!',
  },
  mercado: {
    inicio: 'Desafio do mercado: leia o enunciado e calcule com calma.',
    acerto: 'Perfeito! Sua conta está correta.',
    erro: 'Não desista — releia o problema e tente outra vez.',
    progresso: 'Mais um cliente na fila!',
    fim: 'Mercado vencido! Você é um expert em contas.',
  },
  'material-dourado': {
    inicio: 'Monte o número com o material dourado. Centena, dezena e unidade!',
    acerto: 'Montagem correta! O valor bateu.',
    erro: 'Confira as peças: cada cor vale um lugar diferente.',
    progresso: 'Novo número para montar — mãos à obra!',
    fim: 'Laboratório completo! Números dominados!',
  },
};

export const ENZO_VARIANTE_POR_MISSAO: Record<EnzoMissaoId, EnzoVariante> = {
  space: 'capitao',
  fractions: 'normal',
  dobro: 'normal',
  potencias: 'normal',
  mercado: 'normal',
  'material-dourado': 'normal',
};
