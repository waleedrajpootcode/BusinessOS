-- BusinessOS Day 3
-- Security: Employee tenant isolation
-- Applied to Supabase on 2026-08-18

BEGIN;

-- Add tenant ownership
ALTER TABLE public.employees
ADD COLUMN business_id uuid;

-- Assign existing employee to the existing business
UPDATE public.employees
SET business_id = '95c97852-e4f5-43aa-aad4-55ac840ba89b'
WHERE business_id IS NULL;

-- Enforce tenant ownership
ALTER TABLE public.employees
ALTER COLUMN business_id SET NOT NULL;

-- Enforce valid business relationship
ALTER TABLE public.employees
ADD CONSTRAINT employees_business_id_fkey
FOREIGN KEY (business_id)
REFERENCES public.business_settings(id)
ON DELETE CASCADE;

-- Tenant query index
CREATE INDEX employees_business_id_idx
ON public.employees(business_id);

-- Remove insecure unrestricted policies
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.employees;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.employees;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.employees;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.employees;

-- Tenant-isolated SELECT
CREATE POLICY "Users can view their business employees"
ON public.employees
FOR SELECT
TO authenticated
USING (
    business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
    )
);

-- Tenant-isolated INSERT
CREATE POLICY "Users can insert their business employees"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (
    business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
    )
);

-- Tenant-isolated UPDATE
CREATE POLICY "Users can update their business employees"
ON public.employees
FOR UPDATE
TO authenticated
USING (
    business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
    )
)
WITH CHECK (
    business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
    )
);

-- Tenant-isolated DELETE
CREATE POLICY "Users can delete their business employees"
ON public.employees
FOR DELETE
TO authenticated
USING (
    business_id = (
        SELECT profiles.business_id
        FROM public.profiles
        WHERE profiles.id = auth.uid()
    )
);

-- Server-side tenant ownership for new employees
CREATE OR REPLACE FUNCTION public.set_employee_business_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_business_id uuid;
BEGIN
    SELECT p.business_id
    INTO v_business_id
    FROM public.profiles p
    WHERE p.id = auth.uid();

    IF v_business_id IS NULL THEN
        RAISE EXCEPTION 'Authenticated user has no business assigned';
    END IF;

    NEW.business_id := v_business_id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_employee_business_id_before_insert
ON public.employees;

CREATE TRIGGER set_employee_business_id_before_insert
BEFORE INSERT ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.set_employee_business_id();

COMMIT;