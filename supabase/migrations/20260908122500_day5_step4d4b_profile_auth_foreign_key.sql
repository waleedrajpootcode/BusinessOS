-- BusinessOS Day 5 Step 4D.4B
-- Profile -> Auth user referential integrity hardening.
-- Prepared for review; do not apply without explicit approval.

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
