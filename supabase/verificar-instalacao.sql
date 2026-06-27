-- =============================================================================
-- VERIFICAÇÃO DO BANCO — MatMaker
-- Cole no SQL Editor do Supabase e clique Run.
-- Não altera dados. Só mostra o que está OK e o que falta.
-- =============================================================================

-- 1) Colunas necessárias em public.perfis
select
  'COLUNA perfis.' || coluna as item,
  case
    when exists (
      select 1
      from information_schema.columns c
      where c.table_schema = 'public'
        and c.table_name = 'perfis'
        and c.column_name = coluna
    ) then 'OK'
    else 'FALTA — rode o script indicado'
  end as status,
  script
from (
  values
    ('pontos', 'supabase/perfis-pontos.sql'),
    ('jogos_completados', 'supabase/perfis-pontos.sql'),
    ('missoes_concluidas', 'supabase/missoes-concluidas.sql'),
    ('pontos_semana', 'supabase/ranking-semanal.sql'),
    ('semana_ref', 'supabase/ranking-semanal.sql'),
    ('papel', 'supabase/turmas-professor.sql'),
    ('instituicao', 'supabase/perfis-professor-campos.sql'),
    ('materia', 'supabase/perfis-professor-campos.sql')
) as t(coluna, script)
order by item;

-- 2) Tabelas do modo turma
select
  'TABELA public.' || tabela as item,
  case
    when exists (
      select 1
      from information_schema.tables
      where table_schema = 'public' and table_name = tabela
    ) then 'OK'
    else 'FALTA — rode supabase/turmas-professor.sql'
  end as status
from (values ('turmas'), ('turma_membros')) as t(tabela);

-- 3) Funções RPC
select
  'FUNÇÃO public.' || rotina as item,
  case
    when exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = rotina
    ) then 'OK'
    else 'FALTA — rode supabase/turmas-professor.sql'
  end as status
from (
  values
    ('resolver_codigo_turma'),
    ('eh_membro_da_turma'),
    ('eh_professor_da_turma')
) as f(rotina);

-- 4) Políticas RLS importantes (contagem mínima)
select
  'RLS ' || tabela || ' (' || esperado || ' políticas)' as item,
  case
    when cnt >= esperado then 'OK (' || cnt || ')'
    when cnt > 0 then 'PARCIAL (' || cnt || ') — revise turmas-professor.sql'
    else 'FALTA — rode os scripts SQL'
  end as status
from (
  select 'perfis' as tabela, count(*)::int as cnt, 2 as esperado
  from pg_policies
  where schemaname = 'public' and tablename = 'perfis'
  union all
  select 'turmas', count(*)::int, 4
  from pg_policies
  where schemaname = 'public' and tablename = 'turmas'
  union all
  select 'turma_membros', count(*)::int, 2
  from pg_policies
  where schemaname = 'public' and tablename = 'turma_membros'
) r;

-- 5) Resumo dos perfis (útil antes da banca)
select
  count(*) as total_usuarios,
  count(*) filter (where papel = 'professor') as professores,
  count(*) filter (where papel = 'aluno') as alunos,
  count(*) filter (where pontos > 0) as com_pontos,
  count(*) filter (where cardinality(missoes_concluidas) > 0) as com_missoes
from public.perfis;

-- 6) Turmas criadas
select
  (select count(*) from public.turmas) as total_turmas,
  (select count(*) from public.turma_membros) as total_vinculos_aluno;

-- 7) Professores sem papel correto (corrija se aparecer linha aqui)
select id, email, nome, papel
from public.perfis
where email ilike '%professor%' or nome ilike '%prof%'
order by email;

-- =============================================================================
-- RESULTADO ESPERADO
-- • Todas as linhas da seção 1–3 com status OK
-- • RLS perfis ≥ 2, turmas ≥ 4, turma_membros ≥ 2
-- • Se alguma coluna FALTA: rode os scripts na ordem do ROTEIRO-TESTES.md
-- =============================================================================
