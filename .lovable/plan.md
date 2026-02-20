
# Remover a tela de login

## O que sera feito

Remover apenas a pagina `/login` e a rota correspondente, mantendo todo o sistema de autenticacao (contexto, protecao de rotas, cadastro) intacto.

## Alteracoes

1. **Remover a rota `/login`** do `src/App.tsx` e o import do componente `Login`
2. **Deletar o arquivo** `src/pages/Login.tsx`
3. **Atualizar o `ProtectedRoute`** para nao redirecionar para `/login` quando o usuario nao esta autenticado (redirecionar para `/cadastro` em vez disso, ja que essa pagina continua existindo)
4. **Atualizar o `AppLayout`** - alterar o `handleSignOut` para redirecionar para `/cadastro` em vez de `/login`

## Detalhes tecnicos

- O `ProtectedRoute.tsx` atualmente faz `Navigate to="/login"` - sera alterado para `/cadastro`
- O `AppLayout.tsx` faz `navigate('/login')` no signOut - sera alterado para `/cadastro`
- O link "Nao tem uma conta? Criar conta" que existia na tela de login sera removido junto com o arquivo
- O `AuthContext.tsx` permanece inalterado
