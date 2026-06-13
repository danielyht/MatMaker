import { supabase } from './supabaseClient';
import { obterSemanaAtualRef } from './semanaRanking';
import { lerPontosSemanaLocal, salvarPontosSemanaLocal } from './pontosSemanaLocal';

export interface ResultadoPontos {
  pontos: number | null;
  pontos_semana: number;
  semana_ref: string;
  erro: string | null;
}

function calcularPontosSemana(
  refSalva: string | null | undefined,
  pontosSemanaSalvos: number | null | undefined,
  quantidade: number,
) {
  const semanaRef = obterSemanaAtualRef();
  if (refSalva !== semanaRef) {
    return { pontos_semana: quantidade, semana_ref: semanaRef };
  }
  return {
    pontos_semana: (pontosSemanaSalvos ?? 0) + quantidade,
    semana_ref: semanaRef,
  };
}

/** Soma pontos ao perfil (total + ranking semanal da semana corrente). */
export async function adicionarPontos(
  userId: string,
  quantidade: number,
): Promise<ResultadoPontos> {
  const semanaRef = obterSemanaAtualRef();

  if (quantidade <= 0) {
    return { pontos: null, pontos_semana: 0, semana_ref: semanaRef, erro: null };
  }

  if (!supabase) {
    const local = lerPontosSemanaLocal(userId);
    const semana =
      local.ref === semanaRef
        ? { pontos_semana: local.pontos + quantidade, semana_ref: semanaRef }
        : { pontos_semana: quantidade, semana_ref: semanaRef };
    salvarPontosSemanaLocal(userId, semana.semana_ref, semana.pontos_semana);
    return { pontos: null, ...semana, erro: 'Supabase não configurado.' };
  }

  const { data: atual, error: erroLeitura } = await supabase
    .from('perfis')
    .select('pontos, pontos_semana, semana_ref')
    .eq('id', userId)
    .single();

  if (erroLeitura?.message?.includes('pontos_semana')) {
    return adicionarPontosSemColunaSemanal(userId, quantidade, semanaRef);
  }

  if (erroLeitura) {
    return { pontos: null, pontos_semana: 0, semana_ref: semanaRef, erro: erroLeitura.message };
  }

  const novoTotal = (atual?.pontos ?? 0) + quantidade;
  const semana = calcularPontosSemana(
    atual?.semana_ref,
    atual?.pontos_semana,
    quantidade,
  );

  const { data, error } = await supabase
    .from('perfis')
    .update({
      pontos: novoTotal,
      pontos_semana: semana.pontos_semana,
      semana_ref: semana.semana_ref,
    })
    .eq('id', userId)
    .select('pontos, pontos_semana, semana_ref')
    .single();

  if (error) {
    salvarPontosSemanaLocal(userId, semana.semana_ref, semana.pontos_semana);
    return {
      pontos: novoTotal,
      ...semana,
      erro: error.message,
    };
  }

  salvarPontosSemanaLocal(
    userId,
    data?.semana_ref ?? semana.semana_ref,
    data?.pontos_semana ?? semana.pontos_semana,
  );

  return {
    pontos: data?.pontos ?? novoTotal,
    pontos_semana: data?.pontos_semana ?? semana.pontos_semana,
    semana_ref: data?.semana_ref ?? semana.semana_ref,
    erro: null,
  };
}

async function adicionarPontosSemColunaSemanal(
  userId: string,
  quantidade: number,
  semanaRef: string,
): Promise<ResultadoPontos> {
  const local = lerPontosSemanaLocal(userId);
  const semana =
    local.ref === semanaRef
      ? { pontos_semana: local.pontos + quantidade, semana_ref: semanaRef }
      : { pontos_semana: quantidade, semana_ref: semanaRef };

  const { data: atual, error: erroLeitura } = await supabase!
    .from('perfis')
    .select('pontos')
    .eq('id', userId)
    .single();

  if (erroLeitura) {
    salvarPontosSemanaLocal(userId, semana.semana_ref, semana.pontos_semana);
    return { pontos: null, ...semana, erro: erroLeitura.message };
  }

  const novoTotal = (atual?.pontos ?? 0) + quantidade;

  const { data, error } = await supabase!
    .from('perfis')
    .update({ pontos: novoTotal })
    .eq('id', userId)
    .select('pontos')
    .single();

  salvarPontosSemanaLocal(userId, semana.semana_ref, semana.pontos_semana);

  if (error) {
    return { pontos: novoTotal, ...semana, erro: error.message };
  }

  return {
    pontos: data?.pontos ?? novoTotal,
    ...semana,
    erro: null,
  };
}
