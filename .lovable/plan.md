
# Plano: Dropdown de Areas Dinamico + Correcao de Erros de Build

## Problema Atual

O projeto tem **erros criticos de build** porque o codigo referencia tabelas que nao existem no banco de dados. A base de dados tem tabelas como `recruitment_jobs`, `recruitment_candidates`, `recruitment_stages`, mas o codigo tenta acessar tabelas como `jobs`, `areas`, `form_templates`, `form_fields`, `user_roles`, `user_profiles` -- que nunca foram criadas.

Isso precisa ser resolvido primeiro antes de implementar o dropdown dinamico.

## Etapas de Implementacao

### Etapa 1 -- Criar Tabelas Faltantes no Banco de Dados

Criar via migracao SQL as tabelas que o codigo ja referencia:

- **`areas`** -- com campos `id`, `name`, `description`, `is_archived`, `created_at`, `updated_at`, e constraint UNIQUE no `name`
- **`jobs`** -- tabela completa com todos os campos que `useJobs.ts` referencia (`area_id` como FK para `areas`, `work_model`, campos editoriais, etc.)
- **`form_templates`** e **`form_fields`** -- para o sistema de templates de formulario
- **`user_roles`** -- com campos `user_id` e `role` (usada em `AuthContext.tsx`)
- **`user_profiles`** -- com campo `is_active` (usada em `AuthContext.tsx`)

Alternativa: adaptar `AuthContext.tsx` para usar a tabela `profiles` que ja existe (tem `role` e `is_active`), eliminando a necessidade de `user_roles` e `user_profiles`.

### Etapa 2 -- Corrigir AuthContext.tsx

Adaptar o `AuthContext.tsx` para consultar a tabela `profiles` (que ja existe no banco) em vez de `user_roles` e `user_profiles`:

- Buscar `role` e `is_active` diretamente de `profiles` usando `user_id`
- Eliminar as duas queries separadas

### Etapa 3 -- Corrigir Hooks com Type Assertions

Nos hooks `useAreas.ts`, `useFormTemplates.ts`, e `LinkToJobDialog.tsx`, os erros de tipo ocorrem porque o arquivo `types.ts` (auto-gerado) nao inclui essas tabelas. Apos criar as tabelas via migracao, o `types.ts` sera regenerado automaticamente e os erros desaparecerao.

### Etapa 4 -- Dropdown Dinamico de Areas no Modal de Vagas

O `JobFormDialog.tsx` ja recebe `areas` como prop e filtra por `!isArchived`. O `useAreas` hook ja busca do Supabase com realtime. Apos corrigir os erros de build:

- **Adicionar mensagem vazia**: Se nao houver areas ativas, exibir "Nenhuma area cadastrada. Cadastre em Configuracoes." com botao de redirecionamento
- **Bloquear salvamento**: Ja implementado (valida `!formData.areaId`)
- **Busca digitavel**: Substituir o `Select` por um `Combobox` (usando o componente `Command` do cmdk ja instalado) para permitir busca por texto

### Etapa 5 -- AreasSettings com Supabase

O componente `AreasSettings.tsx` atualmente usa dados mockados (`initialAreas`). Integrar com o hook `useAreas` para:

- Buscar areas do banco
- Criar, editar, arquivar via Supabase
- Impedir arquivamento se houver vagas vinculadas ativas
- Contar vagas reais por area

## Secao Tecnica

### Migracao SQL Principal

```sql
-- Tabela areas (se nao existir)
CREATE TABLE IF NOT EXISTS public.areas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT areas_name_unique UNIQUE (name)
);

-- Tabela jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  requirements text,
  level text NOT NULL DEFAULT 'pleno',
  contract_type text NOT NULL DEFAULT 'clt',
  work_model text DEFAULT 'presencial',
  location text NOT NULL DEFAULT 'Brasil',
  about_job text,
  about_company text,
  responsibilities text,
  requirements_text text,
  nice_to_have text,
  additional_info text,
  salary_min numeric,
  salary_max numeric,
  status text NOT NULL DEFAULT 'rascunho',
  priority text NOT NULL DEFAULT 'media',
  area_id uuid REFERENCES public.areas(id),
  form_template_id uuid,
  source_id text,
  deadline date,
  is_remote boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  is_boosted boolean DEFAULT false,
  investment_amount numeric DEFAULT 0,
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela form_templates
CREATE TABLE IF NOT EXISTS public.form_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela form_fields
CREATE TABLE IF NOT EXISTS public.form_fields (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  label text NOT NULL,
  field_type text NOT NULL,
  is_required boolean DEFAULT false,
  order_index integer DEFAULT 0,
  placeholder text,
  options text[],
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;

-- Policies para usuarios autenticados
CREATE POLICY "Authenticated read areas" ON public.areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH manage areas" ON public.areas FOR ALL TO authenticated USING (
  get_current_user_role() IN ('admin', 'rh')
);
-- (Policies similares para jobs, form_templates, form_fields)

-- Trigger updated_at
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/contexts/AuthContext.tsx` | Usar tabela `profiles` em vez de `user_roles`/`user_profiles` |
| `src/components/settings/AreasSettings.tsx` | Integrar com `useAreas` hook (remover dados mockados) |
| `src/components/jobs/JobFormDialog.tsx` | Adicionar Combobox com busca, mensagem de areas vazias |
| `src/components/talent/LinkToJobDialog.tsx` | Ajustar query para tabela `jobs` (apos criacao) |
| `src/hooks/useFormTemplates.ts` | Type assertions serao resolvidos apos regeneracao de types |

### Componente Combobox de Areas (JobFormDialog)

Substituir o `Select` atual por um dropdown com busca usando `Command` (cmdk):
- Input de busca integrado
- Scroll interno
- Placeholder "Selecione a area"
- Estado vazio com link para Configuracoes

### Integridade Referencial

- `jobs.area_id` -> FK para `areas.id`
- Arquivamento de area: verificar se existem vagas ativas vinculadas antes de permitir
- `UNIQUE(name)` na tabela areas para evitar duplicatas
