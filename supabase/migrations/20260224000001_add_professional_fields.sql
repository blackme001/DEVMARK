-- ==========================================
-- ADD PROFESSIONAL FIELDS TO USER TABLE
-- ==========================================

-- 1. Add columns to User table
ALTER TABLE public."User" 
ADD COLUMN IF NOT EXISTS "field" TEXT,
ADD COLUMN IF NOT EXISTS "techStack" TEXT[] DEFAULT '{}';

-- 2. Update the sync trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, "firstName", "lastName", role, field, "techStack")
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    COALESCE(NEW.raw_user_meta_data->>'role', 'BUYER'),
    NEW.raw_user_meta_data->>'field',
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(NEW.raw_user_meta_data->'techStack', '[]'::jsonb)))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
