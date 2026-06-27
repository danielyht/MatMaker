-- Campos extras para cadastro de professores (instituição e matéria).
-- Rode APÓS supabase/turmas-professor.sql (coluna papel já existente).
-- Idempotente: pode executar mais de uma vez.

alter table public.perfis
  add column if not exists instituicao text;

alter table public.perfis
  add column if not exists materia text;
