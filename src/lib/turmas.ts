import { supabase } from './supabaseClient';
import type { SlugMissao } from '../app/constants/jogos';
import type { AlunoTurma, Turma, TurmaResumo } from '../app/constants/turmas';
import { formatarCodigoTurma } from '../app/constants/turmas';

const CARACTERES_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function mensagemErroTurmas(mensagem: string, operacao: 'listar' | 'criar' = 'listar'): string {
  const msg = mensagem.toLowerCase();

  if (
    msg.includes('does not exist') ||
    msg.includes('schema cache') ||
    msg.includes('could not find the table')
  ) {
    return 'Modo turma não configurado. Execute supabase/turmas-professor.sql no Supabase e, em seguida, recarregue o schema (Settings → API → Reload schema).';
  }

  if (
    msg.includes('row-level security') ||
    (msg.includes('violates') && msg.includes('policy'))
  ) {
    if (operacao === 'criar') {
      return 'Conta sem permissão de professor. No Supabase, rode: update public.perfis set papel = \'professor\' where email = \'SEU_EMAIL\';';
    }
  }

  if (msg.includes('permission denied')) {
    return 'Permissão negada nas tabelas de turma. Execute novamente supabase/turmas-professor.sql (inclui GRANT).';
  }

  return mensagem;
}

export function gerarCodigoTurma(): string {
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += CARACTERES_CODIGO[Math.floor(Math.random() * CARACTERES_CODIGO.length)];
  }
  return codigo;
}

export async function listarTurmasProfessor(professorId: string): Promise<{
  turmas: Turma[];
  erro: string | null;
}> {
  if (!supabase) return { turmas: [], erro: 'Supabase não configurado.' };

  const { data, error } = await supabase
    .from('turmas')
    .select('id, nome, codigo, professor_id, criado_em')
    .eq('professor_id', professorId)
    .order('criado_em', { ascending: false });

  if (error) {
    return { turmas: [], erro: mensagemErroTurmas(error.message, 'listar') };
  }

  const turmas = data ?? [];
  const comContagem = await Promise.all(
    turmas.map(async (turma) => {
      const { count } = await supabase!
        .from('turma_membros')
        .select('*', { count: 'exact', head: true })
        .eq('turma_id', turma.id);
      return { ...turma, total_alunos: count ?? 0 };
    }),
  );

  return { turmas: comContagem, erro: null };
}

export async function criarTurma(
  professorId: string,
  nome: string,
): Promise<{ turma: Turma | null; erro: string | null }> {
  if (!supabase) return { turma: null, erro: 'Supabase não configurado.' };

  const nomeTrim = nome.trim();
  if (!nomeTrim) return { turma: null, erro: 'Informe o nome da turma.' };

  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const codigo = gerarCodigoTurma();
    const { data, error } = await supabase
      .from('turmas')
      .insert({ nome: nomeTrim, codigo, professor_id: professorId })
      .select('id, nome, codigo, professor_id, criado_em')
      .single();

    if (!error && data) {
      return { turma: { ...data, total_alunos: 0 }, erro: null };
    }
    if (error && !error.message.includes('duplicate') && !error.message.includes('unique')) {
      return { turma: null, erro: mensagemErroTurmas(error.message, 'criar') };
    }
  }

  return { turma: null, erro: 'Não foi possível gerar um código único. Tente novamente.' };
}

export async function buscarTurmaProfessor(
  turmaId: string,
  professorId: string,
): Promise<{ turma: Turma | null; erro: string | null }> {
  if (!supabase) return { turma: null, erro: 'Supabase não configurado.' };

  const { data, error } = await supabase
    .from('turmas')
    .select('id, nome, codigo, professor_id, criado_em')
    .eq('id', turmaId)
    .eq('professor_id', professorId)
    .maybeSingle();

  if (error) return { turma: null, erro: error.message };
  if (!data) return { turma: null, erro: 'Turma não encontrada.' };

  const { count } = await supabase
    .from('turma_membros')
    .select('*', { count: 'exact', head: true })
    .eq('turma_id', turmaId);

  return { turma: { ...data, total_alunos: count ?? 0 }, erro: null };
}

export async function listarAlunosTurma(turmaId: string): Promise<{
  alunos: AlunoTurma[];
  erro: string | null;
}> {
  if (!supabase) return { alunos: [], erro: 'Supabase não configurado.' };

  const { data: membros, error: erroMembros } = await supabase
    .from('turma_membros')
    .select('aluno_id, entrou_em')
    .eq('turma_id', turmaId)
    .order('entrou_em', { ascending: true });

  if (erroMembros) return { alunos: [], erro: erroMembros.message };
  if (!membros?.length) return { alunos: [], erro: null };

  const ids = membros.map((m) => m.aluno_id);
  const { data: perfis, error: erroPerfis } = await supabase
    .from('perfis')
    .select('id, nome, foto_url, pontos, jogos_completados, missoes_concluidas')
    .in('id', ids);

  if (erroPerfis) {
    const { data: basicos, error: erroBasicos } = await supabase
      .from('perfis')
      .select('id, nome, foto_url, pontos, jogos_completados')
      .in('id', ids);

    if (erroBasicos) return { alunos: [], erro: erroBasicos.message };

    const mapaEntrada = new Map(membros.map((m) => [m.aluno_id, m.entrou_em]));
    return {
      alunos: (basicos ?? [])
        .map((p) => ({
          id: p.id,
          nome: p.nome,
          foto_url: p.foto_url,
          pontos: p.pontos ?? 0,
          jogos_completados: p.jogos_completados ?? 0,
          missoes_concluidas: [] as SlugMissao[],
          entrou_em: mapaEntrada.get(p.id) ?? '',
        }))
        .sort((a, b) => b.pontos - a.pontos),
      erro: null,
    };
  }

  const mapaEntrada = new Map(membros.map((m) => [m.aluno_id, m.entrou_em]));
  const alunos: AlunoTurma[] = (perfis ?? [])
    .map((p) => ({
      id: p.id,
      nome: p.nome,
      foto_url: p.foto_url,
      pontos: p.pontos ?? 0,
      jogos_completados: p.jogos_completados ?? 0,
      missoes_concluidas: (p.missoes_concluidas ?? []) as SlugMissao[],
      entrou_em: mapaEntrada.get(p.id) ?? '',
    }))
    .sort((a, b) => b.pontos - a.pontos);

  return { alunos, erro: null };
}

export async function listarTurmasAluno(alunoId: string): Promise<{
  turmas: TurmaResumo[];
  erro: string | null;
}> {
  if (!supabase) return { turmas: [], erro: null };

  const { data: membros, error } = await supabase
    .from('turma_membros')
    .select('turma_id, turmas(id, nome)')
    .eq('aluno_id', alunoId);

  if (error) {
    if (error.message.includes('turma_membros') || error.message.includes('does not exist')) {
      return { turmas: [], erro: null };
    }
    return { turmas: [], erro: error.message };
  }

  const turmas: TurmaResumo[] = (membros ?? [])
    .map((m) => {
      const t = m.turmas as { id: string; nome: string } | null;
      return t ? { id: t.id, nome: t.nome } : null;
    })
    .filter((t): t is TurmaResumo => t !== null);

  return { turmas, erro: null };
}

export async function entrarTurmaPorCodigo(
  alunoId: string,
  codigoBruto: string,
): Promise<{ turma: TurmaResumo | null; erro: string | null; jaMembro?: boolean }> {
  if (!supabase) return { turma: null, erro: 'Supabase não configurado.' };

  const codigo = formatarCodigoTurma(codigoBruto);
  if (codigo.length < 6) {
    return { turma: null, erro: 'O código deve ter 6 caracteres.' };
  }

  const { data: resolvida, error: erroRpc } = await supabase.rpc('resolver_codigo_turma', {
    codigo_entrada: codigo,
  });

  let turmaId: string | null = null;
  let turmaNome: string | null = null;

  if (!erroRpc && resolvida?.length) {
    turmaId = resolvida[0].id;
    turmaNome = resolvida[0].nome;
  } else {
    const { data, error } = await supabase
      .from('turmas')
      .select('id, nome')
      .eq('codigo', codigo)
      .maybeSingle();

    if (error || !data) {
      return { turma: null, erro: 'Código inválido. Confira com seu professor.' };
    }
    turmaId = data.id;
    turmaNome = data.nome;
  }

  const { data: existente } = await supabase
    .from('turma_membros')
    .select('turma_id')
    .eq('turma_id', turmaId!)
    .eq('aluno_id', alunoId)
    .maybeSingle();

  if (existente) {
    return {
      turma: { id: turmaId!, nome: turmaNome! },
      erro: null,
      jaMembro: true,
    };
  }

  const { error: erroInsert } = await supabase.from('turma_membros').insert({
    turma_id: turmaId,
    aluno_id: alunoId,
  });

  if (erroInsert) {
    return { turma: null, erro: erroInsert.message };
  }

  return { turma: { id: turmaId!, nome: turmaNome! }, erro: null };
}
