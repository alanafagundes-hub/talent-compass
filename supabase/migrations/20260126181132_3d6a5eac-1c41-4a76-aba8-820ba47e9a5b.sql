-- Encerrar a vaga de teste para verificar sincronização
UPDATE public.jobs 
SET status = 'encerrada', closed_at = now() 
WHERE title = 'Desenvolvedor Full Stack';