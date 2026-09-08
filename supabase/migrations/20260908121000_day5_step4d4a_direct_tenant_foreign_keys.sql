-- BusinessOS Day 5 Step 4D.4A
-- Direct tenant foreign-key hardening.
-- Prepared for review; do not apply without explicit approval.

ALTER TABLE public.expenses
  ADD CONSTRAINT expenses_business_id_fkey
  FOREIGN KEY (business_id)
  REFERENCES public.business_settings(id)
  ON DELETE RESTRICT;

ALTER TABLE public.suppliers
  ADD CONSTRAINT suppliers_business_id_fkey
  FOREIGN KEY (business_id)
  REFERENCES public.business_settings(id)
  ON DELETE RESTRICT;

ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_business_id_fkey
  FOREIGN KEY (business_id)
  REFERENCES public.business_settings(id)
  ON DELETE RESTRICT;

ALTER TABLE public.inventory_movements
  ADD CONSTRAINT inventory_movements_business_id_fkey
  FOREIGN KEY (business_id)
  REFERENCES public.business_settings(id)
  ON DELETE RESTRICT;
