-- Tornar o bucket resumes público para resolver problemas de visualização
UPDATE storage.buckets 
SET public = true 
WHERE id = 'resumes';