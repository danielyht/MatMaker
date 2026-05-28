-- Execute no SQL Editor do Supabase (uma vez).

alter table public.perfis
  add column if not exists pontos integer not null default 0;

alter table public.perfis
  add column if not exists jogos_completados integer not null default 0;

-- Permite usuários logados verem o ranking (nome, foto, pontos).
create policy "Ranking: leitura de todos os perfis"
  on public.perfis for select
  to authenticated
  using (true);

-- Índice para ordenar o ranking rapidamente.
create index if not exists perfis_pontos_desc_idx on public.perfis (pontos desc);

-- Atualização de pontos (missões) — só o próprio usuário.
-- Ignore o erro se a política "Usuário atualiza o próprio perfil" já existir.
create policy "Perfil: atualizar próprios pontos"
  on public.perfis for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
