ALTER TABLE public.sale_items
  ALTER COLUMN business_id SET NOT NULL;

ALTER TABLE public.purchase_items
  ALTER COLUMN business_id SET NOT NULL;
