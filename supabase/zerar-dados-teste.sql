-- =============================================================================
-- ZERAR DADOS DE TESTE — MatMaker
-- ⚠️ IRREVERSÍVEL. Apaga TODAS as turmas, perfis e contas de login.
--
-- O que NÃO é apagado:
--   • Estrutura do banco (tabelas, colunas, políticas RLS, funções)
--   • Scripts já instalados continuam válidos
--
-- O que É apagado:
--   • Turmas e vínculos aluno↔turma
--   • Perfis (pontos, conquistas no banco, papel, etc.)
--   • Contas de autenticação (auth.users) — ninguém consegue mais logar
--
-- Como rodar:
--   1. Supabase → SQL Editor → New query
--   2. Cole este arquivo inteiro
--   3. Leia o aviso e confirme Run (vai pedir confirmação destructive)
--
-- Depois:
--   • Limpe fotos manualmente: Storage → bucket "avatares" (se existir)
--   • Rode supabase/verificar-instalacao.sql para confirmar estrutura OK
--   • Cadastre de novo professor + alunos reais
-- =============================================================================

-- Contagem antes (opcional — anote para o TCC se quiser)
select
  (select count(*) from public.turma_membros) as membros_antes,
  (select count(*) from public.turmas) as turmas_antes,
  (select count(*) from public.perfis) as perfis_antes,
  (select count(*) from auth.users) as usuarios_auth_antes;

-- 1) Turmas (ordem respeita foreign keys)
delete from public.turma_membros;
delete from public.turmas;

-- 2) Perfis públicos
delete from public.perfis;

-- 3) Contas de login (Auth)
-- Necessário para que e-mails antigos possam se cadastrar de novo
delete from auth.users;

-- Contagem depois (deve ser tudo zero)
select
  (select count(*) from public.turma_membros) as membros_depois,
  (select count(*) from public.turmas) as turmas_depois,
  (select count(*) from public.perfis) as perfis_depois,
  (select count(*) from auth.users) as usuarios_auth_depois;

-- =============================================================================
-- OPCIONAL: manter UMA conta (ex.: sua conta de professor)
-- Comente o bloco "delete from auth.users" acima e use isto no lugar:
--
-- delete from auth.users
-- where id not in (
--   select id from public.perfis where email = 'SEU_EMAIL@AQUI.com'
-- );
--
-- (Ainda apague turmas/membros/perfis dos outros antes, ou adapte os DELETE
--  com WHERE email <> 'SEU_EMAIL@AQUI.com' nas tabelas public.*)
-- =============================================================================
