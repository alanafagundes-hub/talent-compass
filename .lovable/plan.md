

## Problema

O erro "new row violates row-level security policy for table 'applications'" ocorre porque as politicas de INSERT nas tabelas do fluxo de candidatura foram criadas apenas para o papel `anon` (usuario nao logado). Quando voce acessa a pagina publica estando logada no sistema, o Supabase trata voce como `authenticated`, e as politicas `anon` nao se aplicam.

Isso afeta 4 tabelas: `candidates`, `applications`, `form_responses` e `application_history`.

## Solucao

Executar uma migracao SQL que adicione politicas de INSERT para o papel `authenticated` nessas 4 tabelas, permitindo que tanto usuarios anonimos quanto logados possam enviar candidaturas pela pagina publica.

## Detalhes Tecnicos

Uma unica migracao SQL com 4 novas politicas:

```text
candidates       -> INSERT para authenticated (criar candidato)
applications     -> INSERT para authenticated (criar candidatura)  
form_responses   -> INSERT para authenticated (salvar respostas)
application_history -> INSERT para authenticated (registrar historico)
```

Tambem serao adicionadas politicas de SELECT para `authenticated` nas tabelas `funnels` e `funnel_stages` (caso ainda nao existam para esse papel), ja que o fluxo precisa consultar a primeira etapa do funil.

Nenhuma alteracao de codigo e necessaria -- apenas permissoes no banco de dados.

