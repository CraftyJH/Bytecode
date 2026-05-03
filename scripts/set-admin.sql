-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- to grant admin role to chatgptjc@gmail.com
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'chatgptjc@gmail.com';

-- Verify the change
SELECT id, email, raw_app_meta_data
FROM auth.users
WHERE email = 'chatgptjc@gmail.com';
