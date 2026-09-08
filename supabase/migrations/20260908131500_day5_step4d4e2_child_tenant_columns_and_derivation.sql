-- BusinessOS Day 5 Step 4D.4E.2
-- Child tenant columns and database-derived tenant enforcement.

ALTER TABLE public.sale_items
  ADD COLUMN business_id uuid;

ALTER TABLE public.purchase_items
  ADD COLUMN business_id uuid;

UPDATE public.sale_items AS item
SET business_id = sale.business_id
FROM public.sales AS sale
WHERE sale.id = item.sale_id;

UPDATE public.purchase_items AS item
SET business_id = purchase.business_id
FROM public.purchases AS purchase
WHERE purchase.id = item.purchase_id;

DO $validation$
DECLARE
  violation_count bigint;
BEGIN
  SELECT count(*)
  INTO violation_count
  FROM public.sale_items AS item
  LEFT JOIN public.sales AS sale ON sale.id = item.sale_id
  LEFT JOIN public.products AS product ON product.id = item.product_id
  WHERE item.business_id IS NULL
     OR sale.id IS NULL
     OR product.id IS NULL
     OR sale.business_id IS NULL
     OR item.business_id IS DISTINCT FROM sale.business_id
     OR item.business_id IS DISTINCT FROM product.business_id;

  IF violation_count <> 0 THEN
    RAISE EXCEPTION 'Sale-item tenant validation failed.';
  END IF;

  SELECT count(*)
  INTO violation_count
  FROM public.purchase_items AS item
  LEFT JOIN public.purchases AS purchase ON purchase.id = item.purchase_id
  LEFT JOIN public.products AS product ON product.id = item.product_id
  WHERE item.business_id IS NULL
     OR purchase.id IS NULL
     OR product.id IS NULL
     OR purchase.business_id IS NULL
     OR item.business_id IS DISTINCT FROM purchase.business_id
     OR item.business_id IS DISTINCT FROM product.business_id;

  IF violation_count <> 0 THEN
    RAISE EXCEPTION 'Purchase-item tenant validation failed.';
  END IF;
END
$validation$;

CREATE FUNCTION public.derive_sale_item_business_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  trusted_business_id uuid;
BEGIN
  IF NEW.sale_id IS NULL THEN
    RAISE EXCEPTION 'Sale item parent is required.';
  END IF;

  SELECT sale.business_id
  INTO trusted_business_id
  FROM public.sales AS sale
  WHERE sale.id = NEW.sale_id;

  IF NOT FOUND OR trusted_business_id IS NULL THEN
    RAISE EXCEPTION 'Sale item parent is invalid.';
  END IF;

  IF NEW.business_id IS NOT NULL
     AND NEW.business_id IS DISTINCT FROM trusted_business_id THEN
    RAISE EXCEPTION 'Sale item tenant is invalid.';
  END IF;

  NEW.business_id := trusted_business_id;
  RETURN NEW;
END;
$function$;

CREATE FUNCTION public.derive_purchase_item_business_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  trusted_business_id uuid;
BEGIN
  IF NEW.purchase_id IS NULL THEN
    RAISE EXCEPTION 'Purchase item parent is required.';
  END IF;

  SELECT purchase.business_id
  INTO trusted_business_id
  FROM public.purchases AS purchase
  WHERE purchase.id = NEW.purchase_id;

  IF NOT FOUND OR trusted_business_id IS NULL THEN
    RAISE EXCEPTION 'Purchase item parent is invalid.';
  END IF;

  IF NEW.business_id IS NOT NULL
     AND NEW.business_id IS DISTINCT FROM trusted_business_id THEN
    RAISE EXCEPTION 'Purchase item tenant is invalid.';
  END IF;

  NEW.business_id := trusted_business_id;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER sale_items_derive_business_id
BEFORE INSERT OR UPDATE
ON public.sale_items
FOR EACH ROW
EXECUTE FUNCTION public.derive_sale_item_business_id();

CREATE TRIGGER purchase_items_derive_business_id
BEFORE INSERT OR UPDATE
ON public.purchase_items
FOR EACH ROW
EXECUTE FUNCTION public.derive_purchase_item_business_id();
