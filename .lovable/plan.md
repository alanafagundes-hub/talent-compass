
# Plano: Criar Tabelas do Funil, Candidatos e Candidaturas

## Problema

O erro **"Could not find the table 'public.funnels'"** ocorre porque 10 tabelas essenciais para o funcionamento do funil, candidatos e candidaturas **nunca foram criadas** no banco de dados:

- `tags`
- `candidates`
- `funnels`
- `funnel_stages`
- `applications`
- `application_tags`
- `application_history`
- `stage_evaluations`
- `form_responses`
- `rejected_applications`

As tabelas de configuracao (areas, jobs, form_templates, etc.) ja existem e funcionam. O problema esta exclusivamente na camada de dados de recrutamento ativo.

## Solucao

Criar uma migracao SQL unica que cria todas as 10 tabelas faltantes, com:

- Chaves primarias e estrangeiras corretas
- RLS habilitado com policies para Admin/RH (escrita) e Head (leitura)
- Triggers de `updated_at` onde aplicavel
- Indices para performance em queries frequentes

## Secao Tecnica

### Tabelas a Criar

| Tabela | Descricao | FKs |
|--------|-----------|-----|
| `tags` | Etiquetas de candidatura | -- |
| `candidates` | Cadastro de candidatos | -- |
| `funnels` | Funil por vaga | `job_id` -> `jobs` |
| `funnel_stages` | Etapas do funil | `funnel_id` -> `funnels` |
| `applications` | Candidaturas | `candidate_id` -> `candidates`, `job_id` -> `jobs`, `current_stage_id` -> `funnel_stages` |
| `application_tags` | Tags por candidatura | `application_id` -> `applications`, `tag_id` -> `tags` |
| `application_history` | Historico de movimentacoes | `application_id` -> `applications` |
| `stage_evaluations` | Avaliacoes por etapa | `application_id` -> `applications`, `stage_id` -> `funnel_stages` |
| `form_responses` | Respostas de formulario | `application_id` -> `applications`, `field_id` -> `form_fields` |
| `rejected_applications` | Motivos de rejeicao | `application_id` -> `applications`, `reason_id` -> `incompatibility_reasons` |

### Campos das Tabelas (resumo)

- **candidates**: id, name, email (UNIQUE), phone, linkedin_url, portfolio_url, resume_url, notes, source, availability, is_in_talent_pool, is_archived, created_at, updated_at
- **funnels**: id, job_id, name, is_active, created_at
- **funnel_stages**: id, funnel_id, name, order_index, color, is_archived, created_at
- **applications**: id, job_id, candidate_id, current_stage_id, status (ativa/contratada/incompativel/desistente), rating, notes, source, tracking_data (jsonb), applied_at, rejected_at, is_archived, created_at, updated_at
- **application_history**: id, application_id, from_stage_id, to_stage_id, action, notes, created_at
- **stage_evaluations**: id, application_id, stage_id, rating, notes, evaluated_by, evaluated_at
- **form_responses**: id, application_id, field_id, value, file_url, created_at
- **rejected_applications**: id, application_id, reason_id, observation, can_reapply, created_at

### RLS

Todas as tabelas com RLS habilitado:
- **SELECT** para todos usuarios autenticados
- **INSERT/UPDATE/DELETE** para usuarios com role `admin` ou `rh` (usando funcao `has_role`)
- Excecao: `candidates`, `applications` e `form_responses` permitem INSERT anonimo (candidaturas publicas)

### Trigger de Criacao Automatica de Funil

Ao criar uma vaga (`INSERT` em `jobs`), um trigger cria automaticamente:
- Um registro em `funnels` vinculado a vaga
- As 7 etapas padrao do funil (Inscritos, Triagem RH, Entrevista RH, etc.)

Isso garante que toda vaga criada ja tenha um funil funcional.

### Arquivos a Alterar

Nenhum arquivo de codigo precisa ser alterado. O problema e exclusivamente no banco de dados. Apos criar as tabelas, o funil passara a funcionar automaticamente.

### Resultado Esperado

- Acessar o funil de qualquer vaga sem erro
- Kanban funcional com drag-and-drop entre etapas
- Banco de Talentos carregando candidatos
- Pagina de Perdidos funcional
