-- BusinessOS Day 5 Step 4D.4C
-- Composite tenant parent-key uniqueness hardening.
-- Prepared for review; do not apply without explicit approval.

ALTER TABLE public.customers
  ADD CONSTRAINT customers_business_id_id_key
  UNIQUE (business_id, id);

ALTER TABLE public.suppliers
  ADD CONSTRAINT suppliers_business_id_id_key
  UNIQUE (business_id, id);

ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_business_id_id_key
  UNIQUE (business_id, id);

ALTER TABLE public.sales
  ADD CONSTRAINT sales_business_id_id_key
  UNIQUE (business_id, id);
