-- Modo turma (professor) — execute no SQL Editor do Supabase (uma vez).

alter table public.perfis
  add column if not exists papel text not null default 'aluno'
  check (papel in ('aluno', 'professor'));

create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  codigo text not null unique,
  professor_id uuid not null references public.perfis(id) on delete cascade,
  criado_em timestamptz not null default now()
);

create table if not exists public.turma_membros (
  turma_id uuid not null references public.turmas(id) on delete cascade,
  aluno_id uuid not null references public.perfis(id) on delete cascade,
  entrou_em timestamptz not null default now(),
  primary key (turma_id, aluno_id)
);

create index if not exists turmas_professor_id_idx on public.turmas (professor_id);
create index if not exists turma_membros_aluno_id_idx on public.turma_membros (aluno_id);

alter table public.turmas enable row level security;
alter table public.turma_membros enable row level security;

-- Turmas: professor gerencia as próprias
drop policy if exists "Turmas: professor lê" on public.turmas;
create policy "Turmas: professor lê"
  on public.turmas for select to authenticated
  using (professor_id = auth.uid());

drop policy if exists "Turmas: professor cria" on public.turmas;
create policy "Turmas: professor cria"
  on public.turmas for insert to authenticated
  with check (
    professor_id = auth.uid()
    and exists (
      select 1 from public.perfis p
      where p.id = auth.uid() and p.papel = 'professor'
    )
  );

drop policy if exists "Turmas: professor exclui" on public.turmas;
create policy "Turmas: professor exclui"
  on public.turmas for delete to authenticated
  using (professor_id = auth.uid());

-- Aluno vê turmas das quais é membro (lista "Minhas turmas")
drop policy if exists "Turmas: aluno membro lê" on public.turmas;
create policy "Turmas: aluno membro lê"
  on public.turmas for select to authenticated
  using (
    exists (
      select 1 from public.turma_membros tm
      where tm.turma_id = turmas.id and tm.aluno_id = auth.uid()
    )
  );

-- Membros: aluno vê as suas; professor vê alunos das suas turmas
drop policy if exists "Membros: leitura" on public.turma_membros;
create policy "Membros: leitura"
  on public.turma_membros for select to authenticated
  using (
    aluno_id = auth.uid()
    or exists (
      select 1 from public.turmas t
      where t.id = turma_membros.turma_id and t.professor_id = auth.uid()
    )
  );

drop policy if exists "Membros: aluno entra" on public.turma_membros;
create policy "Membros: aluno entra"
  on public.turma_membros for insert to authenticated
  with check (
    aluno_id = auth.uid()
    and exists (
      select 1 from public.perfis p
      where p.id = auth.uid() and p.papel = 'aluno'
    )
  );

-- Resolve código sem expor todas as turmas
create or replace function public.resolver_codigo_turma(codigo_entrada text)
returns table (id uuid, nome text)
language sql
security definer
set search_path = public
stable
as $$
  select t.id, t.nome
  from public.turmas t
  where upper(t.codigo) = upper(trim(codigo_entrada))
  limit 1;
$$;

grant execute on function public.resolver_codigo_turma(text) to authenticated;
