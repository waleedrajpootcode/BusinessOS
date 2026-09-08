-- BusinessOS Day 5 Step 4D.2
-- Prevent direct reassignment of a profile to a different business.
--
-- Profile creation intentionally leaves business_id NULL during signup.
-- The current repository has no implemented workflow that assigns or changes
-- profiles.business_id after creation, so all direct changes are rejected.
-- Role, status, and other profile metadata remain updateable through the
-- existing RLS policy.

CREATE OR REPLACE FUNCTION public.prevent_profile_business_id_change()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD.business_id IS DISTINCT FROM NEW.business_id THEN
    RAISE EXCEPTION
      'profiles.business_id cannot be changed directly';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS protect_profile_business_id
ON public.profiles;

CREATE TRIGGER protect_profile_business_id
BEFORE UPDATE OF business_id ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_business_id_change();
