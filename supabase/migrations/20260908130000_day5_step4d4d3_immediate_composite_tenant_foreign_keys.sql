-- BusinessOS Day 5 Step 4D.4D.3
-- Immediate composite tenant foreign-key hardening.

ALTER TABLE public.sales
  ADD CONSTRAINT sales_business_customer_tenant_fkey
  FOREIGN KEY (business_id, customer_id)
  REFERENCES public.customers (business_id, id)
  MATCH SIMPLE
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_business_supplier_tenant_fkey
  FOREIGN KEY (business_id, supplier_id)
  REFERENCES public.suppliers (business_id, id)
  MATCH SIMPLE
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE public.inventory_movements
  ADD CONSTRAINT inventory_movements_business_product_tenant_fkey
  FOREIGN KEY (business_id, product_id)
  REFERENCES public.products (business_id, id)
  MATCH SIMPLE
  ON DELETE CASCADE
  ON UPDATE NO ACTION;
