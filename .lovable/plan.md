

## Problema

O modulo ATS ja possui tabelas separadas (`user_profiles` e `user_roles`) da tabela principal `profiles` (que tem os 27 usuarios existentes). Porem, a tabela `user_profiles` esta incompleta -- faltam colunas essenciais que o codigo espera (`name`, `email`, `avatar_url`) -- e a tabela `user_area_assignments` nao existe. Isso impede a criacao e gestao de usuarios dentro do ATS.

O `AuthContext` ja verifica apenas `user_roles` para determinar se alguem e usuario interno do ATS, entao os 27 usuarios existentes na tabela `profiles` nao aparecem e nao tem acesso ao ATS. A separacao logica ja esta correta; so falta corrigir o esquema do banco.

## Solucao

Executar uma migracao SQL para:

1. Adicionar as colunas faltantes na tabela `user_profiles` (`name`, `email`, `avatar_url`)
2. Criar a tabela `user_area_assignments` com referencia a `areas`
3. Adicionar as politicas de RLS necessarias para ambas as tabelas
4. Adicionar um `created_at` na tabela `user_roles` (o codigo espera esse campo)

Nenhuma alteracao de codigo e necessaria, pois o hook `useUsers` e o `AuthContext` ja referenciam estas tabelas com estas colunas.

## Detalhes Tecnicos

### Alteracoes na tabela `user_profiles`

```text
ADD COLUMN name      TEXT NOT NULL DEFAULT ''
ADD COLUMN email     TEXT NOT NULL DEFAULT ''
ADD COLUMN avatar_url TEXT
```

### Nova tabela `user_area_assignments`

```text
id         UUID PRIMARY KEY
user_id    UUID NOT NULL (referencia auth.users)
area_id    UUID NOT NULL (referencia areas)
created_at TIMESTAMPTZ DEFAULT now()
UNIQUE(user_id, area_id)
```

### Politicas de RLS

- `user_profiles`: SELECT/INSERT/UPDATE para usuarios autenticados com role admin (via `user_roles`)
- `user_area_assignments`: SELECT/INSERT/DELETE para usuarios autenticados com role admin
- Cada usuario pode ler seu proprio perfil em `user_profiles`

### Coluna `created_at` em `user_roles`

Adicionar `created_at TIMESTAMPTZ DEFAULT now()` caso nao exista (o tipo `UserRole` no codigo espera esse campo).

