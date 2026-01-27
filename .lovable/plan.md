
# Plano: Formulário Dinâmico Baseado nos Templates de Configurações

## Visão Geral

Atualmente, o formulário de candidatura na página pública (`VagaPublica.tsx`) possui campos fixos e hardcoded (Nome, E-mail, Telefone, LinkedIn, Currículo). Este plano vai transformar esse formulário para renderizar **dinamicamente** os campos definidos nos templates de formulário criados em Configurações.

---

## Arquitetura Proposta

```text
+---------------------------+       +-----------------------+       +---------------------------+
|   Configurações           |       |   Edição de Vaga      |       |   Página Pública          |
|   (FormTemplates)         |       |   (JobFormDialog)     |       |   (VagaPublica)           |
+---------------------------+       +-----------------------+       +---------------------------+
|                           |       |                       |       |                           |
|  Criar/Editar Templates   | ----> |  Selecionar Template  | ----> |  Renderizar Campos        |
|  com campos dinâmicos     |       |  para a vaga          |       |  do Template selecionado  |
|                           |       |                       |       |                           |
+---------------------------+       +-----------------------+       +---------------------------+
                                              |
                                              v
                                    +---------------------+
                                    |    Banco de Dados   |
                                    +---------------------+
                                    | jobs.form_template_id|
                                    | form_fields.*        |
                                    | form_responses.*     |
                                    +---------------------+
```

---

## Mudanças Necessárias

### 1. Atualizar a Página Pública (`src/pages/VagaPublica.tsx`)

**Problema Atual:** 
- Campos fixos (Nome, E-mail, Telefone, LinkedIn, Currículo) renderizados diretamente no JSX
- Template carrega `form_fields` mas são tratados como campos "extras" após os fixos

**Solução:**
- **Remover todos os campos fixos do formulário**
- **Renderizar APENAS os campos vindos do `form_fields`** associado ao `form_template_id` da vaga
- Se a vaga não tiver template associado, exibir mensagem de erro ou campos mínimos obrigatórios

**Mudanças no código:**
- Remover linhas 672-733 (campos hardcoded de nome, email, phone, linkedin, resume)
- Modificar a seção do formulário para iterar sobre `formFields` e renderizar cada campo dinamicamente
- Atualizar o estado `formData` para ser completamente dinâmico (sem campos fixos pré-definidos)
- Ajustar `validateForm()` para validar campos obrigatórios do template
- Ajustar `handleSubmit()` para salvar todas as respostas na tabela `form_responses`

### 2. Adicionar Suporte a Todos os Tipos de Campo

O sistema já suporta os tipos:
- `short_text` - Input de texto simples
- `long_text` - Textarea
- `yes_no` - Radio buttons Sim/Não
- `multiple_choice` - Checkboxes

**Adicionar suporte a:**
- `file_upload` - Upload de arquivo (currículo, portfólio, etc.)

**Implementação:**
```typescript
case "file_upload":
  return (
    <div key={field.id} className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label} {field.is_required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={field.id}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => handleFileField(field.id, e.target.files?.[0])}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
```

### 3. Atualizar Estrutura de Dados do Formulário

**Estado atual:**
```typescript
interface ApplicationFormData {
  name: string;           // REMOVER
  email: string;          // REMOVER
  phone: string;          // REMOVER
  linkedin: string;       // REMOVER
  resumeFile: File | null; // REMOVER
  lgpdConsent: boolean;
  customFields: Record<string, string | string[] | boolean>;
}
```

**Estado proposto:**
```typescript
interface ApplicationFormData {
  fields: Record<string, string | string[] | boolean | null>;
  files: Record<string, File | null>;
  lgpdConsent: boolean;
}
```

### 4. Atualizar Lógica de Submissão

A submissão deve:
1. Extrair campos essenciais (nome, email) do `formData.fields` para criar/atualizar o `candidate`
2. Fazer upload de todos os arquivos para o Storage
3. Salvar TODAS as respostas na tabela `form_responses` (incluindo URLs dos arquivos)

**Identificação de campos essenciais:**
- Nome: Buscar campo com label contendo "nome" ou tipo especial (pode ser definido no template)
- E-mail: Buscar campo com label contendo "email" ou validar formato de email
- Isso requer uma convenção ou marcação especial nos campos do template

### 5. Tratamento de Vaga sem Template

Se a vaga não tiver `form_template_id`:
- Exibir mensagem: "Esta vaga ainda não possui um formulário de candidatura configurado"
- Ou: Usar um template padrão (se existir um marcado como `is_default`)

---

## Resumo dos Arquivos a Modificar

| Arquivo | Alterações |
|---------|------------|
| `src/pages/VagaPublica.tsx` | Remover campos fixos, renderizar apenas campos do template, adicionar suporte a `file_upload`, atualizar validação e submissão |
| `src/components/settings/FormTemplatesSettings.tsx` | Adicionar opção para marcar campos como "essenciais" (nome, email) - **opcional** |

---

## Resultado Esperado

1. Ao criar um template em Configurações com campos específicos (ex: Nome, E-mail, Portfolio, Pretensão Salarial)
2. Ao selecionar esse template na edição da vaga
3. A página pública da vaga renderizará **exatamente** esses campos na mesma ordem
4. As respostas serão salvas em `form_responses` e exibidas no painel do candidato

---

## Detalhes Técnicos

### Convenção para Campos Essenciais

Para identificar campos que mapeiam para a tabela `candidates`, podemos usar convenções baseadas no **label** do campo:

- **Nome**: Label contém "nome" (case insensitive)
- **E-mail**: Label contém "email" ou "e-mail"
- **Telefone**: Label contém "telefone" ou "phone"
- **LinkedIn**: Label contém "linkedin"
- **Currículo**: Tipo `file_upload` com label contendo "currículo" ou "resume"

### Fluxo de Submissão Atualizado

```text
1. Usuário preenche formulário dinâmico
2. Validar campos obrigatórios
3. Identificar campos essenciais pelo label
4. Criar/atualizar registro em `candidates` com dados essenciais
5. Upload de arquivos para Storage
6. Criar registro em `applications`
7. Salvar TODAS as respostas em `form_responses` (incluindo URLs de arquivos)
8. Criar registro em `application_history`
```

### Mapeamento de Tipos

| Tipo no Template | Componente React | Valor Salvo |
|-----------------|------------------|-------------|
| `short_text` | `<Input>` | string |
| `long_text` | `<Textarea>` | string |
| `yes_no` | `<RadioGroup>` | "sim" / "nao" |
| `multiple_choice` | `<Checkbox>` | array de strings (JSON) |
| `file_upload` | `<Input type="file">` | URL do arquivo no Storage |
