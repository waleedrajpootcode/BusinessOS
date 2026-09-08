-- BusinessOS Day 5 Step 4C.1
-- Prepared only; do not apply without explicit approval.

REVOKE ALL ON TABLE
  public.business_settings,
  public.profiles,
  public.customers,
  public.customer_payments,
  public.employees,
  public.products,
  public.expenses,
  public.suppliers,
  public.supplier_payments,
  public.purchases,
  public.purchase_items,
  public.sales,
  public.sale_items,
  public.inventory_movements
FROM anon;

REVOKE SELECT ON TABLE
  public.customer_payment_summary,
  public.supplier_payment_summary
FROM anon;

REVOKE EXECUTE ON FUNCTION
  public.create_sale_safe(
    text,
    bigint,
    numeric,
    numeric,
    numeric,
    numeric,
    numeric,
    text,
    text,
    jsonb
  ),
  public.increase_stock_with_movement(bigint, integer, bigint),
  public.delete_purchase_safe(bigint),
  public.update_purchase_item_safe(bigint, bigint, numeric),
  public.get_sales_with_payment_summary()
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION
  public.create_sale_safe(
    text,
    bigint,
    numeric,
    numeric,
    numeric,
    numeric,
    numeric,
    text,
    text,
    jsonb
  ),
  public.increase_stock_with_movement(bigint, integer, bigint),
  public.delete_purchase_safe(bigint),
  public.update_purchase_item_safe(bigint, bigint, numeric),
  public.get_sales_with_payment_summary()
TO authenticated;

ALTER FUNCTION public.create_sale_safe(
  text,
  bigint,
  numeric,
  numeric,
  numeric,
  numeric,
  numeric,
  text,
  text,
  jsonb
) SET search_path = public, pg_temp;

ALTER FUNCTION public.delete_purchase_safe(bigint)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.get_sales_with_payment_summary()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.increase_stock_with_movement(bigint, integer, bigint)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.update_purchase_item_safe(bigint, bigint, numeric)
  SET search_path = public, pg_temp;

CREATE INDEX IF NOT EXISTS sale_items_sale_id_idx
  ON public.sale_items (sale_id);

CREATE INDEX IF NOT EXISTS sale_items_product_id_idx
  ON public.sale_items (product_id);

CREATE INDEX IF NOT EXISTS purchase_items_purchase_id_idx
  ON public.purchase_items (purchase_id);

CREATE INDEX IF NOT EXISTS purchase_items_product_id_idx
  ON public.purchase_items (product_id);

CREATE INDEX IF NOT EXISTS sales_customer_id_idx
  ON public.sales (customer_id);

CREATE INDEX IF NOT EXISTS purchases_supplier_id_idx
  ON public.purchases (supplier_id);

CREATE INDEX IF NOT EXISTS inventory_movements_product_id_idx
  ON public.inventory_movements (product_id);
