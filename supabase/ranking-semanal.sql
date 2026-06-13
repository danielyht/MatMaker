-- Pontos da semana (ranking semanal). Execute no SQL Editor do Supabase (uma vez).

alter table public.perfis
  add column if not exists pontos_semana integer not null default 0;

alter table public.perfis
  add column if not exists semana_ref text not null default '';

create index if not exists perfis_pontos_semana_desc_idx
  on public.perfis (pontos_semana desc)
  where pontos_semana > 0;
