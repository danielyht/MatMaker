# Roteiro de testes — MatMaker (TCC e divulgação)

Use este guia **antes de divulgar** o site ou apresentar na banca.

---

## Parte 1 — Banco de dados (Supabase)

### Onde rodar

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Menu **SQL Editor** → **New query**
3. Cole o script → **Run**
4. Se pedir confirmação *destructive*, pode aceitar nos scripts de turma (só recria políticas)

### Ordem de instalação (primeira vez ou banco novo)

Rode **um arquivo por vez**, nesta ordem:

| # | Arquivo | O que faz |
|---|---------|-----------|
| 1 | `supabase/perfis-pontos.sql` | Pontos, jogos completados, políticas de ranking |
| 2 | `supabase/missoes-concluidas.sql` | Coluna `missoes_concluidas` (mapa do lab) |
| 3 | `supabase/ranking-semanal.sql` | `pontos_semana` e `semana_ref` |
| 4 | `supabase/turmas-professor.sql` | Modo turma completo (tabelas, RLS, funções) |

> Se você já rodou o passo 4 **antes** da correção de recursão RLS, rode também:
> `supabase/turmas-professor-fix-rls.sql`  
> (ou rode o `turmas-professor.sql` atualizado de novo — já inclui a correção.)

### Como verificar se está tudo OK

1. No SQL Editor, cole **todo** o conteúdo de:
   ```
   supabase/verificar-instalacao.sql
   ```
2. Clique **Run**
3. Confira os resultados:
   - **Seção 1–3:** tudo com status `OK`
   - **Seção 4 (RLS):** perfis ≥ 2, turmas ≥ 4, turma_membros ≥ 2
   - **Seção 5–6:** números coerentes com seus testes

### Se algo aparecer como FALTA

| Item faltando | Script para rodar |
|---------------|-------------------|
| `pontos`, `jogos_completados` | `perfis-pontos.sql` |
| `missoes_concluidas` | `missoes-concluidas.sql` |
| `pontos_semana`, `semana_ref` | `ranking-semanal.sql` |
| `papel`, tabelas `turmas` | `turmas-professor.sql` |
| funções `eh_membro_da_turma` | `turmas-professor.sql` ou `turmas-professor-fix-rls.sql` |
| Erro *infinite recursion* em turmas | `turmas-professor-fix-rls.sql` |

### Depois dos scripts

- **Settings → API → Reload schema** (recomendado)
- Aguarde ~1 minuto se o app ainda não “enxergar” tabelas novas

### Corrigir conta de professor manualmente

Se o professor cai no dashboard de aluno:

```sql
update public.perfis
set papel = 'professor'
where email = 'SEU_EMAIL@AQUI.com';
```

---

## Parte 2 — Testes automatizados (no computador)

No terminal, na pasta do projeto:

```bash
npm test
```

**Esperado:** `25 passed` (6 arquivos de teste).

Opcional — build de produção:

```bash
npm run build
```

**Esperado:** `built in ...` sem erros.

---

## Parte 3 — Teste manual no navegador

### Preparação

- [ ] `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- [ ] `npm run dev` → abrir http://localhost:5173
- [ ] Testar no **celular** (mesma rede ou deploy na Vercel)

### A — Cadastro e login

| # | Ação | Esperado |
|---|------|----------|
| 1 | Cadastrar como **Aluno** | Vai para `/dashboard` |
| 2 | Sair e cadastrar como **Professor** | Vai para `/professor` |
| 3 | Login com e-mail errado | Mensagem de erro clara |
| 4 | Login professor existente | `/professor` sem loop de redirect |

### B — Aluno (laboratório)

| # | Ação | Esperado |
|---|------|----------|
| 5 | Abrir dashboard | Mapa do lab + missões visíveis |
| 6 | No celular: mapa | Legenda em grid abaixo; setores clicáveis |
| 7 | Jogar 1 missão até o fim | Pontos sobem; setor acende no mapa |
| 8 | Abrir **Conquistas** | Lista carrega; contador atualiza |
| 9 | Abrir **Ranking** → aba **Pódio** | Top 3 em colunas (1º no centro) |
| 10 | Ranking → **Geral / Por liga / Semanal** | Lista muda conforme aba |
| 11 | **Minha turma** → entrar com código | Mensagem de sucesso |

### C — Professor (modo turma)

| # | Ação | Esperado |
|---|------|----------|
| 12 | Criar turma com nome | Código de 6 letras aparece |
| 13 | Copiar código | “Copiado!” |
| 14 | **Ver turma** | Aluno aparece após entrar com código |
| 15 | Atualizar (ícone refresh) | Lista de alunos atualiza |

### D — Guia Enzo

| # | Ação | Esperado |
|---|------|----------|
| 16 | Entrar em qualquer missão | Enzo aparece no canto |
| 17 | Fechar balão (X) | Balão fecha e **não reabre sozinho** |
| 18 | Invasão Espacial | Enzo com variante capitão |

---

## Parte 4 — Teste com outras pessoas (simulação de turma)

Ideal: **5–10 pessoas** ao mesmo tempo (celular + Wi‑Fi).

| Papel | Quantidade | O que fazem |
|-------|------------|-------------|
| Professor | 1 | Cria turma, passa código |
| Alunos | 4–8 | Cadastro, entram na turma, jogam 1 missão cada |
| Observador | 1 | Só abre ranking e atualiza várias vezes |

**Anote:**

- [ ] Alguém ficou preso em redirect?
- [ ] Ranking mostrou todos?
- [ ] Professor viu alunos na turma?
- [ ] Alguém no celular com layout quebrado?

---

## Parte 5 — Checklist do dia da banca / divulgação

### 24 h antes

- [ ] Rodar `supabase/verificar-instalacao.sql` → tudo OK
- [ ] `npm test` → 25 passed
- [ ] Site no ar (Vercel) ou `npm run dev` testado
- [ ] 1 conta professor + 1 aluno de demonstração prontas
- [ ] Turma de demo criada com código anotado

### No dia

- [ ] Internet estável (ou hotspot reserva)
- [ ] Login professor testado 10 min antes
- [ ] **Plano B:** gravação de tela ou screenshots se Supabase cair

### Para citar no TCC

- Frontend: React + Vite (SPA), deploy Vercel
- Backend: Supabase (Auth, PostgreSQL, RLS, Storage)
- Testes: Vitest + Testing Library (25 testes)
- Diferenciais: gamificação (ligas, conquistas, mapa), ranking em pódio, modo turma professor

---

## Parte 6 — Capacidade estimada (resumo)

| Cenário | Aguenta? |
|---------|----------|
| 1–3 turmas (30–90 alunos) | Sim |
| Banca + colegas no mesmo dia | Sim |
| 200–500 contas, uso moderado | Provavelmente sim (Supabase free) |
| Viral (1000+ cadastros/dia) | Pode bater limite do Supabase free |

Monitore em **Supabase → Reports** na semana da apresentação.

---

## Comandos rápidos

```bash
# Subir o site local
npm run dev

# Testes
npm test

# Build
npm run build
```

```sql
-- Verificar banco (Supabase SQL Editor)
-- Cole: supabase/verificar-instalacao.sql
```

---

## Zerar dados de teste (começar do zero)

Quando for divulgar de verdade e quiser apagar contas/turmas de teste:

1. **Backup mental:** anote quantos usuários tinha (opcional, para o TCC).
2. Supabase → **SQL Editor** → cole **`supabase/zerar-dados-teste.sql`** → **Run**.
3. Confirme o aviso *destructive* — **não tem volta**.
4. **Storage** → bucket `avatares` → apague pastas de fotos antigas (se existir).
5. Rode **`verificar-instalacao.sql`** — estrutura deve continuar toda `OK`, contagens em zero.
6. Cadastre de novo: 1 professor real → cria turma → alunos entram com código.

> Você também será deslogado e precisará **criar conta de novo**.
