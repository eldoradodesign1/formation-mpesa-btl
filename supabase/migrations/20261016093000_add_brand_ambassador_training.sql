-- Adds the Brand Ambassadors course without changing existing metadata or grants.
BEGIN;

INSERT INTO public.training_modules AS current_module (code, title, description, estimated_minutes, position, is_active)
VALUES (
  'formation-brand-ambassadors',
  'Formation Brand Ambassadors',
  'Activation respectueuse, découverte du besoin, conseil produit, activation sûre, confidentialité et reporting.',
  75,
  9,
  TRUE
)
ON CONFLICT (code) DO UPDATE
SET is_active = EXCLUDED.is_active
WHERE current_module.title = EXCLUDED.title
  AND current_module.description = EXCLUDED.description
  AND current_module.estimated_minutes = EXCLUDED.estimated_minutes
  AND current_module.position = EXCLUDED.position;

-- Refuse to continue if a concurrent or pre-existing row uses the code with
-- incompatible metadata. Existing catalogue entries are never overwritten.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.training_modules
    WHERE code = 'formation-brand-ambassadors'
      AND title = 'Formation Brand Ambassadors'
      AND description = 'Activation respectueuse, découverte du besoin, conseil produit, activation sûre, confidentialité et reporting.'
      AND estimated_minutes = 75
      AND position = 9
      AND is_active = TRUE
  ) THEN
    RAISE EXCEPTION 'Brand Ambassadors module code exists with incompatible metadata';
  END IF;
END;
$$;

-- Users who already have explicit module grants would not inherit the fallback
-- category rule. Add only this new grant for BAs and management users with an
-- existing grant set; do not replace or broaden any other module access.
INSERT INTO public.training_module_access (user_id, module_code, granted)
SELECT DISTINCT u.id, 'formation-brand-ambassadors', TRUE
FROM public.users AS u
WHERE (
    (u.user_category = 'brand_ambassador' AND u.role = 'agent')
    OR u.role IN ('supervisor', 'admin', 'sub_admin', 'super_admin', 'superadmin', 'super_admi')
  )
  AND EXISTS (
    SELECT 1
    FROM public.training_module_access AS existing_access
    WHERE existing_access.user_id = u.id
  )
ON CONFLICT (user_id, module_code) DO NOTHING;

COMMIT;
