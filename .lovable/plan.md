
# Plano de Correção: Erro ao Criar Vagas

## Problema Identificado

A criação de vagas está falhando com o erro **"invalid input syntax for type uuid: '3'"** porque:

1. O hook `useAreas` em `src/hooks/useAreas.ts` usa **localStorage** com IDs simples como `"1"`, `"2"`, `"3"`
2. O banco de dados Supabase espera **UUIDs** no campo `area_id` (ex: `f29d1e13-6076-4a7b-a4bd-f8c6b308e1ca`)
3. Quando o usuário seleciona uma área, o formulário envia o ID mock em vez do UUID real

## Solução

Atualizar o hook `useAreas` para buscar as áreas diretamente do Supabase, garantindo que os IDs usados sejam UUIDs válidos.

## Arquivos a Modificar

### 1. `src/hooks/useAreas.ts`

Reescrever o hook para:
- Buscar áreas do Supabase em vez do localStorage
- Manter a interface existente (`areas`, `getAreaById`, `createArea`, `updateArea`, etc.)
- Mapear os campos do banco (`is_archived`, `created_at`) para o formato TypeScript (`isArchived`, `createdAt`)
- Adicionar suporte a realtime updates

```text
Principais mudanças:
- Remover constantes de localStorage (STORAGE_KEY, initialAreas)
- Adicionar fetchAreas() que consulta supabase.from('areas')
- Mapear campos snake_case para camelCase
- Implementar createArea, updateArea e toggleArchive usando Supabase
- Adicionar subscription para mudancas em tempo real
```

### 2. Verificar compatibilidade com `src/pages/Vagas.tsx`

O componente já usa `useAreas()` corretamente:
- `areas` para listar no select
- `getAreaById()` para exibir o nome da área no JobCard

Nenhuma mudança necessária neste arquivo.

## Detalhes Tecnicos

### Mapeamento de Tipos

| Banco de Dados | TypeScript |
|----------------|------------|
| `id` (uuid) | `id` (string) |
| `is_archived` | `isArchived` |
| `created_at` | `createdAt` |
| `updated_at` | `updatedAt` |

### Funções do Hook

| Funcao | Implementacao Supabase |
|--------|------------------------|
| `getAreas()` | `supabase.from('areas').select('*').eq('is_archived', false)` |
| `getAreaById(id)` | Buscar do array em memoria |
| `createArea(data)` | `supabase.from('areas').insert()` |
| `updateArea(id, data)` | `supabase.from('areas').update().eq('id', id)` |
| `toggleArchive(id)` | `updateArea(id, { is_archived: !current })` |

## Resultado Esperado

Apos a correcao:
- Vagas serao criadas com `area_id` sendo um UUID valido
- Sincronizacao completa entre ATS e banco de dados
- Areas criadas nas configuracoes aparecerao no formulario de vagas
