
# Plano: Corrigir Visualização de Arquivos

## Diagnóstico

O problema ocorre porque:
1. O bucket `resumes` está configurado como **privado**
2. As URLs são salvas com o formato `/object/public/` que não funciona em buckets privados
3. O Chrome possui políticas de segurança (CSP/CORS) que bloqueiam a exibição inline de PDFs de domínios externos, mesmo com URLs válidas

## Solução Proposta

### Opção 1 (Recomendada): Tornar o Bucket Público

A forma mais simples e confiável de resolver o problema:

**Migração SQL:**
```sql
UPDATE storage.buckets 
SET public = true 
WHERE id = 'resumes';
```

**Vantagens:**
- URLs funcionam imediatamente sem necessidade de assinatura
- Não há dependência de tokens temporários
- Download e visualização funcionam em qualquer navegador
- Os arquivos já possuem nomes randomizados (ex: `1769542926740-vl80nl.pdf`), tornando praticamente impossível adivinhar URLs

**Desvantagens:**
- Tecnicamente qualquer pessoa com a URL exata pode acessar o arquivo
- Dado que as URLs são randomizadas, o risco é mínimo

### Opção 2: Manter Privado e Melhorar UX

Se preferir manter o bucket privado por compliance (LGPD):

1. **Remover preview inline**: Eliminar a tentativa de exibir PDF embutido (que o Chrome bloqueia)
2. **Focar em Download/Nova Aba**: Oferecer apenas botões de "Baixar" e "Abrir em nova aba" com URLs assinadas
3. **Validar geração de URL**: Garantir que as signed URLs estão sendo geradas corretamente

---

## Implementação Recomendada (Opção 1)

### Passo 1: Atualizar Bucket para Público

Executar migração SQL para tornar o bucket público.

### Passo 2: Simplificar Código de Exibição

Atualizar `ApplicationDataBlock.tsx`:
- Remover lógica de signed URLs (não será mais necessária)
- Usar a URL diretamente para download e links externos
- Manter preview com `<object>` tag para PDFs (funcionará melhor com bucket público)

### Passo 3: Manter Políticas RLS de Upload

As políticas de upload continuam funcionando normalmente - apenas a leitura se torna pública.

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| Migração SQL | Tornar bucket `resumes` público |
| `src/components/funnel/ApplicationDataBlock.tsx` | Simplificar lógica de URLs, remover signed URL calls |
| `src/hooks/useSignedUrl.ts` | Pode ser mantido para uso futuro, mas não será necessário para currículos |

---

## Resultado Esperado

Após a implementação:
- Arquivos carregarão instantaneamente sem espera por assinatura
- Preview de PDF funcionará corretamente no Chrome
- Download funcionará em qualquer navegador
- Abrir em nova aba funcionará normalmente
