-- Criar nova vaga publicada para teste de sincronização
INSERT INTO public.jobs (
  title, 
  description, 
  area_id, 
  status, 
  level, 
  contract_type, 
  location, 
  is_remote,
  priority,
  is_archived,
  requirements,
  published_at
)
SELECT 
  'Designer UI/UX',
  'Buscamos um designer criativo para desenvolver interfaces incríveis e experiências de usuário memoráveis.',
  a.id,
  'publicada',
  'pleno',
  'clt',
  'São Paulo, SP',
  true,
  'media',
  false,
  'Experiência com Figma, Adobe XD. Portfólio com projetos web e mobile. Conhecimento em Design Systems.',
  now()
FROM areas a
WHERE a.name = 'Tecnologia'
LIMIT 1;