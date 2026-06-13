-- Corrige: infinite recursion detected in policy for relation "turmas"
-- Execute no SQL Editor do Supabase (pode rodar mesmo se já rodou turmas-professor.sql antes).

create or replace function public.eh_membro_da_turma(turma_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.turma_membros tm
    where tm.turma_id = eh_membro_da_turma.turma_id
      and tm.aluno_id = auth.uid()
  );
$$;

create or replace function public.eh_professor_da_turma(turma_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.turmas t
    where t.id = eh_professor_da_turma.turma_id
      and t.professor_id = auth.uid()
  );
$$;

grant execute on function public.eh_membro_da_turma(uuid) to authenticated;
grant execute on function public.eh_professor_da_turma(uuid) to authenticated;

drop policy if exists "Turmas: aluno membro lê" on public.turmas;
create policy "Turmas: aluno membro lê"
  on public.turmas for select to authenticated
  using (public.eh_membro_da_turma(id));

drop policy if exists "Membros: leitura" on public.turma_membros;
create policy "Membros: leitura"
  on public.turma_membros for select to authenticated
  using (
    aluno_id = auth.uid()
    or public.eh_professor_da_turma(turma_id)
  );
