-- Execute no SQL Editor do Supabase (uma vez).
-- Guarda quais missões do laboratório o aluno já concluiu (para o mapa acender).

alter table public.perfis
  add column if not exists missoes_concluidas text[] not null default '{}';
