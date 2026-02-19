INSERT INTO public.user_roles (user_id, role)
VALUES ('82483cfc-19d0-4ee6-8f74-a2d586630741', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;