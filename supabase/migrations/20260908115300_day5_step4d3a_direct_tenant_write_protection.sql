-- BusinessOS Day 5 Step 4D.3A
-- Direct Tenant Write Protection
-- Prepared after explicit implementation approval.

DROP POLICY IF EXISTS "Users can insert their business sales"
ON public.sales;

CREATE POLICY "Users can insert their business sales"
ON public.sales
FOR INSERT
TO authenticated
WITH CHECK (
  business_id = (
    SELECT profiles.business_id
    FROM public.profiles
    WHERE profiles.id = auth.uid()
  )
  AND (
    customer_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.customers c
      WHERE c.id = sales.customer_id
        AND c.business_id = (
          SELECT profiles.business_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
    )
  )
);

DROP POLICY IF EXISTS "Users can insert their business purchases"
ON public.purchases;

CREATE POLICY "Users can insert their business purchases"
ON public.purchases
FOR INSERT
TO authenticated
WITH CHECK (
  business_id = (
    SELECT profiles.business_id
    FROM public.profiles
    WHERE profiles.id = auth.uid()
  )
  AND (
    supplier_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.suppliers s
      WHERE s.id = purchases.supplier_id
        AND s.business_id = (
          SELECT profiles.business_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
    )
  )
);

DROP POLICY IF EXISTS "Users can insert their business sale items"
ON public.sale_items;

CREATE POLICY "Users can insert their business sale items"
ON public.sale_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.sales s
    JOIN public.profiles p
      ON p.business_id = s.business_id
    WHERE s.id = sale_items.sale_id
      AND p.id = auth.uid()
  )
  AND EXISTS (
    SELECT 1
    FROM public.products product
    WHERE product.id = sale_items.product_id
      AND product.business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
      )
  )
);

DROP POLICY IF EXISTS "Users can update their business sale items"
ON public.sale_items;

CREATE POLICY "Users can update their business sale items"
ON public.sale_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.sales s
    JOIN public.profiles p
      ON p.business_id = s.business_id
    WHERE s.id = sale_items.sale_id
      AND p.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.sales s
    JOIN public.profiles p
      ON p.business_id = s.business_id
    WHERE s.id = sale_items.sale_id
      AND p.id = auth.uid()
  )
  AND EXISTS (
    SELECT 1
    FROM public.products product
    WHERE product.id = sale_items.product_id
      AND product.business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
      )
  )
);

DROP POLICY IF EXISTS "Users can insert their business purchase items"
ON public.purchase_items;

CREATE POLICY "Users can insert their business purchase items"
ON public.purchase_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.purchases purchase
    JOIN public.profiles p
      ON p.business_id = purchase.business_id
    WHERE purchase.id = purchase_items.purchase_id
      AND p.id = auth.uid()
  )
  AND EXISTS (
    SELECT 1
    FROM public.products product
    WHERE product.id = purchase_items.product_id
      AND product.business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
      )
  )
);

DROP POLICY IF EXISTS "Users can update their business purchase items"
ON public.purchase_items;

CREATE POLICY "Users can update their business purchase items"
ON public.purchase_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.purchases purchase
    JOIN public.profiles p
      ON p.business_id = purchase.business_id
    WHERE purchase.id = purchase_items.purchase_id
      AND p.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.purchases purchase
    JOIN public.profiles p
      ON p.business_id = purchase.business_id
    WHERE purchase.id = purchase_items.purchase_id
      AND p.id = auth.uid()
  )
  AND EXISTS (
    SELECT 1
    FROM public.products product
    WHERE product.id = purchase_items.product_id
      AND product.business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
      )
  )
);

DROP POLICY IF EXISTS "Users can insert their business inventory movements"
ON public.inventory_movements;

CREATE POLICY "Users can insert their business inventory movements"
ON public.inventory_movements
FOR INSERT
TO authenticated
WITH CHECK (
  business_id = (
    SELECT profiles.business_id
    FROM public.profiles
    WHERE profiles.id = auth.uid()
  )
  AND EXISTS (
    SELECT 1
    FROM public.products product
    WHERE product.id = inventory_movements.product_id
      AND product.business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
      )
  )
);
