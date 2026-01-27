
# Plano de Correção: Bugs de Etiquetas e Currículo

## Problemas Identificados

### Bug 1: Não é possível adicionar etiquetas aos candidatos
**Causa Raiz:** O componente `CandidateDetailSheet` espera receber os handlers `onAddTag` e `onRemoveTag` como props, mas o `VagaFunil.tsx` **não está passando esses handlers**. As props existem na interface, mas não há implementação para gerenciar as tags.

**Evidência:** Na linha 598-613 de `VagaFunil.tsx`, o componente `CandidateDetailSheet` é renderizado com `availableTags={tags}`, mas sem `onAddTag` nem `onRemoveTag`.

### Bug 2: Currículo anexado no formulário não aparece
**Causa Raiz:** O formulário público (`VagaPublica.tsx`) coleta o arquivo de currículo e valida corretamente, mas **nunca faz o upload** para o Supabase Storage nem atualiza o campo `resume_url` na tabela `candidates`.

**Evidência:** 
- O formulário tem `formData.resumeFile` mas esse arquivo nunca é enviado
- Query no banco mostra `resume_url: null` para todos os candidatos
- O bucket `resumes` existe no Supabase mas está vazio

---

## Solução Proposta

### Correção 1: Implementar gestão de etiquetas

**Arquivo:** `src/hooks/useFunnelData.ts`

Adicionar duas novas funções ao hook:
- `addTag(cardId, tagId)`: Insere registro em `application_tags`
- `removeTag(cardId, tagId)`: Remove registro de `application_tags`

```typescript
const addTag = useCallback(async (cardId: string, tagId: string) => {
  // Inserir na tabela application_tags
  // Atualizar estado local otimisticamente
});

const removeTag = useCallback(async (cardId: string, tagId: string) => {
  // Remover da tabela application_tags  
  // Atualizar estado local
});
```

**Arquivo:** `src/pages/VagaFunil.tsx`

Passar os handlers para o `CandidateDetailSheet`:
```typescript
<CandidateDetailSheet
  // ... props existentes
  onAddTag={async (cardId, tagId) => { await addTag(cardId, tagId); }}
  onRemoveTag={async (cardId, tagId) => { await removeTag(cardId, tagId); }}
/>
```

---

### Correção 2: Implementar upload de currículo

**Arquivo:** `src/pages/VagaPublica.tsx`

Modificar a função `handleSubmit` para:
1. Fazer upload do arquivo para o bucket `resumes` do Supabase Storage
2. Atualizar o `resume_url` do candidato após o upload

```typescript
// Após criar/encontrar o candidato:
if (formData.resumeFile) {
  const fileExt = formData.resumeFile.name.split('.').pop();
  const filePath = `${candidateId}/${Date.now()}.${fileExt}`;
  
  // Upload para o bucket 'resumes'
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, formData.resumeFile);
  
  if (!uploadError) {
    // Obter URL pública/assinada
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);
    
    // Atualizar o candidato com a URL do currículo
    await supabase
      .from('candidates')
      .update({ resume_url: urlData.publicUrl })
      .eq('id', candidateId);
  }
}
```

**Nota:** O bucket `resumes` é privado, então precisamos verificar/ajustar as policies de RLS para permitir:
- Upload anônimo (candidatos públicos)
- Leitura autenticada (recrutadores)

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/hooks/useFunnelData.ts` | Adicionar funções `addTag` e `removeTag` |
| `src/pages/VagaFunil.tsx` | Passar handlers de tags ao `CandidateDetailSheet` |
| `src/pages/VagaPublica.tsx` | Implementar upload do currículo e atualização do `resume_url` |

---

## Detalhes Técnicos

### Storage Policy para o bucket `resumes`
O bucket já existe como privado. Será necessário garantir:
- Policy INSERT para anon (upload público)
- Policy SELECT para authenticated (visualização por recrutadores)

```sql
-- Permitir upload anônimo
CREATE POLICY "Allow public upload" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'resumes');

-- Permitir leitura por usuários autenticados
CREATE POLICY "Allow authenticated read" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'resumes');
```

### Atualização do ResumeBlock
O componente `ResumeBlock` já está preparado para receber a `resumeUrl` e exibir preview/download. Nenhuma modificação necessária após o currículo ser persistido corretamente.

---

## Resultado Esperado

Após as correções:
1. Recrutadores poderão adicionar/remover etiquetas dos candidatos diretamente no drawer
2. Currículos enviados pelos candidatos serão armazenados no Supabase Storage e exibidos no bloco "Currículo" do drawer
