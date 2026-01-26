-- Insert a test area
INSERT INTO public.areas (name, description, is_archived)
VALUES ('Tecnologia', 'Área de desenvolvimento e tecnologia', false);

-- Insert a test job with status 'publicada'
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
  requirements
)
SELECT 
  'Desenvolvedor Full Stack',
  'Buscamos um desenvolvedor full stack para integrar nossa equipe de tecnologia. O profissional será responsável por desenvolver e manter aplicações web modernas.',
  a.id,
  'publicada',
  'pleno',
  'clt',
  'São Paulo, SP',
  true,
  'alta',
  false,
  'Experiência com React, Node.js e TypeScript. Conhecimento em bancos de dados SQL e NoSQL. Boa comunicação e trabalho em equipe.'
FROM areas a
WHERE a.name = 'Tecnologia'
LIMIT 1;