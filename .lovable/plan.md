

# Plano: Isolamento Completo do ATS

## Resumo do Problema

O ATS compartilha tabelas e funcoes com o CRM legado, causando conflitos graves:

- O enum `app_role` so tem valores do CRM (`admin`, `sdr`, `closer`, `manager`, `custom`), mas o ATS tenta gravar `rh`, `head`, `viewer` -- o que causa erro no banco
- A tela de "Perfis de Acesso" mostra 23 modulos do CRM (Copy, CSM, Churn, etc.) em vez de modulos de recrutamento
- O trigger `handle_new_user()` cria usuarios na tabela `profiles` (CRM), nao em `user_profiles` (ATS)
- As funcoes de banco (`get_current_user_role`, `user_has_module_permission`) consultam apenas `profiles` do CRM

## Solucao em 3 Etapas

### Etapa 1 -- Corrigir o enum `app_role`

Adicionar os valores que o ATS precisa (`rh`, `head`, `viewer`) ao enum existente. Isso permite que a tabela `user_roles` aceite as roles do recrutamento sem quebrar o CRM.

### Etapa 2 -- Cadastrar modulos de recrutamento

Inserir modulos especificos do ATS na tabela `modules`:
- Dashboard Recrutamento
- Vagas
- Banco de Talentos
- Perdidos
- Configuracoes de Recrutamento
- Configuracoes Gerais (admin)

Esses modulos precisam ficar sem `workspace_id` (isolados do CRM).

### Etapa 3 -- Isolar o codigo frontend

- **AccessProfilesTab**: Filtrar `modules` para mostrar apenas modulos de recrutamento (nao os 23 do CRM)
- **AccessProfilesTab**: Trocar as opcoes de "Perfil Base" de `admin/sdr/closer/custom` para `admin/rh/head/viewer`
- **useUsers.createUser**: Remover dependencia do `signUp` (que aciona o trigger CRM) e criar logica propria com edge function para criar usuario + profile ATS em uma unica operacao
- **AuthContext**: Ja esta correto, consulta apenas `user_roles`

## Detalhes Tecnicos

### Migracao SQL

```text
-- 1. Expandir enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'rh';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'head';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- 2. Inserir modulos de recrutamento
INSERT INTO public.modules (name, display_name, icon, is_active)
VALUES
  ('ats_dashboard',     'Dashboard',                 'LayoutDashboard', true),
  ('ats_vagas',         'Vagas',                     'Briefcase',       true),
  ('ats_talentos',      'Banco de Talentos',         'Users',           true),
  ('ats_perdidos',      'Perdidos',                  'UserX',           true),
  ('ats_config',        'Config. Recrutamento',      'Settings',        true),
  ('ats_admin',         'Configuracoes Gerais',      'Cog',             true);
```

### Alteracoes no Codigo

1. **`src/hooks/useAccessProfiles.ts`**
   - Filtrar modulos com prefixo `ats_` no fetch ou via WHERE no Supabase

2. **`src/components/admin/AccessProfilesTab.tsx`**
   - Trocar opcoes do Select de base_role para admin/rh/head/viewer
   - Atualizar labels correspondentes

3. **`src/hooks/useUsers.ts`**
   - Criar edge function `create-ats-user` que usa service_role para:
     - Criar usuario no auth
     - Inserir em `user_profiles` (ATS)
     - Inserir em `user_roles` (ATS)
     - NAO aciona `handle_new_user` do CRM
   - Alterar `createUser` para chamar a edge function em vez de `signUp`

4. **`src/pages/MeuPerfil.tsx`**
   - Nenhuma alteracao necessaria (ja usa `user_profiles`)

### Edge Function: `create-ats-user`

Recebe `{ email, password, name, role, areaIds }` e:
- Valida que o chamador e admin (via token JWT)
- Cria usuario com `supabase.auth.admin.createUser`
- Insere profile em `user_profiles`
- Insere role em `user_roles`
- Insere areas em `user_area_assignments`
- Retorna o usuario criado

### O que NAO sera alterado

- Tabela `profiles` e suas 27 entradas (CRM intocado)
- Funcoes do CRM (`get_current_user_role`, etc.)
- Trigger `handle_new_user` (continua criando profiles CRM para novos signups normais)
- Modulos existentes do CRM na tabela `modules`

