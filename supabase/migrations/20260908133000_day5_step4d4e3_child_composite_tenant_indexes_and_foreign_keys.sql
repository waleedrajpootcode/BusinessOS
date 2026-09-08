-- BusinessOS Day 5 Step 4D.4E.3
-- Child-table composite tenant indexes and foreign keys.

CREATE INDEX sale_items_business_sale_idx
ON public.sale_items (business_id, sale_id);

CREATE INDEX sale_items_business_product_idx
ON public.sale_items (business_id, product_id);

CREATE INDEX purchase_items_business_purchase_idx
ON public.purchase_items (business_id, purchase_id);

CREATE INDEX purchase_items_business_product_idx
ON public.purchase_items (business_id, product_id);

ALTER TABLE public.sale_items
  ADD CONSTRAINT sale_items_business_sale_tenant_fkey
  FOREIGN KEY (business_id, sale_id)
  REFERENCES public.sales (business_id, id)
  MATCH SIMPLE
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE public.sale_items
  ADD CONSTRAINT sale_items_business_product_tenant_fkey
  FOREIGN KEY (business_id, product_id)
  REFERENCES public.products (business_id, id)
  MATCH SIMPLE
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE public.purchase_items
  ADD CONSTRAINT purchase_items_business_purchase_tenant_fkey
  FOREIGN KEY (business_id, purchase_id)
  REFERENCES public.purchases (business_id, id)
  MATCH SIMPLE
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE public.purchase_items
  ADD CONSTRAINT purchase_items_business_product_tenant_fkey
  FOREIGN KEY (business_id, product_id)
  REFERENCES public.products (business_id, id)
  MATCH SIMPLE
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
